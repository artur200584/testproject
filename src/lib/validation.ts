import { z } from "zod";
import { IMPORTANCE_VALUES } from "@/lib/importance";

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

// Форма події: назва, дата, час, опис і важливість.
export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Назва має містити хоча б 2 символи")
    .max(100, "Назва задовга — максимум 100 символів"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Оберіть дату події"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Вкажіть час події"),
  description: z
    .string()
    .trim()
    .max(500, "Опис задовгий — максимум 500 символів")
    .optional(),
  importance: z.enum(IMPORTANCE_VALUES, {
    message: "Оберіть важливість події",
  }),
});
