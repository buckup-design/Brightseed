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
// Vertically centered at rest (stepIndex 0, or mid-"thinking" with no
// response text yet), matching the static Figma mock. It only slides down
// into the fixed-height/scrollable layout once the response actually
// starts revealing (revealedLineCount > 0) — not the instant the user
// sends — since a long response can run past the viewport and needs a
// bounded, internally-scrolling thread instead of pushing the composer
// off-screen. The slide itself is a flex-grow transition on two spacers
// (collapsing to 0 pushes the content up to the top) rather than an
// instant layout snap, since align-items can't be transitioned directly.
export default function WelcomeScreen() {
  useDemoScreenSync("welcome");
  const { chatFor, advance, isThinking, revealedLineCount, stepIndex } = useDemoScriptContext();
  const isCentered = stepIndex === 0 || revealedLineCount === 0;
  const spacerClass = "transition-[flex-grow] duration-500 ease-in-out";

  return (
    <div className="flex h-screen w-full bg-white text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 justify-center border-l border-border">
        <div className="flex h-full w-[600px] flex-col px-2">
          <div className={spacerClass} style={{ flexGrow: isCentered ? 1 : 0 }} />

          <div
            className={`flex min-h-0 flex-col gap-2 py-4 ${spacerClass}`}
            style={{ flexGrow: isCentered ? 0 : 1 }}
          >
            <ChatThread messages={chatFor("welcome")} isThinking={isThinking} revealedLineCount={revealedLineCount} />
            <ChatComposer onSubmit={advance} />
          </div>

          <div className={spacerClass} style={{ flexGrow: isCentered ? 1 : 0 }} />
        </div>
      </div>
    </div>
  );
}
