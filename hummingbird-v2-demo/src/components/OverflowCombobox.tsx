import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { FacetSelection } from "../lib/facets";
import type { FilterOption } from "../types";

interface OverflowComboboxProps {
  options: FilterOption[];
  selected: FacetSelection;
  onToggle: (label: string) => void;
}

export default function OverflowCombobox({
  options,
  selected,
  onToggle,
}: OverflowComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, search]);

  useEffect(() => {
    setHighlighted(0);
  }, [search]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlighted((current) => Math.min(current + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlighted((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[highlighted];
      if (option && !option.disabled) onToggle(option.label);
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        More
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-10 mt-1 w-64 rounded-md border border-border bg-card shadow-md">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search"
            className="w-full border-b border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <div role="listbox" className="max-h-64 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <p className="px-2 py-3 text-center text-sm text-muted-foreground">
                No results found.
              </p>
            )}
            {filtered.map((option, index) => {
              // Same pristine-null convention as FilterCard's own chips, so
              // the popup list stays consistent with what's shown above it.
              const isSelected = selected === null || selected.has(option.label);
              const isHighlighted = index === highlighted;
              return (
                <button
                  key={option.label}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={option.disabled}
                  onMouseEnter={() => setHighlighted(index)}
                  onClick={() => onToggle(option.label)}
                  className={`flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left text-sm ${
                    option.disabled
                      ? "cursor-not-allowed text-muted-foreground/50"
                      : `text-foreground ${isHighlighted ? "bg-accent" : ""}`
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Check size={14} className={isSelected ? "shrink-0 opacity-100" : "shrink-0 opacity-0"} />
                    <span className="truncate">{option.label}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">({option.count})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
