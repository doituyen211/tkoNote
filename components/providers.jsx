"use client";

import { GistSyncProvider } from "@/hooks/use-gist-sync";

export function Providers({ children }) {
  return <GistSyncProvider>{children}</GistSyncProvider>;
}
