"use client";

/**
 * ProjectsList — the Projects surface ("Projects list view").
 *
 * Projects are named containers for a body of work: the chats and reports that
 * belong together. Net-new to Quill (not yet in the live product), modelled on
 * the live Conversations/Reports list pattern. A Block — it composes Card +
 * Button + Input — and is the content behind App Shell Quill's "Projects" tab,
 * imported there so the screen and the standalone Block never drift.
 *
 * The search box filters the list live; the New Project button is a callback
 * the app owns. Cards are display-only for now (no detail surface exists yet).
 */

import * as React from "react";
import { FileText, Folder, MessageSquare, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type Project = {
  name: string;
  summary: string;
  /** Chats held in the container. */
  chats: number;
  /** Reports held in the container. */
  reports: number;
  /** Human-readable relative time, e.g. "2 days ago". */
  updated: string;
};

export const SAMPLE_PROJECTS: Project[] = [
  {
    name: "Metabolic Health Line",
    summary:
      "GLP-1 adjacent concepts for glucose control and weight management.",
    chats: 8,
    reports: 3,
    updated: "2 days ago",
  },
  {
    name: "Cognitive Support Formulas",
    summary: "Nootropic stacks and mechanisms for focus, memory, and mood.",
    chats: 5,
    reports: 2,
    updated: "5 days ago",
  },
  {
    name: "Gut & Longevity Concepts",
    summary:
      "Synbiotic and polyphenol combinations across the gut–longevity axis.",
    chats: 12,
    reports: 6,
    updated: "1 week ago",
  },
];

export function ProjectsList({
  projects = SAMPLE_PROJECTS,
  onNewProject,
}: {
  projects?: Project[];
  onNewProject?: () => void;
}) {
  const [query, setQuery] = React.useState("");
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? projects.filter((project) =>
        `${project.name} ${project.summary}`.toLowerCase().includes(needle)
      )
    : projects;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-[var(--c-projects-list-text-default)]">
            Projects
          </h1>
          <p className="text-sm text-[var(--c-projects-list-text-subtle)]">
            Containers for a body of work — the chats and reports that belong
            together.
          </p>
        </div>
        <Button onClick={onNewProject}>
          <Plus />
          New project
        </Button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--c-projects-list-text-subtle)]" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search projects…"
          className="pl-9"
        />
      </div>

      {visible.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map((project) => (
            <Card key={project.name} className="gap-3 p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--c-projects-list-shape-radius-md)] bg-[var(--c-projects-list-surface-alt)] text-[var(--c-projects-list-text-subtle)]">
                  <Folder className="size-5" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="font-medium text-[var(--c-projects-list-text-default)]">
                    {project.name}
                  </div>
                  <p className="line-clamp-2 text-sm text-[var(--c-projects-list-text-subtle)]">
                    {project.summary}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-[var(--c-projects-list-text-subtle)]">
                <span className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="size-4" />
                    {project.chats}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FileText className="size-4" />
                    {project.reports}
                  </span>
                </span>
                <span>Updated {project.updated}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-[var(--c-projects-list-text-subtle)]">
          No projects match your search.
        </p>
      )}
    </div>
  );
}
