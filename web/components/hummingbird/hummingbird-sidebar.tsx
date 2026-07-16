"use client"

/**
 * HummingbirdSidebar, the icon-rail sidebar configured for Hummingbird surfaces.
 *
 * Wraps shadcn/ui's Sidebar in `collapsible="icon"` mode (matches Anna's mocks
 * 4-29-26 and Sidebar.stories.tsx "IconRail"). Brightseed wordmark in the
 * SidebarHeader; primary navigation maps to the five surface kinds; user
 * avatar in the SidebarFooter.
 *
 * Active route is highlighted via `isActive` on SidebarMenuButton. Active state
 * uses --ds-color-surface-alt-hover (sand-200 light / sand-800 dark) per the
 * pattern shadcn ships, no custom token required.
 */

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Compass,
  FlaskConical,
  Layers,
  Settings,
  Sparkles,
  Sprout,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarIdentity } from "@/components/ui/avatar"

const PRIMARY_NAV = [
  { title: "Strategies", href: "/strategies", icon: Compass },
  { title: "Compounds", href: "/compounds", icon: FlaskConical },
  { title: "Plants", href: "/compounds?tab=plants", icon: Sprout },
  { title: "Samples", href: "/samples", icon: Layers },
  { title: "Library", href: "/library", icon: BookOpen },
]

const SECONDARY_NAV = [
  { title: "AI shortcuts", href: "/shortcuts", icon: Sparkles },
  { title: "Settings", href: "/settings", icon: Settings },
]

export function HummingbirdSidebar() {
  const pathname = usePathname() ?? ""

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Brightseed" asChild>
              <Link href="/">
                <span
                  aria-hidden
                  className="flex aspect-square size-8 items-center justify-center rounded-[var(--ds-shape-radius-sm)] bg-[var(--ds-color-surface-brand)] text-[var(--ds-color-text-inverse)] text-[11px] font-semibold tracking-wide"
                >
                  BS
                </span>
                <span className="font-medium">Brightseed</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {PRIMARY_NAV.map((item) => {
                const isActive =
                  item.href === "/strategies"
                    ? pathname.startsWith("/strategies")
                    : item.href.startsWith("/compounds")
                      ? pathname.startsWith("/compounds")
                      : pathname === item.href
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      asChild
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {SECONDARY_NAV.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="user@example.com" asChild>
              <button type="button" className="cursor-pointer">
                <Avatar size="sm">
                  <AvatarIdentity color="cyan" icon="leafy-green" />
                </Avatar>
                <span>Becky Buck</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
