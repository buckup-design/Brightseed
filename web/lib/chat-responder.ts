/**
 * The chat seam.
 *
 * Hummingbird's chat pane does not know where its answers come from. It hands a
 * `ResponderRequest` to a `Responder` and renders whatever comes back. That is
 * the whole contract, and it is deliberately small.
 *
 * WHY A SEAM AND NOT A MODEL CALL: Brightseed has already built an internal MCP
 * that maps their frontend to their database. That is the intended production
 * backend, and wiring it up is Meng's team's call, not this prototype's. So the
 * interface is shaped for a request/response service — async, serializable in
 * and out, no assumption that a language model is on the other end — and ships
 * with a mock implementation over the real project fixtures.
 *
 * To swap: write a function of type `Responder` and pass it to `useChat`.
 * Nothing in the UI changes.
 */

import {
  COMBINATIONS,
  COMPOUND_CANDIDATES,
  COMPOUND_ELIMINATED,
  PREDICTED_COMPOUNDS,
  PROJECT_VIRAL,
  SOURCE_CANDIDATES,
  SOURCE_ELIMINATED,
  STRATEGIES_VIRAL,
} from "@/components/hummingbird/project-data";

export type ChatTurn = {
  role: "user" | "assistant";
  text: string;
  /** Italic line above the prose — what the model did, not what it concluded. */
  meta?: string;
};

export type ResponderRequest = {
  /** What the user typed. Free-form; never assume a menu choice. */
  input: string;
  /** Everything said so far, oldest first, excluding `input`. */
  history: ChatTurn[];
  /** Which stage the user is looking at, when the caller knows. */
  stage?: string;
  projectId?: string;
};

export type ResponderReply = {
  text: string;
  meta?: string;
};

export type Responder = (request: ResponderRequest) => Promise<ResponderReply>;

// ─── Mock responder ──────────────────────────────────────────────────────────
//
// Intent matching over the real fixtures. Two rules hold this together and both
// matter more than coverage:
//
//   1. NEVER INVENT A NUMBER. Every count, name and status below is read out of
//      project-data.ts at call time. The Sept 4 audit found our fixtures match
//      Anna's mock exactly; a chat layer that fabricates figures would throw
//      that away, and a demo that quotes a wrong compound count is worse than
//      one that declines to answer.
//   2. FAIL HONESTLY. Unmatched input says so and lists what it can do, rather
//      than guessing. A confident wrong answer reads as a broken product.

const list = (items: string[]) =>
  items.length <= 1
    ? (items[0] ?? "")
    : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

const n = (value: number) => value.toLocaleString();

/** Every rule gets the lower-cased input; the first to return wins. */
type Rule = (q: string) => ResponderReply | null;

const RULES: Rule[] = [
  // — greetings and orientation —
  (q) =>
    /^(hi|hey|hello|yo)\b|^good (morning|afternoon)/.test(q)
      ? {
          text: `Hello. You're in ${PROJECT_VIRAL.name} — the goal is to ${PROJECT_VIRAL.goal}. I can talk through the ${STRATEGIES_VIRAL.length} strategies, the compounds with direct evidence, the natural sources and their GRAS status, or the source combinations. What would you like to look at?`,
        }
      : null,

  (q) =>
    /\b(help|what can you do|how does this work|what should i ask)\b/.test(q)
      ? {
          text: "I can answer questions about this project's data: the strategies and how they compare on evidence, the compounds with direct evidence and which are food grade, the natural sources and their GRAS status, and the ranked source combinations. I can also tell you the project's goal, constraints and references. Ask in your own words.",
        }
      : null,

  // — project context —
  (q) =>
    /\b(goal|objective|what are we (trying|doing))\b/.test(q)
      ? { text: `The goal for this project is to ${PROJECT_VIRAL.goal}.` }
      : null,

  (q) =>
    /\bconstraint/.test(q)
      ? {
          text:
            PROJECT_VIRAL.constraints === "none"
              ? "No constraints have been set on this project yet. Tell me about format, population or sourcing limits and I'll add them to the project context."
              : `Current constraints: ${PROJECT_VIRAL.constraints}.`,
        }
      : null,

  (q) =>
    /\b(reference|paper|citation|literature)\b/.test(q)
      ? {
          text: `${PROJECT_VIRAL.referenceCount} papers have been reviewed for this project. They're listed under References in the project context panel.`,
        }
      : null,

  // — strategies —
  (q) =>
    /\b(most|best|strongest|highest)\b.*\b(evidence|evidenced|support)\b/.test(q)
      ? (() => {
          const top = [...STRATEGIES_VIRAL].sort(
            (a, b) => b.evidencedCompounds - a.evidencedCompounds,
          )[0];
          return {
            meta: `Ranked ${STRATEGIES_VIRAL.length} strategies by evidenced compound count.`,
            text: `${top.name} carries the most direct evidence — ${n(top.evidencedCompounds)} evidenced compounds against ${n(top.predictedCompounds)} predicted, ${n(top.totalCompounds)} in total. Worth saying that evidence volume is not the same as fit: it's the widest net, not necessarily the right one.`,
          };
        })()
      : null,

  (q) =>
    /\bstrateg/.test(q)
      ? {
          meta: `Read ${STRATEGIES_VIRAL.length} strategies from the project.`,
          text: `There are ${STRATEGIES_VIRAL.length} strategies on the table, all pairing fusion inhibition with a second mechanism: ${list(
            STRATEGIES_VIRAL.map((s) => s.name.replace("Fusion inhibition + ", "")),
          )}. They range from ${n(
            Math.min(...STRATEGIES_VIRAL.map((s) => s.evidencedCompounds)),
          )} to ${n(
            Math.max(...STRATEGIES_VIRAL.map((s) => s.evidencedCompounds)),
          )} evidenced compounds. The aim of this stage is to get down to one or two worth pursuing.`,
        }
      : null,

  // — compounds —
  (q) =>
    /\b(food.?grade|drink|gummy|format)\b/.test(q)
      ? (() => {
          const drink = COMPOUND_CANDIDATES.filter((c) => c.drink);
          const gummy = COMPOUND_CANDIDATES.filter((c) => c.gummy);
          return {
            text: `Of the ${COMPOUND_CANDIDATES.length} candidate compounds, ${drink.length} work in a drink (${list(
              drink.map((c) => c.shortName),
            )}) and ${gummy.length} in a gummy (${list(gummy.map((c) => c.shortName))}). All ${COMPOUND_CANDIDATES.length} are food grade — the ones that weren't are already in the eliminated set.`,
          };
        })()
      : null,

  (q) =>
    /\b(eliminated|ruled out|removed|why.*(out|gone))\b/.test(q)
      ? {
          text: `${COMPOUND_ELIMINATED.length} compounds have been eliminated: ${list(
            COMPOUND_ELIMINATED.map((c) => c.shortName),
          )}. Both failed the food-grade criterion. ${SOURCE_ELIMINATED.length} natural sources are also out, mostly on GRAS status. You can restore any of them from the eliminated section if you disagree.`,
        }
      : null,

  (q) =>
    /\b(predicted compound|structural|fingerprint|bioavailab)/.test(q)
      ? {
          meta: `Read ${PREDICTED_COMPOUNDS.length} predicted compounds.`,
          text: `There are ${PREDICTED_COMPOUNDS.length} top predicted compounds, identified by structure rather than name since most aren't characterised. Fingerprint scores run from ${Math.min(
            ...PREDICTED_COMPOUNDS.map((c) => c.fingerprintScore),
          )} to ${Math.max(
            ...PREDICTED_COMPOUNDS.map((c) => c.fingerprintScore),
          )}. Predicted bioavailability is a range, not a point estimate — treat it as a screening signal, not a measurement.`,
        }
      : null,

  (q) =>
    /\bcompound/.test(q)
      ? {
          text: `${COMPOUND_CANDIDATES.length} compounds carry direct published evidence here: ${list(
            COMPOUND_CANDIDATES.map((c) => c.shortName),
          )}. A further ${COMPOUND_ELIMINATED.length} have been eliminated. Separately there are ${PREDICTED_COMPOUNDS.length} predicted compounds with no direct evidence yet.`,
        }
      : null,

  // — natural sources —
  (q) =>
    /\bgras\b|\bregulatory\b|\bsafe\b/.test(q)
      ? (() => {
          const all = [...SOURCE_CANDIDATES, ...SOURCE_ELIMINATED];
          const listed = all.filter((s) => s.grasStatus === "listed");
          const pending = all.filter((s) => s.grasStatus === "pending");
          const none = all.filter((s) => s.grasStatus === "no-entry");
          return {
            meta: `Checked GRAS status across ${all.length} natural sources.`,
            text: `Of ${all.length} sources, ${listed.length} are GRAS listed, ${none.length} have no entry, and ${pending.length} ${pending.length === 1 ? "is" : "are"} pending${
              pending.length ? ` (${list(pending.map((s) => s.commonName || s.scientificName))})` : ""
            }. No entry isn't the same as unsafe — it means nobody has filed. That's a cost-and-timeline question rather than a safety one.`,
          };
        })()
      : null,

  (q) =>
    /\b(source|plant|botanical|where.*(from|found))\b/.test(q)
      ? (() => {
          const top = [...SOURCE_CANDIDATES].sort(
            (a, b) => b.predictedCompoundsCount - a.predictedCompoundsCount,
          )[0];
          return {
            meta: `Read ${SOURCE_CANDIDATES.length} candidate sources.`,
            text: `${SOURCE_CANDIDATES.length} natural sources are still in consideration and ${SOURCE_ELIMINATED.length} are eliminated. ${
              top.commonName || top.scientificName
            } (${top.scientificName}) leads on predicted bioactives with ${n(
              top.predictedCompoundsCount,
            )} — well clear of the rest, which is worth knowing because it distorts the combination rankings.`,
          };
        })()
      : null,

  // — combinations —
  (q) =>
    /\b(combination|combo|mixture|pair|blend|formulat)/.test(q)
      ? (() => {
          const top = COMBINATIONS[0];
          const sourOrange = COMBINATIONS.filter((c) =>
            c.combinationLabel.toLowerCase().includes("sour orange"),
          );
          return {
            meta: `Ranked ${COMBINATIONS.length} combinations by combined predicted bioactives.`,
            text: `Top combination is ${top.combinationLabel} at ${n(
              top.combinedPredicted,
            )} combined predicted bioactives. Sour orange appears in ${sourOrange.length} of the ${COMBINATIONS.length}, which says more about its ${n(
              SOURCE_CANDIDATES.find((s) => s.commonName === "sour orange")
                ?.predictedCompoundsCount ?? 0,
            )} predicted count dominating the arithmetic than about it being the right ingredient ${sourOrange.length} times over. All ${COMBINATIONS.length} are GRAS on both halves.`,
          };
        })()
      : null,

  // — triage intent —
  (q) =>
    /\b(eliminate|remove|drop|rule out|restore|bring back)\b/.test(q)
      ? {
          text: "You can move rows in and out of the eliminated section directly in the table — the control is at the end of each row. I can't move them from here yet.",
        }
      : null,
];

/**
 * The shipped mock. `delayMs` exists so the pane's pending state is visible in
 * a prototype; a real responder's latency replaces it.
 */
export function createMockResponder({ delayMs = 450 } = {}): Responder {
  return async ({ input }) => {
    const q = input.toLowerCase().trim();
    const reply =
      RULES.reduce<ResponderReply | null>(
        (found, rule) => found ?? rule(q),
        null,
      ) ?? {
        text: "I can't answer that one from this project's data yet. What I can cover: the strategies and how they compare, the evidenced and predicted compounds, the natural sources and their GRAS status, the ranked combinations, and the project's goal, constraints and references.",
      };

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
    return reply;
  };
}
