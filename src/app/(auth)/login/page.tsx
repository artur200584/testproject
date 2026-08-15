import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, isGoogleEnabled } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";
import { GoogleButton } from "@/components/auth/google-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LoginPage() {
  // Якщо користувач уже увійшов — нема сенсу показувати форму входу.
  const session = await auth();
  if (session?.user) redirect("/calendar");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Вхід</CardTitle>
        <CardDescription>Введіть email і пароль, щоб продовжити</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <LoginForm />
        <GoogleButton enabled={isGoogleEnabled} />

        <p className="text-center text-sm text-muted-foreground">
          Ще немає акаунта?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Зареєструватися
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
