"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayCircle, StickyNote, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/stat-card";
import { GlobalSearchBar } from "@/features/search/components/global-search-bar";
import { useGlobalSearch } from "@/features/search/hooks/use-global-search";
import { useVideos } from "@/features/videos/hooks/use-videos";
import { useNotes } from "@/features/notes/hooks/use-notes";
import { VideoGrid } from "@/features/videos/components/video-grid";
import { NoteGrid } from "@/features/notes/components/note-grid";
import { NoteFormDialog } from "@/features/notes/components/note-form-dialog";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { rawVideos, isLoading: videosLoading, deleteVideo } = useVideos();
  const { notes, isLoading: notesLoading, editNote, deleteNote } = useNotes();
  const [editingNote, setEditingNote] = useState(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);

  const { query, setQuery, isSearching, filteredVideos, filteredNotes } =
    useGlobalSearch(rawVideos, notes);

  const recentVideos = [...rawVideos]
    .sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt))
    .slice(0, 4);
  const recentNotes = [...notes]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 4);

  const mostRecentTimestamp = [recentVideos[0]?.addedAt, recentNotes[0]?.updatedAt]
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a))[0];

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteDialogOpen(true);
  };

  return (
    <div className="space-y-10">
      <section>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&rsquo;s what&rsquo;s waiting in your learning workspace.
          </p>
        </motion.div>

        <div className="mt-6">
          <GlobalSearchBar value={query} onChange={setQuery} />
        </div>
      </section>

      {!isSearching && (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard icon={PlayCircle} label="Total videos" value={rawVideos.length} delay={0} />
          <StatCard icon={StickyNote} label="Total notes" value={notes.length} delay={0.05} />
          <StatCard
            icon={Clock}
            label="Last activity"
            value={mostRecentTimestamp ? formatDate(mostRecentTimestamp) : "—"}
            delay={0.1}
          />
        </section>
      )}

      {isSearching ? (
        <div className="space-y-10">
          <section>
            <h2 className="mb-4 text-lg font-semibold">
              Videos {filteredVideos.length > 0 && `(${filteredVideos.length})`}
            </h2>
            <VideoGrid
              videos={filteredVideos}
              isLoading={false}
              isSearching
              reorderable={false}
              onDelete={deleteVideo}
            />
          </section>
          <section>
            <h2 className="mb-4 text-lg font-semibold">
              Notes {filteredNotes.length > 0 && `(${filteredNotes.length})`}
            </h2>
            <NoteGrid
              notes={filteredNotes}
              isLoading={false}
              isSearching
              onEdit={handleEditNote}
              onDelete={deleteNote}
            />
          </section>
        </div>
      ) : (
        <>
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recently added videos</h2>
              <Button asChild variant="ghost" size="sm" className="text-primary">
                <Link href="/videos">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <VideoGrid
              videos={recentVideos}
              isLoading={videosLoading}
              reorderable={false}
              onDelete={deleteVideo}
            />
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent notes</h2>
              <Button asChild variant="ghost" size="sm" className="text-primary">
                <Link href="/notes">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <NoteGrid
              notes={recentNotes}
              isLoading={notesLoading}
              onEdit={handleEditNote}
              onDelete={deleteNote}
            />
          </section>
        </>
      )}

      <NoteFormDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        note={editingNote}
        onUpdate={editNote}
      />
    </div>
  );
}
