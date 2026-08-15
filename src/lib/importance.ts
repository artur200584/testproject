// Усе про "важливість" події зібрано в одному місці,
// щоб назви й кольори не розповзались по всьому проєкту.

export const IMPORTANCE_VALUES = ["NORMAL", "IMPORTANT", "CRITICAL"] as const;

export type Importance = (typeof IMPORTANCE_VALUES)[number];

// Як показувати важливість користувачу.
export const importanceLabels: Record<Importance, string> = {
  NORMAL: "Звичайна",
  IMPORTANT: "Важлива",
  CRITICAL: "Критична",
};

// Кольори кружечка та плашки для кожної важливості.
export const importanceStyles: Record<Importance, { badge: string; dot: string }> = {
  NORMAL: {
    badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    dot: "bg-slate-400",
  },
  IMPORTANT: {
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    dot: "bg-amber-500",
  },
  CRITICAL: {
    badge: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
    dot: "bg-red-500",
  },
};
