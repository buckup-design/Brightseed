"use client";

import * as React from "react";
import { Check, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * DataTable — the column-driven table engine.
 *
 * Hummingbird's discovery flow (business goal → strategies → formulation plans)
 * is carried almost entirely by tables, and no two of them share a shape: a
 * grouped candidates/eliminated list, a ranked combinations list, a wide
 * presence matrix whose columns are generated from the user's kept compounds, a
 * predicted-compounds table with mono identifiers and range strings, and a bare
 * string matrix embedded in chat. One engine has to serve all five, and the next
 * one nobody has drawn yet.
 *
 * WHY A COLUMN ARRAY, NOT COMPOUND COMPONENTS. The matrix settles it: its middle
 * columns come from runtime selection, so they cannot be written as JSX —
 * `[...leading, ...compounds.map(presenceColumn), ...trailing]` is the whole
 * feature. Compound children would mean reading config back out of
 * React.Children to build the <colgroup> and the sticky offsets anyway.
 *
 * WHY A TYPED CELL UNION, NOT `render: () => JSX`. The house rules for reading
 * dense data — mono for identifiers, tabular-nums for numerics, italic binomial
 * over grey common name, icon+text for status, bar+value in one cell — have to
 * live in ONE place or every new query shape re-invents them and the system
 * drifts. `kind: "node"` is the escape hatch; reach for it and you have found a
 * cell kind this union is missing.
 *
 * NO SORTING, DELIBERATELY. The one ordered table carries `rank` as data, and
 * this is a convergence task: re-ordering rows while someone is triaging them
 * moves targets under the cursor. If sorting is ever added it must be CONTROLLED
 * by the screen — never internal state here.
 *
 * NO ROW STATE, EVER. Group membership is derived upstream by the stage that
 * owns the triage model. This component is a pure function of its props; that is
 * what keeps a row eliminated in the table and the same item named in chat from
 * desyncing (the bug strategy-card.tsx:102 still has).
 *
 * Quill public API (BSDS-102): reads ONLY its own --c-data-table-* tier. Row
 * borders, hover and selected states are inherited from the ui/table primitive's
 * --c-table-* rather than redefined here.
 */

// ── Cell vocabulary ────────────────────────────────────────────────────────

export type CellValue =
  /** Plain text. `mono` for structural identifiers, `subtle` for de-emphasis. */
  | {
      kind: "text";
      value: string;
      tone?: "default" | "subtle";
      mono?: boolean;
      /** Marks a standout value, e.g. a bioavailability worth noticing. */
      emphasis?: boolean;
    }
  /** An inline link. `onClick` without `href` renders a button styled as a link. */
  | { kind: "link"; label: string; href?: string; onClick?: () => void }
  /** Two-line identity, e.g. italic binomial over grey common name. */
  | { kind: "entity"; primary: string; secondary?: string; italic?: boolean }
  /** Matrix presence. Check or blank — `label` is the screen-reader sentence. */
  | { kind: "presence"; present: boolean; label: string }
  /** Tri-state flag. Rendered as words, never colour alone. */
  | {
      kind: "flag";
      value: boolean | null;
      labels?: { yes?: string; no?: string; unknown?: string };
      /**
       * Spoken text, when a label is a glyph rather than a word. "—" is read as
       * nothing at all and "†" as "dagger", so a glyph-only label reaches a
       * screen reader as an empty or meaningless cell.
       */
      srLabels?: { yes?: string; no?: string; unknown?: string };
    }
  | { kind: "number"; value: number; unit?: string }
  | { kind: "rank"; value: number }
  /** Magnitude bar + printed value in one cell. Normalized against `max`. */
  | { kind: "meter"; value: number; max: number; display?: string }
  | {
      kind: "status";
      label: string;
      tone?: "neutral" | "success" | "warning" | "critical";
      icon?: LucideIcon;
    }
  /** Escape hatch. Never the default — see the header note. */
  | { kind: "node"; content: React.ReactNode };

export type ColumnDef<Row> = {
  id: string;
  header: React.ReactNode;
  cell: (row: Row) => CellValue;
  align?: "start" | "center" | "end";
  /** <colgroup> width, e.g. "16%" or "2.5rem". */
  width?: string;
  /** Sticky first column for wide matrices. Only "start" is supported. */
  pin?: "start";
  /** Accessible name when `header` is empty or icon-only. */
  srHeader?: string;
};

export type RowGroup<Row> = {
  id: string;
  /** Eyebrow above the group. CONFIG — no group label is hardcoded here. */
  label?: string;
  showCount?: boolean;
  rows: Row[];
  /** Shown when the group is empty. An empty group still renders (see below). */
  emptyLabel?: string;
  /** Dims the group's rows, e.g. for eliminated items. */
  tone?: "default" | "muted";
  /**
   * The row action, per group — which is what lets one table show "eliminate"
   * on one group and "restore" on the other without a second component.
   */
  action?: {
    icon: LucideIcon;
    label: (row: Row) => string;
    onAction: (row: Row) => void;
    /**
     * What to say once the row has moved. Acting on a row relocates it to the
     * other group, which is a silent change for anyone not watching the screen,
     * so without this the flow's primary interaction gives no feedback at all.
     */
    announce?: (row: Row) => string;
  };
};

// ── Cell rendering ─────────────────────────────────────────────────────────

const STATUS_ICON_TONE = {
  neutral: "text-[var(--c-data-table-icon-subtle)]",
  success: "text-[var(--c-data-table-icon-success)]",
  warning: "text-[var(--c-data-table-icon-warning)]",
  critical: "text-[var(--c-data-table-icon-critical)]",
} as const;

function Cell({ value }: { value: CellValue }) {
  switch (value.kind) {
    case "text":
      return (
        <span
          className={cn(
            value.mono && "font-mono text-xs",
            value.emphasis && "font-medium",
            value.tone === "subtle"
              ? "text-[var(--c-data-table-text-subtle)]"
              : "text-[var(--c-data-table-text-default)]",
          )}
        >
          {value.value}
        </span>
      );

    case "link": {
      const linkClass =
        "underline underline-offset-2 text-[var(--c-data-table-text-link)] hover:text-[var(--c-data-table-text-link-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-data-table-border-focus)] rounded-[var(--c-data-table-shape-radius-md)]";
      if (value.href) {
        return (
          <a href={value.href} className={linkClass}>
            {value.label}
          </a>
        );
      }
      return (
        <button type="button" onClick={value.onClick} className={cn(linkClass, "text-left")}>
          {value.label}
        </button>
      );
    }

    case "entity":
      return (
        <span className="flex flex-col gap-0.5">
          <span
            className={cn(
              "text-[var(--c-data-table-text-default)]",
              value.italic && "italic",
            )}
          >
            {value.primary}
          </span>
          {value.secondary ? (
            <span className="text-[var(--c-data-table-text-subtle)]">{value.secondary}</span>
          ) : null}
        </span>
      );

    /* Colour is never the sole signal: the check carries a screen-reader
     * sentence, and absence is announced rather than left silent. */
    case "presence":
      return value.present ? (
        <>
          <Check
            aria-hidden="true"
            className="inline-block size-4 text-[var(--c-data-table-icon-default)]"
          />
          <span className="sr-only">{value.label}</span>
        </>
      ) : (
        <span className="sr-only">{`No ${value.label}`}</span>
      );

    case "flag": {
      const key = value.value === null ? "unknown" : value.value ? "yes" : "no";
      const labels = { yes: "yes", no: "no", unknown: "—", ...value.labels };
      const text = labels[key];
      const spoken = value.srLabels?.[key];
      return (
        <span
          className={
            value.value === null
              ? "text-[var(--c-data-table-text-subtle)]"
              : "text-[var(--c-data-table-text-default)]"
          }
        >
          {spoken ? (
            <>
              <span aria-hidden="true">{text}</span>
              <span className="sr-only">{spoken}</span>
            </>
          ) : (
            text
          )}
        </span>
      );
    }

    case "number":
      return (
        <span className="tabular-nums text-[var(--c-data-table-text-default)]">
          {value.value}
          {value.unit ? (
            <span className="text-[var(--c-data-table-text-subtle)]"> {value.unit}</span>
          ) : null}
        </span>
      );

    case "rank":
      return (
        <span className="tabular-nums text-[var(--c-data-table-text-subtle)]">
          {value.value}
        </span>
      );

    /* Not ScoreMeter: that atom is 0–1 with a threshold notch and forest tier
     * cuts, whereas this value is a raw count normalized against the dataset
     * max — reusing it would print a percentage and imply a tier that does not
     * exist. The bar is decorative; the printed number is the value. */
    case "meter": {
      const pct =
        value.max > 0 && Number.isFinite(value.value)
          ? Math.max(0, Math.min(1, value.value / value.max)) * 100
          : 0;
      return (
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-1.5 w-14 shrink-0 overflow-hidden rounded-[var(--c-data-table-shape-radius-round)] bg-[var(--c-data-table-meter-track)]"
          >
            <span
              className="block h-full rounded-[var(--c-data-table-shape-radius-round)] bg-[var(--c-data-table-meter-fill)]"
              style={{ width: `${pct}%` }}
            />
          </span>
          <span className="tabular-nums text-[var(--c-data-table-text-default)]">
            {value.display ?? value.value}
          </span>
        </span>
      );
    }

    case "status": {
      const Icon = value.icon;
      return (
        <span className="flex items-center gap-1.5 text-[var(--c-data-table-text-default)]">
          {Icon ? (
            <Icon
              aria-hidden="true"
              className={cn("size-4 shrink-0", STATUS_ICON_TONE[value.tone ?? "neutral"])}
            />
          ) : null}
          {value.label}
        </span>
      );
    }

    case "node":
      return <>{value.content}</>;
  }
}

// ── Layout helpers ─────────────────────────────────────────────────────────

const ALIGN = {
  start: "text-left",
  center: "text-center",
  end: "text-right",
} as const;

/**
 * The pinned cell needs its OWN hover background — the row's background paints
 * behind it, not through it, so without this the row hover breaks under the
 * sticky column. A right border rather than a scroll-triggered shadow: no
 * listener, no jank, and it reads as a column divider.
 */
const PINNED_CELL =
  "sticky left-0 z-10 bg-[var(--c-data-table-surface-pinned)] " +
  "border-r border-[var(--c-data-table-border-subtle)] " +
  "group-hover/row:bg-[var(--c-data-table-surface-hover)]";

function cellClass<Row>(column: ColumnDef<Row>, extra?: string) {
  return cn(
    ALIGN[column.align ?? "start"],
    column.pin === "start" && PINNED_CELL,
    extra,
  );
}

// ── The component ──────────────────────────────────────────────────────────

export type DataTableProps<Row> = {
  columns: ColumnDef<Row>[];
  /** Grouped form. Mutually exclusive with `rows`. */
  groups?: RowGroup<Row>[];
  /** Ungrouped shorthand — sugar for a single unlabelled group. */
  rows?: Row[];
  getRowId: (row: Row) => string;
  /** Required: a table with no accessible name is unnavigable. */
  ariaLabel: string;
  loading?: boolean;
  loadingRows?: number;
  empty?: React.ReactNode;
  onRowClick?: (row: Row) => void;
  className?: string;
};

export function DataTable<Row>({
  columns,
  groups,
  rows,
  getRowId,
  ariaLabel,
  loading = false,
  loadingRows = 4,
  empty,
  onRowClick,
  className,
}: DataTableProps<Row>) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [announcement, setAnnouncement] = React.useState("");
  /* The row a user just acted on. Acting moves it to the other group — a
   * different <tbody> — so React unmounts the focused button and focus falls to
   * <body>. Re-find the same row's button after the move and put focus back. */
  const [refocusRowId, setRefocusRowId] = React.useState<string | null>(null);

  const resolved: RowGroup<Row>[] = React.useMemo(
    () => groups ?? [{ id: "default", rows: rows ?? [] }],
    [groups, rows],
  );

  React.useEffect(() => {
    if (!refocusRowId) return;
    const next = rootRef.current?.querySelector<HTMLElement>(
      `[data-row-action="${CSS.escape(refocusRowId)}"]`,
    );
    next?.focus();
    setRefocusRowId(null);
  }, [refocusRowId, resolved]);

  const hasAction = resolved.some((group) => group.action);
  const columnCount = columns.length + (hasAction ? 1 : 0);
  const isEmpty =
    !loading && resolved.every((group) => group.rows.length === 0) && !groups;

  return (
    <div ref={rootRef}>
      {/* Row actions relocate a row to the other group; without this the flow's
        * primary interaction is silent for anyone not watching the screen. */}
      <div aria-live="polite" role="status" className="sr-only">
        {announcement}
      </div>
      <Table aria-label={ariaLabel} className={className}>
      <colgroup>
        {columns.map((column) => (
          <col key={column.id} style={column.width ? { width: column.width } : undefined} />
        ))}
        {hasAction ? <col style={{ width: "3rem" }} /> : null}
      </colgroup>

      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead
              key={column.id}
              scope="col"
              className={cellClass(
                column,
                "align-bottom whitespace-normal text-[var(--c-data-table-text-default)]",
              )}
            >
              {column.srHeader ? <span className="sr-only">{column.srHeader}</span> : column.header}
            </TableHead>
          ))}
          {hasAction ? (
            <TableHead scope="col">
              <span className="sr-only">Row actions</span>
            </TableHead>
          ) : null}
        </TableRow>
      </TableHeader>

      {loading ? (
        <TableBody>
          {Array.from({ length: loadingRows }).map((_, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.id} className={cellClass(column)}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
              {hasAction ? (
                <TableCell>
                  <Skeleton className="size-6 rounded-[var(--c-data-table-shape-radius-round)]" />
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      ) : isEmpty ? (
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={columnCount}
              className="py-8 text-center text-[var(--c-data-table-text-subtle)]"
            >
              {empty ?? "Nothing to show."}
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        resolved.map((group) => (
          <TableBody key={group.id}>
            {group.label ? (
              /* The divider sits on the group header, not the preceding row —
               * TableBody's [&_tr:last-child]:border-0 strips that one. */
              <TableRow className="hover:bg-transparent">
                <th
                  /* rowgroup, not colgroup: each RowGroup renders its own
                   * <tbody>, and scope="rowgroup" is defined as "applies to the
                   * remaining cells in this row group" — which is the intent.
                   * colgroup would instead make "Eliminated" an extra COLUMN
                   * header for all N columns of every row beneath it. */
                  scope="rowgroup"
                  colSpan={columnCount}
                  className="border-t border-[var(--c-data-table-border-default)] bg-[var(--c-data-table-surface-group)] px-2 py-1.5 text-left text-xs font-medium uppercase tracking-wide text-[var(--c-data-table-text-subtle)]"
                >
                  {group.label}
                  {group.showCount ? (
                    <span className="ml-1.5 tabular-nums normal-case">{group.rows.length}</span>
                  ) : null}
                </th>
              </TableRow>
            ) : null}

            {/* An empty group still renders. If a group vanished at zero, the
             * first action would make a section appear from nowhere and the
             * user would lose track of where the row went. */}
            {group.rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columnCount}
                  className="py-4 text-center text-[var(--c-data-table-text-subtle)]"
                >
                  {group.emptyLabel ?? "Nothing here yet."}
                </TableCell>
              </TableRow>
            ) : (
              group.rows.map((row) => {
                const ActionIcon = group.action?.icon;
                return (
                  <TableRow
                    key={getRowId(row)}
                    className={cn(
                      "group/row",
                      /* Re-point the tokens rather than set a colour: a colour on
                       * the <tr> is overridden by TableCell's own text colour and
                       * by each Cell's inner span, so it never reaches a pixel. */
                      group.tone === "muted" &&
                        "[--c-data-table-text-default:var(--c-data-table-text-muted)] [--c-data-table-text-subtle:var(--c-data-table-text-muted)]",
                      onRowClick && "cursor-pointer",
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        className={cellClass(column, "whitespace-normal align-top")}
                      >
                        <Cell value={column.cell(row)} />
                      </TableCell>
                    ))}
                    {hasAction ? (
                      <TableCell className="align-top text-right">
                        {group.action && ActionIcon ? (
                          <button
                            type="button"
                            data-row-action={getRowId(row)}
                            aria-label={group.action.label(row)}
                            onClick={(event) => {
                              event.stopPropagation();
                              const act = group.action;
                              if (!act) return;
                              act.onAction(row);
                              setRefocusRowId(getRowId(row));
                              setAnnouncement(act.announce?.(row) ?? "");
                            }}
                            className="inline-flex size-6 items-center justify-center rounded-[var(--c-data-table-shape-radius-round)] border border-[var(--c-data-table-border-subtle)] text-[var(--c-data-table-icon-subtle)] hover:border-[var(--c-data-table-border-default)] hover:text-[var(--c-data-table-icon-default)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--c-data-table-border-focus)]"
                          >
                            <ActionIcon aria-hidden="true" className="size-3.5" />
                          </button>
                        ) : null}
                      </TableCell>
                    ) : null}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        ))
      )}
      </Table>
    </div>
  );
}

/**
 * Column builder for a bare string matrix — the shape the chat transcript
 * embeds ({ columns: string[], rows: string[][] }). One line instead of a
 * second component.
 */
export function textColumns(headers: string[]): ColumnDef<string[]>[] {
  return headers.map((header, index) => ({
    id: `col-${index}`,
    header,
    cell: (row: string[]) => ({ kind: "text", value: row[index] ?? "" }) as CellValue,
  }));
}
