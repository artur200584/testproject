"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { parse } from "date-fns";
import { uk } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { toDateValue } from "@/lib/date";

// Календар, у якому вибирають день.
// Дні, на які вже щось заплановано, підкреслені.
export function CalendarPicker({
  selectedDate,
  eventDates,
}: {
  selectedDate: string;
  eventDates: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selected = parse(selectedDate, "yyyy-MM-dd", new Date());
  const daysWithEvents = eventDates.map((day) =>
    parse(day, "yyyy-MM-dd", new Date()),
  );

  function selectDay(date: Date | undefined) {
    if (!date) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("date", toDateValue(date));
    router.replace(`/calendar?${params.toString()}`);
  }

  return (
    <Calendar
      mode="single"
      locale={uk}
      weekStartsOn={1}
      selected={selected}
      defaultMonth={selected}
      onSelect={selectDay}
      // Підписи для кнопок гортання місяців (їх читають програми для незрячих).
      labels={{
        labelPrevious: () => "Попередній місяць",
        labelNext: () => "Наступний місяць",
      }}
      modifiers={{ hasEvents: daysWithEvents }}
      modifiersClassNames={{
        hasEvents: "font-bold underline decoration-primary decoration-2 underline-offset-4",
      }}
      className="rounded-md border"
    />
  );
}
