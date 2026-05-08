"use client"

/**
 * Strategies surface.
 *
 * Restructured from Anna's mock 4-29-26 (strategies view.png):
 *   - The chat-panel sidebar in Anna's mock is preserved as a sibling of the
 *     result region inside the AppShell SurfaceHeader contract — header runs
 *     full-width above both columns, not nested in the right column.
 *   - The 2x2 card grid keeps Anna's information model but breaks the
 *     "four identical cards" anti-pattern: the lead recommendation gets an
 *     eyebrow label and sits first; the rest fill the remaining cells.
 *   - StrategyCard already satisfies the impeccable bar (semantic tokens,
 *     dual-nav, hover affordances). This page is composition only.
 */

import * as React from "react"
import { Filter, ListOrdered, Plus } from "lucide-react"

import { AppShell } from "@/components/forager/app-shell"
import { SurfaceHeader } from "@/components/forager/surface-header"
import { ChatPanel } from "@/components/forager/chat-panel"
import { StrategyCard } from "@/components/ui/strategy-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PROJECT, STRATEGIES, type Strategy } from "@/components/forager/data"

export default function StrategiesPage() {
  const lead = STRATEGIES.find((s) => s.isLead) ?? STRATEGIES[0]
  const rest = STRATEGIES.filter((s) => s.id !== lead.id)

  return (
    <AppShell surfaceLabel="Strategies">
      <SurfaceHeader
        eyebrow={`Project · ${PROJECT.name}`}
        title="Strategies"
        subtitle={PROJECT.goal}
        actions={
          <>
            <Button variant="ghost" size="sm">
              <Plus />
              New strategy
            </Button>
          </>
        }
        toolbar={
          <>
            <span className="text-xs font-medium text-[var(--color-text-subtle)] tabular-nums">
              {STRATEGIES.length} strategies
            </span>
            <span className="h-3 w-px bg-[var(--color-border-subtle)]" />
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
            >
              <Filter className="size-3.5" />
              Show filters
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
            >
              <ListOrdered className="size-3.5" />
              Sorted by relevance
            </button>
          </>
        }
      />

      {/* ── Surface body: chat (left) · strategies grid (right) ──────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="hidden lg:block w-[360px] shrink-0">
          <ChatPanel
            contextLine="Asking about this project"
            quickPrompts={[
              "Which is the best strategy?",
              "Show IP whitespace",
              "Compare evidence strength",
            ]}
          />
        </div>

        <section className="min-w-0 flex-1 overflow-y-auto px-8 py-8" aria-label="Strategies grid">
          <div className="mx-auto max-w-[1100px]">
            {/* Lead recommendation — eyebrow label + same card chrome */}
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2">
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-[var(--color-action-primary-active)]"
                />
                <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-tag-forest)]">
                  Lead recommendation
                </span>
              </div>
              <StrategyCardWithSummary strategy={lead} />
            </div>

            {/* Remaining strategies — 3-up at desktop, 2-up at md, 1-up below */}
            <div>
              <h2 className="mb-3 text-[11px] font-medium uppercase tracking-wide text-[var(--color-text-subtle)]">
                Other strategies under evaluation
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {rest.map((s) => (
                  <StrategyCardWithSummary key={s.id} strategy={s} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}

/**
 * Bridge between Forager-shaped Strategy data and the existing StrategyCard
 * component shape. StrategyCard takes flat props; our data carries them as
 * a single object. Inline wrapper for clarity.
 */
function StrategyCardWithSummary({
  strategy,
  className,
}: {
  strategy: Strategy
  className?: string
}) {
  return (
    <StrategyCard
      title={strategy.title}
      mechanism={strategy.mechanism}
      evidence={strategy.evidence}
      feasibility={strategy.feasibility}
      legal={strategy.legal}
      className={cn("max-w-none", className)}
      kebabActions={[
        { label: "Tell me more" },
        { label: "Hide this strategy", destructive: true },
      ]}
    />
  )
}
