"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Folder, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarGroup,
  AvatarGroupCount,
  AvatarIdentity,
  type AvatarColor,
  type AvatarIcon,
} from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * ProjectHeader — the project's own navigation bar.
 *
 * This is the project's global nav, not a column heading: it spans the whole
 * content area, above both the chat pane and the context panel. It stops at the
 * sidebar rather than crossing it (Becky, Sept 2026 — and the sidebar collapses
 * 240px ⇄ 56px, so a header that crossed it would shift its own left edge by
 * 184px on every toggle).
 *
 * When you drill into a strategy, the left side becomes a breadcrumb. That
 * breadcrumb is the flow spine made visible — goal → strategy → formulation —
 * and it is the way back up out of a drill-in.
 *
 * hummingbird/ tier: reads global --ds-* directly (see document-parts.tsx).
 */

export type ProjectMember = {
  id: string;
  name: string;
  color: AvatarColor;
  icon: AvatarIcon;
};

/** One step of the spine. The last crumb is the current place. */
export type ProjectCrumb = {
  label: string;
  onNavigate?: () => void;
};

export function ProjectHeader({
  projectName,
  onNavigateProject,
  crumbs = [],
  members,
  maxAvatars = 3,
  onAddMember,
  contextOpen,
  onContextOpenChange,
  contextLabel = "Project context",
  className,
}: {
  projectName: string;
  /** Back to the project root. Without it the project name is inert text. */
  onNavigateProject?: () => void;
  /** Steps below the project, e.g. the strategy being explored. */
  crumbs?: ProjectCrumb[];
  members: ProjectMember[];
  maxAvatars?: number;
  onAddMember?: () => void;
  contextOpen?: boolean;
  onContextOpenChange?: (open: boolean) => void;
  contextLabel?: string;
  className?: string;
}) {
  const shown = members.slice(0, maxAvatars);
  const overflow = members.length - shown.length;

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between gap-4 border-b border-[var(--ds-color-border-subtle)] bg-[var(--ds-color-surface-default)] px-4",
        className,
      )}
    >
      <Breadcrumb className="min-w-0">
        <BreadcrumbList className="min-w-0 flex-nowrap">
          <BreadcrumbItem>
            <Folder
              aria-hidden="true"
              className="size-4 shrink-0 text-[var(--ds-color-icon-subtle)]"
            />
          </BreadcrumbItem>
          <BreadcrumbItem className="min-w-0">
            {crumbs.length === 0 || !onNavigateProject ? (
              <BreadcrumbPage className="truncate font-semibold text-[var(--ds-color-text-default)]">
                {projectName}
              </BreadcrumbPage>
            ) : (
              <BreadcrumbLink
                href="#project"
                onClick={(event) => {
                  event.preventDefault();
                  onNavigateProject();
                }}
                className="truncate font-semibold text-[var(--ds-color-text-default)]"
              >
                {projectName}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <React.Fragment key={crumb.label}>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="min-w-0">
                  {last ? (
                    <BreadcrumbPage className="truncate">{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      href="#crumb"
                      onClick={(event) => {
                        event.preventDefault();
                        crumb.onNavigate?.();
                      }}
                      className="truncate"
                    >
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex shrink-0 items-center gap-2">
        <AvatarGroup data-size="sm">
          {shown.map((member) => (
            <Tooltip key={member.id}>
              <TooltipTrigger asChild>
                <Avatar className="size-6">
                  <AvatarIdentity color={member.color} icon={member.icon} />
                  <span className="sr-only">{member.name}</span>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>{member.name}</TooltipContent>
            </Tooltip>
          ))}
          {overflow > 0 ? (
            <AvatarGroupCount>
              +{overflow}
              <span className="sr-only">{`${overflow} more members`}</span>
            </AvatarGroupCount>
          ) : null}
        </AvatarGroup>

        {onAddMember ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={onAddMember}
                aria-label="Add a team member"
              >
                <Plus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add a team member</TooltipContent>
          </Tooltip>
        ) : null}

        {onContextOpenChange ? (
          /* aria-expanded alone, deliberately: below md the panel is a Sheet
           * that UNMOUNTS when closed, so an aria-controls here would reference
           * a missing id in that layout and fail axe's aria-valid-attr-value.
           * The expanded state is the part that carries meaning. */
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onContextOpenChange(!contextOpen)}
            aria-expanded={contextOpen}
          >
            {contextLabel}
            {contextOpen ? <ChevronUp /> : <ChevronDown />}
          </Button>
        ) : null}
      </div>
    </header>
  );
}
