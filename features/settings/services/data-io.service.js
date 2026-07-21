import { readStorage, mergeImportedData } from "@/lib/storage";
import { validateImportPayload } from "@/lib/validators";

/**
 * Serializes current storage into a downloadable JSON blob URL.
 * @returns {{ url: string, filename: string }}
 */
export function exportData() {
  const state = readStorage();
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10);
  return { url, filename: `learning-dashboard-export-${date}.json` };
}

/**
 * Parses and validates a File, then merges it into storage.
 * @param {File} file
 * @returns {Promise<{ success: true, videosAdded: number, notesAdded: number } | { success: false, error: string }>}
 */
export async function importDataFromFile(file) {
  let json;
  try {
    const text = await file.text();
    json = JSON.parse(text);
  } catch {
    return { success: false, error: "That file isn't valid JSON." };
  }

  const validation = validateImportPayload(json);
  if (!validation.success) {
    return { success: false, error: validation.error };
  }

  const before = readStorage();
  const merged = mergeImportedData(validation.data);

  return {
    success: true,
    videosAdded: merged.videos.length - before.videos.length,
    notesAdded: merged.notes.length - before.notes.length,
  };
}
