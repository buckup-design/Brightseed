import { useState } from "react";
import { ArrowRight, LayoutGrid, List } from "lucide-react";
import EvidenceTypeFilter from "./EvidenceTypeFilter";
import type { EvidenceTypeValue } from "../lib/evidenceType";

export type ViewMode = "grid" | "list";

interface EvidenceTypeProps {
  value: EvidenceTypeValue;
  onChange: (value: EvidenceTypeValue) => void;
  counts: Record<EvidenceTypeValue, number>;
}

interface FilterToolbarProps {
  // Omitted for tabs with no Evidence Type concept (e.g. Natural Sources).
  evidenceType?: EvidenceTypeProps;
  resultCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function FilterToolbar({
  evidenceType,
  resultCount,
  viewMode,
  onViewModeChange,
}: FilterToolbarProps) {
  const [search, setSearch] = useState("");

  return (
    <div className="flex items-center border-b border-border bg-white px-4 py-2">
      <div className="flex flex-1 items-center">
        {evidenceType && (
          <EvidenceTypeFilter
            value={evidenceType.value}
            onChange={evidenceType.onChange}
            counts={evidenceType.counts}
          />
        )}
      </div>

      <div className="flex w-full max-w-xs items-stretch gap-0">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search within results..."
          className="w-full rounded-l-md border border-input px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
        />
        <button
          type="button"
          aria-label="Search"
          className="flex items-center justify-center rounded-r-md border border-l-0 border-input px-3 text-muted-foreground hover:bg-accent"
        >
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4">
        <span className="text-xs text-muted-foreground">{resultCount} results</span>

        <div className="flex items-center gap-0.5 rounded-md border border-input bg-muted p-0.5">
          <button
            type="button"
            aria-label="Grid view"
            onClick={() => onViewModeChange("grid")}
            className={`flex size-8 items-center justify-center rounded-sm ${
              viewMode === "grid" ? "bg-card shadow-xs" : "text-muted-foreground"
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            aria-label="List view"
            onClick={() => onViewModeChange("list")}
            className={`flex size-8 items-center justify-center rounded-sm ${
              viewMode === "list" ? "bg-card shadow-xs" : "text-muted-foreground"
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
