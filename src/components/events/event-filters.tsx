"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IMPORTANCE_VALUES, importanceLabels } from "@/lib/importance";

// Пошук і фільтр за важливістю.
// Обидва зберігаються прямо в адресі сторінки (наприклад ?q=зустріч&importance=CRITICAL).
// Завдяки цьому сторінку з фільтрами можна перезавантажити або скинути посиланням.
export function EventFilters({
  search,
  importance,
}: {
  search: string;
  importance: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Те, що користувач зараз набирає в полі пошуку.
  const [text, setText] = useState(search);

  // Змінює один параметр в адресі і перезавантажує список подій.
  function updateUrl(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`/calendar?${params.toString()}`);
  }

  // Чекаємо 400 мс після останньої натиснутої клавіші й тільки тоді шукаємо.
  // Інакше запит до сервера летів би на кожну літеру.
  useEffect(() => {
    if (text === search) return;

    const timer = setTimeout(() => updateUrl("q", text), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, search]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Пошук за назвою або описом…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>

      <Select
        value={importance || "ALL"}
        onValueChange={(value) => updateUrl("importance", value === "ALL" ? "" : value)}
      >
        <SelectTrigger className="w-full sm:w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Будь-яка важливість</SelectItem>
          {IMPORTANCE_VALUES.map((value) => (
            <SelectItem key={value} value={value}>
              {importanceLabels[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
