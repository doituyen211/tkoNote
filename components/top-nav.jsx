"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PlayCircle, StickyNote, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/videos", label: "Videos", icon: PlayCircle },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            L
          </span>
          <span className="text-base font-semibold tracking-tight">Learnboard</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 rounded-full border border-border bg-surface p-1 sm:flex"
        >
          {LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <link.icon className="h-4 w-4" aria-hidden />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>

      <nav
        aria-label="Main navigation, mobile"
        className="flex items-center justify-around border-t border-border px-2 py-1.5 sm:hidden"
      >
        {LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xs font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <link.icon className="h-5 w-5" aria-hidden />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
