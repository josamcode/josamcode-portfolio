"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * False while server-rendering and during hydration, true afterwards.
 *
 * Using an external store rather than a mount effect means React renders the
 * server value during hydration — so client-only values (stored theme,
 * media queries) can never produce a hydration mismatch.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, getSnapshot, getServerSnapshot);
}
