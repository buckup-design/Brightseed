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

  // No top divider: the thread scrolls *behind* this, so the separation is
  // carried by the scrim + blur (see ChatPanel), not by a hairline.
  return (
    <div className="p-3">
      {/* The wrapper — not the inner Textarea — is the visible "field": it owns
          the surface, border, and the focus affordance. focus-within lightens
          the whole box (surface-field → hover step) and picks up the focus
          border when the textarea inside is focused. The Textarea is chromeless,
          incl. its hover fill (enabled:hover:bg-transparent), so it never paints
          a lighter rectangle inset inside the wrapper. */}
      <div className="flex items-end gap-2 rounded-[var(--ds-shape-radius-md)] border border-[var(--ds-color-border-field)] bg-[var(--ds-color-surface-field)] p-2.5 transition-[color,box-shadow,background-color] focus-within:border-[var(--ds-color-border-focus)] focus-within:bg-[var(--ds-color-surface-field-hover)] focus-within:ring-[2px] focus-within:ring-[var(--ds-color-ring-focus)]">
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
  const composerRef = React.useRef<HTMLDivElement>(null);
  const [composerHeight, setComposerHeight] = React.useState(0);

  // Follow the conversation as it grows. Keyed to length so a fixture edit that
  // doesn't add a turn won't yank scroll. scrollIntoView targets the message
  // list (nearest scroll ancestor), not the page.
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  // The composer is lifted OUT of flex flow (absolute) so the thread scrolls
  // behind it. That costs us the layout it used to reserve, so measure it and
  // pay it back as scroll padding — otherwise the last message parks under the
  // composer and can never be scrolled clear. Measured, not hardcoded: the
  // textarea is field-sizing-content and grows as you type.
  React.useEffect(() => {
    const el = composerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setComposerHeight(entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("relative flex h-full min-h-0 flex-col bg-[var(--ds-color-surface-default)]", className)}>
      {/* mr-2: the overlay scrollbar is pinned to this element's right edge,
          which butts against the resize handle. A right margin insets the whole
          scroll container (scrollbar included) so the thumb clears the handle
          pill instead of touching it. Padding can't do this — it moves content,
          not the edge-anchored scrollbar. */}
      <div
        className="scrollbar-overlay mr-2 flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4"
        style={{ paddingBottom: composerHeight }}
      >
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
      <div ref={composerRef} className="absolute inset-x-0 bottom-0">
        {/* Pinned over the thread, iOS-style. The veil is its OWN masked layer,
            separate from the composer, for two reasons:
              1. A uniform backdrop-blur box has a hard top edge — you see the
                 exact line where the blur switches on. The mask ramps blur AND
                 tint in from zero, so there is no edge at all.
              2. Masking the composer itself would fade the top of the input.
            It extends 3.5rem above the composer (-top-14, ~2.5 message lines at
            the 22.75px thread line-height) and the mask reaches full strength
            exactly at the composer's top edge — so the line directly above the
            input is blurred, the one above that barely, and the third is clean.
            The mask stop is an absolute LENGTH, not a percentage, on purpose: the
            textarea grows as you type, and a percentage stop would slide the ramp
            down the veil as it does. `black` here is an alpha channel, not a
            colour — only opacity is read, so it is deliberately not a token. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-14 bottom-0 bg-[var(--ds-color-surface-scrim-chrome)] backdrop-blur-md [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_3.5rem)] [mask-image:linear-gradient(to_bottom,transparent_0,black_3.5rem)]"
        />
        <div className="relative">
          <MessageComposer onSend={onSend} />
        </div>
      </div>
    </div>
  );
}
