"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { TriageCounts } from "@/lib/triage";

/**
 * StageBar — how far through the decision you are, and the way out.
 *
 * This is the direct answer to the problem that started this work: you could not
 * see how many strategies a project had, how many were reviewed, or how many were
 * still in play. The counts live here, above the set they describe, on every
 * stage of the spine.
 *
 * COUNTS, NEVER A PROGRESS BAR. DESIGN.md is explicit that strategies compete
 * rather than queue — "losers are eliminated, not deferred… a checklist, stepper
 * or percent-complete bar misreads the model." A bar would also imply the work is
 * done when the last item is ruled on, when what actually matters is landing on
 * one or two survivors.
 *
 * "Reviewed" counts human decisions only; the model's own starting split is a
 * proposal, not review (see lib/triage.ts).
 *
 * hummingbird/ tier: reads global --ds-* directly (see document-parts.tsx).
 */

export function StageBar({
  counts,
  noun,
  pluralNoun,
  converged = false,
  advanceLabel,
  onAdvance,
  advanceHint,
  className,
}: {
  counts: TriageCounts;
  /** e.g. "strategy" — the bar writes the plural itself. */
  noun: string;
  pluralNoun?: string;
  /** Whether the hand-off is unlocked. */
  converged?: boolean;
  /** e.g. "Explore formulations". */
  advanceLabel?: string;
  onAdvance?: () => void;
  /** Why the hand-off is disabled, shown on hover/focus. */
  advanceHint?: string;
  className?: string;
}) {
  const label = counts.total === 1 ? noun : (pluralNoun ?? `${noun}s`);

  const advance = onAdvance ? (
    <Button size="sm" onClick={onAdvance} disabled={!converged}>
      {advanceLabel}
      <ArrowRight />
    </Button>
  ) : null;

  return (
    <div
      className={cn(
        "flex shrink-0 flex-wrap items-center justify-between gap-3 py-1",
        className,
      )}
    >
      {/* One sentence, not three chips: it reads as a status, and it is the
        * accessible name a live region can repeat verbatim after a decision. */}
      <p className="text-sm text-[var(--ds-color-text-subtle)]">
        <span className="font-medium text-[var(--ds-color-text-default)]">
          {counts.total} {label}
        </span>
        {" · "}
        {counts.reviewed} reviewed
        {" · "}
        <span className="font-medium text-[var(--ds-color-text-default)]">
          {counts.inConsideration} in consideration
        </span>
      </p>

      {advance && !converged && advanceHint ? (
        <Tooltip>
          {/* A disabled button fires no pointer events, so the tooltip needs a
            * focusable wrapper or the reason for the lock is unreachable. */}
          <TooltipTrigger asChild>
            <span tabIndex={0} className="inline-flex rounded-[var(--ds-shape-radius-md)]">
              {advance}
            </span>
          </TooltipTrigger>
          <TooltipContent>{advanceHint}</TooltipContent>
        </Tooltip>
      ) : (
        advance
      )}
    </div>
  );
}
