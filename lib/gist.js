const GITHUB_API = "https://api.github.com";
const GIST_DESCRIPTION = "Learnboard — learning dashboard data";
const GIST_FILENAME = "learning-dashboard-data.json";

function headers(token) {
  return {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
  };
}

/**
 * Validate a GitHub token by hitting /user.
 * @returns {Promise<{valid: boolean, username?: string}>}
 */
export async function validateToken(token) {
  const res = await fetch(`${GITHUB_API}/user`, {
    headers: headers(token),
  });
  if (!res.ok) return { valid: false };
  const data = await res.json();
  return { valid: true, username: data.login };
}

/**
 * Create a new private gist.
 * @returns {Promise<string>} The gist ID.
 */
export async function createGist(token) {
  const res = await fetch(`${GITHUB_API}/gists`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({
      description: GIST_DESCRIPTION,
      public: false,
      files: {
        [GIST_FILENAME]: { content: "{}" },
      },
    }),
  });
  if (!res.ok) throw new Error("Failed to create gist");
  const data = await res.json();
  return data.id;
}

/**
 * Read data from an existing gist.
 * @returns {Promise<object|null>}
 */
export async function readGist(token, gistId) {
  const res = await fetch(`${GITHUB_API}/gists/${gistId}`, {
    headers: headers(token),
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to read gist");
  }
  const data = await res.json();
  const file = data.files?.[GIST_FILENAME];
  if (!file?.content) return null;
  try {
    return JSON.parse(file.content);
  } catch {
    return null;
  }
}

/**
 * Update an existing gist with new data.
 */
export async function updateGist(token, gistId, payload) {
  const res = await fetch(`${GITHUB_API}/gists/${gistId}`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({
      files: {
        [GIST_FILENAME]: { content: JSON.stringify(payload, null, 2) },
      },
    }),
  });
  if (!res.ok) throw new Error("Failed to update gist");
}

/**
 * Merge two datasets — newest timestamp wins per record.
 * Records are matched by `id`.
 */
export function mergeData(local, remote) {
  if (!remote) return local;
  if (!local) return remote;

  const mergeById = (a = [], b = []) => {
    const map = new Map();
    for (const item of a) {
      if (item?.id) map.set(item.id, item);
    }
    for (const item of b) {
      if (!item?.id) continue;
      const existing = map.get(item.id);
      if (!existing) {
        map.set(item.id, item);
      } else {
        const localTime = existing.updatedAt || existing.createdAt || "";
        const remoteTime = item.updatedAt || item.createdAt || "";
        map.set(item.id, remoteTime > localTime ? item : existing);
      }
    }
    return Array.from(map.values());
  };

  const mergedVideos = mergeById(local.videos, remote.videos);
  const mergedNotes = mergeById(local.notes, remote.notes);

  return {
    version: local.version || remote.version || 1,
    videos: mergedVideos,
    notes: mergedNotes,
    settings: { ...(remote.settings || {}), ...(local.settings || {}) },
  };
}
