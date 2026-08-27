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

export interface ChatTurn {
  /** Omitted on an assistant-only turn (e.g. an opening greeting). */
  userMessage?: string;
  /** One string per paragraph/bubble. Omitted on a user-only turn (the response comes in a later step). */
  assistantMessage?: string[];
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

export interface StrategyScreenPatch {
  strategyName?: string;
  activeTab?: TabId;
  /** Whole-array replace when present — not merged by id. */
  categoryCards?: CompoundCategoryCardData[];
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
    },
  },
  {
    id: "w2",
    screen: "welcome",
    chat: {
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
    id: "p0",
    screen: "project",
    chat: {
      assistantMessage: ["Here's the project so far, plus a first strategy worth exploring."],
    },
    contextPatch: {
      projectName: "Project Name",
      goal: "help active adults burn fat efficiently, sustain clean energy, and perform at their best—without the harsh stimulants, crash, or clinical aesthetic of traditional fat burners.",
      constraints: "drink or gummy desired but not required",
      referencesLabel: "view all 23 papers reviewed",
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
    ],
  },
  {
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
  },
  {
    id: "s0",
    screen: "strategy",
    chat: {
      assistantMessage: [
        "Diving into Strategy Name — here's what the candidate and eliminated compounds look like so far.",
      ],
    },
    strategyScreen: {
      strategyName: "Strategy Name",
      activeTab: "compounds",
      categoryCards: [
        {
          id: "fusion-inhibition-compounds",
          title: "Compounds targeting viral entry – fusion inhibition",
          candidates: [
            {
              id: "rosemarinic-acid",
              compoundName: "Rosemarinic Acid",
              evidenceContextLabel: "In vitro record, 2013",
              foodGrade: true,
              drink: true,
              gummy: false,
            },
            {
              id: "egcg",
              compoundName: "Epegallocatechin gallate (EGCG)",
              evidenceContextLabel: "in vitro record, 2020",
              foodGrade: true,
              drink: false,
              gummy: true,
            },
          ],
          eliminated: [
            {
              id: "oleanic-acid",
              compoundName: "Oleanic Acid",
              evidenceContextLabel: "in vitro record, 2013",
              foodGrade: false,
              drink: false,
              gummy: false,
            },
            {
              id: "berberine",
              compoundName: "Berberine",
              evidenceContextLabel: "in vitro record, 2020",
              foodGrade: false,
              drink: true,
              gummy: false,
            },
          ],
          referencesLabel: "view 6 relevant papers",
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
