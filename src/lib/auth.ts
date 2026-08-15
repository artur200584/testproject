import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";

// Вхід через Google працює тільки якщо в .env вписані ключі.
// Якщо їх немає — просто не вмикаємо цей спосіб входу, сайт від цього не ламається.
export const isGoogleEnabled = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET,
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Адаптер каже бібліотеці, куди складати дані про акаунти Google.
  adapter: PrismaAdapter(prisma),

  // "jwt" означає: після входу користувач отримує підписаний токен (JWT),
  // який лежить у нього в браузері в cookie. Сервер щоразу перевіряє цей токен.
  session: { strategy: "jwt" },

  // Якщо незалогінений користувач зайде на закриту сторінку —
  // його відправить сюди.
  pages: { signIn: "/login" },

  providers: [
    // Спосіб входу №1 — Google.
    ...(isGoogleEnabled ? [Google] : []),

    // Спосіб входу №2 — email і пароль.
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        // Користувача немає, або він реєструвався через Google і пароля не має.
        if (!user?.passwordHash) return null;

        // Порівнюємо введений пароль із збереженим хешем.
        const passwordIsCorrect = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );
        if (!passwordIsCorrect) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    // Кладемо id користувача в токен...
    jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    // ...і дістаємо його звідти, щоб у коді можна було писати session.user.id
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
