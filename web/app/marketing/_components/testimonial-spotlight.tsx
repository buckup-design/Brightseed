"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Testimonial } from "../content";

/**
 * Restrained-only "split spotlight" quote rotator — right column of the
 * Customer Stories section (the page owns the left headline column). One
 * quote at a time, grid-stacked so the box is naturally as tall as the
 * tallest quote at every width, with a crossfade between them, a per-quote
 * emphasized phrase in Tiempos italic, role-only attribution, position pips,
 * and circular prev/next arrows. Auto-advances every 6s on a continuous
 * loop; pauses on hover and whenever the user prefers reduced motion. A
 * manual arrow or pip click jumps immediately but never breaks the loop.
 * Bold/Minimal keep
 * testimonial-carousel (whose --mk-dot/--mk-dot-active tokens the pips below
 * reuse).
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
  const [hovered, setHovered] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Same guard the rest of the page gives its CSS transitions via
  // motion-reduce:. Note this is now the ONLY non-hover way to stop the
  // rotation — the explicit pause control was removed by design decision
  // (Becky, Aug 2026), so a touch user who doesn't set the OS preference
  // can't halt it. That is a known WCAG 2.2.2 gap, not an oversight.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = useCallback(
    (i: number) => {
      setIndex(((i % n) + n) % n);
    },
    [n],
  );

  const paused = hovered || reducedMotion;

  useEffect(() => {
    if (paused || n <= 1) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % n), intervalMs);
    return () => clearInterval(id);
  }, [paused, n, intervalMs]);

  const current = items[index];

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* All three quotes render in one grid cell (grid-area 1/1 via
          col-start-1 row-start-1) instead of swapping one blockquote in and
          out, so the cell is naturally as tall as the tallest quote at every
          width. This replaces two hand-measured min-h magic numbers
          (min-h-[37.5rem] below sm, sm:min-h-[23.4375rem] at sm+) that were
          wrong across most of the range: up to 178px of dead space at 480px,
          and up to 153px short (causing everything below to jump on the
          carousel's 6s timer) in the 640-830 and 1024-1180 bands. Those
          numbers only worked because they were re-measured by hand per
          breakpoint; grid-stacking needs no re-measuring when copy or type
          size changes. Inactive quotes go opacity-0 + invisible +
          pointer-events-none + aria-hidden so they don't paint, aren't
          reachable, and drop out of the a11y tree, while still occupying the
          cell so the tallest one sets its height. visibility transitions at
          the START when becoming visible and at the END when becoming
          hidden (CSS spec behavior for that property), which is what turns
          the opacity transition into a real crossfade instead of the old
          key={index} remount, which only ever faded in. */}
      {/* Font size is a clamp(), not the old text-5xl sm:text-6xl step: a
          single 48-to-60px jump at sm (640) was exactly the kind of stepped
          quantity that produced the F5 quote-column growth spurt. Floor
          2rem/32px holds below ~400px viewport (per Becky, deliberately
          smaller than the old 48px floor so the quote reads on a phone
          instead of running ten lines deep at four words a line); the ramp
          reaches the old 3.75rem/60px ceiling by ~1100px, comfortably before
          the testimonials split at min-[1120px] below, so the type isn't also
          changing size at the same breakpoint where the column does. */}
      <div className="grid">
        {items.map((item, i) => (
          <blockquote
            key={i}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 text-[clamp(2rem,1rem+4vw,3.75rem)] font-medium leading-[1.25] tracking-tight text-[var(--mk-quote)] transition-[opacity,visibility] duration-700 motion-reduce:transition-none ${
              i === index ? "visible opacity-100" : "invisible pointer-events-none opacity-0"
            }`}
          >
            {"“"}
            <EmphasizedQuote quote={item.quote} emphasis={item.emphasis} />
            {"”"}
          </blockquote>
        ))}
      </div>
      <div className="mt-4 text-sm text-[var(--mk-muted)]">{current.role}</div>
      {/* Pips: 24px hit target (size-6) around a 6px dot (size-1.5), so the
          visual stays small while the touch target clears the 24px minimum.
          The dot used to be the whole button. */}
      <div className="mt-4 flex items-center" role="tablist" aria-label="Testimonial navigation">
        {items.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show testimonial ${i + 1} of ${n}`}
            onClick={() => go(i)}
            className="flex size-6 items-center justify-center"
          >
            <span
              className={`size-1.5 rounded-full transition-colors ${
                i === index ? "bg-[var(--mk-dot-active)]/80" : "bg-[var(--mk-dot)] hover:bg-[var(--mk-dot-active)]/50"
              }`}
            />
          </button>
        ))}
      </div>
      <div className="mt-6 flex gap-3">
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
