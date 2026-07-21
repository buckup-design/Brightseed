"use client";

/**
 * TeamSwitcher — pick the active instance.
 *
 * Descends from the Pro Block of the same name, which lived in App Shell 4's
 * sidebar header and died with the stock sidebar (July 16 2026). Restored
 * deliberately, with two things changed:
 *
 *   1. It is no longer a header widget. The sketch moves instance switching
 *      into the account menu's "Teams" row (annotation on 89:1560: "this is the
 *      instance switcher component, shown as 'Teams' in app shell 4"), and the
 *      shell's header keeps the Brightseed mark. So the switcher's home is the
 *      menu, and the standalone form below exists for reuse and for review.
 *   2. It reads --c-team-switcher-* rather than reaching for --ds-* directly,
 *      which the Pro Block did in seven places.
 *
 * Two forms, one row renderer, deliberately: `TeamSwitcher` is the standalone
 * Block (trigger + panel) and `TeamSwitcherMenuSub` is the form embedded in the
 * account menu. Both delegate their rows to TeamRows, so the two cannot drift.
 */

import * as React from "react";
import { Check, Plus, UsersRound, type LucideIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type Team = {
  name: string;
  logo: LucideIcon;
  /** Free text under the name in the standalone trigger, e.g. "Enterprise". */
  plan: string;
};

type TeamSwitcherProps = {
  teams: Team[];
  /** The active instance. Controlled — the app owns which one is live. */
  value: Team;
  onChange?: (team: Team) => void;
  onAddTeam?: () => void;
};

/* The rows. Shared by both forms so the standalone Block and the menu submenu
 * can never disagree about what an instance looks like. */
function TeamRows({ teams, value, onChange, onAddTeam }: TeamSwitcherProps) {
  return (
    <>
      <DropdownMenuLabel className="text-xs text-[var(--c-team-switcher-text-subtle)]">
        Instances
      </DropdownMenuLabel>
      {teams.map((team) => {
        const active = team.name === value.name;
        return (
          <DropdownMenuItem
            key={team.name}
            onSelect={() => onChange?.(team)}
            className="gap-2 p-2"
          >
            <div className="flex size-6 shrink-0 items-center justify-center rounded-sm border border-[var(--c-team-switcher-border-default)]">
              <team.logo className="size-4 shrink-0" />
            </div>
            <span className="flex-1 truncate">{team.name}</span>
            {/* A switcher has to say which one you are in. The Pro Block used
             * ⌘1/⌘2 shortcut hints here and marked the active team nowhere,
             * which meant the menu could not answer its own question. */}
            {active && <Check className="size-4 shrink-0" />}
          </DropdownMenuItem>
        );
      })}
      <DropdownMenuSeparator />
      <DropdownMenuItem onSelect={onAddTeam} className="gap-2 p-2">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md border border-[var(--c-team-switcher-border-default)] bg-[var(--c-team-switcher-surface-default)]">
          <Plus className="size-4" />
        </div>
        <span className="text-[var(--c-team-switcher-text-subtle)]">
          Add instance
        </span>
      </DropdownMenuItem>
    </>
  );
}

/**
 * The form embedded in the account menu's Teams row. Expands into the instance
 * list in place rather than navigating — Becky, July 16 2026.
 *
 * Must be rendered inside an existing DropdownMenu (it is a Sub), which is why
 * it takes no trigger of its own.
 */
export function TeamSwitcherMenuSub(props: TeamSwitcherProps) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <UsersRound />
        Teams
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="min-w-56">
        <TeamRows {...props} />
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

/**
 * The standalone Block: trigger showing the active instance, panel listing the
 * rest. Nothing in the Hummingbird shell composes this today — the account menu
 * does the switching — but it stays as the reusable form and as the reviewable
 * surface for the row design.
 */
export function TeamSwitcher({
  className,
  ...props
}: TeamSwitcherProps & { className?: string }) {
  const { value } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-slot="team-switcher-trigger"
          className={cn(
            "flex h-12 w-full items-center gap-2 px-2 text-left",
            "rounded-[var(--c-team-switcher-shape-radius-md)] text-[var(--c-team-switcher-text-default)]",
            "hover:bg-[var(--c-team-switcher-surface-alt)]",
            "data-[state=open]:bg-[var(--c-team-switcher-surface-alt)]",
            "outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-team-switcher-border-focus)]",
            className
          )}
        >
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-[var(--c-team-switcher-action-primary)] text-[var(--c-team-switcher-text-on-action-primary)]">
            <value.logo className="size-4" />
          </div>
          <span className="grid flex-1 text-sm leading-tight">
            <span className="truncate font-semibold">{value.name}</span>
            <span className="truncate text-xs text-[var(--c-team-switcher-text-subtle)]">
              {value.plan}
            </span>
          </span>
          <UsersRound className="ml-auto size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 rounded-lg" align="start">
        <TeamRows {...props} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
