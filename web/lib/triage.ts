/**
 * Triage — the shared "narrow a set down to a decision" model.
 *
 * Every stage of Hummingbird's discovery flow is the same move: the model
 * proposes a set, a human narrows it to one or two, and that decision seeds the
 * next stage. Strategies get triaged down to the best one or two; the compounds
 * and natural sources inside a formulation plan get triaged the same way. One
 * model serves both levels, so the counts and the interaction read identically
 * wherever they appear.
 *
 * THE STATE IS A SPARSE OVERRIDE MAP, and that is the whole design. Only the
 * user's explicit decisions are stored; everything else is derived at render.
 * This is the generalization of the lesson already banked in workspace-canvas's
 * favourite overrides: a freshly fetched set contributes its own defaults for
 * free, a user's decision always wins over the model's, and there is no effect
 * and no re-seeding to get wrong.
 *
 * It follows that "reviewed" needs no second flag — the override map IS the
 * reviewed set, so total / reviewed / still-in-consideration all fall out of one
 * structure that cannot disagree with itself.
 *
 * "REVIEWED" MEANS A HUMAN RULED ON IT — nothing else (Becky, Sept 2026). The
 * model's own starting split is a proposal, not a review, so an item the AI
 * eliminated is eliminated but NOT reviewed, and a set opens at 0 reviewed no
 * matter how much pre-sorting arrived with the data. This is the whole point of
 * the human-in-the-loop screen: the count has to measure the human's progress
 * through the set, or it flatters the work as further along than it is.
 *
 * Presentation-free by design, the same way filters/filter-model.ts is. No React
 * here; the hook is in hooks/use-triage.ts.
 */

/** A decision the user has made. Absence from the map means undecided. */
export type TriageVerdict = "kept" | "eliminated";

/** Sparse: an id absent from this map has not been ruled on. */
export type TriageState = Record<string, TriageVerdict>;

export type TriagePartition<T> = {
  undecided: T[];
  kept: T[];
  eliminated: T[];
  /** Kept + undecided, in the original `items` order — everything still live. */
  inConsideration: T[];
  /**
   * Items a HUMAN ruled on: present in the override map. Excludes anything the
   * model pre-sorted via `initial`, which is a proposal, not a review.
   */
  reviewed: T[];
};

export type TriageCounts = {
  total: number;
  undecided: number;
  kept: number;
  eliminated: number;
  /** How many the HUMAN has ruled on. Never counts the model's own split. */
  reviewed: number;
  /** Kept + undecided. */
  inConsideration: number;
};

/**
 * Split a set by verdict.
 *
 * `initial` supplies the model's starting position for an item — the mock ships
 * its compounds pre-split into candidates and eliminated, and that is a property
 * of the data, not of the user. A user override always wins over it.
 */
export function partition<T>(
  items: T[],
  getId: (item: T) => string,
  state: TriageState,
  initial?: (item: T) => TriageVerdict | undefined,
): TriagePartition<T> {
  const undecided: T[] = [];
  const kept: T[] = [];
  const eliminated: T[] = [];
  const reviewed: T[] = [];
  /* Built in this same pass rather than as [...kept, ...undecided]: concatenating
   * the buckets would float every explicitly-kept row above the model's ranking,
   * so restoring an item would teleport it to the top of the list. That is the
   * very reordering DataTable refuses sorting to avoid. */
  const inConsideration: T[] = [];

  for (const item of items) {
    const id = getId(item);
    const userVerdict = state[id];
    /* Only a user verdict counts as reviewed. Walking `items` rather than the
     * map's keys also means a stale id left over from a previous result set
     * cannot inflate the count. */
    if (userVerdict) reviewed.push(item);

    const verdict = userVerdict ?? initial?.(item);
    if (verdict === "kept") {
      kept.push(item);
      inConsideration.push(item);
    } else if (verdict === "eliminated") {
      eliminated.push(item);
    } else {
      undecided.push(item);
      inConsideration.push(item);
    }
  }

  return { undecided, kept, eliminated, inConsideration, reviewed };
}

export function triageCounts<T>(part: TriagePartition<T>): TriageCounts {
  const { undecided, kept, eliminated } = part;
  return {
    total: undecided.length + kept.length + eliminated.length,
    undecided: undecided.length,
    kept: kept.length,
    eliminated: eliminated.length,
    /* Human decisions only — NOT kept + eliminated, which would count the
     * model's own pre-sorting as review work the user never did. */
    reviewed: part.reviewed.length,
    inConsideration: kept.length + undecided.length,
  };
}

/** Record a verdict. Returns a new state; never mutates. */
export function decide(
  state: TriageState,
  id: string,
  verdict: TriageVerdict,
): TriageState {
  return { ...state, [id]: verdict };
}

/**
 * Drop a decision, returning the item to undecided.
 *
 * This — not `decide(id, "kept")` — is what restoring an eliminated item does:
 * pulling something back out of the eliminated pile means you have un-eliminated
 * it, not that you have endorsed it. The stage can opt into the other reading.
 */
export function clear(state: TriageState, id: string): TriageState {
  if (!(id in state)) return state;
  const next = { ...state };
  delete next[id];
  return next;
}

/**
 * Has the set converged on a decision? Between one and `target` items still in
 * consideration — the flow's stated goal of "the best strategy, or maybe the
 * best two".
 *
 * Measured on what SURVIVES, not on explicit endorsements. Elimination is the
 * only mechanic the interface offers, so narrowing five strategies to one leaves
 * that survivor undecided rather than "kept"; an earlier version required
 * `kept >= 1` and could therefore never be satisfied by the actual UI — the
 * stage had no reachable end. Narrowing IS the decision; an explicit `kept`
 * verdict is a stronger signal on top of it, never a precondition.
 */
export function isConverged(counts: TriageCounts, target = 2): boolean {
  return (
    counts.total > 0 &&
    counts.inConsideration >= 1 &&
    counts.inConsideration <= target
  );
}

/**
 * The progress readout, e.g. "6 strategies · 2 reviewed · 4 in consideration".
 * Counts, never a percentage: DESIGN.md is explicit that strategies compete
 * rather than queue, so a stepper or percent-complete bar misreads the model.
 */
export function triageSummary(counts: TriageCounts, noun: string, pluralNoun?: string) {
  const label = counts.total === 1 ? noun : (pluralNoun ?? `${noun}s`);
  return `${counts.total} ${label} · ${counts.reviewed} reviewed · ${counts.inConsideration} in consideration`;
}
