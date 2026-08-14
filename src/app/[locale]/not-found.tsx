import type { Metadata } from "next";
import { NotFoundView } from "@/components/sections/NotFoundView";

/**
 * `not-found.tsx` cannot read route params, so the metadata here is
 * locale-neutral. What matters is that it is never indexed.
 */
export const metadata: Metadata = {
  title: "Page not found",
  description: "That page does not exist. Head back to the work or start a project.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return <NotFoundView />;
}
