"use client";

/**
 * ShareDialog — share a report by email (raised from the report row's ⋮ menu).
 *
 * Add people by email (Enter or Add adds a chip; Backspace on an empty field
 * removes the last; basic format + de-dupe), and copy the shareable link. The
 * app owns what "Share" does (onShare) — this Block only collects addresses.
 * Controlled by `open`/`onOpenChange`; fields reset on OPEN, not close, so the
 * dialog doesn't visibly empty as it leaves (see feedback-dialog).
 *
 * Composes Dialog + Field + Input + Button; the email chips and link row are
 * this component's own chrome, so it carries a --c-share-dialog-* block.
 */

import * as React from "react";
import { Check, Copy, Link2, Plus, X } from "lucide-react";

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
import { Input } from "@/components/ui/input";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function ShareDialog({
  open,
  onOpenChange,
  title,
  link = "",
  onShare,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The report being shared; shown in the description. */
  title?: string;
  /** The shareable link, shown in the copy row. */
  link?: string;
  onShare?: (emails: string[]) => void;
}) {
  const [draft, setDraft] = React.useState("");
  const [emails, setEmails] = React.useState<string[]>([]);
  const [copied, setCopied] = React.useState(false);
  // Snapshot title + link so they survive the close animation.
  const [shown, setShown] = React.useState({ title, link });
  const [wasOpen, setWasOpen] = React.useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setDraft("");
      setEmails([]);
      setCopied(false);
      setShown({ title, link });
    }
  }

  const addEmail = () => {
    const value = draft.trim();
    if (!isEmail(value) || emails.includes(value)) return;
    setEmails((prev) => [...prev, value]);
    setDraft("");
  };
  const removeEmail = (email: string) =>
    setEmails((prev) => prev.filter((e) => e !== email));

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addEmail();
    } else if (event.key === "Backspace" && draft === "" && emails.length) {
      removeEmail(emails[emails.length - 1]);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shown.link);
    } catch {
      /* clipboard can be blocked in sandboxed frames; still reflect intent */
    }
    setCopied(true);
  };

  const canShare = emails.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share report</DialogTitle>
          <DialogDescription>
            {shown.title
              ? `People you add get a link to view “${shown.title}”.`
              : "People you add get a link to view this report."}
          </DialogDescription>
        </DialogHeader>

        <Field>
          <FieldLabel htmlFor="share-email">People</FieldLabel>
          <div className="flex gap-2">
            <Input
              id="share-email"
              type="email"
              placeholder="name@company.com"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addEmail}
              disabled={!isEmail(draft.trim())}
            >
              <Plus />
              Add
            </Button>
          </div>
          {emails.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {emails.map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--c-share-dialog-surface-alt)] py-0.5 pr-1 pl-2.5 text-sm text-[var(--c-share-dialog-text-default)]"
                >
                  {email}
                  <button
                    type="button"
                    aria-label={`Remove ${email}`}
                    onClick={() => removeEmail(email)}
                    className="flex size-4 items-center justify-center rounded-full text-[var(--c-share-dialog-icon-subtle)] transition-colors hover:text-[var(--c-share-dialog-text-default)]"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : null}
        </Field>

        {/* Copy-link row */}
        <div className="flex items-center gap-2 rounded-[var(--c-share-dialog-shape-radius-md)] bg-[var(--c-share-dialog-surface-alt)] py-2 pr-2 pl-3">
          <Link2 className="size-4 shrink-0 text-[var(--c-share-dialog-icon-subtle)]" />
          <span className="min-w-0 flex-1 truncate text-sm text-[var(--c-share-dialog-text-subtle)]">
            {shown.link}
          </span>
          <Button type="button" variant="ghost" size="sm" onClick={copyLink}>
            {copied ? <Check /> : <Copy />}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!canShare}
            onClick={() => {
              if (!canShare) return;
              onShare?.(emails);
              onOpenChange(false);
            }}
          >
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
