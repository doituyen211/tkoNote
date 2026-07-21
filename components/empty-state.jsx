"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

/**
 * Consistent empty-state illustration + copy + call to action, used
 * across the video library, notes, and search results.
 */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center"
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent">
        <Icon className="h-6 w-6 text-accent-foreground" aria-hidden />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction && (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
