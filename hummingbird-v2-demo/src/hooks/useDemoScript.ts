import { useEffect, useMemo, useRef, useState } from "react";
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

// How long the "thinking" indicator shows before an assistant response
// starts revealing, and how far apart each of its lines then appears —
// see advance() below. Lines are revealed one at a time on a real timer
// (not just a CSS animation-delay on an already-inserted block) so a
// short response is still visibly "typed in", not just a quick flash.
const THINKING_DURATION_MS = 5000;
const LINE_REVEAL_INTERVAL_MS = 280;

export interface DemoChatMessage {
  stepId: string;
  turn: ChatTurn;
  /** True only for the very first step of the whole script — present on
   *  load, before any input, so it renders statically (no entrance
   *  animation) instead of like a just-arrived response. */
  isEntryPoint: boolean;
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
  /** True for THINKING_DURATION_MS right after advancing into a step that has an assistant response. */
  isThinking: boolean;
  /** How many lines of the CURRENT (latest) step's response have appeared so far. Irrelevant to every earlier, already-settled turn. */
  revealedLineCount: number;
}

export function useDemoScript(script: DemoStep[]): UseDemoScript {
  const [stepIndex, setStepIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [revealedLineCount, setRevealedLineCount] = useState(0);
  const thinkingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (thinkingTimeout.current) clearTimeout(thinkingTimeout.current);
    if (revealInterval.current) clearInterval(revealInterval.current);
  };

  useEffect(() => clearTimers, []);

  const currentStep = script[stepIndex];
  const visibleSteps = useMemo(() => script.slice(0, stepIndex + 1), [script, stepIndex]);

  const advance = () => {
    setStepIndex((current) => {
      const next = Math.min(current + 1, script.length - 1);
      const nextStep = script[next];
      const lineCount = nextStep.chat.assistantMessage?.length ?? 0;

      clearTimers();
      setRevealedLineCount(0);

      if (lineCount > 0) {
        setIsThinking(true);
        thinkingTimeout.current = setTimeout(() => {
          setIsThinking(false);
          let revealed = 0;
          revealInterval.current = setInterval(() => {
            revealed += 1;
            setRevealedLineCount(revealed);
            if (revealed >= lineCount && revealInterval.current) {
              clearInterval(revealInterval.current);
            }
          }, LINE_REVEAL_INTERVAL_MS);
        }, THINKING_DURATION_MS);
      } else {
        setIsThinking(false);
      }

      return next;
    });
  };

  const chatFor = (screen: ScreenId): DemoChatMessage[] => {
    const threadId = CHAT_THREAD_BY_SCREEN[screen];
    return visibleSteps
      .filter((step) => CHAT_THREAD_BY_SCREEN[step.screen] === threadId)
      .map((step) => ({ stepId: step.id, turn: step.chat, isEntryPoint: step.id === script[0]?.id }));
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
    isThinking,
    revealedLineCount,
  };
}
