"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { GIST_ID_KEY } from "@/constants/storage-keys";
import { readStorage, writeStorage, setSaveHandler } from "@/lib/storage";
import {
  validateToken,
  readGist,
  updateGist,
  resolveGistId,
  mergeData,
} from "@/lib/gist";

const GistSyncContext = createContext(null);

export function GistSyncProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [gistId, setGistId] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | syncing | synced | error
  const [username, setUsername] = useState(null);
  const tokenRef = useRef(null);
  const uploadingRef = useRef(false);
  const pendingPayloadRef = useRef(null);
  const lastUploadedRef = useRef(null); // JSON string of last successful upload, for dedup

  const setToken = useCallback((value) => {
    setTokenState(value);
    tokenRef.current = value;
  }, []);

  // Load gistId from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(GIST_ID_KEY);
    if (saved) setGistId(saved);
  }, []);

  const saveGistId = useCallback((id) => {
    setGistId(id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(GIST_ID_KEY, id);
    }
  }, []);

  const clearGistId = useCallback(() => {
    setGistId(null);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(GIST_ID_KEY);
    }
  }, []);

  // Process queued uploads sequentially — never concurrent
  const flush = useCallback(async () => {
    if (uploadingRef.current) return;
    uploadingRef.current = true;

    try {
      while (pendingPayloadRef.current) {
        const data = pendingPayloadRef.current;
        pendingPayloadRef.current = null;

        const serialized = JSON.stringify(data);
        if (serialized === lastUploadedRef.current) {
          setStatus("synced");
          continue;
        }

        setStatus("syncing");
        await updateGist(tokenRef.current, gistId, data);
        lastUploadedRef.current = serialized;
        setStatus("synced");
      }
    } catch {
      setStatus("error");
    } finally {
      uploadingRef.current = false;
    }

    // If more data was queued while the finally block ran, restart
    if (pendingPayloadRef.current) {
      flush();
    }
  }, [gistId]);

  // Registered as the save handler — called by save() after local persistence
  // Stores the latest payload and triggers sequential upload
  const onSave = useCallback(async (payload) => {
    if (!tokenRef.current || !gistId) return;
    pendingPayloadRef.current = payload;
    if (!uploadingRef.current) {
      flush();
    }
  }, [gistId, flush]);

  // Register the save handler once on mount; unregister on unmount
  useEffect(() => {
    setSaveHandler(onSave);
    return () => setSaveHandler(null);
  }, [onSave]);

  // Pull from gist — uses writeStorage (no sync trigger)
  const pullFromGist = useCallback(async () => {
    const t = tokenRef.current;
    if (!t) return;

    try {
      setStatus("syncing");

      let g = gistId;
      let remote = g ? await readGist(t, g) : null;

      if (!remote) {
        g = await resolveGistId(t, g);
        saveGistId(g);
        remote = await readGist(t, g);
      }

      if (remote) {
        const local = readStorage();
        const merged = mergeData(local, remote);
        writeStorage(merged);
      }

      setStatus(remote ? "synced" : "error");
    } catch {
      setStatus("error");
    }
  }, [gistId, saveGistId]);

  // Push to gist — exposed for manual use; prefer save() for consistency
  const pushToGist = useCallback(async (data) => {
    const t = tokenRef.current;
    const g = gistId;
    if (!t || !g) return;

    try {
      setStatus("syncing");
      await updateGist(t, g, data);
      lastUploadedRef.current = JSON.stringify(data);
      setStatus("synced");
    } catch {
      setStatus("error");
    }
  }, [gistId]);

  // Connect: validate token → resolve gist → pull remote data
  const connect = useCallback(async (inputToken) => {
    const result = await validateToken(inputToken);
    if (!result.valid) throw new Error("Invalid token");

    setToken(inputToken);
    setUsername(result.username);

    const id = await resolveGistId(inputToken, gistId);
    saveGistId(id);

    const remote = await readGist(inputToken, id);
    if (remote) {
      const local = readStorage();
      const merged = mergeData(local, remote);
      writeStorage(merged);
    }

    setStatus("synced");
    return result.username;
  }, [gistId, saveGistId]);

  // Disconnect
  const disconnect = useCallback(() => {
    setToken(null);
    tokenRef.current = null;
    setUsername(null);
    clearGistId();
    setStatus("idle");
    pendingPayloadRef.current = null;
    lastUploadedRef.current = null;
  }, [clearGistId]);

  // Retry after error — uploads the latest local state
  const retry = useCallback(async () => {
    if (!tokenRef.current || !gistId) return;
    const data = readStorage();
    pendingPayloadRef.current = data;
    if (!uploadingRef.current) {
      flush();
    }
  }, [gistId, flush]);

  const value = {
    token,
    gistId,
    status,
    username,
    isConnected: Boolean(token && gistId),
    connect,
    disconnect,
    pushToGist,
    pullFromGist,
    retry,
  };

  return (
    <GistSyncContext.Provider value={value}>
      {children}
    </GistSyncContext.Provider>
  );
}

export function useGistSync() {
  const ctx = useContext(GistSyncContext);
  if (!ctx) throw new Error("useGistSync must be used within GistSyncProvider");
  return ctx;
}
