import { CalendarDays } from "lucide-react";
import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function CalendarPage() {
  // Сюди потрапляють тільки ті, хто увійшов — перевірка стоїть у layout.tsx.
  const session = await auth();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
      <Card>
        <CardHeader>
          <CalendarDays className="size-6 text-primary" />
          <CardTitle>Вітаємо, {session?.user?.name ?? "друже"}!</CardTitle>
          <CardDescription>
            Ви успішно увійшли. Це закрита сторінка — без входу її не побачити.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Сам календар з подіями з&apos;явиться в наступній гілці.
        </CardContent>
      </Card>
    </main>
  );
}
