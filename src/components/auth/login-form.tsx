"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import { FormError } from "@/components/auth/form-error";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Форма входу.
// useActionState зв'язує форму з серверною дією loginAction:
// state — це те, що дія повернула (наприклад, текст помилки),
// formAction — те, що треба підставити у <form action={...}>.
export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state.error} />

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
          autoComplete="current-password"
          required
        />
      </div>

      <SubmitButton>Увійти</SubmitButton>
    </form>
  );
}
