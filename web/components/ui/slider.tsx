"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Slider, Brightseed Quill design system.
 *
 * Color tokens (Brightseed semantics):
 *   Track (unfilled)  → --ds-color-border-default       (sand-300 light / sand-700 dark)
 *   Range (filled)    → --ds-color-action-primary       (lime-300; brand action)
 *   Thumb             → --ds-color-surface-default      (white in light, sand-950 in dark)
 *   Thumb outline     → --ds-color-border-slider-thumb  (sand-700 light / sand-300 dark)
 *   Focus ring        → --ds-color-border-focus         (sand, opaque, same as Button)
 *   Disabled          → uses --ds-disabled-text-opacity
 *
 * THE THUMB OUTLINE IS LOAD-BEARING. Do not remove it to match Switch, which
 * dropped its own on Aug 20 2026. The two diverge on geometry, not taste:
 *
 *   Switch's thumb fills its track, so the track is what it sits against, and a
 *   track edge plus a track fill can carry the job instead. Slider's thumb is a
 *   16px disc on a 4px track, so about three quarters of its edge abuts the
 *   PAGE. And the thumb resolves --ds-color-surface-default, which IS the page
 *   colour in both themes: white on white in light, sand-950 on sand-950 in
 *   dark. Measured in the browser, not derived: 1.00:1. Without this outline the
 *   control has no visible handle at all, in either theme.
 *
 * The dark half of that outline was transparent until Aug 20 2026, so on `main`
 * the dark slider thumb was invisible except where it crossed the track. It is
 * now sand-300 (4.14:1 on the unfilled track, 11.87:1 on the page), mirroring
 * the 4.14:1 light gets from sand-700. Against the lime FILLED range the outline
 * disappears by design; there the thumb body is 11.94:1 on its own.
 *
 * The value itself still needs a non-colour cue for SC 1.4.1: lime-300 and
 * sand-300 are ~1:1 in greyscale, so colour cannot communicate it. Position and
 * the caller's own readout carry it (see ScoreSlider in the filter drawer,
 * which prints the active label beside the title).
 *
 * Radix gives keyboard control for free: arrows step, Home/End jump to the ends,
 * PageUp/PageDown step by 10. Callers pass a single-element `value` array — the
 * primitive is multi-thumb capable but every Quill use today is single-thumb.
 */
function Slider({
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-valuetext": ariaValueText,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  // One thumb per value, so a caller that does pass a range gets both.
  const thumbCount = Array.isArray(props.value)
    ? props.value.length
    : Array.isArray(props.defaultValue)
      ? props.defaultValue.length
      : 1

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-[var(--c-slider-disabled-text-opacity)]",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-1 w-full grow overflow-hidden rounded-full bg-[var(--c-slider-border-default)]"
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="absolute h-full bg-[var(--c-slider-action-primary)]"
        />
      </SliderPrimitive.Track>
      {Array.from({ length: thumbCount }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          // Radix puts role="slider" on the THUMB, not the Root, so naming and
          // value-text props have to be routed here or they never reach the
          // control an assistive tech actually sees — it would announce the raw
          // number while the visible readout said "ANY". Multi-thumb callers get
          // a suffixed label rather than two identically-named handles.
          aria-label={
            ariaLabel && thumbCount > 1 ? `${ariaLabel} (${i + 1})` : ariaLabel
          }
          aria-labelledby={ariaLabelledBy}
          aria-valuetext={ariaValueText}
          className={cn(
            "block size-4 shrink-0 rounded-full",
            "bg-[var(--c-slider-surface-default)]",
            // Width and colour set together: a bare `border` paints currentColor,
            // and a colour with no width paints nothing. Transparent in dark, so
            // the box size is identical across themes.
            "border border-[var(--c-slider-border-thumb)]",
            "transition-[box-shadow] outline-none",
            "focus-visible:ring-[2px] focus-visible:ring-[var(--c-slider-border-focus)]",
            "disabled:pointer-events-none"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
