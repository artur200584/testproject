"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { EventForm } from "@/components/events/event-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { EventItem } from "@/lib/types";

type EventDialogProps = {
  // Є подія — вікно редагування, немає — вікно створення.
  event?: EventItem;
  // Дата, вибрана в календарі (підставиться в нову подію).
  defaultDate: string;
};

// Спливаюче вікно з формою події.
export function EventDialog({ event, defaultDate }: EventDialogProps) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(event);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon" aria-label="Редагувати подію">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" />
            Додати подію
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Редагувати подію" : "Нова подія"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Зміни зберігаються одразу після натискання кнопки."
              : "Заповніть поля — подія з'явиться у вашому календарі."}
          </DialogDescription>
        </DialogHeader>

        {/* Форму створюємо лише коли вікно відкрите.
            Так при кожному відкритті вона починається з чистого стану. */}
        {open && (
          <EventForm
            event={event}
            defaultDate={defaultDate}
            onSaved={() => setOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
