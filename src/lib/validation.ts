import { z } from "zod";

// Тут описано, яким має бути правильно заповнена форма.
// Якщо користувач введе щось не те — покажемо йому зрозуміле повідомлення.

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Ім'я має містити хоча б 2 символи"),
    email: z.email("Схоже, це не схоже на email"),
    password: z.string().min(6, "Пароль має бути не коротшим за 6 символів"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не збігаються",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.email("Схоже, це не схоже на email"),
  password: z.string().min(1, "Введіть пароль"),
});
