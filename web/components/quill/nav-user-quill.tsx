"use client";

/**
 * NavUserQuill — the sidebar footer account menu.
 *
 * Successor to pro-blocks/application/nav-user.tsx, per Anna's proposal sketch
 * (Collab Playground 89:1596, July 16 2026). Three things change from the Pro
 * Block it replaces:
 *
 *   1. The trigger shows the display name alone, not name-over-email. The email
 *      moves into the menu header, where it is read rather than scanned.
 *   2. The affordance is a kebab, not ChevronsUpDown. Annotated on the sketch:
 *      "use kebob dots as the icon affordance".
 *   3. The menu is Hummingbird's actual IA. Upgrade to Pro / Account / Billing /
 *      Notifications are gone — none of them exist in this product — and
 *      Settings / Get help / Give feedback / Teams / Version take their place.
 *
 * nav-user.tsx is deliberately left in place: App Shell 4 still renders it, and
 * it stays the side-by-side comparison until app-shell-quill is signed off.
 *
 * The sketch is annotated "treat as a hand drawing, intent only. spacing, colors
 * and radius are not intentional" — so the grouping below is taken from it, the
 * measurements are not. Those come from the DS defaults.
 */

import {
  CircleHelp,
  EllipsisVertical,
  LogOut,
  MessageSquarePlus,
  Settings,
  UsersRound,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarIdentity,
  type AvatarColor,
  type AvatarIcon,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export type NavUserQuillUser = {
  /** The display name from Settings > Profile > Full name. Free text, 20 chars,
   * not an identifier — so it is shown verbatim and never parsed or split. */
  name: string;
  email: string;
  color?: AvatarColor;
  icon?: AvatarIcon;
};

export function NavUserQuill({
  user,
  version,
  onSettings,
  onGetHelp,
  onGiveFeedback,
  onTeams,
  onLogOut,
}: {
  user: NavUserQuillUser;
  /** Rendered in the non-interactive Version row. */
  version: string;
  onSettings?: () => void;
  onGetHelp?: () => void;
  onGiveFeedback?: () => void;
  onTeams?: () => void;
  onLogOut?: () => void;
}) {
  const { isMobile } = useSidebar();

  /* An identity needs both halves of the stored pair to be renderable, so a
   * half-written row falls to the fallback rather than inventing a match. Same
   * reasoning as the Pro Block this replaces. */
  const avatar =
    user.color && user.icon ? (
      <AvatarIdentity color={user.color} icon={user.icon} className="rounded-lg" />
    ) : (
      <AvatarFallback className="rounded-lg" />
    );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-[var(--c-sidebar-surface-alt)]"
            >
              <Avatar className="h-8 w-8 rounded-lg">{avatar}</Avatar>
              <span className="flex-1 truncate text-left text-sm font-semibold">
                {user.name}
              </span>
              <EllipsisVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-60 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">{avatar}</Avatar>
                <span className="truncate text-[var(--c-nav-user-text-default)]">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onSettings}>
              <Settings />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={onGetHelp}>
                <CircleHelp />
                Get help
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onGiveFeedback}>
                <MessageSquarePlus />
                Give feedback
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onTeams}>
              <UsersRound />
              Teams
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            {/* Not a DropdownMenuItem: this row is a readout, so it must not
             * take focus, highlight on hover, or close the menu when clicked.
             * No aria-label either — on a roleless div it is widely ignored,
             * and the two spans already read as "Version v1.3.2" in order. */}
            <div className="flex items-center justify-between px-2 py-1.5 text-sm text-[var(--c-nav-user-text-subtle)]">
              <span>Version</span>
              <span>{version}</span>
            </div>

            <DropdownMenuItem onSelect={onLogOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
