import { useMemo, useState } from "react";
import {
  CHAT_THREAD_BY_SCREEN,
  type ChatTurn,
  type CompoundCategoryCardData,
  type DemoStep,
  type ProjectContextPatch,
  type ScreenId,
  type StrategyCardData,
} from "../data/demoScript";
import type { TabId } from "../components/Header";

export interface DemoChatMessage {
  stepId: string;
  turn: ChatTurn;
}

export interface FoldedProjectState {
  context: ProjectContextPatch;
  strategyCards: StrategyCardData[];
  strategyName?: string;
  activeTab?: TabId;
  categoryCards: CompoundCategoryCardData[];
}

export interface UseDemoScript {
  stepIndex: number;
  currentStep: DemoStep;
  visibleSteps: DemoStep[];
  isComplete: boolean;
  /** Ignores whatever was actually typed — always plays the next step. */
  advance: () => void;
  /** Chat bubbles for the thread `screen` belongs to (see CHAT_THREAD_BY_SCREEN). */
  chatFor: (screen: ScreenId) => DemoChatMessage[];
  /** Everything Project/Strategy screens read, folded up to the current step. */
  folded: FoldedProjectState;
}

export function useDemoScript(script: DemoStep[]): UseDemoScript {
  const [stepIndex, setStepIndex] = useState(0);

  const currentStep = script[stepIndex];
  const visibleSteps = useMemo(() => script.slice(0, stepIndex + 1), [script, stepIndex]);

  const advance = () => setStepIndex((i) => Math.min(i + 1, script.length - 1));

  const chatFor = (screen: ScreenId): DemoChatMessage[] => {
    const threadId = CHAT_THREAD_BY_SCREEN[screen];
    return visibleSteps
      .filter((step) => CHAT_THREAD_BY_SCREEN[step.screen] === threadId)
      .map((step) => ({ stepId: step.id, turn: step.chat }));
  };

  // Fold: scalar context fields shallow-merge (a step's absent keys keep the
  // prior value); array/name fields are last-write-wins whole replacements.
  // This is what lets a step only specify what actually changed.
  const folded = useMemo<FoldedProjectState>(() => {
    return visibleSteps.reduce<FoldedProjectState>(
      (acc, step) => ({
        context: { ...acc.context, ...step.contextPatch },
        strategyCards: step.strategyCards ?? acc.strategyCards,
        strategyName: step.strategyScreen?.strategyName ?? acc.strategyName,
        activeTab: step.strategyScreen?.activeTab ?? acc.activeTab,
        categoryCards: step.strategyScreen?.categoryCards ?? acc.categoryCards,
      }),
      { context: {}, strategyCards: [], categoryCards: [] }
    );
  }, [visibleSteps]);

  return {
    stepIndex,
    currentStep,
    visibleSteps,
    isComplete: stepIndex >= script.length - 1,
    advance,
    chatFor,
    folded,
  };
}
