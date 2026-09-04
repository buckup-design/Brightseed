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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
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
  chat,
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
  /**
   * The conversation half of the stage. Optional: a stage rendered without it
   * keeps the pre-chat single-pane layout, so nothing that already composes
   * ProjectStage has to change.
   */
  chat?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [contextOpen, setContextOpen] = React.useState(defaultContextOpen);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const stagePane = (
    <div
      ref={scrollRef}
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-6"
    >
      {children}
    </div>
  );

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
        {chat ? (
          isMobile ? (
            /* Two panels can't sit side by side on a phone. Same swap the
               Workspace canvas makes, and the SAME stage/chat instances render
               either way — only the container changes. */
            <Tabs
              defaultValue="stage"
              /* min-w-0: the tables are wider than a phone, and without this
                 the stage's intrinsic width pushes the whole Tabs box — tab bar
                 included — past the viewport instead of scrolling inside it. */
              className="flex min-h-0 min-w-0 flex-1 flex-col gap-0"
            >
              <TabsList className="w-full shrink-0 justify-start rounded-none border-b border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-canvas)] px-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="stage">Work</TabsTrigger>
              </TabsList>
              <TabsContent
                value="chat"
                className="min-h-0 min-w-0 flex-1 overflow-hidden"
              >
                {chat}
              </TabsContent>
              <TabsContent
                value="stage"
                className="min-h-0 min-w-0 flex-1 overflow-hidden"
              >
                {stagePane}
              </TabsContent>
            </Tabs>
          ) : (
            <ResizablePanelGroup
              orientation="horizontal"
              className="min-h-0 flex-1"
            >
              {/* String percents, NOT numbers — a numeric size is PIXELS in
                  react-resizable-panels v4. Narrower default than the Workspace
                  canvas's 38: the tables here are wide and the reading happens
                  on the right. */}
              <ResizablePanel
                defaultSize="32"
                minSize="24"
                maxSize="48"
                className="flex min-h-0 flex-col"
              >
                {chat}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize="68"
                minSize="45"
                className="flex min-h-0 flex-col"
              >
                {stagePane}
              </ResizablePanel>
            </ResizablePanelGroup>
          )
        ) : (
          stagePane
        )}
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
