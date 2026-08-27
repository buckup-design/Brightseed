import Sidebar from "./Sidebar";
import ResizeHandle from "./ResizeHandle";
import ChatThread from "./ChatThread";
import ChatComposer from "./ChatComposer";
import ProjectHeaderBar from "./ProjectHeaderBar";
import ContextDrawer from "./ContextDrawer";
import StrategyCard from "./StrategyCard";
import { useResizableSplit } from "../hooks/useResizableSplit";
import { useDemoScreenSync } from "../hooks/useDemoScreenSync";
import { useDemoScriptContext } from "../context/DemoScriptContext";

export default function ProjectScreen() {
  useDemoScreenSync("project");
  const { chatFor, advance, folded } = useDemoScriptContext();
  const { leftWidth, containerRef, handleResize, reset } = useResizableSplit();

  return (
    <div className="flex h-screen w-full bg-white text-foreground">
      <Sidebar />

      <div ref={containerRef} className="flex min-w-0 flex-1">
        <div className="flex shrink-0 flex-col" style={{ width: leftWidth }}>
          <ChatThread messages={chatFor("project")} />
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
          <ProjectHeaderBar projectName={folded.context.projectName ?? "Untitled Project"} />
          <ContextDrawer context={folded.context} />

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
            {folded.strategyCards.map((card) => (
              <StrategyCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
