import { getCanonicalUrl } from "../utils/youtube-parser";

/**
 * Fetches a video's title via YouTube's public oEmbed endpoint.
 * Falls back to a generic label if the request fails, so adding a
 * video never blocks on network flakiness.
 * @param {string} videoId
 * @returns {Promise<string>}
 */
export async function fetchVideoTitle(videoId) {
  const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    getCanonicalUrl(videoId)
  )}&format=json`;

  try {
    const response = await fetch(oEmbedUrl);
    if (!response.ok) throw new Error("oEmbed request failed");
    const data = await response.json();
    return data.title || "Untitled video";
  } catch {
    return "Untitled video";
  }
}
