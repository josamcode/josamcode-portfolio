"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query without a mount effect, so the value is read
 * straight from the browser rather than set through a cascading render.
 * Returns `serverValue` during SSR and the first client render.
 */
export function useMediaQuery(query: string, serverValue = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => serverValue, [serverValue]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
