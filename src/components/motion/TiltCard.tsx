"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * 3D tilt on pointer move plus a spotlight that tracks the cursor.
 * The spotlight is a separate layer so it can fade independently of the tilt.
 */
export function TiltCard({
  children,
  className,
  intensity = 7,
  spotlight = true,
  glare = false,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
  spotlight?: boolean;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() ?? false;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const opacity = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), {
    stiffness: 200,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), {
    stiffness: 200,
    damping: 22,
  });

  // Hooks stay unconditional; the layers below just choose whether to render.
  const spotlightBg = useTransform(
    [px, py],
    ([x, y]: number[]) =>
      `radial-gradient(420px circle at ${x * 100}% ${y * 100}%, var(--accent-soft), transparent 62%)`,
  );
  const glareBg = useTransform(
    [px, py],
    ([x, y]: number[]) =>
      `radial-gradient(220px circle at ${x * 100}% ${y * 100}%, rgb(255 255 255 / 0.14), transparent 60%)`,
  );

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width);
    py.set((event.clientY - rect.top) / rect.height);
    opacity.set(1);
  }

  function handleLeave() {
    px.set(0.5);
    py.set(0.5);
    opacity.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn("relative isolate transform-gpu", className)}
      style={
        reduced
          ? undefined
          : { rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 900 }
      }
    >
      {spotlight && !reduced ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 block"
          style={{ opacity, background: spotlightBg }}
        />
      ) : null}

      {glare && !reduced ? (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 block mix-blend-overlay"
          style={{ opacity, background: glareBg }}
        />
      ) : null}

      {children}
    </motion.div>
  );
}
