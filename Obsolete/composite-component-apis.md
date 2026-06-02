# Composite Component APIs (archived)

> Archived from `BrightseedDS.md` §5.2 when that file was retired. These are **forward specs** — proposed prop interfaces for Forager composite components, most of which were never built. Kept for reference if/when these components get implemented. Not authoritative; the real source of truth for any built component is its Storybook story + code. Token names below use the retired `--color-*` prefix; translate to `--ds-color-*` if reused.

## `<StatCard>`

Metric + label + delta indicator.

```tsx
type Trend = "up" | "down" | "neutral"

interface StatCardProps {
  label: string       // e.g. "Compounds screened this week"
  value: string       // pre-formatted: "1,247" — caller handles formatting
  delta?: string      // e.g. "+12%" — omit if no comparison period
  trend?: Trend       // controls icon and color; defaults to "neutral"
  footnote?: string   // e.g. "vs. last week" — defaults to "vs. last week"
}
```

## `<DataTable>`

Sortable, optionally filterable/paginated table with row actions. The `columns` definition drives all rendering.

```tsx
type ColumnType = "text" | "mono" | "numeric" | "badge" | "action"

interface ColumnDef<T> {
  key: keyof T
  label: string
  type: ColumnType
  sortable?: boolean
  statusConfig?: Record<string, { label: string; className: string }>  // for type="badge"
  decimals?: number   // for type="numeric"
  unit?: string       // appended after value — e.g. "µM", "%"
}

interface DataTableProps<T extends { id: string }> {
  columns: ColumnDef<T>[]
  data: T[]
  isLoading?: boolean           // renders Skeleton rows when true
  emptyState?: React.ReactNode  // shown when data.length === 0
  rowActions?: {
    label: string
    onClick: (id: string) => void
    variant?: "default" | "critical"   // critical renders in --color-text-critical
  }[]
  pagination?: {
    pageSize: number
    totalCount: number
    currentPage: number
    onPageChange: (page: number) => void
  }
  search?: {
    placeholder?: string    // defaults to "Search…"
    keys: (keyof T)[]       // fields to search across — always include compoundId if present
  }
  filters?: {
    key: keyof T
    label: string
    options: { label: string; value: string }[]
  }[]
}

// Search + filter toolbar renders above the table whenever either prop is present.
// Both filter and search reset pagination to page 1. All filter/search state is internal (no controlled-state props in v1).
```

## `<DoseResponseChart>`

4PL dose-response curve.

```tsx
type Point = { logConc: number; inhibition: number }

interface DoseResponseChartProps {
  compoundId: string
  targetId: string
  dataPoints: Point[]    // raw experimental observations
  curvePoints: Point[]   // pre-computed 4PL fit (higher density than raw)
  ic50LogValue: number   // log10(IC50 in µM) — e.g. -1.42 = 0.038 µM
  height?: number        // defaults to 320
}
```

## `<AssayTimeSeries>`

Multi-series time-on-x chart. Uses `--chart-cat-*` in order; first series is always `--chart-cat-1`.

```tsx
type TimePoint = { time: number; value: number }

interface Series {
  id: string           // legend key
  label: string        // legend + tooltip
  data: TimePoint[]
}

interface AssayTimeSeriesProps {
  series: Series[]     // up to 8 series; beyond 8 is not supported
  xLabel: string       // include unit, e.g. "Time (h)"
  yLabel: string       // include unit, e.g. "Response (RFU)"
  height?: number      // defaults to 280
  referenceLines?: { value: number; label: string }[]
}
```

## `<CompoundBadge>`

Inline identifier pill for compound IDs with status color.

```tsx
type CompoundStatus = "active" | "pending" | "failed" | "archived"

interface CompoundBadgeProps {
  compoundId: string       // e.g. "BS-4421" — rendered in font-mono
  status: CompoundStatus
  size?: "sm" | "default"  // sm for dense table contexts
  onClick?: () => void     // if provided, renders as a button
}
```

The ID string always renders `font-mono text-sm` regardless of `size`; `size` controls padding/height only.
