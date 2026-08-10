import { useLayoutEffect, useRef, useState } from "react";
import Badge from "./Badge";
import OverflowCombobox from "./OverflowCombobox";
import type { FacetSelection } from "../lib/facets";
import type { FilterGroup, FilterOption } from "../types";

// "Two rows" = 2 × one Benefit pill (40px — each wraps to 2 text lines at
// this width, since Benefit's chips are long enough to stack one-per-row)
// + 1 × the gap-1.5 between them (6px) = 86px, per Anna. This is a single
// fixed height shared by every FilterCard, not "2 rows" re-measured per
// group — shorter-text groups (e.g. Compound Classes) can fit 3+ of their
// own (shorter, single-line) rows in that same budget before overflowing,
// which is fine: the point is capping the *shared* row height the 3-column
// grid stretches every card to, not forcing every group to exactly 2 rows.
const TWO_ROW_HEIGHT = 86;

interface FilterCardProps {
  group: FilterGroup;
  selected: FacetSelection;
  onToggle: (label: string) => void;
}

export default function FilterCard({ group, selected, onToggle }: FilterCardProps) {
  const chipWrapRef = useRef<HTMLDivElement>(null);
  const [hiddenOptions, setHiddenOptions] = useState<FilterOption[]>([]);

  useLayoutEffect(() => {
    const el = chipWrapRef.current;
    if (!el) return;

    function measure() {
      if (!el) return;
      const containerTop = el.getBoundingClientRect().top;
      const children = Array.from(el.children) as HTMLElement[];
      // Chips render in the same order as group.options, so the first child
      // that spills past the visible height marks where the hidden tail
      // starts — everything from there on is what "More" should list.
      const firstHiddenIndex = children.findIndex(
        (child) => child.getBoundingClientRect().bottom - containerTop > el.clientHeight + 1
      );
      setHiddenOptions(firstHiddenIndex === -1 ? [] : group.options.slice(firstHiddenIndex));
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [group.options]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-medium text-foreground">{group.title}</h3>
      <div
        ref={chipWrapRef}
        className="flex flex-wrap gap-1.5 overflow-hidden"
        style={{ maxHeight: TWO_ROW_HEIGHT }}
      >
        {group.options.map((option) => {
          // Pristine (null) means "everything included" — show that as
          // every chip selected, not every chip deselected, so the two
          // states that behave identically also look identical. Once the
          // user picks one, only picked chips stay lit — including down to
          // a real, explicit "none" if they deselect everything.
          const isSelected = selected === null || selected.has(option.label);
          return (
            <button
              key={option.label}
              type="button"
              onClick={() => onToggle(option.label)}
              className="max-w-full text-left"
            >
              <Badge wrap variant={isSelected ? "filter" : "neutral"}>
                {option.label} ({option.count})
              </Badge>
            </button>
          );
        })}
      </div>
      {hiddenOptions.length > 0 && (
        <div className="self-start">
          <OverflowCombobox options={hiddenOptions} selected={selected} onToggle={onToggle} />
        </div>
      )}
    </div>
  );
}
