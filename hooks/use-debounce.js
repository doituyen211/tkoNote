"use client";

import { useEffect, useState } from "react";

/**
 * Debounces a fast-changing value.
 * @template T
 * @param {T} value
 * @param {number} [delay=250]
 * @returns {T}
 */
export function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}
