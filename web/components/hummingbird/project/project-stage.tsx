"use client";

import * as React from "react";

import { AppShellQuill } from "@/components/quill/app-shell-quill";
import type { SettingsAccount, SettingsUser } from "@/components/quill/settings-modal";
import type { Team } from "@/components/quill/team-switcher";
import {
  ProjectHeader,
  type ProjectCrumb,
  type ProjectMember,
} from "@/components/hummingbird/project/project-header";
import { ProjectContextPanel } from "@/components/hummingbird/project/project-context-panel";

/**
 * ProjectStage — the chrome every stage of the discovery flow wears.
 *
 * One place owns the layout so the stages stay interchangeable: the project
 * header (with the breadcrumb showing where in the spine you are), the work
 * itself, and the standing project context. Swap `children` to move from
 * strategies to formulation plans to an experiment plan; nothing else moves.
 *
 * It puts the shell in `layout="app"`, so the page is viewport-height and the
 * panes scroll rather than the document. That is what the min-h-0 fix in
 * app-shell-quill unlocked; every other Hummingbird screen still scrolls the
 * document and is untouched by it.
 *
 * Context-panel visibility lives here rather than in each stage — it is a
 * property of the project you are looking at, not of the stage you are on, so it
 * must survive moving between stages.
 *
 * hummingbird/ tier: reads global --ds-* directly (see document-parts.tsx).
 */

export type ProjectBriefContent = {
  name: string;
  goal: React.ReactNode;
  constraints?: React.ReactNode;
  references?: React.ReactNode;
};

export function ProjectStage({
  user,
  account,
  version,
  teams,
  activeTeam,
  project,
  members,
  crumbs,
  stageKey,
  onNavigateProject,
  onAddMember,
  defaultContextOpen = true,
  children,
}: {
  user: SettingsUser;
  account: SettingsAccount;
  version: string;
  teams: Team[];
  activeTeam: Team;
  project: ProjectBriefContent;
  members: ProjectMember[];
  /** Steps below the project — the stage you are on. */
  crumbs?: ProjectCrumb[];
  /**
   * Identifies the stage on screen. When it changes the content pane scrolls
   * back to the top — without it you arrive at a new stage already scrolled to
   * wherever you left the last one, which reads as a half-rendered page.
   */
  stageKey?: string;
  /** Back to the project root — the way out of a drill-in. */
  onNavigateProject?: () => void;
  onAddMember?: () => void;
  defaultContextOpen?: boolean;
  children: React.ReactNode;
}) {
  const [contextOpen, setContextOpen] = React.useState(defaultContextOpen);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [stageKey]);

  return (
    <AppShellQuill
      user={user}
      account={account}
      version={version}
      teams={teams}
      activeTeam={activeTeam}
      activeItem="Projects"
      layout="app"
      contentClassName="p-0"
      header={
        <ProjectHeader
          projectName={project.name}
          crumbs={crumbs}
          onNavigateProject={onNavigateProject}
          members={members}
          onAddMember={onAddMember}
          contextOpen={contextOpen}
          onContextOpenChange={setContextOpen}
        />
      }
    >
      <div className="flex min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-6"
        >
          {children}
        </div>
        {/* Always mounted: it owns its own visibility so it can animate out as a
          * Sheet on mobile rather than vanishing mid-transition. */}
        <ProjectContextPanel
          open={contextOpen}
          onOpenChange={setContextOpen}
          goal={project.goal}
          constraints={project.constraints}
          references={project.references}
          members={members}
        />
      </div>
    </AppShellQuill>
  );
}
