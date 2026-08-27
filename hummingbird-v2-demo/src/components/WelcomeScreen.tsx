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
export default function WelcomeScreen() {
  useDemoScreenSync("welcome");
  const { chatFor, advance } = useDemoScriptContext();

  return (
    <div className="flex h-screen w-full bg-white text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 items-center justify-center border-l border-border">
        <div className="flex w-[600px] flex-col gap-2 px-2">
          <ChatThread messages={chatFor("welcome")} />
          <ChatComposer onSubmit={advance} />
        </div>
      </div>
    </div>
  );
}
