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
 *   Thumb outline     → --ds-color-border-switch-thumb  (sand-700 light / none in dark)
 *   Focus ring        → --ds-color-border-focus         (sand, opaque, same as Button)
 *   Disabled          → uses --ds-disabled-text-opacity
 *
 * Accessibility note. This inherits Switch's constraint: in light mode the fill
 * (lime-300) and the track (sand-300) are ~1:1 apart in greyscale, so colour
 * cannot be what communicates the value (SC 1.4.1, Level A). Two non-colour cues
 * carry it instead — the thumb's POSITION, and the caller's own value readout
 * (see ScoreSlider in the filter drawer, which prints the active label beside
 * the title). The thumb keeps the same light-mode outline Switch uses so its
 * position stays perceivable against both track colours; do not remove it
 * without replacing the cue.
 *
 * BRIGHTSEED-TBD: [CONCERN] In DARK the thumb outline is transparent by token
 * (--ds-color-border-switch-thumb), leaving thumb-vs-unfilled-track at 2.87:1 —
 * just under the 3:1 SC 1.4.11 asks of a control's own indicator. Measured, not
 * estimated. This is INHERITED, not introduced here: the shipped Switch is the
 * same two tokens and measures the same 2.87:1, so Slider matching it is the
 * consistent choice and diverging unilaterally would split the two apart. Worth
 * a system-level call on the dark thumb outline; raising it fixes both at once.
 * (Against the lime FILLED range the thumb is 11.94:1, so this only bites on the
 * unfilled side — i.e. hardest at the ANY floor, where every slider rests.)
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
