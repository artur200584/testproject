"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { createEventAction, updateEventAction } from "@/actions/events";
import { FormError } from "@/components/auth/form-error";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toDateValue, toTimeValue } from "@/lib/date";
import { IMPORTANCE_VALUES, importanceLabels } from "@/lib/importance";
import type { EventItem } from "@/lib/types";

type EventFormProps = {
  // Якщо подію передали — форма працює в режимі редагування.
  event?: EventItem;
  // Дата, яка підставиться в нову подію (та, що вибрана в календарі).
  defaultDate: string;
  // Що зробити після успішного збереження (закрити вікно).
  onSaved: () => void;
};

export function EventForm({ event, defaultDate, onSaved }: EventFormProps) {
  const isEdit = Boolean(event);

  const [state, formAction] = useActionState(
    isEdit ? updateEventAction : createEventAction,
    {},
  );

  // Коли сервер відповів "ok" — показуємо повідомлення і закриваємо вікно.
  useEffect(() => {
    if (state.ok) {
      toast.success(isEdit ? "Подію оновлено" : "Подію додано");
      onSaved();
    }
  }, [state.ok, isEdit, onSaved]);

  return (
    <form action={formAction} className="space-y-4">
      {/* У режимі редагування треба знати, яку саме подію змінюємо. */}
      {event && <input type="hidden" name="id" value={event.id} />}

      <FormError message={state.error} />

      <div className="space-y-2">
        <Label htmlFor="title">Назва події</Label>
        <Input
          id="title"
          name="title"
          placeholder="Зустріч із командою"
          defaultValue={state.values?.title ?? event?.title}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="date">Дата</Label>
          <Input
            id="date"
            name="date"
            type="date"
            defaultValue={
              state.values?.date ??
              (event ? toDateValue(event.startsAt) : defaultDate)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Час</Label>
          <Input
            id="time"
            name="time"
            type="time"
            defaultValue={
              state.values?.time ?? (event ? toTimeValue(event.startsAt) : "12:00")
            }
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="importance">Важливість</Label>
        <Select
          name="importance"
          defaultValue={state.values?.importance ?? event?.importance ?? "NORMAL"}
        >
          <SelectTrigger id="importance" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {IMPORTANCE_VALUES.map((value) => (
              <SelectItem key={value} value={value}>
                {importanceLabels[value]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Опис (не обов&apos;язково)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Про що ця подія?"
          rows={3}
          defaultValue={state.values?.description ?? event?.description ?? ""}
        />
      </div>

      <SubmitButton>{isEdit ? "Зберегти зміни" : "Додати подію"}</SubmitButton>
    </form>
  );
}
