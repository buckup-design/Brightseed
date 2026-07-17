"use client";

/**
 * ReportsList — the Reports surface ("Reports list view").
 *
 * The library of concept briefs generated from recommendations. Mirrors the
 * live product's /report list (brightseed.ai v1.3.2). A Block — it composes
 * Card + Button + Input + Tag — and is the content behind App Shell Quill's
 * "Reports" tab, imported there so the screen and the standalone Block never
 * drift.
 *
 * Search filters the list live. Filter/Sort are visual placeholders — the real
 * List Toolbar (menus vs. selects) is its own Tier-3 pass. New Report and View
 * are callbacks the app owns.
 */

import * as React from "react";
import {
  ArrowUpDown,
  FileText,
  ListFilter,
  MoreVertical,
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";

export type Report = {
  title: string;
  /** Status label rendered as a Tag; the live product's default is "Draft". */
  status: string;
  /** Human-readable relative time, e.g. "Updated 3 hours ago". */
  updated: string;
};

export const SAMPLE_REPORTS: Report[] = [
  { title: "Berberine + Biochanin A", status: "Draft", updated: "Updated 3 hours ago" },
  { title: "Resveratrol Longevity Concept", status: "Draft", updated: "Updated yesterday" },
  { title: "Sulforaphane Gut Health Brief", status: "Draft", updated: "Updated 4 days ago" },
];

export function ReportsList({
  reports = SAMPLE_REPORTS,
  onNewReport,
  onView,
}: {
  reports?: Report[];
  onNewReport?: () => void;
  onView?: (report: Report) => void;
}) {
  const [query, setQuery] = React.useState("");
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? reports.filter((report) => report.title.toLowerCase().includes(needle))
    : reports;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-[var(--c-reports-list-text-default)]">
            Reports
          </h1>
          <p className="text-sm text-[var(--c-reports-list-text-subtle)]">
            Concept briefs generated from your recommendations.
          </p>
        </div>
        <Button onClick={onNewReport}>
          <Plus />
          New Report
        </Button>
      </div>

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
        <Button variant="outline">
          <ListFilter />
          All
        </Button>
        <Button variant="outline">
          <ArrowUpDown />
          Recent
        </Button>
      </div>

      {visible.length > 0 ? (
        <div className="flex flex-col gap-3">
          {visible.map((report) => (
            <Card key={report.title} className="flex-row items-center gap-4 p-4">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--c-reports-list-shape-radius-md)] bg-[var(--c-reports-list-surface-alt)] text-[var(--c-reports-list-text-subtle)]">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-[var(--c-reports-list-text-default)]">
                    {report.title}
                  </span>
                  <Tag variant="default">{report.status}</Tag>
                </div>
                <div className="text-sm text-[var(--c-reports-list-text-subtle)]">
                  {report.updated}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onView ? () => onView(report) : undefined}
              >
                View
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="More options">
                <MoreVertical />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-[var(--c-reports-list-text-subtle)]">
          No reports match your search.
        </p>
      )}
    </div>
  );
}
