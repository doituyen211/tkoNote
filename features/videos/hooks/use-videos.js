"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { readStorage } from "@/lib/storage";
import {
  addVideoFromUrl,
  deleteVideo as deleteVideoRecord,
  reorderVideos as reorderVideoRecords,
  setVideoSort as persistVideoSort,
} from "../services/video.storage";

/**
 * Owns all state and mutations for the video library: loading, sorting,
 * add/delete, and drag-and-drop reordering. UI components stay thin.
 */
export function useVideos() {
  const [videos, setVideos] = useState([]);
  const [sort, setSort] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const state = readStorage();
    setVideos(state.videos);
    setSort(state.settings.videoSort || "newest");
    setIsLoading(false);
  }, []);

  const addVideo = useCallback(async (url) => {
    setIsAdding(true);
    try {
      const record = await addVideoFromUrl(url);
      setVideos((prev) => [...prev, record]);
      toast.success("Video added to your library.");
      return true;
    } catch (error) {
      toast.error(error.message || "Couldn't add that video.");
      return false;
    } finally {
      setIsAdding(false);
    }
  }, []);

  const deleteVideo = useCallback((id) => {
    deleteVideoRecord(id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
    toast.success("Video removed.");
  }, []);

  const reorder = useCallback((orderedVideos) => {
    setVideos(orderedVideos);
    reorderVideoRecords(orderedVideos);
  }, []);

  const changeSort = useCallback((value) => {
    setSort(value);
    persistVideoSort(value);
  }, []);

  const sortedVideos = useMemo(() => {
    const copy = [...videos];
    switch (sort) {
      case "oldest":
        return copy.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
      case "alphabetical":
        return copy.sort((a, b) => a.title.localeCompare(b.title));
      case "newest":
      default:
        // Manual drag order takes priority when it exists; fall back
        // to recency otherwise.
        return copy.sort((a, b) => (b.order ?? 0) - (a.order ?? 0));
    }
  }, [videos, sort]);

  return {
    videos: sortedVideos,
    rawVideos: videos,
    sort,
    isLoading,
    isAdding,
    addVideo,
    deleteVideo,
    reorder,
    changeSort,
  };
}
