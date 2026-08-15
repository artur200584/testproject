import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Це "клієнт бази даних" — через нього ми читаємо й записуємо дані.
//
// Навіщо тут globalThis: у режимі розробки Next.js перезавантажує код
// після кожної правки. Якщо просто написати new PrismaClient(), то з кожним
// перезавантаженням створювався б новий клієнт, і база швидко впиралась би
// в ліміт підключень. Тому ми зберігаємо клієнт у глобальній змінній
// і перевикористовуємо той самий.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
