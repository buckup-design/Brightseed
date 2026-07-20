"use client";

/**
 * ChatPanel — the left half of the Workspace canvas.
 *
 * A presentational, controlled surface (its only internal state is the
 * composer's draft text): a flex-1 scrolling message list over a bottom-pinned
 * composer + disclaimer. It renders the ChatMessage union through two inlined
 * renderers — MessageBubble (user + user-yes) and AgentMessage (the hummingbird
 * glyph + an optional italic meta line + prose + an optional stack of real
 * ResultCards) — and reports send / select / favorite up to the canvas.
 *
 * The inline agent ResultCards share the SAME favoritedIds + onSelectResult +
 * onFavorite as the grid, so a card favorited in chat and the same card in the
 * results grid stay in sync (the canvas owns that Set).
 *
 * MessageComposer / MessageBubble / AgentMessage are inlined (used once) — the
 * same call result-detail makes with Section/Pills, and NOT a refactor of the
 * shipped NewChat composer, whose chrome diverges (PageHeading, Formula Brief).
 *
 * Token tier: a Hummingbird leaf app surface — reads global --ds-* directly;
 * the Textarea / Button / ResultCard it composes carry their own --c-*.
 */

import * as React from "react";
import { ArrowUp } from "lucide-react";

import { HummingbirdLine } from "@/components/ui/badge-icons";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ResultCard,
  resultKey,
  type Result,
} from "@/components/hummingbird/cards/result-card";
import type { ChatMessage } from "@/components/hummingbird/data";
import { cn } from "@/lib/utils";

// ─── Message renderers (inlined) ─────────────────────────────────────────────

/** User turns (both a typed message and the "Yes" affirmation) — a centered
 * sand bubble, left-aligned text. */
function MessageBubble({ text }: { text: string }) {
  return (
    <div className="mx-auto max-w-[85%] rounded-[var(--ds-shape-radius-md)] bg-[var(--ds-color-surface-alt)] px-4 py-2.5 text-sm leading-relaxed text-[var(--ds-color-text-default)]">
      {text}
    </div>
  );
}

function AgentMessage({
  message,
  favoritedIds,
  onSelectResult,
  onFavorite,
}: {
  message: Extract<ChatMessage, { role: "assistant" }>;
  favoritedIds: Set<string>;
  onSelectResult: (result: Result) => void;
  onFavorite: (result: Result, favorited: boolean) => void;
}) {
  return (
    <div className="flex gap-3">
      {/* Decorative brand-green agent mark. The success tokens are chosen for
          their forest tint (matching the live product's hummingbird avatar),
          not their semantic meaning; it carries no status. */}
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--ds-color-surface-success)] text-[var(--ds-color-icon-success)]">
        <HummingbirdLine className="size-4" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {message.meta && (
          <p className="text-[13px] italic text-[var(--ds-color-text-subtle)]">
            {message.meta}
          </p>
        )}
        <p className="text-sm leading-relaxed text-[var(--ds-color-text-default)]">
          {message.text}
        </p>
        {message.results && message.results.length > 0 && (
          <div className="mt-1 flex max-w-[420px] flex-col gap-2">
            {message.results.map((result) => (
              <ResultCard
                key={resultKey(result)}
                result={{ ...result, isFavorited: favoritedIds.has(resultKey(result)) }}
                onFavorite={(favorited) => onFavorite(result, favorited)}
                onSelect={() => onSelectResult(result)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Composer (inlined) ──────────────────────────────────────────────────────

function MessageComposer({ onSend }: { onSend?: (value: string) => void }) {
  const [value, setValue] = React.useState("");

  const send = () => {
    const text = value.trim();
    if (!text) return;
    onSend?.(text);
    setValue("");
  };

  return (
    <div className="shrink-0 border-t border-[var(--ds-color-border-subtle)] p-3">
      {/* The wrapper — not the inner Textarea — is the visible "field": it owns
          the surface, border, and the focus affordance. focus-within lightens
          the whole box (surface-field → hover step) and picks up the focus
          border when the textarea inside is focused. The Textarea is chromeless,
          incl. its hover fill (enabled:hover:bg-transparent), so it never paints
          a lighter rectangle inset inside the wrapper. */}
      <div className="flex items-end gap-2 rounded-[var(--ds-shape-radius-md)] border border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-field)] p-2.5 transition-[color,box-shadow,background-color] focus-within:border-[var(--ds-color-border-focus)] focus-within:bg-[var(--ds-color-surface-field-hover)] focus-within:ring-[2px] focus-within:ring-[var(--ds-color-ring-focus)]">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
          placeholder="Message Hummingbird"
          // Prompt field, never a credential — stop the browser's password
          // manager (iCloud Passwords et al.) offering autofill on focus.
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          className="min-h-16 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 enabled:hover:bg-transparent"
        />
        <Button size="icon" aria-label="Send message" onClick={send}>
          <ArrowUp />
        </Button>
      </div>
      <p className="mt-2 text-center text-[12px] text-[var(--ds-color-text-subtle)]">
        Hummingbird can make mistakes. Verify important information.
      </p>
    </div>
  );
}

// ─── ChatPanel ───────────────────────────────────────────────────────────────

export interface ChatPanelProps {
  messages: ChatMessage[];
  /** Favorites keyed by resultKey(result) — the canvas's one source of truth. */
  favoritedIds: Set<string>;
  onSend?: (value: string) => void;
  onSelectResult: (result: Result) => void;
  onFavorite: (result: Result, favorited: boolean) => void;
  className?: string;
}

export function ChatPanel({
  messages,
  favoritedIds,
  onSend,
  onSelectResult,
  onFavorite,
  className,
}: ChatPanelProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  // Follow the conversation as it grows. Keyed to length so a fixture edit that
  // doesn't add a turn won't yank scroll. scrollIntoView targets the message
  // list (nearest scroll ancestor), not the page.
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-[var(--ds-color-surface-default)]", className)}>
      {/* mr-2: the overlay scrollbar is pinned to this element's right edge,
          which butts against the resize handle. A right margin insets the whole
          scroll container (scrollbar included) so the thumb clears the handle
          pill instead of touching it. Padding can't do this — it moves content,
          not the edge-anchored scrollbar. */}
      <div className="scrollbar-overlay mr-2 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4">
        {messages.map((message, i) =>
          message.role === "assistant" ? (
            <AgentMessage
              key={i}
              message={message}
              favoritedIds={favoritedIds}
              onSelectResult={onSelectResult}
              onFavorite={onFavorite}
            />
          ) : (
            <MessageBubble
              key={i}
              text={message.role === "user-yes" ? "Yes" : message.text}
            />
          ),
        )}
        <div ref={bottomRef} />
      </div>
      <MessageComposer onSend={onSend} />
    </div>
  );
}
