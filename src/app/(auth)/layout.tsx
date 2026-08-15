import Link from "next/link";
import { CalendarDays } from "lucide-react";

// Спільна обгортка для сторінок входу та реєстрації:
// логотип угорі і форма по центру екрана.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <CalendarDays className="size-5 text-primary" />
        Планувальник подій
      </Link>
      {children}
    </main>
  );
}
