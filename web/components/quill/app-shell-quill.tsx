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
} from "@/components/ui/sidebar";

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
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" tooltip="Brightseed">
                {/* The tile variant exists for exactly this slot — the mark on
                 * pale lime at 32x32, theme-invariant by design. Its colours are
                 * brand-locked literals, which is why this is not a token
                 * reference. The Sidebar story still hand-rolls a "BS" square
                 * here through bridge classes; that predates the tile. */}
                <BrightseedLogo variant="tile" className="size-8 shrink-0" />
                <span className="font-medium">Brightseed</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
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
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--c-sidebar-border-default)] px-4">
          <SidebarTrigger />
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
