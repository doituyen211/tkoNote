"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Animated statistic card for the dashboard overview.
 */
export function StatCard({ icon: Icon, label, value, className, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-card",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
          <Icon className="h-4 w-4 text-accent-foreground" aria-hidden />
        </div>
      </div>
      <motion.p
        key={value}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 text-3xl font-semibold tracking-tight"
      >
        {value}
      </motion.p>
    </motion.div>
  );
}
