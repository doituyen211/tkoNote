import { cn } from "@/lib/utils";

const VARIANTS = {
  default: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
  outline: "border border-border text-foreground",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        VARIANTS[variant],
        className
      )}
      {...props}
    />
  );
}
