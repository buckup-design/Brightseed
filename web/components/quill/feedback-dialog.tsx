"use client";

/**
 * FeedbackDialog — "Give feedback" from the sidebar footer menu.
 *
 * Per Anna's spec sketch (Collab Playground 89:1549). Two annotations bound it:
 *   - "Topics: General Feedback, Bug Report, Feature Request, Usability Issue"
 *   - "ignore emojis. text input only"
 *
 * The reference screenshot shows a sentiment row (four emoji faces) next to
 * Send. That row is deliberately NOT built — the second annotation rules it out.
 *
 * This replaces the widget that is ever-present in the bottom-right corner of
 * live Hummingbird v1.3.2 (the green bubble in 87:1540). The point of the move
 * is that feedback stops occupying a corner of every screen forever and becomes
 * something you go to, so this is a dialog raised from the menu, not a bubble.
 */

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

/** Verbatim from the annotation, in the annotated order. */
const TOPICS = [
  "General Feedback",
  "Bug Report",
  "Feature Request",
  "Usability Issue",
] as const;

export type FeedbackTopic = (typeof TOPICS)[number];

export type FeedbackSubmission = {
  topic: FeedbackTopic;
  message: string;
};

export function FeedbackDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (submission: FeedbackSubmission) => void;
}) {
  const [topic, setTopic] = React.useState<FeedbackTopic | "">("");
  const [message, setMessage] = React.useState("");

  /* Cleared on open, not on close: wiping during the close animation makes the
   * dialog visibly empty itself as it leaves. Adjusted during render rather
   * than in an effect — see the same note in avatar-picker-dialog. */
  const [wasOpen, setWasOpen] = React.useState(open);

  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setTopic("");
      setMessage("");
    }
  }

  /* Both fields required. The sketch shows no error state and no validation
   * copy, so the affordance is a disabled Send rather than an error the sketch
   * never designed. */
  const canSend = topic !== "" && message.trim() !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Give feedback</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="feedback-topic">Topic</Label>
          <Select
            value={topic}
            onValueChange={(v) => setTopic(v as FeedbackTopic)}
          >
            <SelectTrigger id="feedback-topic" className="w-full">
              <SelectValue placeholder="Select a topic…" />
            </SelectTrigger>
            <SelectContent>
              {TOPICS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="feedback-message">Feedback</Label>
          <Textarea
            id="feedback-message"
            rows={5}
            placeholder="Your feedback…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!canSend}
            onClick={() => {
              if (!canSend) return;
              onSubmit?.({ topic: topic as FeedbackTopic, message });
              onOpenChange(false);
            }}
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
