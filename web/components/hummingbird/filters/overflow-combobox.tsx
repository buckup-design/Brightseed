"use client";

/**
 * OverflowCombobox — the "More" affordance on a FilterCard: a searchable list of
 * the facet values that didn't fit in the card's two visible rows.
 *
 * Token tier: Hummingbird leaf app surface, reads global --ds-* directly.
 *
 * The demo hand-rolled the outside-click and Escape handling; Popover brings both
 * (plus focus trapping and return-focus) from Radix, so all that's left here is
 * the type-to-filter list and its arrow-key roving highlight.
 */

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { FacetSelection, FilterOption } from "./filter-model";

export interface OverflowComboboxProps {
  /** The parent facet's title, used to label the listbox for screen readers. */
  groupTitle: string;
  options: FilterOption[];
  selected: FacetSelection;
  onToggle: (label: string) => void;
}

export function OverflowCombobox({
  groupTitle,
  options,
  selected,
  onToggle,
}: OverflowComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [highlighted, setHighlighted] = React.useState(0);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, search]);

  // Clamp rather than reset to 0: the highlight should survive a keystroke that
  // merely shortens the list, and must never point past its end.
  const activeIndex = Math.min(highlighted, Math.max(filtered.length - 1, 0));

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted(Math.min(activeIndex + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted(Math.max(activeIndex - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) onToggle(option.label);
    }
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setSearch("");
          setHighlighted(0);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          {options.length} more
          <ChevronDown />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-64 p-0">
        <div className="border-b border-[var(--ds-color-border-subtle)] p-1">
          <Input
            autoFocus
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={handleKeyDown}
            // Short placeholder, full name on the label: the longest group title
            // ("Biological Targets + Biomarkers") truncates mid-word in a 64-unit
            // popover, and the accessible name is what needs to be complete.
            placeholder="Search"
            aria-label={`Search ${groupTitle}`}
            className="h-8 border-0 shadow-none focus-visible:ring-0"
          />
        </div>

        <div
          role="listbox"
          aria-label={groupTitle}
          aria-multiselectable
          className="max-h-64 overflow-y-auto p-1"
        >
          {filtered.length === 0 ? (
            <p className="px-2 py-3 text-center text-sm text-[var(--ds-color-text-subtle)]">
              No results found.
            </p>
          ) : (
            filtered.map((option, index) => {
              // Same pristine-null convention as FilterCard's own chips, so the
              // popup list stays consistent with what's shown above it.
              const isSelected = selected === null || selected.has(option.label);
              return (
                <button
                  key={option.label}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => onToggle(option.label)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 rounded-[var(--ds-shape-radius-sm)] px-2 py-1.5",
                    "text-left text-sm text-[var(--ds-color-text-default)] outline-none",
                    index === activeIndex && "bg-[var(--ds-color-surface-alt)]"
                  )}
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Check
                      className={cn(
                        "size-3.5 shrink-0 text-[var(--ds-color-icon-subtle)]",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-xs text-[var(--ds-color-text-subtle)]">
                    {option.count}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
