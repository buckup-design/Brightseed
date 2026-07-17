"use client";

/**
 * NewChat — the Hummingbird agent home ("New chat").
 *
 * The first thing a user sees in the product: a greeting, a context composer,
 * and a set of suggested prompts. Mirrors the live product's /new-chat screen
 * (brightseed.ai v1.3.2). A Block — it composes Textarea + Button + Chip — and
 * is the content behind App Shell Quill's "New chat" tab, imported there so the
 * screen and the standalone Block never drift.
 *
 * Deliberately light on wiring: the composer holds local text and hands it to
 * onSend; a suggested prompt fills the composer and fires onSelectPrompt. The
 * app owns what "send" and "Create Formula Brief" actually do.
 */

import * as React from "react";
import { ArrowUp, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
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
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-[var(--c-new-chat-text-default)]">
          {greeting}
        </h1>
        <p className="text-[var(--c-new-chat-text-subtle)]">{subtitle}</p>
      </div>

      {/* Context composer — the Textarea sits seamless inside a field-surface shell */}
      <div className="space-y-3 rounded-[var(--c-new-chat-shape-radius-md)] border border-[var(--c-new-chat-border-default)] bg-[var(--c-new-chat-surface-field)] p-3">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Ask about compounds, combinations, mechanisms, or dosing…"
          className="min-h-20 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
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
