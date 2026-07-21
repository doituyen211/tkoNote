"use client";

import { Settings as SettingsIcon } from "lucide-react";
import { ThemeSettings } from "@/features/settings/components/theme-settings";
import { ImportExport } from "@/features/settings/components/import-export";

export default function SettingsPage() {
  const handleImported = () => {
    // Hooks read localStorage once on mount; reloading guarantees every
    // page (dashboard, videos, notes) reflects the freshly merged data.
    window.location.reload();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
          <SettingsIcon className="h-4.5 w-4.5 text-accent-foreground" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage appearance and your saved data.
          </p>
        </div>
      </div>

      <ThemeSettings />
      <ImportExport onImported={handleImported} />
    </div>
  );
}
