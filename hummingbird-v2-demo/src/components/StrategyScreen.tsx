import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import ResizeHandle from "./ResizeHandle";
import ChatThread from "./ChatThread";
import ChatComposer from "./ChatComposer";
import ProjectHeaderBar from "./ProjectHeaderBar";
import ContextDrawer from "./ContextDrawer";
import Header, { type TabId } from "./Header";
import CompoundCategoryCard from "./CompoundCategoryCard";
import PredictedCompoundsCard from "./PredictedCompoundsCard";
import NaturalSourcesTable from "./NaturalSourcesTable";
import { useResizableSplit } from "../hooks/useResizableSplit";
import { useDemoScreenSync } from "../hooks/useDemoScreenSync";
import { useDemoScriptContext } from "../context/DemoScriptContext";

export default function StrategyScreen() {
  useDemoScreenSync("strategy");
  const { chatFor, advance, folded, isThinking, revealedLineCount } = useDemoScriptContext();
  const { leftWidth, containerRef, handleResize, reset } = useResizableSplit();

  // The tab bar stays genuinely clickable between script beats — a local
  // override only resets when a step explicitly sets a new activeTab, so a
  // manual click doesn't get silently fought by the script on every render.
  const scriptTab = folded.activeTab;
  const [tabOverride, setTabOverride] = useState<TabId | null>(null);
  const lastScriptTab = useRef(scriptTab);
  useEffect(() => {
    if (scriptTab !== lastScriptTab.current) {
      setTabOverride(null);
      lastScriptTab.current = scriptTab;
    }
  }, [scriptTab]);
  const activeTab = tabOverride ?? scriptTab ?? "compounds";

  return (
    <div className="flex h-screen w-full bg-white text-foreground">
      <Sidebar />

      <div ref={containerRef} className="flex min-w-0 flex-1">
        <div className="flex shrink-0 flex-col" style={{ width: leftWidth }}>
          <ChatThread messages={chatFor("strategy")} isThinking={isThinking} revealedLineCount={revealedLineCount} />
          <ChatComposer onSubmit={advance} />
          <footer className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>© 2026 Brightseed. All rights reserved.</span>
            <span className="rounded-full border border-border bg-muted px-2 py-0.5 font-medium text-foreground">
              v2.0
            </span>
          </footer>
        </div>

        <ResizeHandle onResize={handleResize} onReset={reset} />

        <div className="flex min-w-0 flex-1 flex-col">
          <ProjectHeaderBar
            projectName={folded.context.projectName ?? "Untitled Project"}
            strategyName={folded.strategyName ?? "Untitled Strategy"}
          />
          <ContextDrawer context={folded.context} />
          <Header
            activeTab={activeTab}
            onTabChange={setTabOverride}
            hideSourcesTab={!folded.naturalSourcesCard}
          />

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {activeTab === "compounds" ? (
              <>
                {folded.categoryCards.map((card) => (
                  <CompoundCategoryCard key={card.id} card={card} />
                ))}
                {folded.predictedCompoundsCards.map((card) => (
                  <PredictedCompoundsCard key={card.id} card={card} />
                ))}
              </>
            ) : folded.naturalSourcesCard ? (
              <div className="rounded-xl border border-border bg-card p-4 shadow-xs">
                <NaturalSourcesTable card={folded.naturalSourcesCard} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No Natural Sources content in this script yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
