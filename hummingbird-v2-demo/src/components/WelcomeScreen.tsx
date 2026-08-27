import Sidebar from "./Sidebar";
import ChatThread from "./ChatThread";
import ChatComposer from "./ChatComposer";
import { useDemoScreenSync } from "../hooks/useDemoScreenSync";
import { useDemoScriptContext } from "../context/DemoScriptContext";

// Landing/new-chat screen — Figma "welcome screen"
// (https://www.figma.com/design/cSPnczZR5iL6tRLtwmHgoE/HB-2.0?node-id=130-80496).
// Sidebar is the same component the main app shell uses; the centered
// conversation pane now plays the scripted demo (see src/data/demoScript.ts)
// instead of a hardcoded greeting + fake bubble.
//
// Before any input (stepIndex 0 — just the opening greeting), the column is
// vertically centered, matching the static Figma mock. Once the user sends
// anything, the script's assistant responses can run long, so the layout
// switches to a fixed-height, top-anchored column with the thread scrolling
// internally — otherwise a long response would grow the page and push the
// composer off-screen.
export default function WelcomeScreen() {
  useDemoScreenSync("welcome");
  const { chatFor, advance, isThinking, stepIndex } = useDemoScriptContext();
  const isInitial = stepIndex === 0;

  return (
    <div className="flex h-screen w-full bg-white text-foreground">
      <Sidebar />

      <div
        className={`flex min-w-0 flex-1 justify-center border-l border-border ${isInitial ? "items-center" : ""}`}
      >
        <div className={`flex w-[600px] flex-col gap-2 px-2 ${isInitial ? "" : "h-full py-4"}`}>
          <ChatThread messages={chatFor("welcome")} isThinking={isThinking} />
          <ChatComposer onSubmit={advance} />
        </div>
      </div>
    </div>
  );
}
