"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type CursorState = "default" | "link" | "view" | "text";

/**
 * Two-part cursor: a hard dot that tracks exactly, and a lagging ring that
 * grows over interactive targets. Falls back to the native cursor on touch
 * devices and when reduced motion is on.
 */
export function Cursor({ viewLabel = "View" }: { viewLabel?: string }) {
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = finePointer && !reducedMotion;

  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 340, damping: 30, mass: 0.45 });
  const ringY = useSpring(y, { stiffness: 340, damping: 30, mass: 0.45 });

  // Tells the stylesheet to hide the native cursor only while ours is drawn.
  useEffect(() => {
    if (!enabled) return;
    document.documentElement.setAttribute("data-cursor", "custom");
    return () => document.documentElement.removeAttribute("data-cursor");
  }, [enabled]);

  const last = useRef<{ x: number; y: number } | null>(null);

  /** Resolve the cursor state from whatever element sits under a point. */
  const resolveState = useCallback((element: Element | null) => {
    const interactive = (element as HTMLElement | null)?.closest<HTMLElement>(
      "a, button, [role='button'], input, textarea, select, label, [data-cursor-target]",
    );
    if (!interactive) return setState("default");

    if (interactive.getAttribute("data-cursor-state") === "view") return setState("view");
    if (interactive.matches("input, textarea, select")) return setState("text");
    return setState("link");
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function move(event: MouseEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      last.current = { x: event.clientX, y: event.clientY };
      if (!visible) setVisible(true);
      resolveState(event.target as Element | null);
    }

    // The pointer can end up over a different element without moving, so the
    // state is re-derived whenever the page scrolls underneath it.
    let queued = false;
    function onScroll() {
      if (queued || !last.current) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        if (!last.current) return;
        resolveState(document.elementFromPoint(last.current.x, last.current.y));
      });
    }

    function leave() {
      setVisible(false);
    }
    function down() {
      setPressed(true);
    }
    function up() {
      setPressed(false);
    }

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", leave);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", leave);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [enabled, visible, x, y, resolveState]);

  if (!enabled) return null;

  const ringSize = state === "view" ? 64 : state === "link" ? 44 : state === "text" ? 4 : 28;
  const dotSize = state === "text" ? 2 : state === "default" ? 5 : 0;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[200] rounded-full bg-accent"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: dotSize,
          height: state === "text" ? 22 : dotSize,
          opacity: visible ? 1 : 0,
          borderRadius: state === "text" ? 1 : 999,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 34 }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[199] flex items-center justify-center rounded-full border border-accent/70"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: ringSize,
          height: ringSize,
          opacity: visible ? (state === "text" ? 0 : 1) : 0,
          scale: pressed ? 0.82 : 1,
          backgroundColor:
            state === "view" ? "var(--accent)" : "rgba(0,0,0,0)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <AnimatePresence>
          {state === "view" ? (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="label text-[9px] font-medium text-on-accent"
            >
              {viewLabel}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
