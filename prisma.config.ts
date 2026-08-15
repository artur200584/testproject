// Налаштування для команд Prisma (prisma migrate, prisma studio і т.д.).
// Сам застосунок цей файл не використовує — він потрібен тільки в терміналі.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Для створення та зміни таблиць беремо ПРЯМЕ підключення (без "-pooler"),
    // бо через пулер такі операції працюють нестабільно.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
