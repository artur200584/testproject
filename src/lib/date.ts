import { format, parse } from "date-fns";
import { uk } from "date-fns/locale";

// Дрібні помічники для роботи з датами, щоб не писати те саме в різних місцях.

// Дата у вигляді "2026-08-15" — саме такий формат розуміє <input type="date">.
export function toDateValue(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// Час у вигляді "14:30" — формат для <input type="time">.
export function toTimeValue(date: Date): string {
  return format(date, "HH:mm");
}

// З рядків "2026-08-15" і "14:30" робимо одну справжню дату.
export function fromDateAndTime(date: string, time: string): Date {
  return parse(`${date} ${time}`, "yyyy-MM-dd HH:mm", new Date());
}

// Красивий підпис для користувача: "15 серпня 2026, 14:30".
export function formatEventDateTime(date: Date): string {
  return format(date, "d MMMM yyyy, HH:mm", { locale: uk });
}

// Тільки дата, без часу: "15 серпня 2026".
export function formatDayTitle(date: Date): string {
  return format(date, "d MMMM yyyy", { locale: uk });
}
