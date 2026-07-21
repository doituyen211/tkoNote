"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, cn } from "@/lib/utils";
import { NOTE_THEMES } from "../constants/themes";

export function NoteViewDialog({ open, onOpenChange, note, onEdit }) {
  if (!note) return null;

  const theme = NOTE_THEMES[note.theme] ?? NOTE_THEMES.sakura;

  const handleEdit = () => {
    onOpenChange(false);
    onEdit(note);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "w-[min(92vw,580px)] max-h-[85dvh]",
          theme.bg
        )}
      >
        <DialogHeader>
          <DialogTitle className="sr-only">{note.title}</DialogTitle>
        </DialogHeader>

        <div className="relative space-y-4 pr-8">
          <span
            aria-hidden
            className="absolute -right-1 -top-6 text-6xl opacity-15 select-none"
          >
            {theme.emoji}
          </span>

          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
              theme.chip
            )}
          >
            {theme.emoji} {theme.label}
          </span>

          <h2
            className={cn(
              "text-xl font-semibold leading-snug tracking-tight",
              theme.accent
            )}
          >
            {note.title}
          </h2>

          <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
            {note.content}
          </div>

          <div className="flex items-center justify-between border-t border-black/5 pt-3 dark:border-white/10">
            <div className="text-xs text-muted-foreground space-y-0.5">
              <p>Created {formatDate(note.createdAt)}</p>
              {note.updatedAt !== note.createdAt && (
                <p>Edited {formatDate(note.updatedAt)}</p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
