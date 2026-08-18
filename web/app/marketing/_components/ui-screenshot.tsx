"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Swappable UI-screenshot placeholder — the gray "UI Screenshot hero" box from
 * the Bold + Restrained mock. Renders the labeled placeholder by default; when
 * an image exists at `src`, it covers the box. If the file is missing the
 * <img> errors and we fall back to the placeholder, so Becky can drop her
 * screenshots at the given paths and they appear on next load with no code
 * change.
 *
 * Expected drop paths (public/): see each page for the exact filename.
 *
 * `mobileSrc` (optional, item 11): art-directs a separate crop below 640px
 * via a <picture><source media> swap, rather than just scaling `src` down.
 * The load-detection below still targets the single underlying <img> DOM
 * node — the browser picks which source resolves into it, but it's the same
 * element either way, so onLoad/onError and the mount-time complete check
 * keep working unchanged regardless of which source won.
 */
export function UiScreenshot({
  src,
  mobileSrc,
  alt = "Hummingbird interface",
  label = "UI Screenshot",
  className = "",
}: {
  src?: string;
  mobileSrc?: string;
  alt?: string;
  label?: string;
  className?: string;
}) {
  // Start hidden; reveal only once the image actually loads. A missing file
  // (404) never resolves with pixels, so it stays invisible and the placeholder
  // shows — no broken-image glyph or alt text flashing through.
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // A cached/fast image can finish loading before React attaches onLoad, so the
  // event never fires and the box stays blank. Check img.complete on mount (and
  // when src changes) and reveal if it already decoded (naturalWidth > 0 rules
  // out a 404, whose complete is also true but has no pixels).
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder fill — sand-500, matching the mock's neutral gray box. */}
      <div className="absolute inset-0 grid place-items-center bg-[var(--p-color-sand-500)]">
        <span className="text-lg font-medium tracking-tight text-white/95">{label}</span>
      </div>
      {src ? (
        <picture>
          {mobileSrc ? <source media="(max-width: 639px)" srcSet={mobileSrc} /> : null}
          {/* eslint-disable-next-line @next/next/no-img-element -- swappable drop-in placeholder, not a build-time asset */}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(false)}
            className={`relative z-10 h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        </picture>
      ) : null}
    </div>
  );
}
