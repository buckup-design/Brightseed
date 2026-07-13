import { ArrowUp } from "lucide-react";

import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import { Chip } from "@/components/ui/chip";
import { hero } from "../content";

/**
 * Hero product preview — the Hummingbird chat interface rebuilt as real DOM
 * (Quill logo + prompt field + suggestion Chips), not a bitmap screenshot.
 * Theme-aware and crisp at any size. Each page frames it differently
 * (minimal: floating soft card; product: browser chrome).
 */
export function HeroPreview({ showLede = true }: { showLede?: boolean }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10 sm:px-10 sm:py-14">
      <div className="flex flex-col items-center text-center">
        <BrightseedLogo variant="lockup" className="h-7" />
        {showLede && (
          <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--ds-color-text-subtle)]">
            {hero.lede}
          </p>
        )}
      </div>

      {/* Prompt field */}
      <div className="mt-8 rounded-2xl border border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-default)] p-4 shadow-sm">
        <div className="flex min-h-24 items-start justify-between gap-3">
          <span className="text-sm text-[var(--ds-color-text-subtle)]">
            {hero.preview.prompt}
          </span>
          <span
            aria-hidden
            className="mt-auto grid size-8 shrink-0 place-items-center rounded-full bg-[var(--ds-color-action-primary)] text-[var(--ds-color-text-on-action-primary)]"
          >
            <ArrowUp className="size-4" />
          </span>
        </div>
      </div>

      {/* Suggestion chips */}
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {hero.preview.suggestions.map((s) => (
          <Chip key={s} className="cursor-default">
            {s}
          </Chip>
        ))}
      </div>
    </div>
  );
}
