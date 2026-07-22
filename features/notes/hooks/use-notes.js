"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { readStorage } from "@/lib/storage";
import {
  createNote,
  deleteNote as deleteNoteRecord,
  setNoteSort as persistNoteSort,
  updateNote,
} from "../services/note.storage";

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [sort, setSort] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const state = readStorage();
    setNotes(state.notes);
    setSort(state.settings.noteSort || "newest");
    setIsLoading(false);
  }, []);

  const addNote = useCallback(async (input) => {
    const record = await createNote(input);
    setNotes((prev) => [...prev, record]);
    toast.success("Note saved.");
    return record;
  }, []);

  const editNote = useCallback(async (id, input) => {
    const record = await updateNote(id, input);
    if (record) {
      setNotes((prev) => prev.map((n) => (n.id === id ? record : n)));
      toast.success("Note updated.");
    }
    return record;
  }, []);

  const deleteNote = useCallback(async (id) => {
    await deleteNoteRecord(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast.success("Note deleted.");
  }, []);

  const changeSort = useCallback(async (value) => {
    setSort(value);
    await persistNoteSort(value);
  }, []);

  const sortedNotes = useMemo(() => {
    const copy = [...notes];
    switch (sort) {
      case "oldest":
        return copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "theme":
        return copy.sort((a, b) => a.theme.localeCompare(b.theme));
      case "newest":
      default:
        return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }, [notes, sort]);

  return {
    notes: sortedNotes,
    sort,
    isLoading,
    addNote,
    editNote,
    deleteNote,
    changeSort,
  };
}
