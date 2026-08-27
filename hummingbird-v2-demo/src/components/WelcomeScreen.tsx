import { useState } from "react";
import Sidebar from "./Sidebar";
import hummingbirdLogo from "../assets/hummingbird-logo.svg";

// Landing/new-chat screen — Figma "welcome screen"
// (https://www.figma.com/design/cSPnczZR5iL6tRLtwmHgoE/HB-2.0?node-id=130-80496).
// Sidebar is the same component the main app shell uses (see App.tsx); only
// the centered conversation pane is new. The Figma frame's own placeholder
// copy ("This is a text") is swapped for real Hummingbird-shaped content —
// a generic greeting plus the sample query from the live-app link Anna
// shared when this project kicked off (muscle health combos).
export default function WelcomeScreen() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex h-screen w-full bg-white text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 items-center justify-center border-l border-border">
        <div className="flex w-[600px] flex-col gap-2 px-2">
          <div className="flex w-full items-start gap-[10px]">
            <img src={hummingbirdLogo} alt="" className="size-10 shrink-0" />
            <p className="flex-1 text-sm leading-5 text-foreground">
              Hi! Ask Hummingbird about compounds, natural sources, or
              combinations for any health area.
            </p>
          </div>

          <div className="flex w-full items-center pl-11">
            <div className="flex flex-1 justify-end rounded-sm bg-muted p-2">
              <p className="flex-1 text-right text-sm leading-5 text-foreground">
                Show me combos for muscle health
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-1">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask Hummingbird"
              rows={2}
              className="min-h-16 w-full resize-none rounded-lg border border-input bg-white px-2.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
