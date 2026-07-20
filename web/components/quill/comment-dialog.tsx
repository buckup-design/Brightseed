"use client";

/**
 * CommentDialog — leave a note on a report (raised from the report row's ⋮ menu).
 *
 * Composition-only (Dialog + Field + Textarea + Button), so it carries no
 * --c-comment-dialog-* tokens of its own; each composed component owns its
 * appearance. Controlled by `open`/`onOpenChange`; the app owns what a saved
 * note does (onSubmit). Follows the feedback-dialog pattern: the field is
 * cleared on OPEN, not close, so the dialog doesn't visibly empty as it leaves.
 */

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function CommentDialog({
  open,
  onOpenChange,
  title,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The report the note attaches to; shown in the description. */
  title?: string;
  onSubmit?: (note: string) => void;
}) {
  const [note, setNote] = React.useState("");
  // Snapshot the title so it (and the field) survive the close animation.
  const [shownTitle, setShownTitle] = React.useState(title);
  const [wasOpen, setWasOpen] = React.useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setNote("");
      setShownTitle(title);
    }
  }

  const canSave = note.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a comment</DialogTitle>
          {shownTitle ? (
            <DialogDescription>Leave a note on “{shownTitle}”.</DialogDescription>
          ) : null}
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor="comment-note">Comment</FieldLabel>
          <Textarea
            id="comment-note"
            rows={5}
            placeholder="Write a note…"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </Field>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!canSave}
            onClick={() => {
              if (!canSave) return;
              onSubmit?.(note.trim());
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
