"use server";

// Уся робота з подіями в базі. Виконується тільки на сервері.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { eventSchema } from "@/lib/validation";
import { fromDateAndTime } from "@/lib/date";
import type { Importance } from "@/lib/importance";
import type { EventFormState, EventItem } from "@/lib/types";

// Дізнаємось, хто зараз на сайті.
// Якщо користувач не увійшов — далі нічого не робимо.
async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

// Дістаємо з форми те, що ввів користувач.
function readEventValues(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    description: String(formData.get("description") ?? ""),
    importance: String(formData.get("importance") ?? ""),
  };
}

// ---------- Додавання події ----------

export async function createEventAction(
  _prevState: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const values = readEventValues(formData);

  const userId = await getCurrentUserId();
  if (!userId) return { error: "Спочатку треба увійти", values };

  const parsed = eventSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, values };
  }

  const { title, date, time, description, importance } = parsed.data;

  await prisma.event.create({
    data: {
      title,
      description: description || null,
      startsAt: fromDateAndTime(date, time),
      importance,
      userId,
    },
  });

  // Кажемо Next.js оновити сторінку календаря, щоб нова подія одразу з'явилась.
  revalidatePath("/calendar");
  return { ok: true };
}

// ---------- Редагування події ----------

export async function updateEventAction(
  _prevState: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const values = readEventValues(formData);

  const userId = await getCurrentUserId();
  if (!userId) return { error: "Спочатку треба увійти", values };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Не зрозуміло, яку подію редагувати", values };

  const parsed = eventSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, values };
  }

  const { title, date, time, description, importance } = parsed.data;

  // Умова { id, userId } важлива: так чужу подію змінити неможливо,
  // навіть якщо хтось підставить чужий id.
  const result = await prisma.event.updateMany({
    where: { id, userId },
    data: {
      title,
      description: description || null,
      startsAt: fromDateAndTime(date, time),
      importance,
    },
  });

  if (result.count === 0) {
    return { error: "Подію не знайдено", values };
  }

  revalidatePath("/calendar");
  return { ok: true };
}

// ---------- Видалення події ----------

export async function deleteEventAction(
  _prevState: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: "Спочатку треба увійти" };

  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Не зрозуміло, яку подію видаляти" };

  // Знову ж таки: видалити можна тільки свою подію.
  const result = await prisma.event.deleteMany({ where: { id, userId } });

  if (result.count === 0) {
    return { error: "Подію не знайдено" };
  }

  revalidatePath("/calendar");
  return { ok: true };
}

// ---------- Читання подій ----------

type GetEventsOptions = {
  // Слово для пошуку в назві та описі.
  search?: string;
  // Показувати тільки події цієї важливості.
  importance?: Importance;
  // Показувати тільки події за цей день.
  day?: Date;
};

export async function getEventsAction(
  options: GetEventsOptions = {},
): Promise<EventItem[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { search, importance, day } = options;

  // Якщо просять конкретний день — рахуємо його початок і кінець.
  const dayRange = day
    ? {
        gte: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0),
        lt: new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1, 0, 0, 0),
      }
    : undefined;

  const events = await prisma.event.findMany({
    where: {
      // Найголовніше: беремо тільки події цього користувача.
      userId,
      ...(importance ? { importance } : {}),
      ...(dayRange ? { startsAt: dayRange } : {}),
      // Пошук: шукаємо слово і в назві, і в описі. mode: "insensitive"
      // означає, що великі й малі літери не мають значення.
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { description: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    orderBy: { startsAt: "asc" },
  });

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startsAt: event.startsAt,
    importance: event.importance as Importance,
  }));
}

// Дати всіх подій користувача — щоб у календарі підсвітити дні,
// на які щось заплановано.
export async function getEventDatesAction(): Promise<string[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const events = await prisma.event.findMany({
    where: { userId },
    select: { startsAt: true },
  });

  // Один і той самий день міг зустрітись кілька разів — Set прибирає повтори.
  const days = events.map((event) => {
    const d = event.startsAt;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });

  return [...new Set(days)];
}
