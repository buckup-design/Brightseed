"use client";

/**
 * NewChat — the Hummingbird agent home ("New chat").
 *
 * The first thing a user sees in the product: a greeting, a context composer,
 * and a set of suggested prompts. Mirrors the live product's /new-chat screen
 * (brightseed.ai v1.3.2). A Block — it composes PageHeading + Textarea + Button
 * + Chip — and is the content behind App Shell Quill's "New chat" tab, imported
 * there so the screen and the standalone Block never drift.
 *
 * Deliberately light on wiring: the composer holds local text and hands it to
 * onSend; a suggested prompt fills the composer and fires onSelectPrompt. The
 * app owns what "send" and "Create Formula Brief" actually do.
 */

import * as React from "react";
import { ArrowUp, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { PageHeading } from "@/components/ui/page-heading";
import { Textarea } from "@/components/ui/textarea";

/** The six starter prompts from the live product's New Chat screen. */
export const NEW_CHAT_PROMPTS = [
  "Find compounds for glucose metabolism",
  "Ingredient combinations for weight management",
  "What synergizes with berberine?",
  "Comprehensive information about rutin",
  "How does resveratrol work?",
  "What dosage for lipoic acid?",
];

export function NewChat({
  greeting = "What can I help you create today?",
  subtitle = "I’m Hummingbird, your agent for innovating new product concepts.",
  prompts = NEW_CHAT_PROMPTS,
  onSend,
  onSelectPrompt,
  onCreateBrief,
}: {
  greeting?: string;
  subtitle?: string;
  prompts?: string[];
  /** Fired with the composer text when send is pressed (empty input is ignored). */
  onSend?: (value: string) => void;
  /** Fired when a suggested prompt is chosen; it also drops into the composer. */
  onSelectPrompt?: (prompt: string) => void;
  onCreateBrief?: () => void;
}) {
  const [value, setValue] = React.useState("");

  const send = () => {
    const text = value.trim();
    if (!text) return;
    onSend?.(text);
    setValue("");
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 py-16">
      <PageHeading align="center" title={greeting} description={subtitle} />

      {/* Context composer — the shell (not the inner Textarea) is the visible
          field: it owns the surface, border, and focus affordance. focus-within
          lightens the whole box and adds the sand-500 border + lime whisper ring,
          matching every other field. The Textarea is chromeless, incl. its hover
          fill (enabled:hover:bg-transparent), so it never paints a lighter
          rectangle inset inside the shell. */}
      <div className="space-y-3 rounded-[var(--c-new-chat-shape-radius-md)] border border-[var(--c-new-chat-border-default)] bg-[var(--c-new-chat-surface-field)] p-3 transition-[color,box-shadow,background-color] focus-within:border-[var(--c-new-chat-border-focus)] focus-within:bg-[var(--c-new-chat-surface-field-hover)] focus-within:ring-[2px] focus-within:ring-[var(--c-new-chat-ring-focus)]">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask about compounds, combinations, mechanisms, or dosing…"
          // Prompt field, never a credential — stop the browser's password
          // manager (iCloud Passwords et al.) offering autofill on focus.
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          className="min-h-20 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 enabled:hover:bg-transparent"
        />
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onCreateBrief}>
            <Sparkles />
            Create Formula Brief
          </Button>
          <Button size="icon" aria-label="Send message" onClick={send}>
            <ArrowUp />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {prompts.map((prompt) => (
          <Chip key={prompt} variant="outline" asChild>
            <button
              type="button"
              onClick={() => {
                setValue(prompt);
                onSelectPrompt?.(prompt);
              }}
            >
              {prompt}
            </button>
          </Chip>
        ))}
      </div>
    </div>
  );
}
