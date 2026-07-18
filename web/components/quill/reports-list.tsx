"use client";

/**
 * ReportsList — the Reports surface ("Reports list view").
 *
 * The library of concept briefs generated from recommendations. Mirrors the
 * live product's /report list (brightseed.ai v1.3.2). A Block — it composes
 * PageHeading + Input + DropdownMenu + Card + StatusBadge + Button — and is the
 * content behind App Shell Quill's "Reports" tab, imported there so the screen
 * and the standalone Block never drift.
 *
 * The toolbar is live: Search filters by title, Filter narrows by status, Sort
 * reorders (Recent / Oldest / Title). A star favorites a report and floats it to
 * the top. Clicking a card opens the report (onView) — the whole card is the
 * affordance, no button; each row also has a favorite star and a ⋮ overflow
 * (Favorite / Share / Comment / Delete). With zero reports the whole list is
 * replaced by an empty state. New Report, View, Delete, Share and Comment are
 * callbacks the app owns; favorite state is local (the app owns real persistence).
 */

import * as React from "react";
import {
  ArrowUpDown,
  FileText,
  ListFilter,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Share2,
  Star,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { Input } from "@/components/ui/input";
import { PageHeading } from "@/components/ui/page-heading";
import { StatusBadge, type Status } from "@/components/ui/status-badge";
import { CommentDialog } from "@/components/quill/comment-dialog";
import { ShareDialog } from "@/components/quill/share-dialog";

export type Report = {
  id: string;
  title: string;
  /** Lifecycle state, rendered as a StatusBadge. The live default is "draft". */
  status: Status;
  /** Human-readable relative time, e.g. "Updated 3 hours ago". */
  updated: string;
  favorited?: boolean;
};

export const SAMPLE_REPORTS: Report[] = [
  { id: "r1", title: "Berberine + Biochanin A", status: "draft", updated: "Updated 3 hours ago", favorited: true },
  { id: "r2", title: "Resveratrol Longevity Concept", status: "completed", updated: "Updated yesterday" },
  { id: "r3", title: "Sulforaphane Gut Health Brief", status: "draft", updated: "Updated 4 days ago" },
  { id: "r4", title: "Quercetin + Fisetin Senolytic Stack", status: "draft", updated: "Updated 1 week ago" },
];

type StatusFilter = "all" | Status;
type SortKey = "recent" | "oldest" | "title";

const SORT_LABELS: Record<SortKey, string> = {
  recent: "Recent",
  oldest: "Oldest",
  title: "Title A–Z",
};

export function ReportsList({
  reports = SAMPLE_REPORTS,
  onNewReport,
  onView,
  onDelete,
  onShare,
  onComment,
}: {
  reports?: Report[];
  onNewReport?: () => void;
  onView?: (report: Report) => void;
  onDelete?: (report: Report) => void;
  onShare?: (report: Report, emails: string[]) => void;
  onComment?: (report: Report, note: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [sort, setSort] = React.useState<SortKey>("recent");
  const [favoritedIds, setFavoritedIds] = React.useState<Set<string>>(
    () => new Set(reports.filter((r) => r.favorited).map((r) => r.id))
  );
  const [shareReport, setShareReport] = React.useState<Report | null>(null);
  const [commentReport, setCommentReport] = React.useState<Report | null>(null);

  const toggleFavorite = (id: string) =>
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const needle = query.trim().toLowerCase();
  const filtered = reports.filter(
    (r) =>
      (statusFilter === "all" || r.status === statusFilter) &&
      (!needle || r.title.toLowerCase().includes(needle))
  );
  const sorted = [...filtered];
  if (sort === "oldest") sorted.reverse();
  else if (sort === "title") sorted.sort((a, b) => a.title.localeCompare(b.title));
  // Favorited reports float to the top, keeping their relative order.
  const visible = [
    ...sorted.filter((r) => favoritedIds.has(r.id)),
    ...sorted.filter((r) => !favoritedIds.has(r.id)),
  ];

  return (
    <>
    <div className="min-h-svh bg-[var(--c-reports-list-surface-canvas)] px-6 py-8">
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <PageHeading
          size="sm"
          title="Reports"
          description="Concept briefs generated from your recommendations."
        />
        <Button onClick={onNewReport}>
          <Plus />
          New Report
        </Button>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[var(--c-reports-list-shape-radius-md)] border border-dashed border-[var(--c-reports-list-border-default)] py-16 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[var(--c-reports-list-surface-alt)] text-[var(--c-reports-list-text-subtle)]">
            <FileText className="size-6" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-[var(--c-reports-list-text-default)]">
              No reports yet
            </p>
            <p className="max-w-sm text-sm text-[var(--c-reports-list-text-subtle)]">
              Create your first concept report by analyzing ingredients with the
              AI assistant.
            </p>
          </div>
          <Button onClick={onNewReport}>
            <Plus />
            Get Started
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--c-reports-list-text-subtle)]" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, ingredients, or summary…"
                className="pl-9"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ListFilter />
                  {statusFilter === "all" ? "All" : "Draft"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as StatusFilter)}
                >
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="draft">Draft</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ArrowUpDown />
                  {SORT_LABELS[sort]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value as SortKey)}
                >
                  <DropdownMenuRadioItem value="recent">Recent</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">Oldest</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="title">Title A–Z</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {visible.length > 0 ? (
            <div className="flex flex-col gap-3">
              {visible.map((report) => {
                const favorited = favoritedIds.has(report.id);
                return (
                  <Card
                    key={report.id}
                    className="relative flex-row items-center gap-4 p-4 transition-colors hover:border-[var(--c-reports-list-border-hover)]"
                  >
                    {/* Whole card opens the report. An invisible, keyboard-
                        focusable button fills the card; non-interactive content
                        is pointer-events-none so clicks fall through to it, and
                        the star + overflow sit above it (later in DOM, relative)
                        — so they stay clickable without any nested-interactive. */}
                    <button
                      type="button"
                      aria-label={`View ${report.title}`}
                      onClick={() => onView?.(report)}
                      className="absolute inset-0 rounded-[var(--c-reports-list-shape-radius-md)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--c-reports-list-border-focus)]/50"
                    />
                    <div className="pointer-events-none flex size-9 shrink-0 items-center justify-center rounded-[var(--c-reports-list-shape-radius-md)] bg-[var(--c-reports-list-surface-alt)] text-[var(--c-reports-list-text-subtle)]">
                      <FileText className="size-5" />
                    </div>
                    <div className="pointer-events-none min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-medium text-[var(--c-reports-list-text-default)]">
                          {report.title}
                        </span>
                        <StatusBadge status={report.status} />
                      </div>
                      <div className="text-sm text-[var(--c-reports-list-text-subtle)]">
                        {report.updated}
                      </div>
                    </div>
                    <FavoriteButton
                      favorited={favorited}
                      onToggle={() => toggleFavorite(report.id)}
                      label="report"
                      className="relative"
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="More options"
                          className="relative"
                        >
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => toggleFavorite(report.id)}>
                          <Star />
                          {favorited ? "Unfavorite" : "Favorite"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setShareReport(report)}>
                          <Share2 />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setCommentReport(report)}>
                          <MessageSquare />
                          Comment
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() => onDelete?.(report)}
                        >
                          <Trash2 />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-[var(--c-reports-list-text-subtle)]">
              No reports match your search.
            </p>
          )}
        </>
      )}
    </div>
    </div>

    <ShareDialog
      open={shareReport !== null}
      onOpenChange={(o) => {
        if (!o) setShareReport(null);
      }}
      title={shareReport?.title}
      link={shareReport ? `https://brightseed.ai/report/${shareReport.id}` : ""}
      onShare={(emails) => {
        if (shareReport) onShare?.(shareReport, emails);
      }}
    />
    <CommentDialog
      open={commentReport !== null}
      onOpenChange={(o) => {
        if (!o) setCommentReport(null);
      }}
      title={commentReport?.title}
      onSubmit={(note) => {
        if (commentReport) onComment?.(commentReport, note);
      }}
    />
    </>
  );
}
