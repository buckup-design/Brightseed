import Sidebar from "./Sidebar";
import ChatThread from "./ChatThread";
import ChatComposer from "./ChatComposer";
import { useDemoScreenSync } from "../hooks/useDemoScreenSync";
import { useDemoScriptContext } from "../context/DemoScriptContext";

// Landing/new-chat screen — Figma "welcome screen"
// (https://www.figma.com/design/cSPnczZR5iL6tRLtwmHgoE/HB-2.0?node-id=130-80496).
// Sidebar is the same component the main app shell uses; the centered
// conversation pane now plays the scripted demo (see src/data/demoScript.ts)
// instead of a hardcoded greeting + fake bubble. The column is only
// horizontally centered (not vertically, unlike the original static Figma
// mock) — the script's assistant responses can run long, so the thread
// needs a bounded height to scroll within rather than growing the page and
// pushing the composer off-screen.
export default function WelcomeScreen() {
  useDemoScreenSync("welcome");
  const { chatFor, advance, isThinking } = useDemoScriptContext();

  return (
    <div className="flex h-screen w-full bg-white text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 justify-center border-l border-border">
        <div className="flex h-full w-[600px] flex-col gap-2 px-2 py-4">
          <ChatThread messages={chatFor("welcome")} isThinking={isThinking} />
          <ChatComposer onSubmit={advance} />
        </div>
      </div>
    </div>
  );
}
