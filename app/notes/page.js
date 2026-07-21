"use client";

import { useState } from "react";
import { StickyNote, Plus } from "lucide-react";
import { useNotes } from "@/features/notes/hooks/use-notes";
import { NoteGrid } from "@/features/notes/components/note-grid";
import { NoteFilters } from "@/features/notes/components/note-filters";
import { NoteFormDialog } from "@/features/notes/components/note-form-dialog";
import { NoteViewDialog } from "@/features/notes/components/note-view-dialog";
import { Button } from "@/components/ui/button";

export default function NotesPage() {
  const { notes, sort, isLoading, addNote, editNote, deleteNote, changeSort } = useNotes();
  const [formOpen, setFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewNote, setViewNote] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const openCreateDialog = () => {
    setEditingNote(null);
    setFormOpen(true);
  };

  const openEditDialog = (note) => {
    setEditingNote(note);
    setFormOpen(true);
  };

  const openViewDialog = (note) => {
    setViewNote(note);
    setViewOpen(true);
  };

  const handleViewEdit = (note) => {
    setViewNote(null);
    setViewOpen(false);
    openEditDialog(note);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center bg-accent">
            <StickyNote className="h-4.5 w-4.5 text-accent-foreground" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Cute Notes</h1>
            <p className="text-sm text-muted-foreground">
              {notes.length} note{notes.length === 1 ? "" : "s"} saved
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <NoteFilters value={sort} onChange={changeSort} />
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4" />
            New note
          </Button>
        </div>
      </div>

      <NoteGrid
        notes={notes}
        isLoading={isLoading}
        onView={openViewDialog}
        onEdit={openEditDialog}
        onDelete={deleteNote}
        onAddClick={openCreateDialog}
      />

      <NoteViewDialog
        open={viewOpen}
        onOpenChange={setViewOpen}
        note={viewNote}
        onEdit={handleViewEdit}
      />

      <NoteFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        note={editingNote}
        onCreate={addNote}
        onUpdate={editNote}
      />
    </div>
  );
}
