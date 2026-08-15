// Технічна "адреса", за якою бібліотека NextAuth сама обробляє
// вхід, вихід і повернення з Google. Свого коду тут не потрібно.
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
