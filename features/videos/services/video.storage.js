import { readStorage, save } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import { extractYoutubeVideoId, getThumbnailUrl } from "../utils/youtube-parser";
import { fetchVideoTitle } from "./youtube.service";

/**
 * @typedef {object} VideoRecord
 * @property {string} id
 * @property {string} videoId
 * @property {string} url
 * @property {string} title
 * @property {string} thumbnail
 * @property {string} addedAt
 * @property {number} order
 */

export function getAllVideos() {
  return readStorage().videos;
}

/**
 * Adds a new video from a raw YouTube URL. Parses the id, generates
 * the thumbnail, and fetches the title via oEmbed.
 * @param {string} rawUrl
 * @returns {Promise<VideoRecord>}
 */
export async function addVideoFromUrl(rawUrl) {
  const videoId = extractYoutubeVideoId(rawUrl);
  if (!videoId) {
    throw new Error("That doesn't look like a valid YouTube link.");
  }

  const state = readStorage();
  const duplicate = state.videos.find((v) => v.videoId === videoId);
  if (duplicate) {
    throw new Error("This video is already in your library.");
  }

  const title = await fetchVideoTitle(videoId);

  /** @type {VideoRecord} */
  const record = {
    id: generateId(),
    videoId,
    url: rawUrl,
    title,
    thumbnail: getThumbnailUrl(videoId),
    addedAt: new Date().toISOString(),
    order: state.videos.length,
  };

  await save({ ...state, videos: [...state.videos, record] });
  return record;
}

/**
 * @param {string} id
 */
export async function deleteVideo(id) {
  const state = readStorage();
  await save({ ...state, videos: state.videos.filter((v) => v.id !== id) });
}

/**
 * Persists a new relative order after a drag-and-drop reorder.
 * @param {VideoRecord[]} orderedVideos
 */
export async function reorderVideos(orderedVideos) {
  const state = readStorage();
  const withOrder = orderedVideos.map((v, index) => ({ ...v, order: index }));
  await save({ ...state, videos: withOrder });
}

/**
 * @param {"newest"|"oldest"|"alphabetical"} sort
 */
export async function setVideoSort(sort) {
  const state = readStorage();
  await save({ ...state, settings: { ...state.settings, videoSort: sort } });
}
