"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { videoUrlSchema } from "@/lib/validators";

export function AddVideoDialog({ onAdd, isAdding, open, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(videoUrlSchema), defaultValues: { url: "" } });

  useEffect(() => {
    if (dialogOpen) {
      reset({ url: "" });
    }
  }, [dialogOpen, reset]);

  const onSubmit = async ({ url }) => {
    const success = await onAdd(url);
    if (success) {
      reset();
      setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="rounded-full">
            <Plus className="h-4 w-4" />
            Add video
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a YouTube video</DialogTitle>
          <DialogDescription>
            Paste a link from youtube.com or youtu.be. We&rsquo;ll pull the title and
            thumbnail automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="video-url">YouTube URL</Label>
            <Input
              id="video-url"
              placeholder="https://www.youtube.com/watch?v=..."
              aria-invalid={!!errors.url}
              aria-describedby={errors.url ? "video-url-error" : undefined}
              {...register("url")}
            />
            {errors.url && (
              <p id="video-url-error" role="alert" className="text-xs text-error">
                {errors.url.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isAdding}>
              {isAdding && <Loader2 className="h-4 w-4 animate-spin" />}
              {isAdding ? "Adding..." : "Add video"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
