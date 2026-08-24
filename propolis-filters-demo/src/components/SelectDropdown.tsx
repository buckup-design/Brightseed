import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface SelectDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  /** Shown as the first, selectable "no filter" option and as the trigger label when value is "". */
  placeholder?: string;
  disabled?: boolean;
  /**
   * False for dropdowns with no "no selection" state (e.g. a sort order,
   * which always has an active value) — hides the placeholder/clear row
   * from the open panel. Default true matches every existing filter-style
   * call site (Product Format's "Any").
   */
  showClearOption?: boolean;
}

/**
 * Custom-styled stand-in for a native <select>, matching
 * EvidenceTypeFilter's trigger/panel look (border-input button + ChevronDown,
 * bg-card panel with Check-marked rows) so every dropdown in the app reads
 * as the same control instead of one being the browser's native chrome.
 */
export default function SelectDropdown({
  value,
  options,
  onChange,
  placeholder = "Any",
  disabled = false,
  showClearOption = true,
}: SelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-8 w-full items-center justify-between gap-1.5 rounded-md border border-input bg-white px-2.5 text-sm text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-foreground/10 disabled:cursor-not-allowed disabled:hover:bg-white"
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>{value || placeholder}</span>
        <ChevronDown size={16} className="shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div
          role="listbox"
          // z-20: FilterToggleBar (the drawer's bottom bar) sits at z-10, so this
          // panel — which overflows past the drawer's own edge — needs to
          // outrank it, not just tie (a tie falls back to DOM order, which
          // would still lose to the toggle bar rendered after this drawer).
          className="absolute left-0 top-full z-20 mt-1 w-full rounded-md border border-border bg-card p-1 shadow-md"
        >
          {showClearOption && (
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm text-foreground hover:bg-accent"
            >
              <Check size={14} className={value === "" ? "opacity-100" : "opacity-0"} />
              {placeholder}
            </button>
          )}
          {options.map((option) => {
            const selected = value === option;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-1.5 rounded-sm px-2 py-1.5 text-left text-sm text-foreground hover:bg-accent"
              >
                <Check size={14} className={selected ? "opacity-100" : "opacity-0"} />
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
