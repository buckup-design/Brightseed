import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { EVIDENCE_TYPE_OPTIONS, type EvidenceTypeValue } from "../lib/evidenceType";

interface EvidenceTypeFilterProps {
  value: EvidenceTypeValue;
  onChange: (value: EvidenceTypeValue) => void;
  counts: Record<EvidenceTypeValue, number>;
}

export default function EvidenceTypeFilter({
  value,
  onChange,
  counts,
}: EvidenceTypeFilterProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedLabel =
    EVIDENCE_TYPE_OPTIONS.find((option) => option.value === value)?.label ?? "Any published data";

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
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Evidence Type</span>
      <div className="relative" ref={containerRef}>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent"
        >
          {selectedLabel}
          <ChevronDown size={16} />
        </button>

        {open && (
          <div
            role="listbox"
            aria-label="Evidence Type"
            className="absolute right-0 top-full z-10 mt-1 w-56 rounded-md border border-border bg-card p-1 shadow-md"
          >
            {EVIDENCE_TYPE_OPTIONS.map((option) => {
              const count = counts[option.value];
              const disabled = count === 0;
              const selected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={disabled}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-sm px-2 py-1.5 text-left text-sm ${
                    disabled
                      ? "cursor-not-allowed text-muted-foreground/50"
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Check size={14} className={selected ? "opacity-100" : "opacity-0"} />
                    {option.label}
                  </span>
                  <span className="text-xs text-muted-foreground">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
