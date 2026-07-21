"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, Reorder, useDragControls } from "framer-motion";
import { ExternalLink, Copy, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { formatDate } from "@/lib/utils";

export function VideoCard({ video, onDelete, reorderable = true }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const controls = useDragControls();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(video.url);
      toast.success("Link copied to clipboard.");
    } catch {
      toast.error("Couldn't copy the link.");
    }
  };

  const Wrapper = reorderable ? Reorder.Item : "div";
  const wrapperProps = reorderable
    ? { value: video, dragListener: false, dragControls: controls }
    : {};

  return (
    <Wrapper {...wrapperProps} className="masonry-item">
      <motion.div
        layout
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="group overflow-hidden rounded-xl bg-surface shadow-card transition-shadow hover:shadow-hover"
      >
        <div className="relative aspect-video w-full overflow-hidden bg-secondary/50">
          <Image
            src={video.thumbnail}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
          />
          {reorderable && (
            <button
              type="button"
              aria-label="Drag to reorder"
              onPointerDown={(e) => controls.start(e)}
              className="absolute left-2 top-2 flex h-7 w-7 cursor-grab items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 active:cursor-grabbing"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            {video.title}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Added {formatDate(video.addedAt)}
          </p>

          <div className="mt-3 flex items-center gap-1.5">
            <Button asChild variant="secondary" size="sm" className="flex-1">
              <a href={video.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Open
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Copy link"
              onClick={handleCopy}
              className="h-8 w-8"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Delete ${video.title}`}
              onClick={() => setConfirmOpen(true)}
              className="h-8 w-8 text-error hover:bg-error/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this video?"
        description={`"${video.title}" will be removed from your library. This can't be undone.`}
        confirmLabel="Delete video"
        onConfirm={() => onDelete(video.id)}
      />
    </Wrapper>
  );
}
