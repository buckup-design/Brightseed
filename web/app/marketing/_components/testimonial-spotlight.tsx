"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Testimonial } from "../content";

/**
 * Restrained-only "split spotlight" quote rotator — right column of the
 * Customer Stories section (the page owns the left headline column). One
 * quote at a time with the carousel's keyed fade, a per-quote emphasized
 * phrase in Tiempos italic, role-only attribution, and circular prev/next
 * arrows. Auto-advances every 6s on a continuous loop, pausing only on
 * hover — a manual arrow click jumps immediately but never breaks the
 * loop. Bold/Minimal keep testimonial-carousel.
 */

/** Defensive emphasis split: plain render when absent or not an exact substring. */
function EmphasizedQuote({ quote, emphasis }: { quote: string; emphasis?: string }) {
  if (!emphasis) return <>{quote}</>;
  const at = quote.indexOf(emphasis);
  if (at === -1) return <>{quote}</>;
  return (
    <>
      {quote.slice(0, at)}
      <span className="font-display italic text-[var(--mk-emphasis)]">{emphasis}</span>
      {quote.slice(at + emphasis.length)}
    </>
  );
}

export function TestimonialSpotlight({
  items,
  intervalMs = 6000,
}: {
  items: Testimonial[];
  intervalMs?: number;
}) {
  const n = items.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (i: number) => {
      setIndex(((i % n) + n) % n);
    },
    [n],
  );

  useEffect(() => {
    if (paused || n <= 1) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % n), intervalMs);
    return () => clearInterval(id);
  }, [paused, n, intervalMs]);

  const current = items[index];

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {/* keyed so the fade replays on each change */}
      <blockquote
        key={index}
        className="animate-in fade-in duration-700 text-3xl font-medium leading-[1.25] tracking-tight text-[var(--mk-quote)] sm:text-4xl"
      >
        {"“"}
        <EmphasizedQuote quote={current.quote} emphasis={current.emphasis} />
        {"”"}
      </blockquote>
      <div className="mt-4 text-sm text-[var(--mk-muted)]">{current.role}</div>
      <div className="mt-10 flex gap-3">
        <button
          type="button"
          aria-label="Previous testimonial"
          onClick={() => go(index - 1)}
          className="flex size-10 items-center justify-center rounded-full border border-[var(--p-color-sand-300)] text-[var(--mk-quote)] transition-colors hover:border-[var(--p-color-sand-500)] hover:bg-[var(--p-color-sand-50)]"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Next testimonial"
          onClick={() => go(index + 1)}
          className="flex size-10 items-center justify-center rounded-full border border-[var(--p-color-sand-300)] text-[var(--mk-quote)] transition-colors hover:border-[var(--p-color-sand-500)] hover:bg-[var(--p-color-sand-50)]"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
