import { useLayoutEffect, useMemo, useState } from "react";
import {
  CHAT_THREAD_BY_SCREEN,
  type ChatTurn,
  type CombinationsCardData,
  type CompoundCategoryCardData,
  type DemoStep,
  type NaturalSourcesCardData,
  type PredictedCompoundsCardData,
  type ProjectContextPatch,
  type ScreenId,
  type StrategyCardData,
} from "../data/demoScript";
import type { TabId } from "../components/Header";

// How long the "thinking" indicator shows before an assistant response
// starts revealing, and how far apart each of its lines then appears —
// see the effect below. Lines are revealed one at a time on a real timer
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
  predictedCompoundsCards: PredictedCompoundsCardData[];
  naturalSourcesCard?: NaturalSourcesCardData;
  combinationsCard?: CombinationsCardData;
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

  const currentStep = script[stepIndex];
  const visibleSteps = useMemo(() => script.slice(0, stepIndex + 1), [script, stepIndex]);

  const advance = () => setStepIndex((current) => Math.min(current + 1, script.length - 1));

  // Drives the thinking -> reveal sequence for whichever step is current.
  // Deliberately a layout effect, not side effects stuffed inside the
  // setStepIndex updater above: React (in StrictMode) intentionally
  // invokes a functional setState updater twice per call to catch impure
  // updaters, which was silently double-scheduling/cancelling these timers
  // — an effect's setup/cleanup lifecycle is the correct, StrictMode-safe
  // place for this. It's a *layout* effect rather than a plain one so the
  // isThinking/revealedLineCount reset for a new step lands before the
  // browser paints — otherwise there'd be a one-frame flash of the previous
  // step's already-settled state (and, worse, foldSourceSteps below would
  // briefly fold the new step in a beat early). Skipped entirely for the
  // very first step (index 0): that one is present on load, not revealed by
  // a send.
  useLayoutEffect(() => {
    if (stepIndex === 0) return;

    const assistantMessage = currentStep.chat.assistantMessage;
    const lineCount = assistantMessage?.length ?? 0;
    // A loading segment (e.g. "Creating project…") IS the thinking
    // indicator, not a message that follows it: its text shows immediately,
    // right alongside the pulsing icon (see ChatThread — isThinking and
    // revealedLineCount are allowed to be true at the same time), holds for
    // THINKING_DURATION_MS, then the script moves itself on — no second
    // user send required.
    const hasLoadingSegment =
      assistantMessage?.some((item) => typeof item !== "string" && "loading" in item) ?? false;
    // A step that moves to a different screen than the one before it is a
    // navigation, not a reply the user is waiting on — Hummingbird doesn't
    // "think" before landing you on the new screen, it just shows what's
    // there. Skips straight to the (still per-line staggered) reveal.
    const previousStep = script[stepIndex - 1];
    const isScreenTransition = previousStep !== undefined && previousStep.screen !== currentStep.screen;
    setRevealedLineCount(0);

    if (lineCount === 0) {
      setIsThinking(false);
      return;
    }

    if (hasLoadingSegment) {
      setIsThinking(true);
      setRevealedLineCount(lineCount);
      const autoAdvanceTimeout = setTimeout(advance, THINKING_DURATION_MS);
      return () => clearTimeout(autoAdvanceTimeout);
    }

    const startRevealing = () => {
      let revealed = 0;
      const revealInterval = setInterval(() => {
        revealed += 1;
        setRevealedLineCount(revealed);
        if (revealed >= lineCount) clearInterval(revealInterval);
      }, LINE_REVEAL_INTERVAL_MS);
      return revealInterval;
    };

    if (isScreenTransition) {
      setIsThinking(false);
      const revealInterval = startRevealing();
      return () => clearInterval(revealInterval);
    }

    setIsThinking(true);
    let revealInterval: ReturnType<typeof setInterval> | undefined;
    const thinkingTimeout = setTimeout(() => {
      setIsThinking(false);
      revealInterval = startRevealing();
    }, THINKING_DURATION_MS);

    return () => {
      clearTimeout(thinkingTimeout);
      if (revealInterval) clearInterval(revealInterval);
    };
  }, [stepIndex, currentStep, script]);

  const chatFor = (screen: ScreenId): DemoChatMessage[] => {
    const threadId = CHAT_THREAD_BY_SCREEN[screen];
    return visibleSteps
      .filter((step) => CHAT_THREAD_BY_SCREEN[step.screen] === threadId)
      .map((step) => ({ stepId: step.id, turn: step.chat, isEntryPoint: step.id === script[0]?.id }));
  };

  // While the latest turn is still "thinking", the workspace hasn't caught
  // up to it yet — a tab switch or a new card (e.g. the Best combinations
  // table) should land at the same moment its message starts revealing, not
  // the instant the user sends/clicks. So while isThinking is true, fold as
  // if the current (last) step in visibleSteps hadn't happened yet; the
  // moment isThinking flips false (immediately for a screen transition,
  // after the delay otherwise — see the layout effect above), the current
  // step's patches land in the same beat the reveal starts.
  const foldSourceSteps = useMemo(() => {
    if (isThinking && stepIndex > 0) return visibleSteps.slice(0, -1);
    return visibleSteps;
  }, [visibleSteps, isThinking, stepIndex]);

  // Fold: scalar context fields shallow-merge (a step's absent keys keep the
  // prior value); array/name fields are last-write-wins whole replacements.
  // This is what lets a step only specify what actually changed.
  const folded = useMemo<FoldedProjectState>(() => {
    return foldSourceSteps.reduce<FoldedProjectState>(
      (acc, step) => ({
        context: { ...acc.context, ...step.contextPatch },
        strategyCards: step.strategyCards ?? acc.strategyCards,
        strategyName: step.strategyScreen?.strategyName ?? acc.strategyName,
        activeTab: step.strategyScreen?.activeTab ?? acc.activeTab,
        categoryCards: step.strategyScreen?.categoryCards ?? acc.categoryCards,
        predictedCompoundsCards: step.strategyScreen?.predictedCompoundsCards ?? acc.predictedCompoundsCards,
        naturalSourcesCard: step.strategyScreen?.naturalSourcesCard ?? acc.naturalSourcesCard,
        combinationsCard: step.strategyScreen?.combinationsCard ?? acc.combinationsCard,
      }),
      { context: {}, strategyCards: [], categoryCards: [], predictedCompoundsCards: [] }
    );
  }, [foldSourceSteps]);

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
