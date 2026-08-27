import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import type { ProjectContextPatch } from "../data/demoScript";

interface ContextDrawerProps {
  context: ProjectContextPatch;
}

// Project-level Goal / Constraints / References, collapsible via its own
// "Hide context" / "Show context" toggle bar — visually and behaviorally
// parallel to FilterDrawer + FilterToggleBar, but with no facet logic:
// collapse/expand is a local UI affordance only, never driven by the
// script. Reused as-is by both ProjectScreen and StrategyScreen off the
// same folded context.
export default function ContextDrawer({ context }: ContextDrawerProps) {
  const [visible, setVisible] = useState(true);

  return (
    <div className="flex flex-col">
      {visible && (
        <div className="flex flex-col gap-4 bg-white px-4 py-4">
          {context.goal && (
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold text-foreground">Goal</h3>
              <p className="text-sm leading-6 text-foreground">{context.goal}</p>
            </div>
          )}

          {context.constraints && (
            <div className="flex flex-col gap-1">
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Constraints</h4>
              <p className="text-sm text-foreground">{context.constraints}</p>
            </div>
          )}

          {context.referencesLabel && (
            <div className="flex flex-col gap-1">
              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">References</h4>
              <a href="#" className="w-fit text-sm text-foreground underline underline-offset-2">
                {context.referencesLabel}
              </a>
            </div>
          )}
        </div>
      )}

      <div className="relative z-10 flex items-center justify-end gap-1 bg-muted px-6 py-0.5 shadow-md">
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-foreground hover:bg-accent"
        >
          {visible ? "Hide context" : "Show context"}
          <ChevronsUpDown size={16} />
        </button>
      </div>
    </div>
  );
}
