"use client";

/**
 * FilterCard — one facet group in the filter drawer: a title and a wrapping
 * cloud of selectable value chips, capped at two rows, with the hidden tail
 * reachable through a searchable "More" popover.
 *
 * Token tier: a Hummingbird leaf app surface, so it reads global --ds-* directly
 * (the result-card / results-panel precedent). Every primitive it composes
 * carries its own --c-* block; the two tiers never mix inside one file.
 *
 * Why the chips are plain buttons carrying `toggleVariants` rather than a
 * ToggleGroup, unlike the Evidence pills in results-panel: this facet's first
 * click on a pristine group means "narrow to only this one", which is NOT the
 * value a multi-select ToggleGroup computes for that click (it would report
 * everything-except-the-clicked-one, since every chip renders as on while
 * pristine — see toggleFacetSelection). Owning the click directly is what keeps
 * that semantic; borrowing `toggleVariants` is what keeps the appearance, the
 * dark-theme safety and the focus recipe identical to the shipped pills.
 */

import * as React from "react";

import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { OverflowCombobox } from "./overflow-combobox";
import type { FacetSelection, FilterGroup, FilterOption } from "./filter-model";

/**
 * Two rows of chips. One `size="sm"` chip is h-8 (32px); two of them plus the
 * 6px gap between rows is 70px. This is a single fixed height shared by every
 * FilterCard, not "2 rows" re-measured per group — the point is capping the
 * SHARED row height the 3-column grid stretches every card to, so groups with
 * shorter labels simply fit more chips into the same budget before overflowing.
 */
const TWO_ROW_HEIGHT = 70;

export interface FilterCardProps {
  group: FilterGroup;
  selected: FacetSelection;
  onToggle: (label: string) => void;
}

export function FilterCard({ group, selected, onToggle }: FilterCardProps) {
  const chipWrapRef = React.useRef<HTMLDivElement>(null);
  const [hiddenOptions, setHiddenOptions] = React.useState<FilterOption[]>([]);

  React.useLayoutEffect(() => {
    const el = chipWrapRef.current;
    if (!el) return;

    function measure() {
      if (!el) return;
      const containerTop = el.getBoundingClientRect().top;
      const children = Array.from(el.children) as HTMLElement[];
      // Chips render in the same order as group.options, so the first child that
      // spills past the visible height marks where the hidden tail starts —
      // everything from there on is what "More" should list.
      const firstHiddenIndex = children.findIndex(
        (child) => child.getBoundingClientRect().bottom - containerTop > el.clientHeight + 1
      );
      setHiddenOptions(firstHiddenIndex === -1 ? [] : group.options.slice(firstHiddenIndex));
    }

    measure();

    // ResizeObserver, not a window resize listener: inside a resizable split
    // view (the Workspace canvas) the drawer changes width without the window
    // ever resizing, and a window-only listener would leave the "More" tail
    // stale exactly when the column got narrower and more chips were pushed out.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [group.options]);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <h3 className="text-sm font-medium text-[var(--ds-color-text-default)]">
        {group.title}
      </h3>

      <div
        ref={chipWrapRef}
        className="flex flex-wrap gap-1.5 overflow-hidden"
        style={{ maxHeight: TWO_ROW_HEIGHT }}
      >
        {group.options.map((option) => {
          // Pristine (null) means "everything included" — show that as every chip
          // selected, not every chip deselected, so the two states that behave
          // identically also look identical. Once the user picks one, only picked
          // chips stay lit — including down to a real, explicit "none".
          const isSelected = selected === null || selected.has(option.label);
          return (
            <button
              key={option.label}
              type="button"
              aria-pressed={isSelected}
              data-state={isSelected ? "on" : "off"}
              onClick={() => onToggle(option.label)}
              className={cn(
                toggleVariants({ variant: "outline", size: "sm" }),
                "shrink-0 rounded-full px-3"
              )}
            >
              {option.label}
              <span className="ml-1.5 tabular-nums opacity-70">{option.count}</span>
            </button>
          );
        })}
      </div>

      {hiddenOptions.length > 0 && (
        <div className="self-start">
          <OverflowCombobox
            groupTitle={group.title}
            options={hiddenOptions}
            selected={selected}
            onToggle={onToggle}
          />
        </div>
      )}
    </div>
  );
}
