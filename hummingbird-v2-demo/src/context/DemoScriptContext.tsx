import { createContext, useContext, type ReactNode } from "react";
import { DEMO_STEPS } from "../data/demoScript";
import { useDemoScript, type UseDemoScript } from "../hooks/useDemoScript";

const DemoScriptContext = createContext<UseDemoScript | null>(null);

export function DemoScriptProvider({ children }: { children: ReactNode }) {
  const script = useDemoScript(DEMO_STEPS);
  return <DemoScriptContext.Provider value={script}>{children}</DemoScriptContext.Provider>;
}

// Instantiated once above the three scripted routes (see main.tsx) so
// stepIndex survives client-side navigation between welcome/project/strategy
// with no state threaded through navigate().
export function useDemoScriptContext(): UseDemoScript {
  const context = useContext(DemoScriptContext);
  if (!context) {
    throw new Error("useDemoScriptContext must be used within a DemoScriptProvider");
  }
  return context;
}
