import { loginWithGoogleAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Кнопка "Увійти через Google".
// Якщо ключі Google ще не додані в .env — кнопка показується вимкненою
// з підказкою, щоб було зрозуміло, чому вона не працює.
export function GoogleButton({ enabled }: { enabled: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">або</span>
        <Separator className="flex-1" />
      </div>

      {enabled ? (
        <form action={loginWithGoogleAction}>
          <Button type="submit" variant="outline" className="w-full">
            <GoogleIcon />
            Увійти через Google
          </Button>
        </form>
      ) : (
        <div className="space-y-2">
          <Button variant="outline" className="w-full" disabled>
            <GoogleIcon />
            Увійти через Google
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Щоб увімкнути, додай ключі Google у файл .env (інструкція в README)
          </p>
        </div>
      )}
    </div>
  );
}

// Логотип Google. В lucide-react логотипів брендів немає,
// тому малюємо його вручну.
function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.4 14.4a7.2 7.2 0 0 1 0-4.6V6.7H1.4a12 12 0 0 0 0 10.8l4-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.7l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
      />
    </svg>
  );
}
