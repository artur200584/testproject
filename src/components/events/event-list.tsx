import { CalendarX2 } from "lucide-react";
import { DeleteEventButton } from "@/components/events/delete-event-button";
import { EventDialog } from "@/components/events/event-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatEventDateTime } from "@/lib/date";
import { importanceLabels, importanceStyles } from "@/lib/importance";
import type { EventItem } from "@/lib/types";

type EventListProps = {
  events: EventItem[];
  // Дата з календаря — потрібна кнопкам редагування всередині списку.
  selectedDate: string;
  // Що написати, якщо подій немає.
  emptyText: string;
};

export function EventList({ events, selectedDate, emptyText }: EventListProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <CalendarX2 className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{emptyText}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {events.map((event) => (
        <li key={event.id}>
          <Card>
            <CardContent className="flex items-start gap-3">
              {/* Кольоровий кружечок — одразу видно, наскільки подія важлива. */}
              <span
                className={cn(
                  "mt-1.5 size-2.5 shrink-0 rounded-full",
                  importanceStyles[event.importance].dot,
                )}
              />

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium">{event.title}</h3>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      importanceStyles[event.importance].badge,
                    )}
                  >
                    {importanceLabels[event.importance]}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {formatEventDateTime(event.startsAt)}
                </p>

                {event.description && (
                  <p className="text-sm whitespace-pre-line">{event.description}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center">
                <EventDialog event={event} defaultDate={selectedDate} />
                <DeleteEventButton id={event.id} title={event.title} />
              </div>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
