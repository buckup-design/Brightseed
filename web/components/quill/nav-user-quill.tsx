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
 *
 * Built on sidebar-alt1, per Becky's July 16 2026 call to move the shell. The
 * trigger is a plain button rather than a stock SidebarMenuButton: Alt1 has no
 * such primitive, and it is what caused the rail clipping anyway — the name and
 * kebab are panel-only content, so in the rail they are ABSENT, not hidden.
 * SidebarAlt1Item cannot be reused here because it takes a LucideIcon and this
 * leads with an Avatar; the geometry below is copied from it instead.
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
import { useSidebarAlt1 } from "@/components/ui/sidebar-alt1";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  const { state, isMobile } = useSidebarAlt1();
  const expanded = isMobile || state === "expanded";

  /* An identity needs both halves of the stored pair to be renderable, so a
   * half-written row falls to the fallback rather than inventing a match. Same
   * reasoning as the Pro Block this replaces. */
  const avatar =
    user.color && user.icon ? (
      <AvatarIdentity color={user.color} icon={user.icon} className="rounded-lg" />
    ) : (
      <AvatarFallback className="rounded-lg" />
    );

  /* Geometry lifted from SidebarAlt1Item so the footer sits in the same column
   * as the nav above it: 40px row either way, and in the rail a 40px box that
   * centres the 32px avatar at x=28 — where every nav icon already is. */
  const trigger = (
    <button
      type="button"
      data-slot="nav-user-quill-trigger"
      /* In the rail the name is not rendered, so the button would otherwise have
       * no accessible name at all — the avatar is aria-hidden decoration. Same
       * fix SidebarAlt1Item applies (it sets aria-label when collapsed). The
       * tooltip is not a substitute: it is not announced. */
      aria-label={expanded ? undefined : user.name}
      className={cn(
        "flex items-center rounded-[var(--c-nav-user-shape-radius-md)] text-[var(--c-nav-user-text-default)]",
        "hover:bg-[var(--c-nav-user-surface-alt)]",
        "outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-nav-user-border-focus)]",
        "data-[state=open]:bg-[var(--c-nav-user-surface-alt)]",
        expanded ? "h-10 w-full gap-3 px-2.5 text-left" : "size-10 justify-center"
      )}
    >
      <Avatar className="size-8 shrink-0 rounded-lg">{avatar}</Avatar>
      {/* Panel-only. In the rail these are absent from the DOM rather than
       * hidden in it — the same call Alt1 makes everywhere else. Hiding them
       * was what pushed the kebab to x=48 and clipped it away silently. */}
      {expanded && (
        <>
          <span className="flex-1 truncate text-sm font-semibold">
            {user.name}
          </span>
          <EllipsisVertical className="size-4 shrink-0" />
        </>
      )}
    </button>
  );

  return (
    <DropdownMenu>
      {/* The label is visible in the panel, so the tooltip is rail-only — same
       * rule SidebarAlt1Item follows.
       *
       * Nesting order is load-bearing and was wrong once already: Tooltip must
       * be OUTSIDE and DropdownMenuTrigger INSIDE. asChild clones its single
       * child and merges props onto it, so the chain has to bottom out at a real
       * DOM node. With DropdownMenuTrigger on the outside, its child was
       * <Tooltip> — a Radix Root that renders no element and forwards nothing —
       * so aria-haspopup/aria-expanded and the click handler evaporated and the
       * menu could never open in the rail. Nested this way both asChild links
       * chain down to the same <button>. */}
      {expanded ? (
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            {user.name}
          </TooltipContent>
        </Tooltip>
      )}
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-60 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* No avatar here. The identity is already established by the
             * trigger this menu hangs off, so repeating it inside adds a second
             * 32px focal point and makes the header out-shout the actions.
             * The avatar lives in the sidebar trigger only. */}
            <DropdownMenuLabel className="p-0 font-normal">
              {/* px-2 to align with the menu items below, which are px-2. */}
              <div className="px-2 py-1.5 text-left text-sm">
                <span className="block truncate font-light text-[var(--c-nav-user-text-subtle)]">
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
             * and the two spans already read as "Version v1.3.2" in order.
             *
             * mb-8 buys a blank row's worth of space before Log out: a menu row
             * is py-1.5 + text-sm's 20px line box = 32px, and mb-8 is the same
             * 32px. Log out is the one destructive-ish action in here, so it
             * gets separated by space rather than by another hairline.
             *
             * font-light (300) is real here, not synthesised — geist/font/sans
             * loads Geist-Variable across a 100–900 axis, so 300 is true Geist
             * Light. It is the first use of 300 in the system; every other
             * weight in components/ is a bare Tailwind font-* utility too (the
             * --p-font-weight-* primitives only serve typography.css's display
             * roles), so this needs no new token. Paired with sand-700 because
             * colour had already bottomed out at AA. */}
            <div className="mb-8 flex items-center justify-between px-2 py-1.5 text-sm font-light text-[var(--c-nav-user-text-subtle)]">

              <span>Version</span>
              <span>{version}</span>
            </div>

            <DropdownMenuItem onSelect={onLogOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
