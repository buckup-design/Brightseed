"use client";

/**
 * AvatarPickerDialog — choose an avatar's colour + icon.
 *
 * Per the annotation on the Avatar row of the settings sketch (Collab
 * Playground 89:1606): "clicking this opens a modal that lets user choose color
 * and icon from the predefined set".
 *
 * "The predefined set" is the identity vocabulary in components/ui/avatar.tsx:
 * 5 colours x 4 icons = 20 pairs. This dialog does NOT define its own list — it
 * imports AVATAR_COLORS / AVATAR_ICONS, so the two can never drift.
 *
 * It offers the two axes separately (5 swatches + 4 icons) rather than 20
 * combinations, because the axes are independent and a 20-cell grid would make
 * the user hunt for the pair they want instead of picking each.
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

  const cellClasses = cn(
    "flex items-center justify-center rounded-[var(--c-avatar-picker-shape-radius-md)]",
    "outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-avatar-picker-border-focus)]",
    "hover:bg-[var(--c-avatar-picker-surface-alt)]",
    "data-[selected=true]:ring-2 data-[selected=true]:ring-[var(--c-avatar-picker-border-focus)]"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose your avatar</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center py-2">
          <Avatar size="lg" className="rounded-lg">
            <AvatarIdentity
              color={draftColor}
              icon={draftIcon}
              className="rounded-lg"
            />
          </Avatar>
        </div>

        <fieldset className="space-y-2">
          <legend className="text-sm text-[var(--c-avatar-picker-text-subtle)]">
            Colour
          </legend>
          <div className="flex gap-2">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={c}
                aria-pressed={c === draftColor}
                data-selected={c === draftColor}
                onClick={() => setDraftColor(c)}
                className={cn(cellClasses, "size-10 p-1")}
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarIdentity color={c} icon={draftIcon} className="rounded-lg" />
                </Avatar>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-sm text-[var(--c-avatar-picker-text-subtle)]">
            Icon
          </legend>
          <div className="flex gap-2">
            {ICON_NAMES.map((i) => (
              <button
                key={i}
                type="button"
                aria-label={i}
                aria-pressed={i === draftIcon}
                data-selected={i === draftIcon}
                onClick={() => setDraftIcon(i)}
                className={cn(cellClasses, "size-10 p-1")}
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarIdentity color={draftColor} icon={i} className="rounded-lg" />
                </Avatar>
              </button>
            ))}
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
