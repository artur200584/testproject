import Link from "next/link";
import { CalendarDays, LogOut } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";

// Шапка сайту для сторінок, куди можна зайти лише після входу.
export function SiteHeader({ userLabel }: { userLabel: string }) {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <CalendarDays className="size-5 text-primary" />
          Планувальник подій
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {userLabel}
          </span>
          <form action={logoutAction}>
            <Button type="submit" variant="outline" size="sm">
              <LogOut className="size-4" />
              Вийти
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
