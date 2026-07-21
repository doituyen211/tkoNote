"use client";

import { Reorder } from "framer-motion";
import { PlayCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { VideoCard } from "./video-card";

export function VideoGrid({
  videos,
  isLoading,
  isSearching,
  onReorder,
  onDelete,
  onAddClick,
  reorderable = true,
}) {
  if (isLoading) {
    return (
      <div className="masonry masonry-sm">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="masonry-item aspect-[4/5] w-full" />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <EmptyState
        icon={PlayCircle}
        title={isSearching ? "No videos match your search" : "Your video library is empty"}
        description={
          isSearching
            ? "Try a different keyword, or clear the search to see everything."
            : "Paste a YouTube link to save your first learning video."
        }
        actionLabel={isSearching ? undefined : "Add a video"}
        onAction={isSearching ? undefined : onAddClick}
      />
    );
  }

  if (!reorderable) {
    return (
      <div className="masonry masonry-sm">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} onDelete={onDelete} reorderable={false} />
        ))}
      </div>
    );
  }

  return (
    <Reorder.Group
      as="div"
      axis="y"
      values={videos}
      onReorder={onReorder}
      className="masonry masonry-sm"
    >
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onDelete={onDelete} />
      ))}
    </Reorder.Group>
  );
}
