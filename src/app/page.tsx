import { CalendarDays, Search, ShieldCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Список можливостей, які показуємо на головній.
// Виніс його в масив, щоб не копіювати однакові картки руками.
const features = [
  {
    icon: CalendarDays,
    title: "Календар подій",
    text: "Обираєш день у календарі й одразу додаєш подію на цю дату.",
  },
  {
    icon: Star,
    title: "Важливість",
    text: "Кожній події ставиш позначку: звичайна, важлива або критична.",
  },
  {
    icon: Search,
    title: "Пошук і фільтри",
    text: "Знаходиш потрібну подію за словом у назві або фільтруєш за важливістю.",
  },
  {
    icon: ShieldCheck,
    title: "Особистий кабінет",
    text: "Вхід через email або Google. Свої події бачиш тільки ти.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-10 px-6 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <CalendarDays className="size-12 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Планувальник подій
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Простий календар для твоїх зустрічей, справ і нагадувань. Додавай
          події, познач їх важливість і завжди тримай план перед очима.
        </p>
        <Button size="lg" disabled>
          Календар з&apos;явиться в наступній гілці
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon className="size-5 text-primary" />
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.text}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}
