"use client";

import { useCallback, useEffect, useState } from "react";

import type { Testimonial } from "../content";

/**
 * Animated testimonial carousel — one quote at a time, auto-advancing with a
 * fade, clickable dots, and pause-on-hover. Shared engine across the three
 * concepts; all skin decisions (quote/role type, dot colors, alignment) come
 * in as className props so each page styles it to its concept.
 *
 * No italic emphasis yet (Becky will specify which phrase to italicize per
 * quote later) — quotes render plain inside typographic quotation marks.
 */
export function TestimonialCarousel({
  items,
  intervalMs = 6000,
  align = "left",
  quoteClassName = "",
  roleClassName = "",
  dotClassName = "",
  dotActiveClassName = "",
}: {
  items: Testimonial[];
  intervalMs?: number;
  align?: "left" | "center";
  quoteClassName?: string;
  roleClassName?: string;
  dotClassName?: string;
  dotActiveClassName?: string;
}) {
  const n = items.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);

  useEffect(() => {
    if (paused || n <= 1) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % n), intervalMs);
    return () => clearInterval(id);
  }, [paused, n, intervalMs]);

  const current = items[index];

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={align === "center" ? "text-center" : "text-left"}
    >
      {/* keyed so the fade replays on each change */}
      <blockquote key={index} className={`animate-in fade-in duration-700 ${quoteClassName}`}>
        {"“"}
        {current.quote}
        {"”"}
      </blockquote>
      <div className={roleClassName}>{current.role}</div>

      <div
        className={`mt-8 flex gap-2.5 ${align === "center" ? "justify-center" : "justify-start"}`}
        role="tablist"
        aria-label="Testimonials"
      >
        {items.map((t, i) => (
          <button
            key={t.role + i}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show testimonial ${i + 1} of ${n}`}
            onClick={() => go(i)}
            className={`h-3 w-3 rounded-full transition-colors ${i === index ? dotActiveClassName : dotClassName}`}
          />
        ))}
      </div>
    </div>
  );
}
