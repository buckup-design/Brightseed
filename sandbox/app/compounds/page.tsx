"use client"

/**
 * Compounds / Plants surface.
 *
 * The central restructuring move from shape Round 1:
 *   The surface header runs full-width above both the chat panel AND the
 *   result grid, not framed inside the right panel as it was in Anna's mock
 *   4-29-26. Below that band, chat (left) and results (right) are siblings.
 *
 * Compounds vs Plants is a tab on the same surface, not a separate route —
 * the chat thread persists across the toggle, which matches the conversational
 * exploration model PRODUCT.md describes.
 */

import * as React from "react"
import { Filter, LayoutGrid, List, ListOrdered } from "lucide-react"

import { AppShell } from "@/components/forager/app-shell"
import { SurfaceHeader } from "@/components/forager/surface-header"
import { ChatPanel } from "@/components/forager/chat-panel"
import { CompoundCard } from "@/components/forager/compound-card"
import { PlantCard } from "@/components/forager/plant-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { COMPOUNDS, PLANTS } from "@/components/forager/data"

const STRATEGY_TITLE = "Shift microbiome towards propionate producers"

export default function CompoundsPage() {
  const [tab, setTab] = React.useState<"compounds" | "plants">("compounds")
  const [layout, setLayout] = React.useState<"grid" | "list">("grid")
  const [savedIds, setSavedIds] = React.useState<Set<string>>(new Set())

  const toggleSaved = (id: string) =>
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const resultCount = tab === "compounds" ? COMPOUNDS.length : PLANTS.length

  return (
    <AppShell surfaceLabel={STRATEGY_TITLE}>
      <SurfaceHeader
        backLink={{ href: "/strategies", label: "Back to strategies" }}
        eyebrow="Strategy · GLP-1 + Lean Muscle"
        title={STRATEGY_TITLE}
        toolbar={
          <>
            {/* Compounds vs Plants — primary segmentation. Tabs sit at toolbar
                row so the surface header carries the topic, the toolbar carries
                the lens. */}
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as "compounds" | "plants")}
            >
              <TabsList>
                <TabsTrigger value="compounds">Compounds</TabsTrigger>
                <TabsTrigger value="plants">Plant sources</TabsTrigger>
              </TabsList>
            </Tabs>

            <span className="h-3 w-px bg-[var(--color-border-subtle)]" />

            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
            >
              Evidence: Animal
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
            >
              <Filter className="size-3.5" />
              Show filters
            </button>

            <span className="ml-auto text-xs font-medium text-[var(--color-text-subtle)] tabular-nums">
              {resultCount} results
            </span>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
            >
              <ListOrdered className="size-3.5" />
              Sorted by relevance
            </button>

            <div className="inline-flex items-center rounded-[var(--shape-radius-sm)] border border-[var(--color-border-subtle)] p-0.5">
              <LayoutToggleButton
                active={layout === "grid"}
                onClick={() => setLayout("grid")}
                label="Grid view"
              >
                <LayoutGrid className="size-3.5" />
              </LayoutToggleButton>
              <LayoutToggleButton
                active={layout === "list"}
                onClick={() => setLayout("list")}
                label="List view"
              >
                <List className="size-3.5" />
              </LayoutToggleButton>
            </div>
          </>
        }
      />

      {/* ── Surface body: chat (left) · results (right) ──────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="hidden lg:block w-[360px] shrink-0">
          <ChatPanel contextLine="Asking about this strategy" />
        </div>

        <section className="min-w-0 flex-1 overflow-y-auto px-8 py-6" aria-label="Results grid">
          <div className="mx-auto max-w-[1100px]">
            <div
              className={cn(
                "grid gap-4",
                layout === "grid"
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1"
              )}
            >
              {tab === "compounds"
                ? COMPOUNDS.map((c) => (
                    <CompoundCard
                      key={c.id}
                      compound={c}
                      saved={savedIds.has(c.id)}
                      onSaveToggle={() => toggleSaved(c.id)}
                    />
                  ))
                : PLANTS.map((p) => (
                    <PlantCard
                      key={p.id}
                      plant={p}
                      saved={savedIds.has(p.id)}
                      onSaveToggle={() => toggleSaved(p.id)}
                    />
                  ))}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  )
}

function LayoutToggleButton({
  active,
  onClick,
  children,
  label,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-[var(--shape-radius-xs)]",
        "transition-colors duration-[120ms]",
        active
          ? "bg-[var(--color-surface-alt)] text-[var(--color-text-default)]"
          : "text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)]/50"
      )}
    >
      {children}
    </button>
  )
}
