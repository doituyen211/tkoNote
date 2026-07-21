"use client";

import { useState } from "react";
import { PlayCircle, Plus } from "lucide-react";
import { useVideos } from "@/features/videos/hooks/use-videos";
import { VideoGrid } from "@/features/videos/components/video-grid";
import { VideoFilters } from "@/features/videos/components/video-filters";
import { AddVideoDialog } from "@/features/videos/components/add-video-dialog";
import { Button } from "@/components/ui/button";

export default function VideosPage() {
  const {
    videos,
    sort,
    isLoading,
    isAdding,
    addVideo,
    deleteVideo,
    reorder,
    changeSort,
  } = useVideos();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center bg-accent">
            <PlayCircle className="h-4.5 w-4.5 text-accent-foreground" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Video Library</h1>
            <p className="text-sm text-muted-foreground">
              {videos.length} video{videos.length === 1 ? "" : "s"} saved
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <VideoFilters value={sort} onChange={changeSort} />
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add video
          </Button>
          <AddVideoDialog
            onAdd={addVideo}
            isAdding={isAdding}
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
          />
        </div>
      </div>

      <VideoGrid
        videos={videos}
        isLoading={isLoading}
        onReorder={reorder}
        onDelete={deleteVideo}
        onAddClick={() => setAddDialogOpen(true)}
      />
    </div>
  );
}
