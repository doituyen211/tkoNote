"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { GIST_ID_KEY } from "@/constants/storage-keys";
import { readStorage, writeStorage, subscribeToWrites } from "@/lib/storage";
import {
  validateToken,
  createGist,
  readGist,
  updateGist,
  mergeData,
} from "@/lib/gist";

const GistSyncContext = createContext(null);

export function GistSyncProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [gistId, setGistId] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | syncing | synced | error
  const [username, setUsername] = useState(null);
  const syncingRef = useRef(false);
  const tokenRef = useRef(null);
  const suppressPushRef = useRef(false); // suppress push during pull to avoid loop

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

  // Pull from gist — suppress push subscriber during pull
  const pullFromGist = useCallback(async () => {
    const t = tokenRef.current;
    const g = gistId;
    if (!t || !g) return;

    try {
      setStatus("syncing");
      suppressPushRef.current = true;
      const remote = await readGist(t, g);
      if (!remote) {
        setStatus("error");
        return;
      }
      const local = readStorage();
      const merged = mergeData(local, remote);
      writeStorage(merged);
      suppressPushRef.current = false;
      setStatus("synced");
    } catch {
      suppressPushRef.current = false;
      setStatus("error");
    }
  }, [gistId]);

  // Push to gist — called after every write
  const pushToGist = useCallback(async (data) => {
    const t = tokenRef.current;
    const g = gistId;
    if (!t || !g || syncingRef.current) return;

    try {
      syncingRef.current = true;
      setStatus("syncing");
      await updateGist(t, g, data);
      setStatus("synced");
    } catch {
      setStatus("error");
    } finally {
      syncingRef.current = false;
    }
  }, [gistId]);

  // Subscribe to localStorage writes → auto-push to gist
  useEffect(() => {
    if (!tokenRef.current || !gistId) return;
    const unsub = subscribeToWrites((data) => {
      if (suppressPushRef.current) return;
      pushToGist(data);
    });
    return unsub;
  }, [gistId, pushToGist]);

  // Connect: validate token → create or find gist → pull
  const connect = useCallback(async (inputToken) => {
    const result = await validateToken(inputToken);
    if (!result.valid) throw new Error("Invalid token");

    setToken(inputToken);
    setUsername(result.username);

    let id = gistId;
    if (!id) {
      id = await createGist(inputToken);
      saveGistId(id);
    }

    // Pull latest data
    suppressPushRef.current = true;
    const remote = await readGist(inputToken, id);
    if (remote) {
      const local = readStorage();
      const merged = mergeData(local, remote);
      writeStorage(merged);
    }
    suppressPushRef.current = false;

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
  }, [clearGistId]);

  // Retry after error
  const retry = useCallback(async () => {
    await pullFromGist();
  }, [pullFromGist]);

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
