"use client";

import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarIdentity } from "@/components/ui/avatar";
import { Section, Prose } from "@/components/hummingbird/document-parts";
import type { ProjectMember } from "@/components/hummingbird/project/project-header";

/**
 * ProjectContextPanel — the standing answer to "what are we actually doing?"
 *
 * Goal, constraints, references and the people on the project, parked beside the
 * work rather than buried in the transcript. Every stage of the flow is judged
 * against the goal, so the goal should never require scrolling back to find.
 *
 * A plain <aside>, deliberately NOT a third ResizablePanel: it isn't resizable
 * in the design, three panels make the two handles' min/max constraints interact
 * confusingly, and a panel collapsed to zero strands its handle.
 *
 * Below md it moves into a Sheet, and that switch lives HERE rather than in each
 * caller: at 375px a 320px aside leaves the work about 40px of width, so a
 * consumer that forgot to handle it would ship a broken screen rather than an
 * ugly one. DESIGN.md restricts product side-panels to side="right".
 *
 * Visibility is a prop rather than the caller's conditional render, because the
 * Sheet needs to stay mounted to animate out — and because `aria-controls` on
 * the toggle has to point at an element that exists while collapsed.
 *
 * hummingbird/ tier: reads global --ds-* directly (see document-parts.tsx).
 */

export function ProjectContextPanel({
  open = true,
  onOpenChange,
  goal,
  constraints,
  references,
  members,
  className,
  id = "project-context-panel",
}: {
  /** Controlled visibility. Owning it here is what lets the mobile Sheet work. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  goal: React.ReactNode;
  /** The mock's copy is literally "none" when unconstrained — say so, don't hide it. */
  constraints?: React.ReactNode;
  references?: React.ReactNode;
  members?: ProjectMember[];
  className?: string;
  id?: string;
}) {
  const isMobile = useIsMobile();

  const sections = (
    <>
      <Section title="Goal" size="eyebrow">
        <Prose>{goal}</Prose>
      </Section>

      {constraints !== undefined ? (
        <Section title="Constraints" size="eyebrow">
          <Prose>{constraints}</Prose>
        </Section>
      ) : null}

      {references ? (
        <Section title="References" size="eyebrow">
          <div className="text-sm text-[var(--ds-color-text-default)]">{references}</div>
        </Section>
      ) : null}

      {members && members.length > 0 ? (
        <Section title="Team members" size="eyebrow">
          <ul className="flex flex-col gap-2">
            {members.map((member) => (
              <li key={member.id} className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarIdentity color={member.color} icon={member.icon} />
                </Avatar>
                <span className="text-sm text-[var(--ds-color-text-default)]">
                  {member.name}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[85vw] gap-0 overflow-y-auto p-5 sm:max-w-sm">
          <SheetHeader className="p-0">
            <SheetTitle className="text-sm font-semibold">Project context</SheetTitle>
          </SheetHeader>
          {/* The id lives on the mobile body too, so the header's
           * aria-controls resolves in both layouts. */}
          <div id={id} className="mt-5 flex flex-col gap-5">
            {sections}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  /* Kept in the DOM while collapsed (hidden), so aria-controls always resolves
   * and the toggle's aria-expanded describes a real element. */
  return (
    <aside
      id={id}
      aria-label="Project context"
      hidden={!open}
      className={cn(
        "flex w-80 shrink-0 flex-col gap-5 overflow-y-auto border-l border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] p-5",
        // min-h-0 so this scrolls internally instead of stretching the row.
        "min-h-0",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-sm font-semibold text-[var(--ds-color-text-default)]">
          Project context
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="-mt-1 -mr-1 size-7"
          onClick={() => onOpenChange?.(false)}
          aria-label="Hide project context"
        >
          <X />
        </Button>
      </div>

      {sections}
    </aside>
  );
}
