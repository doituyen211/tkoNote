"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { noteSchema } from "@/lib/validators";
import { NOTE_THEME_LIST } from "../constants/themes";

const DEFAULT_VALUES = { title: "", content: "", theme: "sakura" };

export function NoteFormDialog({ open, onOpenChange, note, onCreate, onUpdate }) {
  const isEditing = Boolean(note);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ resolver: zodResolver(noteSchema), defaultValues: DEFAULT_VALUES });

  useEffect(() => {
    if (open) {
      reset(
        note
          ? { title: note.title, content: note.content, theme: note.theme }
          : DEFAULT_VALUES
      );
    }
  }, [open, note, reset]);

  const onSubmit = (values) => {
    if (isEditing) {
      onUpdate(note.id, values);
    } else {
      onCreate(values);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(92vw,540px)]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit note" : "New note"}</DialogTitle>
          <DialogDescription>
            Pick a theme that matches the mood of what you're learning.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "note-title-error" : undefined}
              {...register("title")}
            />
            {errors.title && (
              <p id="note-title-error" role="alert" className="text-xs text-error">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note-content">Content</Label>
            <Textarea
              id="note-content"
              aria-invalid={!!errors.content}
              aria-describedby={errors.content ? "note-content-error" : undefined}
              {...register("content")}
            />
            {errors.content && (
              <p id="note-content-error" role="alert" className="text-xs text-error">
                {errors.content.message}
              </p>
            )}
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Theme</legend>
            <Controller
              control={control}
              name="theme"
              render={({ field }) => (
                <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Note theme">
                  {NOTE_THEME_LIST.map((theme) => {
                    const selected = field.value === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={theme.label}
                        onClick={() => field.onChange(theme.id)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-xl border p-2.5 text-xs font-medium transition-colors",
                          theme.bg,
                          selected ? "border-primary ring-2 ring-primary/30" : theme.border
                        )}
                      >
                        <span className="text-xl leading-none">{theme.emoji}</span>
                        {theme.label}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </fieldset>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Save changes" : (
                <>
                  <Plus className="h-4 w-4" />
                  Create note
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
