"use client"

/**
 * AppShell, the layout wrapper used by every Hummingbird surface.
 *
 * Structure:
 *   ┌─────────────┬────────────────────────────────────────────┐
 *   │             │  TopBar      (compact: project breadcrumb, │
 *   │  Sidebar    │               user avatar)                 │
 *   │  (icon      ├────────────────────────────────────────────┤
 *   │   rail,     │  SurfaceHeader (page-owned: title, tabs,   │
 *   │   collap-   │                 filters)                   │
 *   │   sible)    ├────────────────────────────────────────────┤
 *   │             │                                            │
 *   │             │  Surface content (children)                │
 *   │             │                                            │
 *   └─────────────┴────────────────────────────────────────────┘
 *
 * Why two header bands instead of one: the top bar is app-level chrome (where
 * are you in the project, who is logged in). The surface header is page-level
 * topic (what surface, what tabs, what filters). Collapsing them into one
 * forces every surface to repeat app-level metadata, which is the SaaS-cream
 * trap PRODUCT.md anti-references warn against. Separating them keeps the
 * surface header free to carry editorial weight.
 *
 * Pages render their own SurfaceHeader inside the children slot, AppShell
 * doesn't impose one. That's deliberate: the header is page-owned content,
 * not chrome.
 */

import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { HummingbirdSidebar } from "./hummingbird-sidebar"
import { PROJECT } from "./data"

export type AppShellProps = {
  children: React.ReactNode
  /** Override the project name shown in the top-bar breadcrumb. Defaults to `PROJECT.name`. */
  projectName?: string
  /** Current surface name shown after the project breadcrumb separator. */
  surfaceLabel?: string
}

export function AppShell({
  children,
  projectName = PROJECT.name,
  surfaceLabel,
}: AppShellProps) {
  return (
    <SidebarProvider defaultOpen={false}>
      <HummingbirdSidebar />
      <SidebarInset className="bg-[var(--ds-color-surface-default)]">
        <TopBar projectName={projectName} surfaceLabel={surfaceLabel} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

// ── Top bar ───────────────────────────────────────────────────────────────

function TopBar({
  projectName,
  surfaceLabel,
}: {
  projectName: string
  surfaceLabel?: string
}) {
  return (
    <div
      data-slot="app-shell-top-bar"
      className={cn(
        "sticky top-0 z-20 flex h-12 shrink-0 items-center gap-3",
        "border-b border-[var(--ds-color-border-subtle)]",
        "bg-[var(--ds-color-surface-default)]/95 backdrop-blur-[2px]",
        "px-4"
      )}
    >
      <SidebarTrigger className="size-8 shrink-0" />

      {/* Project breadcrumb. Calm and small, the app top bar should not compete
          with the surface header below it. */}
      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 flex-1 items-center gap-1.5 text-sm"
      >
        <Link
          href="/"
          className={cn(
            "shrink-0 text-[var(--ds-color-text-subtle)] transition-colors",
            "hover:text-[var(--ds-color-text-default)]"
          )}
        >
          {projectName}
        </Link>
        {surfaceLabel ? (
          <>
            <ChevronRight
              aria-hidden
              className="size-3.5 shrink-0 text-[var(--ds-color-text-subtle)]"
            />
            <span className="min-w-0 truncate text-[var(--ds-color-text-default)]">
              {surfaceLabel}
            </span>
          </>
        ) : null}
      </nav>

      {/* Project meta, quiet status pill on the right. Tag-color decorative
          (lavender), not implying status meaning per DESIGN.md. */}
      <span
        className={cn(
          "hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full",
          "bg-[var(--ds-color-surface-tag-lavender)] px-2.5 py-0.5",
          "text-[11px] font-medium text-[var(--ds-color-text-tag-lavender)]"
        )}
      >
        <span aria-hidden className="size-1.5 rounded-full bg-current" />
        Active project
      </span>
    </div>
  )
}
