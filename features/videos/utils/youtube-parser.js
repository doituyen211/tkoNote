/**
 * Extracts a YouTube video id from any supported URL shape:
 * - youtube.com/watch?v=ID
 * - youtu.be/ID
 * - youtube.com/shorts/ID
 * @param {string} rawUrl
 * @returns {string|null}
 */
export function extractYoutubeVideoId(rawUrl) {
  if (!rawUrl) return null;

  let url;
  try {
    const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    url = new URL(withProtocol);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id || null;
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (url.pathname === "/watch") {
      return url.searchParams.get("v");
    }
    if (url.pathname.startsWith("/shorts/")) {
      return url.pathname.split("/")[2] || null;
    }
  }

  return null;
}

/**
 * Builds the highest-quality thumbnail URL available for a video id.
 * @param {string} videoId
 * @returns {string}
 */
export function getThumbnailUrl(videoId) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Builds the canonical watch URL for a video id.
 * @param {string} videoId
 * @returns {string}
 */
export function getCanonicalUrl(videoId) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}
