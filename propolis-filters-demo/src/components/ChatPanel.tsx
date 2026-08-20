import { useState } from "react";
import hummingbirdLogo from "../assets/hummingbird-logo.svg";

export default function ChatPanel() {
  const [message, setMessage] = useState("");

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1" />
      <div className="flex flex-col gap-6 px-2 pb-4">
        <div className="flex gap-3 px-2">
          <img src={hummingbirdLogo} alt="" className="size-[26px] shrink-0" />
          <div className="flex flex-col gap-3 pt-1 text-sm leading-6 text-foreground">
            <p>
              Here is a demo of the filters available on any set of
              compounds. It is for demonstration only; some data is not
              accurate.
            </p>
            <p>
              Note that a real query would generally start within a health
              area. The Muscle Health area is recommended for this
              demonstration.
            </p>
          </div>
        </div>

        <div className="px-2">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask Hummingbird"
            rows={3}
            className="w-full resize-none rounded-xl border border-input bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Hummingbird can make mistakes. Check important information.
          </p>
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span>© 2026 Brightseed. All rights reserved.</span>
        <span className="rounded-full border border-border bg-muted px-2 py-0.5 font-medium text-foreground">
          v1.2.0
        </span>
      </footer>
    </div>
  );
}
