"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { formatDate, cn } from "@/lib/utils";
import { NOTE_THEMES } from "../constants/themes";

export function NoteCard({ note, onEdit, onDelete }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const theme = NOTE_THEMES[note.theme] ?? NOTE_THEMES.sakura;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "masonry-item relative overflow-hidden rounded-2xl border p-5 shadow-card transition-shadow hover:shadow-hover",
        theme.bg,
        theme.border
      )}
    >
      <span
        aria-hidden
        className="absolute -right-3 -top-3 text-5xl opacity-20 select-none"
      >
        {theme.emoji}
      </span>

      <div className="relative">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
            theme.chip
          )}
        >
          {theme.emoji} {theme.label}
        </span>

        <h3 className={cn("mt-3 text-base font-semibold leading-snug", theme.accent)}>
          {note.title}
        </h3>
        <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/80 line-clamp-6">
          {note.content}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDate(note.updatedAt)}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Edit ${note.title}`}
              onClick={() => onEdit(note)}
              className="h-8 w-8 rounded-full hover:bg-white/60 dark:hover:bg-white/10"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Delete ${note.title}`}
              onClick={() => setConfirmOpen(true)}
              className="h-8 w-8 rounded-full text-error hover:bg-error/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this note?"
        description={`"${note.title}" will be deleted permanently.`}
        confirmLabel="Delete note"
        onConfirm={() => onDelete(note.id)}
      />
    </motion.div>
  );
}
