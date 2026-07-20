"use client";

/**
 * AvatarPickerDialog — customize an avatar's colour + icon.
 *
 * Per the annotation on the Avatar row of the settings sketch (Collab
 * Playground 89:1606): "clicking this opens a modal that lets user choose color
 * and icon from the predefined set". The picker's own sketch (96:1559) then
 * corrected an earlier build: "the color selector shouldn't have an icon on it,
 * the icon selector shouldn't be on a color surface." So the two axes are shown
 * on separate ground — the colour selector is pure colour (flat circles, no
 * glyph), the icon selector is the glyph on a neutral surface (no colour). The
 * live preview at the top recombines them so the user still sees the actual
 * avatar update in realtime.
 *
 * "The predefined set" is the identity vocabulary in components/ui/avatar.tsx:
 * 5 colours x 5 icons = 25 pairs. This dialog does NOT define its own list — it
 * imports AVATAR_COLORS / AVATAR_ICONS, so the two can never drift.
 *
 * It offers the two axes separately (5 swatches + 5 icons) rather than 25
 * combinations, because the axes are independent and a 25-cell grid would make
 * the user hunt for the pair they want instead of picking each.
 *
 * Sketch annotations that shaped this (all "just a sketch, ignore the styling"):
 *   · colour swatches are full circles (radius 999); icon cells stay rounded
 *   · icon cell = sand-100 surface, sand-900 glyph → the neutral --ds tokens,
 *     which swap to dark-cell / light-glyph under data-theme="dark"
 *   · a sand-300 hairline divider sits under the preview
 *   · the selection indicator follows each shape — a ring that is a circle on a
 *     swatch and a rounded square on an icon cell (it inherits the button's own
 *     border-radius, so this falls out for free)
 */

import * as React from "react";

import {
  AVATAR_COLORS,
  AVATAR_ICONS,
  Avatar,
  AvatarIdentity,
  type AvatarColor,
  type AvatarIcon,
} from "@/components/ui/avatar";
import { BADGE_ICON_STROKE } from "@/components/ui/badge-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ICON_NAMES = Object.keys(AVATAR_ICONS) as AvatarIcon[];

/* Spelt out in full so Tailwind's source scan sees each class literal (same
 * reason avatar.tsx writes out its colour map). Each value is one picker-owned
 * token; the picker never borrows the Avatar component's --c-avatar-* tokens. */
const SWATCH_SURFACE: Record<AvatarColor, string> = {
  orange: "bg-[var(--c-avatar-picker-swatch-orange)]",
  lavender: "bg-[var(--c-avatar-picker-swatch-lavender)]",
  cyan: "bg-[var(--c-avatar-picker-swatch-cyan)]",
  orchid: "bg-[var(--c-avatar-picker-swatch-orchid)]",
  blue: "bg-[var(--c-avatar-picker-swatch-blue)]",
};

export function AvatarPickerDialog({
  open,
  onOpenChange,
  color,
  icon,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  color: AvatarColor;
  icon: AvatarIcon;
  onSave: (next: { color: AvatarColor; icon: AvatarIcon }) => void;
}) {
  /* Draft state so Cancel is a real cancel. Re-seeded from props each time the
   * dialog opens, otherwise a cancelled edit would persist into the next open.
   *
   * Adjusted during render rather than in an effect: React re-runs this pass
   * before committing, so the draft is never painted stale. The effect version
   * both tripped react-hooks/set-state-in-effect and cost an extra render. */
  const [draftColor, setDraftColor] = React.useState(color);
  const [draftIcon, setDraftIcon] = React.useState(icon);
  const [wasOpen, setWasOpen] = React.useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setDraftColor(color);
      setDraftIcon(icon);
    }
  }

  /* One interaction model for both selectors. The selection ring (and the
   * unselected hover ring) inherit each button's own border-radius, so a
   * circular swatch gets a circular ring and a rounded icon cell gets a rounded
   * one — the "selection indicator follows the shape" annotation, for free.
   * Hover is scoped to data-selected=false so hovering the current choice can't
   * repaint its ring. */
  const optionBase = cn(
    "relative flex items-center justify-center outline-none transition",
    // Focus + selection match the Input field: the sand-500 ring carries a faint
    // lime whisper halo (--ds-color-ring-focus) just outside it. The whisper is a
    // box-shadow one step wider than the ring, so it peeks out past the sand —
    // 4px on focus (2px ring), 6px when selected (the ring sits 2px further out
    // behind ring-offset-2).
    "focus-visible:ring-2 focus-visible:ring-[var(--c-avatar-picker-border-focus)]",
    "focus-visible:shadow-[0_0_0_4px_var(--c-avatar-picker-ring-focus)]",
    "data-[selected=false]:hover:ring-2 data-[selected=false]:hover:ring-[var(--c-avatar-picker-border-default)]",
    "data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--c-avatar-picker-border-focus)]",
    "data-[selected=true]:ring-offset-2 data-[selected=true]:ring-offset-[var(--c-avatar-picker-surface-default)]",
    "data-[selected=true]:shadow-[0_0_0_6px_var(--c-avatar-picker-ring-focus)]"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Customize your avatar</DialogTitle>
        </DialogHeader>

        {/* Live preview — recombines the two selections into the real avatar and
         * updates in realtime as they change (sketch: "updates in realtime based
         * on selections below"). */}
        <div className="flex items-center justify-center py-2">
          <Avatar size="lg" className="rounded-lg">
            <AvatarIdentity
              color={draftColor}
              icon={draftIcon}
              className="rounded-lg"
            />
          </Avatar>
        </div>

        {/* Hairline divider under the preview (sketch: "add hairline divider
         * sand-300" → border-default, which is sand-300 light / sand-700 dark). */}
        <div className="h-px bg-[var(--c-avatar-picker-border-default)]" />

        {/* Colour — pure colour, no glyph; full circles. */}
        <fieldset className="space-y-2">
          <legend className="text-sm text-[var(--c-avatar-picker-text-subtle)]">
            Choose color
          </legend>
          <div className="flex gap-3">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                aria-pressed={c === draftColor}
                data-selected={c === draftColor}
                onClick={() => setDraftColor(c)}
                className={cn(optionBase, "size-9 rounded-full", SWATCH_SURFACE[c])}
              />
            ))}
          </div>
        </fieldset>

        {/* Icon — the glyph on a neutral surface, no colour; rounded square. */}
        <fieldset className="space-y-2">
          <legend className="text-sm text-[var(--c-avatar-picker-text-subtle)]">
            Pick an icon
          </legend>
          <div className="flex gap-3">
            {ICON_NAMES.map((i) => {
              const Icon = AVATAR_ICONS[i];
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={i}
                  aria-pressed={i === draftIcon}
                  data-selected={i === draftIcon}
                  onClick={() => setDraftIcon(i)}
                  className={cn(
                    optionBase,
                    "size-9 rounded-[var(--c-avatar-picker-shape-radius-md)]",
                    "bg-[var(--c-avatar-picker-surface-alt)]",
                    "text-[var(--c-avatar-picker-icon-default)] [&>svg]:size-5"
                  )}
                >
                  <Icon strokeWidth={BADGE_ICON_STROKE} aria-hidden="true" />
                </button>
              );
            })}
          </div>
        </fieldset>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave({ color: draftColor, icon: draftIcon });
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
