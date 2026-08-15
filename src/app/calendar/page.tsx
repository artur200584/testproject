import { parse } from "date-fns";
import { CalendarDays, List } from "lucide-react";
import { getEventDatesAction, getEventsAction } from "@/actions/events";
import { CalendarPicker } from "@/components/events/calendar-picker";
import { EventDialog } from "@/components/events/event-dialog";
import { EventFilters } from "@/components/events/event-filters";
import { EventList } from "@/components/events/event-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDayTitle, toDateValue } from "@/lib/date";
import { IMPORTANCE_VALUES, type Importance } from "@/lib/importance";

// В адресі сторінки параметр може прийти як один рядок або як масив —
// нам завжди потрібен просто рядок.
function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default async function CalendarPage(props: PageProps<"/calendar">) {
  const searchParams = await props.searchParams;

  // Який день вибрано в календарі. Якщо в адресі дати немає — беремо сьогоднішню.
  const dateParam = firstValue(searchParams.date);
  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(dateParam);
  const selectedDate = isValidDate ? dateParam : toDateValue(new Date());
  const selectedDay = parse(selectedDate, "yyyy-MM-dd", new Date());

  // Слово для пошуку.
  const search = firstValue(searchParams.q).trim();

  // Фільтр за важливістю. Перевіряємо, що прийшло справді одне з наших значень,
  // а не будь-що, вписане в адресу вручну.
  const importanceParam = firstValue(searchParams.importance);
  const importance = IMPORTANCE_VALUES.includes(importanceParam as Importance)
    ? (importanceParam as Importance)
    : undefined;

  // Три запити до бази одночасно — так швидше, ніж по черзі.
  const [dayEvents, allEvents, eventDates] = await Promise.all([
    getEventsAction({ search, importance, day: selectedDay }),
    getEventsAction({ search, importance }),
    getEventDatesAction(),
  ]);

  // Якщо фільтри увімкнені, порожній список означає інше,
  // ніж коли подій просто ще немає.
  const hasFilters = Boolean(search || importance);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Мої події</h1>
          <p className="text-sm text-muted-foreground">
            {hasFilters
              ? `Знайдено: ${allEvents.length}`
              : `Усього подій: ${allEvents.length}`}
          </p>
        </div>

        <EventDialog defaultDate={selectedDate} />
      </div>

      <EventFilters search={search} importance={importance ?? ""} />

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">
            <CalendarDays className="size-4" />
            Календар
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="size-4" />
            Списком
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-4">
          <div className="grid gap-6 md:grid-cols-[auto_1fr]">
            <CalendarPicker selectedDate={selectedDate} eventDates={eventDates} />

            <div className="space-y-3">
              <h2 className="font-medium">{formatDayTitle(selectedDay)}</h2>
              <EventList
                events={dayEvents}
                selectedDate={selectedDate}
                emptyText={
                  hasFilters
                    ? "На цей день немає подій, які підходять під фільтр"
                    : "На цей день подій немає"
                }
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <EventList
            events={allEvents}
            selectedDate={selectedDate}
            emptyText={
              hasFilters
                ? "За такими умовами нічого не знайдено"
                : "Подій ще немає — додайте першу"
            }
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
