"use client";

import * as React from "react";

import {
  clear,
  decide,
  isConverged,
  partition,
  triageCounts,
  triageSummary,
  type TriageCounts,
  type TriagePartition,
  type TriageState,
  type TriageVerdict,
} from "@/lib/triage";

/**
 * useTriage — React binding for lib/triage.
 *
 * A HOOK, NOT A CONTEXT, deliberately: the formulation stage runs two
 * independent triaged sets side by side (compounds and natural sources), and a
 * context would force them to share one. The stage that owns the sets calls this
 * once per set, exactly as WorkspaceCanvas owns its favourite overrides.
 *
 * Everything below the owner stays controlled — it receives the partition and
 * emits actions. Nothing downstream keeps its own copy of a verdict, which is
 * the desync strategy-card.tsx:102 still has (useState seeded from a prop reads
 * it once at mount and ignores every change after).
 *
 * The partition is recomputed each render rather than memoized. These sets are
 * tens of items, one pass is nothing, and memoizing over caller-supplied
 * `getId`/`initial` closures costs more correctness than it buys speed.
 */
export type UseTriageOptions<T> = {
  /** The model's starting position for an item, if the data ships pre-split. */
  initial?: (item: T) => TriageVerdict | undefined;
  /** Seed for uncontrolled use. */
  defaultState?: TriageState;
  /**
   * Controlled state. Pass this (with `onStateChange`) when the set outlives the
   * component showing it — drilling into a strategy unmounts the strategies
   * stage, and uncontrolled state would silently discard every decision the user
   * made before they navigated.
   */
  state?: TriageState;
  onStateChange?: (next: TriageState) => void;
  /**
   * What restoring an eliminated item means. "undecided" (the default) treats it
   * as un-eliminating; "kept" treats it as endorsing.
   */
  restoreTo?: "undecided" | "kept";
  /** Target survivor count for convergence — "the best one or two". */
  target?: number;
};

export type UseTriageResult<T> = {
  state: TriageState;
  partition: TriagePartition<T>;
  counts: TriageCounts;
  converged: boolean;
  /** e.g. "6 strategies · 2 reviewed · 4 in consideration". */
  summary: (noun: string, pluralNoun?: string) => string;
  verdictOf: (item: T) => TriageVerdict | undefined;
  keep: (item: T) => void;
  eliminate: (item: T) => void;
  /** Pull an item back out of the eliminated pile — see `restoreTo`. */
  restore: (item: T) => void;
  reset: () => void;
};

export function useTriage<T>(
  items: T[],
  getId: (item: T) => string,
  options: UseTriageOptions<T> = {},
): UseTriageResult<T> {
  const {
    initial,
    defaultState,
    state: controlledState,
    onStateChange,
    restoreTo = "undecided",
    target = 2,
  } = options;
  const [uncontrolled, setUncontrolled] = React.useState<TriageState>(defaultState ?? {});

  const controlled = controlledState !== undefined;
  const state = controlled ? controlledState : uncontrolled;

  const setState = React.useCallback(
    (update: (prev: TriageState) => TriageState) => {
      if (controlled) onStateChange?.(update(controlledState));
      else setUncontrolled(update);
    },
    [controlled, controlledState, onStateChange],
  );

  const part = partition(items, getId, state, initial);
  const counts = triageCounts(part);

  return {
    state,
    partition: part,
    counts,
    converged: isConverged(counts, target),
    summary: (noun, pluralNoun) => triageSummary(counts, noun, pluralNoun),
    verdictOf: (item) => state[getId(item)] ?? initial?.(item),
    keep: (item) => setState((s) => decide(s, getId(item), "kept")),
    eliminate: (item) => setState((s) => decide(s, getId(item), "eliminated")),
    restore: (item) =>
      setState((s) => {
        const id = getId(item);
        if (restoreTo === "kept") return decide(s, id, "kept");
        /* Dropping the override only restores an item whose DATA default isn't
         * already "eliminated" — otherwise the default re-eliminates it on the
         * next render and the button looks broken. When the model shipped it
         * eliminated, pulling it back is necessarily an explicit decision. */
        return initial?.(item) === "eliminated" ? decide(s, id, "kept") : clear(s, id);
      }),
    reset: () => setState(() => ({})),
  };
}
