"use client"

/**
 * ChatPanel — left-column conversational thread for Forager exploration surfaces.
 *
 * Rendered inside the surface body (sibling of the result grid), NOT as a
 * sibling of the surface header. The surface header runs above both columns;
 * see SurfaceHeader docs.
 *
 * Posture is calm and editorial. No avatar bubbles, no chat-tail SVG, no
 * "AI assistant" persona name. Assistant messages get a hummingbird mark in
 * the gutter so the role is unambiguous; user messages are right-aligned with
 * a sand-tinted card. Inline "saved" assistant entries (the green "Yes" pill
 * Anna's mock uses to show user accepted) render as a compact accent card.
 *
 * Layout: header strip (optional context line), thread body (scrollable),
 * footer composer (sticky at bottom: textarea + send + quick prompts).
 */

import * as React from "react"
import { ArrowUp } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ChatMessage } from "./data"
import { SAMPLE_THREAD } from "./data"

export type ChatPanelProps = {
  /** Messages to render. Defaults to the sample thread. */
  messages?: ChatMessage[]
  /** Quick-prompt chips shown above the composer. */
  quickPrompts?: string[]
  /** Optional eyebrow line above the thread (e.g. "Asking about this strategy"). */
  contextLine?: string
  className?: string
}

const DEFAULT_QUICK_PROMPTS = [
  "Explore your results",
  "Which compounds appear in dataset?",
  "What's the IP picture for fennel?",
]

export function ChatPanel({
  messages = SAMPLE_THREAD,
  quickPrompts = DEFAULT_QUICK_PROMPTS,
  contextLine,
  className,
}: ChatPanelProps) {
  return (
    <aside
      data-slot="chat-panel"
      className={cn(
        "flex h-full flex-col",
        "bg-[var(--color-surface-alt)]",
        "border-r border-[var(--color-border-subtle)]",
        className
      )}
      aria-label="Project chat"
    >
      {/* ── Optional eyebrow context ─────────────────────────────────── */}
      {contextLine ? (
        <div
          className={cn(
            "shrink-0 px-5 py-3 border-b border-[var(--color-border-subtle)]",
            "text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-subtle)]"
          )}
        >
          {contextLine}
        </div>
      ) : null}

      {/* ── Thread body (scrolls) ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <ul className="space-y-4">
          {messages.map((m, i) => (
            <li key={i}>
              <ChatBubble message={m} />
            </li>
          ))}
        </ul>
      </div>

      {/* ── Composer ─────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-default)] px-5 py-4">
        {quickPrompts.length > 0 ? (
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            {quickPrompts.map((qp) => (
              <button
                key={qp}
                type="button"
                className={cn(
                  "inline-flex items-center rounded-full",
                  "border border-[var(--color-border-subtle)]",
                  "bg-[var(--color-surface-default)] px-2.5 py-1",
                  "text-[11px] font-medium text-[var(--color-text-subtle)]",
                  "transition-colors duration-[120ms]",
                  "hover:border-[var(--color-border-default)] hover:text-[var(--color-text-default)]",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-[var(--color-border-focus)]/50"
                )}
              >
                {qp}
              </button>
            ))}
          </div>
        ) : null}
        <Composer />
      </div>
    </aside>
  )
}

// ── Chat bubble (per-message rendering) ───────────────────────────────────

function ChatBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user-yes") {
    // User accepted — render as a compact, brand-leaning chip on the right.
    return (
      <div className="flex justify-end">
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1",
            "bg-[var(--color-surface-tag-lime)]",
            "text-[12px] font-medium text-[var(--color-text-tag-lime)]"
          )}
        >
          Yes
        </span>
      </div>
    )
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div
          className={cn(
            "max-w-[85%] rounded-[var(--shape-radius-md)]",
            "bg-[var(--color-surface-default)]",
            "border border-[var(--color-border-subtle)]",
            "px-3 py-2 text-sm text-[var(--color-text-default)]"
          )}
        >
          {message.text}
        </div>
      </div>
    )
  }

  // Assistant: gutter mark + body text. No card chrome.
  return (
    <div className="flex gap-2.5">
      <HummingbirdMark
        aria-hidden
        className="mt-0.5 size-4 shrink-0 text-[var(--color-text-tag-forest)]"
      />
      <p className="text-sm leading-relaxed text-[var(--color-text-default)]">
        {message.text}
      </p>
    </div>
  )
}

// ── Composer (textarea + send button) ─────────────────────────────────────

function Composer() {
  const [value, setValue] = React.useState("")
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        // No-op: this is a visual sandbox. Real submit lands later.
      }}
      className={cn(
        "flex items-end gap-2 rounded-[var(--shape-radius-md)]",
        "border border-[var(--color-border-subtle)]",
        "bg-[var(--color-surface-default)] px-3 py-2",
        "transition-colors duration-[120ms]",
        "focus-within:border-[var(--color-border-default)]"
      )}
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask anything..."
        rows={1}
        className={cn(
          "flex-1 resize-none bg-transparent",
          "text-sm leading-relaxed text-[var(--color-text-default)]",
          "placeholder:text-[var(--color-text-subtle)]",
          "outline-none"
        )}
      />
      <button
        type="submit"
        aria-label="Send message"
        className={cn(
          "shrink-0 inline-flex items-center justify-center",
          "size-8 rounded-full",
          "bg-[var(--color-action-primary)] text-[var(--color-text-on-action-primary)]",
          "transition-colors duration-[120ms]",
          "hover:bg-[var(--color-action-primary-hover)]",
          "active:bg-[var(--color-action-primary-active)]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--color-border-focus)]/50"
        )}
      >
        <ArrowUp className="size-4" />
      </button>
    </form>
  )
}

// ── Hummingbird mark (assistant gutter) ───────────────────────────────────

/**
 * Tiny hummingbird-leaf mark used in the chat assistant gutter only. Drawn
 * inline as SVG so the ChatPanel ships with no asset dependency. The full
 * hummingbird brand mark belongs in the brand layer; this is the lightweight
 * UI-glyph equivalent — leaf shape + bird silhouette, line-art style.
 */
function HummingbirdMark({
  className,
  ...rest
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {/* Leaf */}
      <path d="M2 13c4-6 8-9 12-11-1 5-3 9-7 12-3 2-5-1-5-1Z" />
      {/* Vein */}
      <path d="M3 13c3-3 6-6 10-10" />
    </svg>
  )
}
