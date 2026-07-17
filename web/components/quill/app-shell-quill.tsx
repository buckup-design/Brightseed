"use client";

/**
 * AppShellQuill — the Hummingbird application shell.
 *
 * Built on sidebar-alt1, not the stock sidebar (Becky, July 16 2026). The two
 * differ in what happens during the 200ms nobody thinks about:
 *
 *   Stock morphs one composition. The labels stay mounted and get squeezed —
 *   measured, "Compounds" went 79px → 0px while the panel narrowed. Text
 *   reflows and clips in real time, and the rail ends up a crushed panel.
 *   Alt1 swaps two compositions. The rail mounts fully formed at its final
 *   width and the wrapper wipes 240 → 56 over 150ms with overflow-hidden doing
 *   the reveal. Nothing is ever mid-squeeze, because the rail composition never
 *   had labels to squeeze.
 *
 * sidebar-alt1-spec.md is the argument in full; it is why Alt1 was built. This
 * shell used to sit on the losing side of that decision, and the "B" bug Becky
 * filed was that showing through — the wordmark was being squeezed rather than
 * removed.
 *
 * The toggle, the hover reveal, the logo crossfade and the rail curation are
 * all Alt1's now. This file previously hand-ported them onto stock; that code
 * is gone, which is most of the point.
 *
 * Still true from before: app-shell-4 retires once this is signed off, and
 * nothing here touches it.
 */

import * as React from "react";
import {
  Compass,
  Database,
  FlaskConical,
  Layers,
  MessageSquare,
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
  SidebarAlt1,
  SidebarAlt1Content,
  SidebarAlt1Footer,
  SidebarAlt1Header,
  SidebarAlt1Inset,
  SidebarAlt1Item,
  SidebarAlt1PanelOnly,
  SidebarAlt1Provider,
  useSidebarAlt1,
} from "@/components/ui/sidebar-alt1";

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
 * Mobile-only opener.
 *
 * SidebarAlt1Toggle cannot be reused here, and the reason is worth stating: its
 * reveal is `opacity-0` lifted by `group-hover/alt1`, and `group/alt1` lives on
 * the nav root. Placed in the inset — outside that ancestor — the variant never
 * matches and the button stays invisible at opacity 0 forever. It would look
 * like a missing button, not a misconfigured one.
 *
 * It also has to exist at all: below md, Alt1 renders the nav inside a Sheet,
 * and its only toggle is inside that Sheet. Once the sheet closes there is no
 * way back except Cmd/Ctrl+B. Alt1's own story never noticed because it has no
 * mobile viewport story.
 */
function MobileNavOpener() {
  const { toggleSidebar } = useSidebarAlt1();

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
  activeItem = "Compounds",
  onNavigate,
  onUserChange,
  children,
}: {
  user: SettingsUser;
  account: SettingsAccount;
  version: string;
  nav?: AppShellQuillNavItem[];
  activeItem?: string;
  /** Fired when a nav item is chosen. Routing is the caller's problem — the
   * shell owns no router. Without this the nav is inert, which reads as broken. */
  onNavigate?: (title: string) => void;
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
    <SidebarAlt1Provider>
      <SidebarAlt1>
        <SidebarAlt1Header>
          <BrightseedLogo variant="tile" className="size-8 shrink-0" />
          {/* PanelOnly, not a hidden class: the wordmark is absent from the rail
           * DOM rather than clipped inside it. This is the fix for the "B". */}
          <SidebarAlt1PanelOnly>
            <span className="ml-2 truncate text-sm font-medium text-[var(--c-app-shell-text-default)]">
              Brightseed
            </span>
          </SidebarAlt1PanelOnly>
        </SidebarAlt1Header>

        <SidebarAlt1Content>
          {nav.map((item) => (
            <SidebarAlt1Item
              key={item.title}
              icon={item.icon}
              label={item.title}
              isActive={item.title === activeItem}
              onClick={() => onNavigate?.(item.title)}
            />
          ))}
        </SidebarAlt1Content>

        <SidebarAlt1Footer>
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
        </SidebarAlt1Footer>
      </SidebarAlt1>

      <SidebarAlt1Inset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--c-app-shell-border-default)] px-4 md:hidden">
          <MobileNavOpener />
        </header>
        <div className="flex-1 p-6">{children}</div>
      </SidebarAlt1Inset>

      <SettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        openTo={settingsSection}
        user={user}
        account={account}
        onUserChange={onUserChange}
      />
      <FeedbackDialog open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </SidebarAlt1Provider>
  );
}
