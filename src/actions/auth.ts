"use server";

// "use server" на початку файлу означає: усе, що тут написано,
// виконується ТІЛЬКИ на сервері. Браузер цей код не бачить.
// Саме тому тут можна безпечно працювати з базою даних і паролями.

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validation";
import type { AuthFormState } from "@/lib/types";

// Реєстрація нового користувача.
export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  // Запам'ятовуємо введене, щоб повернути назад у форму, якщо буде помилка.
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };

  const parsed = registerSchema.safeParse({
    ...values,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    // Беремо перше повідомлення про помилку і показуємо його.
    return { error: parsed.error.issues[0].message, values };
  }

  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Користувач з таким email вже існує", values };
  }

  // Пароль ніколи не зберігаємо у відкритому вигляді — тільки хеш.
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, passwordHash },
  });

  // Одразу після реєстрації заходимо в акаунт.
  return signInWithPassword(email, password, values);
}

// Вхід за email і паролем.
export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const values = { email: String(formData.get("email") ?? "") };

  const parsed = loginSchema.safeParse({
    ...values,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, values };
  }

  return signInWithPassword(parsed.data.email, parsed.data.password, values);
}

// Вхід через Google (спрацьовує по кнопці "Увійти через Google").
export async function loginWithGoogleAction() {
  await signIn("google", { redirectTo: "/calendar" });
}

// Вихід з акаунта.
export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

// Спільний шматок для реєстрації та входу, щоб не писати те саме двічі.
async function signInWithPassword(
  email: string,
  password: string,
  values: AuthFormState["values"],
): Promise<AuthFormState> {
  try {
    await signIn("credentials", { email, password, redirectTo: "/calendar" });
  } catch (error) {
    // Якщо пароль не підійшов — показуємо помилку.
    if (error instanceof AuthError) {
      return { error: "Невірний email або пароль", values };
    }
    // Успішний вхід теж "кидає помилку" — це технічний сигнал
    // "перекинь користувача на іншу сторінку". Його треба пропустити далі.
    throw error;
  }

  return {};
}
