import { EMPTY_STATE, SCHEMA_VERSION, STORAGE_KEY } from "@/constants/storage-keys";

/**
 * Migration registry. Each function upgrades data from its key version
 * to the next version. Add a new entry whenever SCHEMA_VERSION increases.
 */
const migrations = {
  // Example for future use:
  // 1: (data) => ({ ...data, version: 2, newField: [] }),
};

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validates the minimal shape we depend on. Anything else is coerced
 * to safe defaults rather than throwing, so a corrupted key never
 * crashes the app.
 */
function sanitize(data) {
  if (!isPlainObject(data)) return { ...EMPTY_STATE };

  const version = typeof data.version === "number" ? data.version : SCHEMA_VERSION;
  const videos = Array.isArray(data.videos) ? data.videos : [];
  const notes = Array.isArray(data.notes) ? data.notes : [];
  const settings = isPlainObject(data.settings)
    ? { ...EMPTY_STATE.settings, ...data.settings }
    : { ...EMPTY_STATE.settings };

  return { version, videos, notes, settings };
}

function migrate(data) {
  let current = sanitize(data);
  while (current.version < SCHEMA_VERSION) {
    const step = migrations[current.version];
    if (!step) {
      // No migration path available; bump the version to avoid an
      // infinite loop and keep whatever data survived sanitation.
      current = { ...current, version: SCHEMA_VERSION };
      break;
    }
    current = sanitize(step(current));
  }
  return current;
}

/**
 * Reads the full app state from localStorage, gracefully recovering
 * from missing keys, invalid JSON, or an outdated schema.
 * @returns {{version:number, videos:Array, notes:Array, settings:object}}
 */
export function readStorage() {
  if (typeof window === "undefined") return { ...EMPTY_STATE };

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_STATE };

    const parsed = JSON.parse(raw);
    return migrate(parsed);
  } catch {
    // Corrupted JSON — recover with a clean slate instead of crashing.
    return { ...EMPTY_STATE };
  }
}

/** @type {Array<(data: object) => void>} */
const writeListeners = [];

/**
 * Register a callback that fires after every successful writeStorage.
 * Returns an unsubscribe function.
 * @param {(data: object) => void} fn
 * @returns {() => void}
 */
export function subscribeToWrites(fn) {
  writeListeners.push(fn);
  return () => {
    const idx = writeListeners.indexOf(fn);
    if (idx !== -1) writeListeners.splice(idx, 1);
  };
}

/**
 * Persists the full app state to localStorage.
 * @param {{version:number, videos:Array, notes:Array, settings:object}} data
 * @returns {boolean} whether the write succeeded
 */
export function writeStorage(data) {
  if (typeof window === "undefined") return false;

  try {
    const payload = sanitize(data);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    writeListeners.forEach((fn) => {
      try { fn(payload); } catch { /* subscriber error should not break write */ }
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Merges imported data into current storage without wiping existing
 * records. Videos/notes are de-duplicated by id; settings are merged.
 * @param {object} incoming
 * @returns {{version:number, videos:Array, notes:Array, settings:object}}
 */
export function mergeImportedData(incoming) {
  const current = readStorage();
  const clean = sanitize(incoming);

  const videoIds = new Set(current.videos.map((v) => v.id));
  const noteIds = new Set(current.notes.map((n) => n.id));

  const mergedVideos = [
    ...current.videos,
    ...clean.videos.filter((v) => v?.id && !videoIds.has(v.id)),
  ];
  const mergedNotes = [
    ...current.notes,
    ...clean.notes.filter((n) => n?.id && !noteIds.has(n.id)),
  ];

  const merged = {
    version: SCHEMA_VERSION,
    videos: mergedVideos,
    notes: mergedNotes,
    settings: { ...current.settings, ...clean.settings },
  };

  writeStorage(merged);
  return merged;
}

export { EMPTY_STATE, SCHEMA_VERSION };
