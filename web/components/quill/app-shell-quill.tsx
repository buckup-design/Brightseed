"use client";

/**
 * AppShellQuill — the Hummingbird application shell.
 *
 * Successor to the Pro Block App Shell 4, which was deleted along with the stock
 * shadcn sidebar it composed (Becky, July 16 2026). This is the only app shell.
 *
 * It is a Block, not a Component: it composes the sidebar, the nav items, the
 * account menu, the team switcher, settings and feedback. That composition is
 * what the Blocks section is for.
 *
 * Built on ui/sidebar, which swaps two compositions rather than morphing one.
 * That difference is the reason the old sidebar is gone: stock kept labels
 * mounted and squeezed them as the panel narrowed ("Compounds" measured 79px →
 * 0px), which is what produced the clipped "B" in the brand mark. Here the rail
 * composition simply has no labels to squeeze. See Components/Sidebar for the
 * argument in full.
 *
 * The toggle, the hover reveal, the logo crossfade and the rail curation all
 * belong to the sidebar. This file hand-ported them onto stock once; that code
 * is gone, which was most of the point of the move.
 */

import * as React from "react";
import {
  FileText,
  Folder,
  MessageSquare,
  PanelLeftOpenIcon,
  Plus,
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
  type Appearance,
  type SettingsAccount,
  type SettingsSectionId,
  type SettingsUser,
} from "@/components/quill/settings-modal";
import type { Team } from "@/components/quill/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarPanelOnly,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

export type AppShellQuillNavItem = {
  title: string;
  icon: LucideIcon;
};

/* The Hummingbird IA, aligned to the live product (brightseed.ai v1.3.2), whose
 * rail is New Chat · Conversations · Reports. Conversations is the flat thread
 * list — the history of chats, and the door into each one's Workspace. Projects
 * sits ALONGSIDE it (Becky, July 18 2026), evolving that flat list into named
 * containers that hold both chats and reports — a known need, not yet in the
 * live product. Both earn a slot: Conversations for live parity, Projects for
 * the container concept. */
const DEFAULT_NAV: AppShellQuillNavItem[] = [
  { title: "New chat", icon: Plus },
  { title: "Conversations", icon: MessageSquare },
  { title: "Projects", icon: Folder },
  { title: "Reports", icon: FileText },
];

/**
 * Mobile-only opener.
 *
 * SidebarToggle cannot be reused here, and the reason is worth stating: its
 * reveal is `opacity-0` lifted by `group-hover/sidebar`, and `group/sidebar`
 * lives on the nav root. Placed in the inset — outside that ancestor — the
 * variant never matches and the button stays invisible at opacity 0 forever. It
 * would look like a missing button, not a misconfigured one.
 *
 * It also has to exist at all: below md the sidebar renders inside a Sheet, and
 * its only toggle is inside that Sheet. Once the sheet closes there is no way
 * back except Cmd/Ctrl+B. The sidebar's own story never caught it because it has
 * no mobile-viewport story.
 */
function MobileNavOpener() {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label="Open navigation"
      className="flex size-9 shrink-0 items-center justify-center rounded-[var(--c-app-shell-shape-radius-md)] text-[var(--c-app-shell-text-subtle)] outline-none hover:bg-[var(--c-app-shell-surface-alt)] focus-visible:ring-1 focus-visible:ring-[var(--c-app-shell-border-focus)] md:hidden [&>svg]:size-5"
    >
      <PanelLeftOpenIcon />
    </button>
  );
}

export function AppShellQuill({
  user,
  account,
  version,
  nav = DEFAULT_NAV,
  activeItem = "New chat",
  teams,
  activeTeam,
  onTeamChange,
  onAddTeam,
  onNavigate,
  onUserChange,
  appearance,
  onAppearanceChange,
  children,
}: {
  user: SettingsUser;
  account: SettingsAccount;
  version: string;
  nav?: AppShellQuillNavItem[];
  activeItem?: string;
  /** The instances, surfaced through the account menu's Teams row. */
  teams: Team[];
  activeTeam: Team;
  onTeamChange?: (team: Team) => void;
  onAddTeam?: () => void;
  /** Fired when a nav item is chosen. Routing is the caller's problem — the
   * shell owns no router. Without this the nav is inert, which reads as broken. */
  onNavigate?: (title: string) => void;
  onUserChange?: (next: SettingsUser) => void;
  /** Appearance preference, threaded to the settings modal. The shell doesn't
   * apply the theme — the app owns that (see the story for the reference wiring). */
  appearance?: Appearance;
  onAppearanceChange?: (next: Appearance) => void;
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
      <Sidebar>
        <SidebarHeader>
          <BrightseedLogo variant="tile" className="size-8 shrink-0" />
          {/* PanelOnly, not a hidden class: the wordmark is absent from the rail
           * DOM rather than clipped inside it. This is the fix for the "B". */}
          <SidebarPanelOnly>
            <span className="ml-2 truncate text-sm font-medium text-[var(--c-app-shell-text-muted)]">
              Brightseed
            </span>
          </SidebarPanelOnly>
        </SidebarHeader>

        <SidebarContent>
          {nav.map((item) => (
            <SidebarItem
              key={item.title}
              icon={item.icon}
              label={item.title}
              isActive={item.title === activeItem}
              onClick={() => onNavigate?.(item.title)}
            />
          ))}
        </SidebarContent>

        <SidebarFooter>
          {/* The Teams [CONCERN] is closed: Becky's call (July 16 2026) is that
           * the row links to the Team Switcher, which expands in place, and the
           * header keeps the Brightseed mark. No fourth surface invented. */}
          <NavUserQuill
            user={menuUser}
            version={version}
            teams={teams}
            activeTeam={activeTeam}
            onTeamChange={onTeamChange}
            onAddTeam={onAddTeam}
            onSettings={() => openSettings("profile")}
            onGiveFeedback={() => setFeedbackOpen(true)}
            /* Get help is annotated "will open jira ticket. ignore flow for
             * now", so it is deliberately left unwired. */
          />
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--c-app-shell-border-default)] px-4 md:hidden">
          <MobileNavOpener />
        </header>
        <div className="flex flex-1 flex-col bg-[var(--c-app-shell-surface-canvas)] p-6">
          {children}
        </div>
      </SidebarInset>

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        openTo={settingsSection}
        user={user}
        account={account}
        onUserChange={onUserChange}
        appearance={appearance}
        onAppearanceChange={onAppearanceChange}
      />
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </SidebarProvider>
  );
}
