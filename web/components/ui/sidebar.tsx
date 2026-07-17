"use client"

/**
 * Sidebar — the Quill sidebar. Composition-swap, after Otter.ai. The design
 * rationale lives in this file and in Components/Sidebar's docs page; the
 * original spec doc was deleted July 16 2026 once both carried it.
 *
 * This WAS sidebar-alt1, built alongside stock shadcn's sidebar to prove a
 * different collapse model. It won: Becky took the Hummingbird shell onto it,
 * then retired stock outright (July 16 2026). Stock and its whole ecosystem —
 * App Shell 4, the Pro Block nav parts, the old hummingbird shell — are gone
 * from the repo; this is now the only sidebar, and the Alt1 suffix is gone with
 * the thing it distinguished itself from.
 *
 * The core mechanic, and the reason it won:
 *   1. On toggle, the rail/panel composition swaps immediately, fully formed.
 *   2. The overflow-hidden wrapper animates width 56px <-> 240px over 150ms
 *      ease-in-out (cubic-bezier(0.4, 0, 0.2, 1), measured from Otter).
 *   3. Inner content is laid out at the DESTINATION width (no transition on
 *      the inner container), so text never rewraps mid-wipe.
 *   4. The toggle is always mounted at opacity 0 and fades in over 300ms on
 *      nav hover or focus-within.
 *
 * What stock did instead — morph one composition in place, squeezing labels to
 * nothing as the width animates — is what this was built against, and is what
 * produced the clipped "B" in the brand mark that finally killed it.
 * Panel-only content here is ABSENT from the rail (SidebarPanelOnly), never
 * hidden inside it. Keep it that way; that is the whole thesis.
 *
 * Deliberately absent, so nobody helpfully restores them:
 *   - Stock's SidebarRail, the clickable/draggable border strip. The
 *     hover-revealed toggle and Cmd/Ctrl+B are the two ways to collapse; an
 *     invisible third hit target on the border is not a third.
 *   - Stock's collapsible="icon" morph classes and its per-item tooltip
 *     plumbing, both of which existed to compensate for the morph.
 */

import * as React from "react"
import {
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  type LucideIcon,
} from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
// Structural layout constants (not brand tokens), same bucket as shadcn's
// SIDEBAR_WIDTH. Measured live off otter.ai, June 7 2026 — panel 240px, rail
// 56px, and on the rail: 40x40 item hit areas, 24px icons, 16px horizontal
// content padding. These are measurements, not preferences; do not round them.
const SIDEBAR_WIDTH = "15rem"
const SIDEBAR_WIDTH_RAIL = "3.5rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"
// The motion values below (150ms wipe, 300ms fade, the easing) are hardcoded on
// purpose — same bucket as the widths above. The token system has no motion
// primitives: no --p-duration-*, no --p-easing-*. Standing up a whole tier for
// one component is not worth it. The trigger to change that is a SECOND
// component needing motion values; promote them then. Until then this is a
// considered exemption from the no-hardcoded-values rule, not an oversight.
//
// Width wipe duration. Group focus-on-expand waits this out (+1 frame).
// CAUTION: this constant only drives the JS focus timer. The CSS wipe is a
// literal `duration-150` on the outer wrapper, because Tailwind needs literal
// class strings. Change one and you must change the other.
const SIDEBAR_WIPE_MS = 150
// Tooltip delay, measured live on otter.ai (June 7, 2026): their nav tooltips
// are Radix Tooltip at the DEFAULT delayDuration (700ms; measured ~787ms
// pointerover → data-state open, incl. event latency). Applies to all nav
// tooltips including the toggle. Radix's default skipDelayDuration (300ms)
// gives the instant follow-up tooltips when sweeping the rail, same as Otter.
const SIDEBAR_TOOLTIP_DELAY_MS = 700

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(
  null
)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }
  return context
}

/** True when the full panel composition should render (mobile sheet is always the panel). */
function usePanelComposition() {
  const { state, isMobile } = useSidebar()
  return isMobile || state === "expanded"
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={SIDEBAR_TOOLTIP_DELAY_MS}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-rail": SIDEBAR_WIDTH_RAIL,
              ...style,
            } as React.CSSProperties
          }
          className={cn("flex min-h-svh w-full", className)}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          side="left"
          className="w-(--sidebar-width) bg-[var(--c-sidebar-surface-default)] p-0 [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
            <SheetDescription>Displays the mobile navigation.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      data-slot="sidebar"
      data-state={state}
      className={cn(
        // group/sidebar scopes the toggle's hover/focus reveal to the whole nav.
        "group/sidebar relative hidden h-svh shrink-0 flex-col md:flex",
        // The wipe: overflow-hidden + width transition on the OUTER wrapper.
        "overflow-hidden border-r border-[var(--c-sidebar-border-default)] bg-[var(--c-sidebar-surface-default)]",
        "transition-[width] duration-150 ease-in-out motion-reduce:transition-none",
        "w-(--sidebar-width-rail) data-[state=expanded]:w-(--sidebar-width)",
        className
      )}
      {...props}
    >
      {/* Inner container snaps to the DESTINATION width with no transition,
          so the entering composition is fully laid out before the wipe
          reveals it. This is what prevents mid-animation text rewrap. */}
      <div
        data-slot="sidebar-inner"
        className={cn(
          "flex h-full flex-col",
          state === "expanded"
            ? "w-(--sidebar-width)"
            : "w-(--sidebar-width-rail)"
        )}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Hover-revealed toggle. Always mounted at opacity 0; fades in over 300ms
 * when the pointer enters the nav or focus lands inside it (Otter only does
 * hover; we add focus-within so keyboard users can find it).
 *
 * Icon carries the expand/collapse affordance: panel + chevron pointing the
 * way the nav will move (PanelLeftOpen collapsed, PanelLeftClose expanded).
 * Matches Becky's Figma comps `Sidebar / ExpandIcon` + `Sidebar /
 * CollapseIcon` (Library, section 28517:1302397), which compose the same
 * lucide panel-left-open/close geometry.
 */
function SidebarToggle({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { state, isMobile, toggleSidebar } = useSidebar()
  const expanded = isMobile || state === "expanded"

  const button = (
    <button
      type="button"
      data-slot="sidebar-toggle"
      aria-label={expanded ? "Close navigation" : "Open navigation"}
      aria-expanded={expanded}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center",
        "rounded-[var(--c-sidebar-shape-radius-md)] text-[var(--c-sidebar-text-subtle)]",
        "hover:bg-[var(--c-sidebar-surface-alt)]",
        "outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-sidebar-border-focus)]",
        // The reveal: 300ms opacity fade scoped to nav hover / focus-within.
        // DESKTOP ONLY. Touch has no hover to key off, and in the mobile Sheet
        // this toggle is the *only* visible way to close the nav (the Sheet's own
        // X is hidden by [&>button]:hidden on SheetContent). Left at opacity 0 it
        // becomes an invisible-but-tappable phantom in the nav header. So on
        // mobile it renders solid. Closes DOCS/tickets/sidebar-mobile-phantom-tap.md.
        !isMobile &&
          cn(
            "opacity-0 transition-opacity duration-300 motion-reduce:transition-none",
            "group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100"
          ),
        "[&>svg]:size-5 [&>svg]:shrink-0",
        className
      )}
      {...props}
    >
      {expanded ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
    </button>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center">
        {expanded ? "Close navigation" : "Open navigation"}
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Header row. Children = the logo slot.
 * Expanded: logo left, toggle right, both visible slots.
 * Collapsed: toggle OCCUPIES the logo slot; the logo crossfades out on
 * hover/focus-within and the toggle crossfades in (both over 300ms).
 */
function SidebarHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const expanded = usePanelComposition()

  if (expanded) {
    return (
      <div
        data-slot="sidebar-header"
        className={cn(
          "flex h-14 shrink-0 items-center justify-between gap-2 px-3",
          className
        )}
        {...props}
      >
        <div className="flex min-w-0 items-center">{children}</div>
        <SidebarToggle />
      </div>
    )
  }

  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        "flex h-14 shrink-0 items-center justify-center",
        className
      )}
      {...props}
    >
      {/* Single 40x40 cell: logo and toggle stacked, opacity crossfade. */}
      <div className="relative size-10">
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center",
            "transition-opacity duration-300 motion-reduce:transition-none",
            "group-hover/sidebar:opacity-0 group-focus-within/sidebar:opacity-0"
          )}
        >
          {children}
        </div>
        <SidebarToggle className="absolute inset-0" />
      </div>
    </div>
  )
}

function SidebarContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const expanded = usePanelComposition()

  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden py-2",
        expanded ? "px-3" : "items-center px-2",
        className
      )}
      {...props}
    />
  )
}

const itemBaseClasses = cn(
  "flex items-center text-sm",
  "rounded-[var(--c-sidebar-shape-radius-md)] text-[var(--c-sidebar-text-muted)]",
  "hover:bg-[var(--c-sidebar-surface-alt)]",
  "outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-sidebar-border-focus)]",
  "data-[active=true]:bg-[var(--c-sidebar-surface-selected-brand)] data-[active=true]:text-[var(--c-sidebar-text-brand)] data-[active=true]:font-medium",
  "[&>svg]:size-6 [&>svg]:shrink-0"
)

/**
 * Plain nav item. Rail: 40x40 icon only (label not in the DOM).
 * Panel: icon + label row. Lucide icons inherit currentColor.
 */
function SidebarItem({
  icon: Icon,
  label,
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  icon: LucideIcon
  label: string
  isActive?: boolean
}) {
  const expanded = usePanelComposition()

  const button = (
    <button
      type="button"
      data-slot="sidebar-item"
      data-active={isActive}
      aria-label={expanded ? undefined : label}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        itemBaseClasses,
        expanded
          ? "h-10 w-full gap-3 px-2.5 text-left"
          : "size-10 justify-center",
        className
      )}
      {...props}
    >
      <Icon />
      {expanded && <span className="truncate">{label}</span>}
    </button>
  )

  // Labels are visible in the panel; tooltips only make sense on the rail.
  if (expanded) {
    return button
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right" align="center">
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Curated group. Panel: label header + children.
 * Rail: ONE representative 40x40 icon; clicking it expands the nav, then
 * scrolls the group into view and focuses its header after the wipe.
 *
 * Clicking the rail icon EXPANDS. It does not navigate, and it does not open a
 * popover flyout — both were considered and rejected. A flyout is what most
 * collapsed navs do, so expect it to be proposed again: the answer is that it
 * would put panel content back on the rail, which is the one thing this
 * component exists to prevent. The rail icon is a way into the panel, not a
 * shortcut past it.
 *
 * `isActive` on a group is a ROLLUP, not the header's own state: pass true when
 * any child route is active. Otherwise the rail loses all active signal the
 * moment the labels go, which is exactly the degraded-collapsed-state failure
 * this component was built to avoid.
 */
function SidebarGroup({
  icon: Icon,
  label,
  isActive = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  icon: LucideIcon
  label: string
  isActive?: boolean
}) {
  const { setOpen } = useSidebar()
  const expanded = usePanelComposition()
  const headerRef = React.useRef<HTMLDivElement>(null)
  const pendingFocus = React.useRef(false)

  React.useEffect(() => {
    if (expanded && pendingFocus.current) {
      pendingFocus.current = false
      const t = setTimeout(() => {
        headerRef.current?.scrollIntoView({ block: "nearest" })
        headerRef.current?.focus({ preventScroll: true })
      }, SIDEBAR_WIPE_MS + 16)
      return () => clearTimeout(t)
    }
  }, [expanded])

  if (!expanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            data-slot="sidebar-group-rail-icon"
            data-active={isActive}
            aria-label={`${label} — open navigation`}
            onClick={() => {
              pendingFocus.current = true
              setOpen(true)
            }}
            className={cn(itemBaseClasses, "size-10 justify-center", className)}
          >
            <Icon />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div
      data-slot="sidebar-group"
      role="group"
      aria-label={label}
      className={cn("flex flex-col gap-1 pt-3", className)}
      {...props}
    >
      <div
        ref={headerRef}
        data-slot="sidebar-group-label"
        tabIndex={-1}
        className={cn(
          "flex h-8 items-center px-2.5 text-xs font-medium tracking-wide uppercase",
          "text-[var(--c-sidebar-text-subtle)]",
          "rounded-[var(--c-sidebar-shape-radius-md)] outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-sidebar-border-focus)]"
        )}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

/** Children render only in the panel composition (account card, promo, etc.). */
function SidebarPanelOnly({ children }: { children: React.ReactNode }) {
  const expanded = usePanelComposition()
  if (!expanded) return null
  return <>{children}</>
}

function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const expanded = usePanelComposition()

  return (
    <div
      data-slot="sidebar-footer"
      className={cn(
        "flex shrink-0 flex-col gap-1 py-2",
        expanded ? "px-3" : "items-center px-2",
        className
      )}
      {...props}
    />
  )
}

function SidebarInset({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn("relative flex min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarItem,
  SidebarPanelOnly,
  SidebarProvider,
  SidebarToggle,
  useSidebar,
}
