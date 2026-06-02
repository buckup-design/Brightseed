/**
 * CompoundScreeningTable
 * Forager — compound screening results
 *
 * Tokens: BrightseedDS.md §3.3 (semantics), §3.5 (typography), §3.6 (shape)
 * Components: Table, Badge, DropdownMenu, Button — all shadcn/ui
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react"
import { useState } from "react"

// ── Types ────────────────────────────────────────────────────────────────────

type Status = "active" | "pending" | "failed" | "archived"

type CompoundResult = {
  compoundId: string
  target: string
  ic50: number | null       // µM — null if curve fit not yet computed
  inhibition: number | null // % — null if run incomplete
  replicates: number
  status: Status
}

type SortKey = keyof Pick<
  CompoundResult,
  "compoundId" | "target" | "ic50" | "inhibition" | "replicates"
>
type SortDir = "asc" | "desc"

// ── Status badge config ───────────────────────────────────────────────────────
// Each status gets the full semantic triplet: surface + text + border
// CSS variable arbitrary refs are allowed per §7 anti-examples

const STATUS_CONFIG: Record<
  Status,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className: [
      "bg-[var(--ds-color-surface-success)]",
      "text-[var(--ds-color-text-success)]",
      "border-[var(--ds-color-border-success-bold)]",
    ].join(" "),
  },
  pending: {
    label: "Pending",
    className: [
      "bg-[var(--ds-color-surface-warning)]",
      "text-[var(--ds-color-text-warning)]",
      "border-[var(--ds-color-border-warning-bold)]",
    ].join(" "),
  },
  failed: {
    label: "Failed",
    className: [
      "bg-[var(--ds-color-surface-critical)]",
      "text-[var(--ds-color-text-critical)]",
      "border-[var(--ds-color-border-critical-bold)]",
    ].join(" "),
  },
  archived: {
    label: "Archived",
    // No semantic "archived" — use muted (shadcn bridge covers this)
    // BRIGHTSEED-TBD: needs a dedicated --ds-color-surface-archived token if
    //   archived becomes a first-class Forager state; using muted as closest match.
    className: "bg-muted text-muted-foreground border-border",
  },
}

// ── Column definitions ────────────────────────────────────────────────────────

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "compoundId",  label: "Compound ID" },
  { key: "target",      label: "Target" },
  { key: "ic50",        label: "IC₅₀ (µM)" },
  { key: "inhibition",  label: "% Inhibition" },
  { key: "replicates",  label: "n" },
]

// ── Component ─────────────────────────────────────────────────────────────────

export function CompoundScreeningTable({
  results,
  onView,
  onExport,
  onArchive,
}: {
  results: CompoundResult[]
  onView: (id: string) => void
  onExport: (id: string) => void
  onArchive: (id: string) => void
}) {
  const [sortKey, setSortKey] = useState<SortKey>("compoundId")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = [...results].sort((a, b) => {
    const av = a[sortKey] ?? -Infinity
    const bv = b[sortKey] ?? -Infinity
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortDir === "asc" ? cmp : -cmp
  })

  return (
    <div className="rounded-lg border border-[var(--border-subtle)] overflow-hidden">
      <Table>
        {/* ── Header ── */}
        <TableHeader>
          <TableRow
            style={{ backgroundColor: "var(--ds-color-surface-alt)" }}
            className="hover:bg-inherit"
          >
            {COLUMNS.map(({ key, label }) => (
              <TableHead key={key}>
                <button
                  onClick={() => handleSort(key)}
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                  {sortKey === key ? (
                    sortDir === "asc" ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )
                  ) : (
                    <ChevronUp className="w-3 h-3 opacity-25" />
                  )}
                </button>
              </TableHead>
            ))}
            {/* Status — not sortable */}
            <TableHead>
              <span className="text-sm font-medium text-muted-foreground">
                Status
              </span>
            </TableHead>
            {/* Actions — no header label */}
            <TableHead />
          </TableRow>
        </TableHeader>

        {/* ── Body ── */}
        <TableBody>
          {sorted.map((row, i) => {
            const { label, className } = STATUS_CONFIG[row.status]
            const isAlt = i % 2 !== 0

            return (
              <TableRow
                key={row.compoundId}
                style={{
                  backgroundColor: isAlt
                    ? "var(--ds-color-surface-alt)"
                    : "var(--ds-color-surface-default)",
                }}
                className="hover:bg-[var(--ds-color-surface-default-hover)]"
              >
                {/* Compound ID — first-class identifier, always mono */}
                <TableCell>
                  <span className="font-mono text-sm">{row.compoundId}</span>
                </TableCell>

                {/* Target */}
                <TableCell>
                  <span className="text-sm font-normal">{row.target}</span>
                </TableCell>

                {/* IC50 — scientific value: mono + tabular-nums, 3 decimal places */}
                <TableCell>
                  <span className="font-mono text-sm tabular-nums">
                    {row.ic50 != null ? row.ic50.toFixed(3) : "—"}
                  </span>
                </TableCell>

                {/* % Inhibition — numeric: tabular-nums, 1 decimal place */}
                <TableCell>
                  <span className="font-mono text-sm tabular-nums">
                    {row.inhibition != null
                      ? `${row.inhibition.toFixed(1)}%`
                      : "—"}
                  </span>
                </TableCell>

                {/* Replicates — small integer, still tabular for column alignment */}
                <TableCell>
                  <span className="font-mono text-sm tabular-nums">
                    {row.replicates}
                  </span>
                </TableCell>

                {/* Status badge — pill shape per §3.6 conventions */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium rounded-full px-2 py-0.5 ${className}`}
                  >
                    {label}
                  </Badge>
                </TableCell>

                {/* Row actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                        <span className="sr-only">
                          Actions for {row.compoundId}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onView(row.compoundId)}
                      >
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onExport(row.compoundId)}
                      >
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onArchive(row.compoundId)}
                        className="text-[var(--ds-color-text-critical)]"
                      >
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

// ── Usage ─────────────────────────────────────────────────────────────────────

/*
<CompoundScreeningTable
  results={screeningResults}
  onView={id => router.push(`/compounds/${id}`)}
  onExport={id => downloadCompound(id)}
  onArchive={id => archiveCompound(id)}
/>
*/
