import { CircleAlert } from "lucide-react";

// Червона плашка з текстом помилки. Якщо помилки немає — нічого не показуємо.
export function FormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
      <CircleAlert className="size-4 shrink-0" />
      {message}
    </p>
  );
}
