import type { TabId } from "../components/Header";

// Scripted, non-functional demo: a fixed, editable sequence Anna authors and
// the app replays. Typing anything into any chat composer and hitting send
// always advances to the next step below, regardless of what was typed —
// see useDemoScript.ts. This file is the ONLY place the actual walkthrough
// content lives; everything else in the demo mechanism is generic.

export type ScreenId = "welcome" | "project" | "strategy";

// The single place that says which screens share a live conversation
// thread. Welcome + Project share "main" (the chat visibly carries over);
// Strategy gets its own "strategy" thread (starts fresh) — see
// CHAT_THREAD_BY_SCREEN's use in useDemoScript's chatStepsFor().
export const CHAT_THREAD_BY_SCREEN: Record<ScreenId, string> = {
  welcome: "main",
  project: "main",
  strategy: "strategy",
};

export interface AssistantTableSegment {
  table: {
    columns: string[];
    rows: string[][];
  };
}

// A "creating project…" style status line: it reads as pendingText for as
// long as its step is the latest turn, then flips to doneText the moment a
// later step has advanced past it — see ChatThread's isLast handling. No
// separate timer/state needed for the swap, it falls out of the same
// mechanism that already tracks "is this still the current turn."
export interface AssistantLoadingSegment {
  loading: {
    pendingText: string;
    doneText: string;
  };
}

// A response is a sequence of items, each one revealed as its own beat —
// see useDemoScript's revealedLineCount. Plain strings are the common case
// (one paragraph/bulleted line each, see ChatThread's AssistantLine); a
// table segment renders as a real HTML table instead of prose, for the
// rare response that needs one; a loading segment is a status line whose
// text changes once the script has moved on (see AssistantLoadingSegment).
export type AssistantMessageItem = string | AssistantTableSegment | AssistantLoadingSegment;

export interface ChatTurn {
  /** Omitted on an assistant-only turn (e.g. an opening greeting). */
  userMessage?: string;
  /** One item per paragraph/bulleted line/table. Omitted on a user-only turn (the response comes in a later step). */
  assistantMessage?: AssistantMessageItem[];
}

export interface ProjectContextPatch {
  projectName?: string;
  goal?: string;
  constraints?: string;
  referencesLabel?: string;
}

export interface StrategyCardData {
  id: string;
  name: string;
  approach: string;
  evidencedCompounds: number;
  predictedCompounds: number;
  totalCompounds: number;
  referencesLabel: string;
}

export interface CompoundRow {
  id: string;
  compoundName: string;
  evidenceContextLabel: string;
  foodGrade: boolean;
  drink: boolean;
  gummy: boolean;
}

export interface CompoundCategoryCardData {
  id: string;
  title: string;
  candidates: CompoundRow[];
  eliminated: CompoundRow[];
  referencesLabel: string;
}

// A different shape from CompoundRow — model-predicted rather than
// evidence-backed, so it has no food-grade/drink/gummy columns, only ever
// a Candidates list (no Eliminated), and its own scoring columns instead.
export interface PredictedCompoundRow {
  id: string;
  structuralIdentifier: string;
  predictedAssociation: string;
  fingerprintScore: number;
  chemicalGrouping: string;
  /** A single value ("0.63") or a range ("0.37–0.78"); kept as text, not parsed. */
  predictedBioavailability: string;
  /** The source screenshot bolds a couple of standout bioavailability values — preserve that signal. */
  highlightBioavailability?: boolean;
}

export interface PredictedCompoundsCardData {
  id: string;
  title: string;
  candidates: PredictedCompoundRow[];
}

export interface StrategyScreenPatch {
  strategyName?: string;
  activeTab?: TabId;
  /** Whole-array replace when present — not merged by id. */
  categoryCards?: CompoundCategoryCardData[];
  /** Whole-array replace when present — not merged by id. Rendered below categoryCards. */
  predictedCompoundsCards?: PredictedCompoundsCardData[];
}

export interface DemoStep {
  id: string;
  screen: ScreenId;
  chat: ChatTurn;
  /** Shallow-merged into an accumulator — omitted keys keep their last value. */
  contextPatch?: ProjectContextPatch;
  /** Whole-array replace when present — not merged by id. */
  strategyCards?: StrategyCardData[];
  strategyScreen?: StrategyScreenPatch;
}

// PLACEHOLDER CONTENT — sourced directly from the Figma reference frames
// (node 130:80496, 131:83040, 133:88281) so it's visually checkable against
// the design, not because it's the real walkthrough copy. Anna replaces
// this with the actual script.
export const DEMO_STEPS: DemoStep[] = [
  {
    id: "w0",
    screen: "welcome",
    chat: {
      assistantMessage: [
        "I’m Hummingbird, your agent for product concept creation. I can help you design natural health products, guiding your selection of science-backed ingredients or identifying health benefit opportunities for specific plants.",
        "You can always ask me questions about my capabilities.",
        "Let’s start your first project.",
      ],
    },
  },
  {
    id: "w1",
    screen: "welcome",
    chat: {
      userMessage: "I want to develop a supplement that supports resistance to viral infection.",
      assistantMessage: [
        "There are over 800 compounds in the database for resistance to viral infections. Biological pathways you might consider are:",
        "1. Block viral entry or membrane fusion",
        "- Multiple in-vitro records link inhibition of viral fusion with reduced viral replication.",
        "2. Target viral replication enzymes",
        "- Reported targets include:",
        "  - Polymerase",
        "  - Reverse transcriptase",
        "  - HIV-1/retroviral protease",
        "  - Integrase",
        "  - Neuraminidase",
        "- These are direct viral-life-cycle targets, rather than general immune-support pathways.",
        "3. Modulate inflammatory signaling—especially NF-κB and cytokines",
        "- Records repeatedly involve reduced NF-κB, IL-6, IL-1β, and sometimes TNF-related signaling. This may be relevant to limiting infection-associated inflammatory injury, but it is not equivalent to broadly “boosting” immunity.",
        "4. Regulate oxidative-stress and apoptosis pathways",
        "- The data include modulation of ROS accumulation, p53, BAX, BCL-2, and caspase-3 in association with lower viral load in experimental settings.",
        "5. Modulate PI3K/AKT/mTOR and AMPK-linked signaling",
        "- Some entries connect reduced PI3K/AKT/mTOR signaling or increased AMPK activity with antiviral outcomes. These pathways have broad cellular roles, so they are less specific targets than viral enzymes or entry mechanisms.",
        "6. Support mitochondrial quality-control signaling",
        "- A small number of records associate SIRT1 and PINK1/Parkin-related signaling with reduced viral replication, though these findings are experimental.",
        "The records behind these pathway links are predominantly in-vitro or animal studies; they should be viewed as mechanistic hypotheses and early evidence, not proof of improved resistance to viral infections in people. The clearest mechanistic categories are viral entry/fusion and viral replication enzymes.",
        "I can answer any follow up questions about these pathways, or narrow them down for you. Since viral entry/fusion has the most robust supporting evidence, and the compound space is broad, I recommend looking into compounds that may both block viral entry and target one of the additional pathways outlined.",
      ],
    },
  },
  {
    id: "w2",
    screen: "welcome",
    chat: {
      userMessage: "Help me choose a secondary target.",
      assistantMessage: [
        {
          table: {
            columns: ["Secondary target/pathway", "Why it may be complementary", "Example compounds represented in KB", "Evidence context"],
            rows: [
              ["Viral polymerase inhibition", "Targets viral genome replication after entry.", "Beta-sitosterol; fisetin", "Primarily animal/in-vitro records"],
              ["Neuraminidase inhibition", "Targets a viral life-cycle enzyme associated with viral release/spread.", "Curcumin", "In-vitro records"],
              ["Viral protease inhibition — including HIV-1 and retroviral protease", "Targets viral protein processing and maturation.", "Hinnuliquinone; carvacrol; curcumin", "In-vitro records"],
              ["Integrase / reverse-transcriptase inhibition", "Relevant to retroviral replication steps.", "Curcumin; myricetin", "In-vitro records"],
              ["NF-κB and pro-inflammatory cytokines — IL-6, IL-1β, TNF-related signaling", "May address infection-associated inflammatory signaling or tissue injury rather than directly blocking viral entry.", "Curcumin; ergosterol peroxide; others", "Mostly in-vitro/animal evidence"],
              ["PI3K–AKT–mTOR signaling", "A host-cell signaling axis linked in KB mechanisms to antiviral outcomes; best considered a host-pathway hypothesis rather than a virus-specific target.", "Myricetin; curcumin", "In-vitro records"],
              ["AMPK signaling", "Appears in a fusion/replication-related mechanism record and may be a complementary host-pathway angle.", "Tangeretin", "In-vitro / mouse-associated record"],
              ["Oxidative-stress and cell-survival pathways — ROS, p53, BAX/BCL-2, caspase-3", "Associated with reduced viral load in a curated experimental mechanism; potentially relevant to infected-cell stress and apoptosis.", "Ergosterol peroxide", "In-vitro record"],
              ["SIRT1 / PINK1–Parkin mitochondrial quality-control signaling", "Linked to reduced viral replication in a predicted-inclusive mechanism record.", "Pterostilbene", "In-vitro / mouse-associated record"],
            ],
          },
        },
        "I would prioritize pairings such as:",
        "1. Fusion inhibition + polymerase inhibition — entry plus replication. (7 directly evidenced compounds, 1,241 predictions)",
        "2. Fusion inhibition + neuraminidase inhibition — entry plus release/spread. (6 directly evidenced compounds, 1,085 predictions)",
        "3. Fusion inhibition + viral protease inhibition — entry plus viral protein maturation. (9 directly evidenced compounds, 1,147 predictions)",
        "4. Fusion inhibition + NF-κB/cytokine modulation — viral-life-cycle targeting plus a host inflammatory-response angle. (117 directly evidenced compounds, 6,902 predictions)",
        "5. Fusion inhibition + PI3K/AKT/mTOR or AMPK modulation — a host-cell pathway hypothesis, but less virus-specific. (76 directly evidenced compounds, 4,930 predictions)",
        "Caution: these are knowledge-base mechanistic associations, and the supporting records are predominantly in vitro or animal studies. They do not establish that targeting these pathways prevents viral infection in people.",
        "If this looks like a good solution space for us to explore, just say “GO” and I’ll kick off a project workspace for you.",
      ],
    },
  },
  {
    id: "w3",
    screen: "welcome",
    chat: {
      userMessage: "GO",
      // Wrapped in "*…*" — AssistantLine renders a plain string bounded by
      // asterisks as an italicized status line (see ChatThread.tsx). Once
      // this step is no longer the latest turn (the moment p0 auto-advances
      // in below), the bubble flips from pendingText to doneText in place.
      assistantMessage: [
        {
          loading: {
            pendingText: "*Creating project...*",
            doneText: "*Project Created*",
          },
        },
      ],
    },
  },
  {
    id: "p0",
    screen: "project",
    chat: {
      assistantMessage: [
        "Great! Here’s your new project workspace. I’ve given it a name, but you can change that at any time. The top panel includes important context and requirements for the project that I’ve pulled out of our conversation. It also holds a citations list that you can access at any time for the full set of literature I’ve consulted.",
        "Do you have any additional hard constraints on this project – like a desired product format or target population?",
      ],
    },
    contextPatch: {
      projectName: "Immunity supplement",
      goal: "support resistance to viral infection",
      constraints: "none",
      referencesLabel: "view all 23 papers reviewed",
    },
    // Same 5 pairings + stats introduced back in w2's table/list.
    strategyCards: [
      {
        id: "fusion-polymerase",
        name: "Fusion inhibition + polymerase inhibition",
        approach: "Entry plus replication: targets viral genome replication after entry.",
        evidencedCompounds: 7,
        predictedCompounds: 1241,
        totalCompounds: 1248,
        referencesLabel: "view 6 relevant papers",
      },
      {
        id: "fusion-neuraminidase",
        name: "Fusion inhibition + neuraminidase inhibition",
        approach: "Entry plus release/spread: targets a viral life-cycle enzyme associated with viral release and spread.",
        evidencedCompounds: 6,
        predictedCompounds: 1085,
        totalCompounds: 1091,
        referencesLabel: "view 6 relevant papers",
      },
      {
        id: "fusion-protease",
        name: "Fusion inhibition + viral protease inhibition",
        approach: "Entry plus viral protein maturation: targets viral protein processing and maturation.",
        evidencedCompounds: 9,
        predictedCompounds: 1147,
        totalCompounds: 1156,
        referencesLabel: "view 6 relevant papers",
      },
      {
        id: "fusion-nfkb",
        name: "Fusion inhibition + NF-κB/cytokine modulation",
        approach:
          "Viral-life-cycle targeting plus a host inflammatory-response angle: may address infection-associated inflammatory signaling or tissue injury rather than directly blocking viral entry.",
        evidencedCompounds: 117,
        predictedCompounds: 6902,
        totalCompounds: 7019,
        referencesLabel: "view 6 relevant papers",
      },
      {
        id: "fusion-pi3k-ampk",
        name: "Fusion inhibition + PI3K/AKT/mTOR or AMPK modulation",
        approach: "A host-cell pathway hypothesis, but less virus-specific — linked to antiviral outcomes via host-cell signaling axes.",
        evidencedCompounds: 76,
        predictedCompounds: 4930,
        totalCompounds: 5006,
        referencesLabel: "view 6 relevant papers",
      },
    ],
  },
  {
    id: "p1",
    screen: "project",
    chat: {
      userMessage: "Not targeting a specific population yet. I’d like the product to be a drink or gummy, but I’m open to other formats.",
      assistantMessage: [
        "Got it. Added that to your requirements. Go ahead and choose a strategy you’d like to explore. We’ll review each one until you’ve found a solution that works for you.",
      ],
    },
    contextPatch: {
      constraints: "drink or gummy desired but not required",
    },
  },
  {
    id: "s0",
    screen: "strategy",
    chat: {
      assistantMessage: [
        "I’ve eliminated for you the compounds that don’t meet my criteria for food grade. If you want to refine that criteria, just ask and I’ll add it to the project’s context.",
        "You can drill into any compound for more information, or ask me questions about them. You can also remove any compounds from the candidates list that you don't want to include. I'll keep track of them in the eliminated list below.",
        "I’ve also listed the top predicted compound candidates, along with prediction score and predicted bioavailabilty. You can do the same things with those.",
        "When you’re ready, I can suggest some natural sources.",
      ],
    },
    strategyScreen: {
      strategyName: "Fusion inhibition + polymerase inhibition",
      activeTab: "compounds",
      categoryCards: [
        {
          id: "fusion-inhibition-compounds",
          title: "Compounds with direct evidence",
          candidates: [
            {
              id: "rosmarinic-acid",
              compoundName: "Rosmarinic acid",
              evidenceContextLabel: "In-vitro / mouse-associated record; 2019",
              foodGrade: true,
              drink: true,
              gummy: false,
            },
            {
              id: "egcg",
              compoundName: "Epigallocatechin gallate (EGCG)",
              evidenceContextLabel: "In-vitro record; 2021",
              foodGrade: true,
              drink: false,
              gummy: true,
            },
            {
              id: "tangeretin",
              compoundName: "Tangeretin",
              evidenceContextLabel: "In-vitro / mouse-associated record; 2018",
              foodGrade: true,
              drink: true,
              gummy: true,
            },
            {
              id: "beta-sitosterol",
              compoundName: "Beta-sitosterol",
              // "Curated target label" from Anna's second screenshot
              // ("Decreases polymerase") dropped — no column for it, and not
              // folded into evidence context either.
              evidenceContextLabel: "Animal record, 2022; 50 mg/kg reported",
              foodGrade: true,
              drink: false,
              gummy: false,
            },
            {
              id: "fisetin",
              compoundName: "Fisetin",
              evidenceContextLabel: "In-vitro record, 2025",
              foodGrade: true,
              drink: true,
              gummy: false,
            },
          ],
          eliminated: [
            {
              id: "oleanolic-acid",
              compoundName: "Oleanolic acid",
              evidenceContextLabel: "In-vitro record; 2013",
              foodGrade: false,
              drink: false,
              gummy: false,
            },
            {
              id: "berberine",
              compoundName: "Berberine",
              evidenceContextLabel: "In-vitro record; 2020",
              foodGrade: false,
              drink: true,
              gummy: false,
            },
          ],
          referencesLabel: "view 6 relevant papers",
        },
      ],
      // From Anna's screenshot: model-predicted candidates, ranked by
      // fingerprint score. All candidates (no eliminated list) — see
      // PredictedCompoundRow.
      predictedCompoundsCards: [
        {
          id: "top-predicted-compounds",
          title: "Top predicted compounds",
          candidates: [
            { id: "ulsuxbhsysgdt", structuralIdentifier: "ULSUXBHSYSGDT", predictedAssociation: "Fusion inhibition", fingerprintScore: 5.0, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.85", highlightBioavailability: true },
            { id: "kzjwdpnrjallns", structuralIdentifier: "KZJWDPNRJALLNS", predictedAssociation: "Decreases polymerase", fingerprintScore: 5.0, chemicalGrouping: "Steroids", predictedBioavailability: "0.37–0.78" },
            { id: "mijyxulnpsfwek", structuralIdentifier: "MIJYXULNPSFWEK", predictedAssociation: "Fusion inhibition", fingerprintScore: 5.0, chemicalGrouping: "Triterpenoids", predictedBioavailability: "0.54–0.74" },
            { id: "ybhilyktiriute", structuralIdentifier: "YBHILYKTIRIUTE", predictedAssociation: "Fusion inhibition", fingerprintScore: 5.0, chemicalGrouping: "Tyrosine alkaloids", predictedBioavailability: "0.51–0.65" },
            { id: "xhefdibzljxqhf", structuralIdentifier: "XHEFDIBZLJXQHF", predictedAssociation: "Polymerase inhibition", fingerprintScore: 5.0, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.37–0.48" },
            { id: "doumfzqkyfqntf", structuralIdentifier: "DOUMFZQKYFQNTF", predictedAssociation: "Fusion inhibition", fingerprintScore: 5.0, chemicalGrouping: "Phenylpropanoids", predictedBioavailability: "0.38–0.42*" },
            { id: "wmbwrepuvvbilr", structuralIdentifier: "WMBWREPUVVBILR", predictedAssociation: "Fusion inhibition", fingerprintScore: 5.0, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.31–0.37" },
            { id: "vkjgbajnnalvav", structuralIdentifier: "VKJGBAJNNALVAV", predictedAssociation: "Fusion inhibition", fingerprintScore: 3.2, chemicalGrouping: "Tyrosine alkaloids", predictedBioavailability: "0.46–0.68" },
            { id: "lshvyafmtmfkba", structuralIdentifier: "LSHVYAFMTMFKBA", predictedAssociation: "Fusion inhibition", fingerprintScore: 3.083, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.34–0.41" },
            { id: "sgnbvlswzmbqth", structuralIdentifier: "SGNBVLSWZMBQTH", predictedAssociation: "Decreases polymerase", fingerprintScore: 2.583, chemicalGrouping: "Steroids", predictedBioavailability: "0.38–0.71" },
            { id: "oselkochbmdkej", structuralIdentifier: "OSELKOCHBMDKEJ", predictedAssociation: "Decreases polymerase", fingerprintScore: 2.558, chemicalGrouping: "Steroids", predictedBioavailability: "0.34–0.78" },
            { id: "hcxvjbmsmiarin", structuralIdentifier: "HCXVJBMSMIARIN", predictedAssociation: "Decreases polymerase", fingerprintScore: 2.45, chemicalGrouping: "Steroids", predictedBioavailability: "0.32–0.72" },
            { id: "sdzpynmxguhfmz", structuralIdentifier: "SDZPYNMXGUHFMZ", predictedAssociation: "Fusion inhibition", fingerprintScore: 2.283, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.39–0.41" },
            { id: "ghgkplpbpgysoo", structuralIdentifier: "GHGKPLPBPGYSOO", predictedAssociation: "Decreases polymerase", fingerprintScore: 2.081, chemicalGrouping: "Steroids", predictedBioavailability: "0.70–0.71" },
            { id: "jzfsmvxquwrsiw", structuralIdentifier: "JZFSMVXQUWRSIW", predictedAssociation: "Fusion inhibition", fingerprintScore: 2.023, chemicalGrouping: "Triterpenoids", predictedBioavailability: "0.62–0.66" },
            { id: "qgosjbzftwgwdu", structuralIdentifier: "QGOSJBZFTWGWDU", predictedAssociation: "Fusion inhibition", fingerprintScore: 2.011, chemicalGrouping: "Triterpenoids", predictedBioavailability: "0.63" },
            { id: "hvywmomldimfja", structuralIdentifier: "HVYWMOMLDIMFJA", predictedAssociation: "Decreases polymerase", fingerprintScore: 1.972, chemicalGrouping: "Steroids", predictedBioavailability: "0.37–0.79" },
            { id: "mriaqlrqzppods", structuralIdentifier: "MRIAQLRQZPPODS", predictedAssociation: "Fusion inhibition", fingerprintScore: 1.946, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.88", highlightBioavailability: true },
            { id: "xhalvrqbzgzhfe", structuralIdentifier: "XHALVRQBZGZHFE", predictedAssociation: "Fusion inhibition", fingerprintScore: 1.867, chemicalGrouping: "Phenylpropanoids", predictedBioavailability: "0.40–0.55" },
            { id: "bxpbsbbfpntfft", structuralIdentifier: "BXPBSBBFPNTFFT", predictedAssociation: "Polymerase inhibition", fingerprintScore: 1.813, chemicalGrouping: "Flavonoids", predictedBioavailability: "0.39–0.49" },
          ],
        },
      ],
    },
  },
  {
    id: "s1",
    screen: "strategy",
    chat: {
      userMessage: "Why were some compounds eliminated?",
      assistantMessage: [
        "Mostly delivery-format mismatches — see the Eliminated table below for the specifics.",
      ],
    },
  },
  {
    id: "p2",
    screen: "project",
    chat: {
      userMessage: "Let's go back and compare the two strategies.",
      assistantMessage: ["Back on the project — here's Strategy Name alongside the other option again."],
    },
  },
];

// PARKED — not part of DEMO_STEPS, so it can never be silently reached by
// advance(). This was step p1, sitting between p0 and s0, before the
// project screen's drill-in became a strategy-card click (which jumps
// straight from p0 into s0). Keeping the shape here in case a later turn
// wants to reintroduce a second-strategy comparison; wire it back into
// DEMO_STEPS with real content when that's ready, not this placeholder data.
export const PARKED_STEP_P1: DemoStep = {
  id: "p1",
  screen: "project",
  chat: {
    userMessage: "What's another angle worth exploring?",
    assistantMessage: ["Here's a second strategy for comparison."],
  },
  strategyCards: [
    {
      id: "fusion-inhibition",
      name: "Strategy Name",
      approach: "Paragraph long description of the strategy. Explain the science concisely, identify pathways of interest.",
      evidencedCompounds: 7,
      predictedCompounds: 1241,
      totalCompounds: 1248,
      referencesLabel: "view 6 relevant papers",
    },
    {
      id: "alternate-strategy",
      name: "Alternate Strategy",
      approach: "Paragraph long description of the alternate strategy. Explain the science concisely, identify pathways of interest.",
      evidencedCompounds: 3,
      predictedCompounds: 512,
      totalCompounds: 515,
      referencesLabel: "view 4 relevant papers",
    },
  ],
};
