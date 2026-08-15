"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteEventAction } from "@/actions/events";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Кнопка "видалити" з підтвердженням —
// щоб подія не зникла через випадкове натискання.
export function DeleteEventButton({ id, title }: { id: string; title: string }) {
  const [state, formAction] = useActionState(deleteEventAction, {});

  // Показуємо повідомлення про результат.
  useEffect(() => {
    if (state.ok) toast.success("Подію видалено");
    if (state.error) toast.error(state.error);
  }, [state.ok, state.error]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Видалити подію">
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Видалити подію?</AlertDialogTitle>
          <AlertDialogDescription>
            Подію «{title}» буде видалено назавжди. Цю дію не можна скасувати.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Скасувати</AlertDialogCancel>
          <form action={formAction}>
            <input type="hidden" name="id" value={id} />
            <AlertDialogAction type="submit">Видалити</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
