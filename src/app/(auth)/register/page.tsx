import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, isGoogleEnabled } from "@/lib/auth";
import { RegisterForm } from "@/components/auth/register-form";
import { GoogleButton } from "@/components/auth/google-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) redirect("/calendar");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Реєстрація</CardTitle>
        <CardDescription>Створіть акаунт, щоб зберігати свої події</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <RegisterForm />
        <GoogleButton enabled={isGoogleEnabled} />

        <p className="text-center text-sm text-muted-foreground">
          Вже маєте акаунт?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Увійти
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
