/**
 * Each theme defines a self-contained visual identity for a note card:
 * a light/dark aware background, a border tone, an accent tone for the
 * title and chip, and an emoji standing in for a hand-drawn icon.
 */
export const NOTE_THEMES = {
  sakura: {
    label: "Sakura",
    emoji: "🌸",
    bg: "bg-pink-50 dark:bg-pink-950/30",
    border: "border-pink-200 dark:border-pink-900",
    accent: "text-pink-600 dark:text-pink-300",
    chip: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-200",
  },
  cat: {
    label: "Cat",
    emoji: "🐱",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-900",
    accent: "text-orange-600 dark:text-orange-300",
    chip: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-200",
  },
  bunny: {
    label: "Bunny",
    emoji: "🐰",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-900",
    accent: "text-rose-600 dark:text-rose-300",
    chip: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-200",
  },
  teddy: {
    label: "Teddy",
    emoji: "🧸",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-900",
    accent: "text-amber-700 dark:text-amber-300",
    chip: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
  },
  lemon: {
    label: "Lemon",
    emoji: "🍋",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-900",
    accent: "text-yellow-700 dark:text-yellow-300",
    chip: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
  },
  plant: {
    label: "Plant",
    emoji: "🌿",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-900",
    accent: "text-green-700 dark:text-green-300",
    chip: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200",
  },
  cloud: {
    label: "Cloud",
    emoji: "☁️",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-200 dark:border-sky-900",
    accent: "text-sky-700 dark:text-sky-300",
    chip: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200",
  },
  galaxy: {
    label: "Galaxy",
    emoji: "⭐",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    border: "border-violet-200 dark:border-violet-900",
    accent: "text-violet-700 dark:text-violet-300",
    chip: "bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-200",
  },
};

export const NOTE_THEME_LIST = Object.entries(NOTE_THEMES).map(([id, theme]) => ({
  id,
  ...theme,
}));
