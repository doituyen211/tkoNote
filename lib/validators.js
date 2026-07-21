import { z } from "zod";

const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]{6,}/i;

export const videoUrlSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, "Paste a YouTube link to continue.")
    .regex(YOUTUBE_URL_REGEX, "That doesn't look like a valid YouTube link."),
});

export const NOTE_THEMES = [
  "sakura",
  "cat",
  "bunny",
  "teddy",
  "lemon",
  "plant",
  "cloud",
  "galaxy",
];

export const noteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Give your note a title.")
    .max(80, "Keep the title under 80 characters."),
  content: z
    .string()
    .trim()
    .min(1, "Write something before saving.")
    .max(4000, "Keep notes under 4000 characters."),
  theme: z.enum(NOTE_THEMES),
});

const videoRecordSchema = z.object({
  id: z.string(),
  videoId: z.string(),
  url: z.string(),
  title: z.string(),
  thumbnail: z.string(),
  addedAt: z.string(),
  order: z.number(),
});

const noteRecordSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  theme: z.enum(NOTE_THEMES),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const importSchema = z.object({
  version: z.number(),
  videos: z.array(videoRecordSchema).default([]),
  notes: z.array(noteRecordSchema).default([]),
  settings: z.record(z.any()).default({}),
});

/**
 * Validates an imported JSON payload. Returns either the parsed data
 * or a friendly error message — never throws.
 * @param {unknown} json
 * @returns {{ success: true, data: object } | { success: false, error: string }}
 */
export function validateImportPayload(json) {
  const result = importSchema.safeParse(json);
  if (result.success) return { success: true, data: result.data };
  return {
    success: false,
    error: "This file doesn't match the expected format. Nothing was imported.",
  };
}
