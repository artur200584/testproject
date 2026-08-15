import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";

// Це "охоронець" на вході в розділ /calendar.
// Layout виконується на сервері перед сторінкою: якщо користувач не увійшов —
// його одразу перекидає на /login, і вміст сторінки він навіть не отримає.
export default async function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <>
      <SiteHeader userLabel={session.user.name ?? session.user.email ?? ""} />
      {children}
    </>
  );
}
