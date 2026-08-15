import type { Importance } from "@/lib/importance";

// Подія в тому вигляді, в якому її показуємо на сторінці.
export type EventItem = {
  id: string;
  title: string;
  description: string | null;
  startsAt: Date;
  importance: Importance;
};

// Те, що повертає форма додавання/редагування події.
export type EventFormState = {
  // Текст помилки, якщо щось не так.
  error?: string;
  // true — все збереглося, можна закривати вікно.
  ok?: boolean;
  // Що користувач уже ввів — щоб після помилки не заповнювати форму заново.
  values?: {
    title: string;
    date: string;
    time: string;
    description: string;
    importance: string;
  };
};

// Те, що серверна дія повертає назад у форму.
export type AuthFormState = {
  // Текст помилки (або нічого, якщо все добре).
  error?: string;
  // Що користувач уже ввів — щоб після помилки не набирати все заново.
  // Паролі сюди навмисно не кладемо.
  values?: {
    name?: string;
    email?: string;
  };
};
