import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { ScreenId } from "../data/demoScript";
import { useDemoScriptContext } from "../context/DemoScriptContext";

/**
 * Navigates to whichever route the current script step belongs to whenever
 * it differs from the screen calling this hook — in either direction. A
 * step's own `screen` tag is the entire trigger, so the script can move
 * forward (welcome -> project -> strategy) or back (strategy -> project)
 * with no special-cased transition logic anywhere.
 */
export function useDemoScreenSync(screenId: ScreenId): void {
  const navigate = useNavigate();
  const { currentStep } = useDemoScriptContext();

  useEffect(() => {
    if (currentStep.screen !== screenId) {
      navigate(`/${currentStep.screen}`);
    }
  }, [currentStep.screen, screenId, navigate]);
}
