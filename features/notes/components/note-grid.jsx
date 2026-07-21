"use client";

import { AnimatePresence } from "framer-motion";
import { StickyNote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { NoteCard } from "./note-card";

export function NoteGrid({ notes, isLoading, isSearching, onView, onEdit, onDelete, onAddClick }) {
  if (isLoading) {
    return (
      <div className="masonry masonry-sm">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="masonry-item h-40 w-full" />
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={StickyNote}
        title={isSearching ? "No notes match your search" : "No notes yet"}
        description={
          isSearching
            ? "Try a different keyword, or clear the search to see everything."
            : "Capture what you're learning in a cute, themeable note."
        }
        actionLabel={isSearching ? undefined : "Write a note"}
        onAction={isSearching ? undefined : onAddClick}
      />
    );
  }

  return (
    <div className="masonry masonry-sm">
      <AnimatePresence mode="popLayout">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onView={onView} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </div>
  );
}
