"use client";

/**
 * AppShellQuill — the Hummingbird application shell.
 *
 * Successor to pro-blocks/application/app-shells/app-shell-4.tsx. Both exist on
 * purpose right now: App Shell 4 is the comparison baseline, and it retires
 * once this is signed off (Becky, July 16 2026). Nothing here mutates it.
 *
 * What it is, versus what it replaces:
 *   - Reads --c-sidebar-* through the ui/ Sidebar. App Shell 4 composes Pro
 *     Block nav parts (nav-main, nav-projects, team-switcher) that still reach
 *     for --ds-* directly, which component code is not allowed to do.
 *   - Nav is the five Hummingbird surfaces, not the Pro Block's demo IA of
 *     Playground / Models / Documentation / Projects.
 *   - The footer account menu is NavUserQuill, and Settings and Give feedback
 *     are wired to real surfaces rather than being inert menu rows.
 *
 * Where the instance switcher went: App Shell 4 puts a TeamSwitcher in the
 * header. Anna's sketch moves it into the footer menu as "Teams" (annotation on
 * 89:1560: "this is the instance switcher component, shown as 'Teams' in app
 * shell 4"), so the header here carries the brand mark instead.
 */

import * as React from "react";
import {
  Compass,
  Database,
  FlaskConical,
  Layers,
  MessageSquare,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  type LucideIcon,
} from "lucide-react";

import { BrightseedLogo } from "@/components/brand/BrightseedLogo";
import { FeedbackDialog } from "@/components/quill/feedback-dialog";
import {
  NavUserQuill,
  type NavUserQuillUser,
} from "@/components/quill/nav-user-quill";
import {
  SettingsModal,
  type SettingsAccount,
  type SettingsSectionId,
  type SettingsUser,
} from "@/components/quill/settings-modal";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type AppShellQuillNavItem = {
  title: string;
  icon: LucideIcon;
};

const DEFAULT_NAV: AppShellQuillNavItem[] = [
  { title: "Strategies", icon: Compass },
  { title: "Compounds", icon: FlaskConical },
  { title: "Plants", icon: Layers },
  { title: "Datasets", icon: Database },
  { title: "Chat", icon: MessageSquare },
];

/**
 * The collapse toggle, ported from SidebarAlt1Toggle (sidebar-alt1.tsx:251-294).
 * The 300ms reveal is written as a literal `duration-300` rather than a
 * constant because Tailwind only sees literal class strings — a constant here
 * would be dead code that reads like the source of truth.
 * Four behaviours, all load-bearing — placement alone is not parity:
 *   1. Lives in the nav header, not the content bar (which is App Shell 4's
 *      placement, and what Becky rejected).
 *   2. Hover/focus-revealed: opacity 0 → 1 over 300ms, scoped to the whole nav
 *      via group/nav, not to the header cell.
 *   3. The icon states the direction the nav will move.
 *   4. aria-label flips, aria-expanded is set, and it carries a tooltip. Stock
 *      SidebarTrigger has a static sr-only "Toggle Sidebar" and no aria-expanded.
 *
 * Reads --c-app-shell-* rather than Alt1's --c-sidebar-alt1-*; both alias the
 * same --ds-* semantics, so they render identically.
 */
function NavToggle({ className }: { className?: string }) {
  const { state, isMobile, toggleSidebar } = useSidebar();
  const expanded = isMobile || state === "expanded";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          data-slot="app-shell-quill-toggle"
          aria-label={expanded ? "Close navigation" : "Open navigation"}
          aria-expanded={expanded}
          onClick={toggleSidebar}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center",
            "rounded-[var(--c-app-shell-shape-radius-md)] text-[var(--c-app-shell-text-subtle)]",
            "hover:bg-[var(--c-app-shell-surface-alt)]",
            "outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-app-shell-border-focus)]",
            "opacity-0 transition-opacity duration-300 motion-reduce:transition-none",
            "group-hover/nav:opacity-100 group-focus-within/nav:opacity-100",
            "[&>svg]:size-5 [&>svg]:shrink-0",
            className
          )}
        >
          {expanded ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
        </button>
      </TooltipTrigger>
      <TooltipContent side="right" align="center">
        {expanded ? "Close navigation" : "Open navigation"}
      </TooltipContent>
    </Tooltip>
  );
}

/**
 * The brand header, ported from SidebarAlt1Header (sidebar-alt1.tsx:302-348).
 *
 * Deliberately NOT a SidebarMenuButton. That is what the previous version got
 * wrong, and it caused both of Becky's bugs at once:
 *   - The wordmark survived collapse as a clipped 8px "B". size="lg" is the one
 *     size where `p-0!` beats `p-2!` (twMerge drops the loser from the class
 *     list), leaving a 40px box with no padding: 40 − 24 logo − 8 gap = 8px of
 *     slack, and truncate's overflow:hidden lets the span settle into exactly
 *     that. One glyph.
 *   - The logo rendered 24px, not 32px, because the button's
 *     `[&>svg:first-child]:size-6` outranks a bare `size-8`.
 * Outside a menu button there is no cva, no padding fight, and no icon rule —
 * both bugs stop existing rather than getting patched.
 *
 * Geometry: the logo centres at x=28 in BOTH states, which is also where the
 * nav icons below it sit, so the rail reads as one column and the mark does not
 * jump on collapse. Expanded: px-3 → 12 + 16 = 28. Collapsed: the 40px cell
 * centres in the 56px rail at 8..48 → 28. This requires SidebarHeader's own p-2
 * to be turned off; see the call site.
 */
function NavHeader() {
  const { state, isMobile } = useSidebar();
  const expanded = isMobile || state === "expanded";

  if (expanded) {
    return (
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 px-3">
        <div className="flex min-w-0 items-center gap-2">
          <BrightseedLogo variant="tile" className="size-8 shrink-0" />
          <span className="truncate text-sm font-medium text-[var(--c-app-shell-text-default)]">
            Brightseed
          </span>
        </div>
        <NavToggle />
      </div>
    );
  }

  /* The wordmark is not rendered here at all — the same call Alt1 makes with
   * SidebarAlt1PanelOnly (sidebar-alt1.tsx:516-520). Panel-only content is
   * absent from the rail rather than hidden in it, which is why there is
   * nothing left to clip into a "B". */
  return (
    <div className="flex h-14 shrink-0 items-center justify-center">
      {/* One 40x40 cell holding logo and toggle stacked, crossfading. */}
      <div className="relative size-10">
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "transition-opacity duration-300 motion-reduce:transition-none",
            "group-hover/nav:opacity-0 group-focus-within/nav:opacity-0"
          )}
        >
          <BrightseedLogo variant="tile" className="size-8 shrink-0" />
        </div>
        <NavToggle className="absolute inset-0 size-10" />
      </div>
    </div>
  );
}

export function AppShellQuill({
  user,
  account,
  version,
  nav = DEFAULT_NAV,
  activeItem = "Compounds",
  onUserChange,
  children,
}: {
  user: SettingsUser;
  account: SettingsAccount;
  version: string;
  nav?: AppShellQuillNavItem[];
  activeItem?: string;
  onUserChange?: (next: SettingsUser) => void;
  children?: React.ReactNode;
}) {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [settingsSection, setSettingsSection] =
    React.useState<SettingsSectionId>("profile");
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);

  const openSettings = (section: SettingsSectionId) => {
    setSettingsSection(section);
    setSettingsOpen(true);
  };

  /* NavUserQuill takes the display name and email; the avatar identity is the
   * same stored pair the settings modal edits, so both read from one `user`. */
  const menuUser: NavUserQuillUser = {
    name: user.name,
    email: user.email,
    color: user.color,
    icon: user.icon,
  };

  return (
    <SidebarProvider>
      {/* group/nav scopes the toggle's reveal to the whole nav, as Alt1 does
       * with group/alt1. It has to be a NAMED group: className lands on the
       * sidebar-container, a descendant of the root that carries
       * data-collapsible, so group-data-[collapsible=icon] and group-hover/nav
       * resolve against different ancestors and can stack on one element.
       * Reusing the root's bare `group` would make both resolve to the same
       * element, which does not work. */}
      <Sidebar collapsible="icon" className="group/nav">
        {/* p-0: NavHeader owns its own padding so the logo can sit at x=28 in
         * both states. SidebarHeader's default p-2 would put it at 24 expanded
         * and 28 collapsed — a 4px jump on every toggle. */}
        <SidebarHeader className="p-0">
          <NavHeader />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={item.title === activeItem}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <NavUserQuill
            user={menuUser}
            version={version}
            onSettings={() => openSettings("profile")}
            onGiveFeedback={() => setFeedbackOpen(true)}
            /* BRIGHTSEED-TBD: [CONCERN] The sketch says Teams *is* the instance
             * switcher but never draws what it opens from this menu — a submenu
             * of instances, its own dialog, or a jump to where they are listed.
             * Routed to Settings > Account, the only surface in the proposal
             * that shows the instances, rather than inventing a fourth. Needs a
             * design call before this ships. */
            onTeams={() => openSettings("account")}
            /* Get help is annotated "will open jira ticket. ignore flow for
             * now", so it is deliberately left unwired. */
          />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--c-app-shell-border-default)] px-4">
          {/* Mobile only. Alt1 puts its ONLY toggle inside the nav, which on
           * mobile means inside the Sheet — so once the sheet closes there is
           * no way to reopen it except Cmd/Ctrl+B. Matching Alt1's placement
           * would inherit that dead end, so below md the trigger stays out
           * here where it can actually be reached. Above md it is gone and
           * NavHeader's hover-revealed toggle is the only one, per Becky. */}
          <SidebarTrigger className="md:hidden" />
        </header>
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        openTo={settingsSection}
        user={user}
        account={account}
        onUserChange={onUserChange}
      />
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </SidebarProvider>
  );
}
