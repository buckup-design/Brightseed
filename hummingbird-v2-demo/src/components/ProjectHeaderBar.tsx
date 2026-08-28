import { ChevronRight, Folder, Plus } from "lucide-react";

interface ProjectHeaderBarProps {
  projectName: string;
  /** Present only on the Strategy screen — switches to a breadcrumb header. */
  strategyName?: string;
  /** Strategy screen only — drills back out to the project (see StrategyScreen). */
  onProjectClick?: () => void;
}

// One header, two states: plain title (Project screen) vs. a two-segment
// breadcrumb (Strategy screen, "Project Name > Strategy Name"). Avatar
// group is decorative/hardcoded placeholders — this is a scripted demo,
// there's no real collaborator data to render.
export default function ProjectHeaderBar({ projectName, strategyName, onProjectClick }: ProjectHeaderBarProps) {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
      <div className="flex items-center gap-2 text-foreground">
        <Folder size={20} className="text-muted-foreground" />
        {strategyName ? (
          <div className="flex items-center gap-1.5 text-base">
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                onProjectClick?.();
              }}
              className="font-medium text-foreground underline underline-offset-2"
            >
              {projectName}
            </a>
            <ChevronRight size={16} className="text-muted-foreground" />
            <span className="font-semibold">{strategyName}</span>
          </div>
        ) : (
          <h1 className="text-base font-semibold">{projectName}</h1>
        )}
      </div>

      <div className="flex items-center -space-x-2">
        <div className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-muted text-xs font-medium text-foreground">
          CH
        </div>
        <button
          type="button"
          aria-label="Add collaborator"
          className="flex size-8 items-center justify-center rounded-full border-2 border-white bg-muted text-muted-foreground hover:bg-accent"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
