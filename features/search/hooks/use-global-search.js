"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

/**
 * Filters videos and notes against a single query string. The query
 * is debounced so fast typing doesn't cause layout thrashing on large
 * collections.
 * @param {Array} videos
 * @param {Array} notes
 */
export function useGlobalSearch(videos, notes) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 200);

  const normalizedQuery = debouncedQuery.trim().toLowerCase();

  const filteredVideos = useMemo(() => {
    if (!normalizedQuery) return videos;
    return videos.filter((v) => v.title.toLowerCase().includes(normalizedQuery));
  }, [videos, normalizedQuery]);

  const filteredNotes = useMemo(() => {
    if (!normalizedQuery) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(normalizedQuery) ||
        n.content.toLowerCase().includes(normalizedQuery)
    );
  }, [notes, normalizedQuery]);

  return {
    query,
    setQuery,
    isSearching: normalizedQuery.length > 0,
    filteredVideos,
    filteredNotes,
  };
}
