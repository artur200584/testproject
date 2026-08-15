"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/auth";
import { FormError } from "@/components/auth/form-error";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Форма реєстрації. Влаштована так само, як форма входу,
// тільки полів більше і викликає вона registerAction.
export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state.error} />

      <div className="space-y-2">
        <Label htmlFor="name">Ім&apos;я</Label>
        <Input
          id="name"
          name="name"
          placeholder="Іван"
          autoComplete="name"
          defaultValue={state.values?.name}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="ivan@example.com"
          autoComplete="email"
          defaultValue={state.values?.email}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Пароль</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Повторіть пароль</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>

      <SubmitButton>Створити акаунт</SubmitButton>
    </form>
  );
}
