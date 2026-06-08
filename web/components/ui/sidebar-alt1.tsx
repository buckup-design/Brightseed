"use client"

/**
 * SidebarAlt1 — composition-swap sidebar (Otter.ai pattern).
 * Spec: /sidebar-alt1-spec.md. Coexists with the stock shadcn sidebar.tsx;
 * all exports are suffixed Alt1.
 *
 * The core mechanic, per the spec:
 *   1. On toggle, the rail/panel composition swaps immediately, fully formed.
 *   2. The overflow-hidden wrapper animates width 56px <-> 240px over 150ms
 *      ease-in-out (cubic-bezier(0.4, 0, 0.2, 1), measured from Otter).
 *   3. Inner content is laid out at the DESTINATION width (no transition on
 *      the inner container), so text never rewraps mid-wipe.
 *   4. The toggle is always mounted at opacity 0 and fades in over 300ms on
 *      nav hover or focus-within.
 *
 * Note: this provider binds Cmd/Ctrl+B like the stock SidebarProvider. Don't
 * mount both providers on one page or the shortcut will toggle both.
 */

import * as React from "react"
import { PanelLeftIcon, type LucideIcon } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const SIDEBAR_ALT1_COOKIE_NAME = "sidebar_alt1_state"
const SIDEBAR_ALT1_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
// Structural layout constants (not brand tokens), same bucket as shadcn's
// SIDEBAR_WIDTH. Values measured from Otter: panel 240px, rail 56px.
const SIDEBAR_ALT1_WIDTH = "15rem"
const SIDEBAR_ALT1_WIDTH_RAIL = "3.5rem"
const SIDEBAR_ALT1_WIDTH_MOBILE = "18rem"
const SIDEBAR_ALT1_KEYBOARD_SHORTCUT = "b"
// Width wipe duration. Group focus-on-expand waits this out (+1 frame).
const SIDEBAR_ALT1_WIPE_MS = 150

type SidebarAlt1ContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarAlt1Context = React.createContext<SidebarAlt1ContextProps | null>(
  null
)

function useSidebarAlt1() {
  const context = React.useContext(SidebarAlt1Context)
  if (!context) {
    throw new Error("useSidebarAlt1 must be used within a SidebarAlt1Provider.")
  }
  return context
}

/** True when the full panel composition should render (mobile sheet is always the panel). */
function usePanelComposition() {
  const { state, isMobile } = useSidebarAlt1()
  return isMobile || state === "expanded"
}

function SidebarAlt1Provider({
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
      document.cookie = `${SIDEBAR_ALT1_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_ALT1_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_ALT1_KEYBOARD_SHORTCUT &&
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

  const contextValue = React.useMemo<SidebarAlt1ContextProps>(
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
    <SidebarAlt1Context.Provider value={contextValue}>
      <div
        data-slot="sidebar-alt1-wrapper"
        style={
          {
            "--sidebar-alt1-width": SIDEBAR_ALT1_WIDTH,
            "--sidebar-alt1-width-rail": SIDEBAR_ALT1_WIDTH_RAIL,
            ...style,
          } as React.CSSProperties
        }
        className={cn("flex min-h-svh w-full", className)}
        {...props}
      >
        {children}
      </div>
    </SidebarAlt1Context.Provider>
  )
}

function SidebarAlt1({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebarAlt1()

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar-alt1"
          data-slot="sidebar-alt1"
          data-mobile="true"
          side="left"
          className="w-(--sidebar-alt1-width) bg-[var(--c-sidebar-alt1-surface-default)] p-0 [&>button]:hidden"
          style={
            {
              "--sidebar-alt1-width": SIDEBAR_ALT1_WIDTH_MOBILE,
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
      data-slot="sidebar-alt1"
      data-state={state}
      className={cn(
        // group/alt1 scopes the toggle's hover/focus reveal to the whole nav.
        "group/alt1 relative hidden h-svh shrink-0 flex-col md:flex",
        // The wipe: overflow-hidden + width transition on the OUTER wrapper.
        "overflow-hidden border-r border-[var(--c-sidebar-alt1-border-default)] bg-[var(--c-sidebar-alt1-surface-default)]",
        "transition-[width] duration-150 ease-in-out motion-reduce:transition-none",
        "w-(--sidebar-alt1-width-rail) data-[state=expanded]:w-(--sidebar-alt1-width)",
        className
      )}
      {...props}
    >
      {/* Inner container snaps to the DESTINATION width with no transition,
          so the entering composition is fully laid out before the wipe
          reveals it. This is what prevents mid-animation text rewrap. */}
      <div
        data-slot="sidebar-alt1-inner"
        className={cn(
          "flex h-full flex-col",
          state === "expanded"
            ? "w-(--sidebar-alt1-width)"
            : "w-(--sidebar-alt1-width-rail)"
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
 */
function SidebarAlt1Toggle({
  className,
  onClick,
  ...props
}: React.ComponentProps<"button">) {
  const { state, isMobile, toggleSidebar } = useSidebarAlt1()
  const expanded = isMobile || state === "expanded"

  return (
    <button
      type="button"
      data-slot="sidebar-alt1-toggle"
      aria-label={expanded ? "Close navigation" : "Open navigation"}
      aria-expanded={expanded}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      className={cn(
        "flex size-10 shrink-0 items-center justify-center",
        "rounded-[var(--c-sidebar-alt1-shape-radius-md)] text-[var(--c-sidebar-alt1-text-default)]",
        "hover:bg-[var(--c-sidebar-alt1-surface-alt)]",
        "outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-sidebar-alt1-border-focus)]",
        // The reveal: 300ms opacity fade scoped to nav hover / focus-within.
        "opacity-0 transition-opacity duration-300 motion-reduce:transition-none",
        "group-hover/alt1:opacity-100 group-focus-within/alt1:opacity-100",
        "[&>svg]:size-6 [&>svg]:shrink-0",
        className
      )}
      {...props}
    >
      <PanelLeftIcon />
    </button>
  )
}

/**
 * Header row. Children = the logo slot.
 * Expanded: logo left, toggle right, both visible slots.
 * Collapsed: toggle OCCUPIES the logo slot; the logo crossfades out on
 * hover/focus-within and the toggle crossfades in (both over 300ms).
 */
function SidebarAlt1Header({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const expanded = usePanelComposition()

  if (expanded) {
    return (
      <div
        data-slot="sidebar-alt1-header"
        className={cn(
          "flex h-14 shrink-0 items-center justify-between gap-2 px-3",
          className
        )}
        {...props}
      >
        <div className="flex min-w-0 items-center">{children}</div>
        <SidebarAlt1Toggle />
      </div>
    )
  }

  return (
    <div
      data-slot="sidebar-alt1-header"
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
            "group-hover/alt1:opacity-0 group-focus-within/alt1:opacity-0"
          )}
        >
          {children}
        </div>
        <SidebarAlt1Toggle className="absolute inset-0" />
      </div>
    </div>
  )
}

function SidebarAlt1Content({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const expanded = usePanelComposition()

  return (
    <div
      data-slot="sidebar-alt1-content"
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
  "rounded-[var(--c-sidebar-alt1-shape-radius-md)] text-[var(--c-sidebar-alt1-text-default)]",
  "hover:bg-[var(--c-sidebar-alt1-surface-alt)]",
  "outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-sidebar-alt1-border-focus)]",
  "data-[active=true]:bg-[var(--c-sidebar-alt1-surface-selected-brand)] data-[active=true]:text-[var(--c-sidebar-alt1-text-brand)] data-[active=true]:font-medium",
  "[&>svg]:size-6 [&>svg]:shrink-0"
)

/**
 * Plain nav item. Rail: 40x40 icon only (label not in the DOM).
 * Panel: icon + label row. Lucide icons inherit currentColor.
 */
function SidebarAlt1Item({
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

  return (
    <button
      type="button"
      data-slot="sidebar-alt1-item"
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
}

/**
 * Curated group. Panel: label header + children.
 * Rail: ONE representative 40x40 icon; clicking it expands the nav, then
 * scrolls the group into view and focuses its header after the wipe.
 */
function SidebarAlt1Group({
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
  const { setOpen } = useSidebarAlt1()
  const expanded = usePanelComposition()
  const headerRef = React.useRef<HTMLDivElement>(null)
  const pendingFocus = React.useRef(false)

  React.useEffect(() => {
    if (expanded && pendingFocus.current) {
      pendingFocus.current = false
      const t = setTimeout(() => {
        headerRef.current?.scrollIntoView({ block: "nearest" })
        headerRef.current?.focus({ preventScroll: true })
      }, SIDEBAR_ALT1_WIPE_MS + 16)
      return () => clearTimeout(t)
    }
  }, [expanded])

  if (!expanded) {
    return (
      <button
        type="button"
        data-slot="sidebar-alt1-group-rail-icon"
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
    )
  }

  return (
    <div
      data-slot="sidebar-alt1-group"
      role="group"
      aria-label={label}
      className={cn("flex flex-col gap-1 pt-3", className)}
      {...props}
    >
      <div
        ref={headerRef}
        data-slot="sidebar-alt1-group-label"
        tabIndex={-1}
        className={cn(
          "flex h-8 items-center px-2.5 text-xs font-medium tracking-wide uppercase",
          "text-[var(--c-sidebar-alt1-text-subtle)]",
          "rounded-[var(--c-sidebar-alt1-shape-radius-md)] outline-none focus-visible:ring-1 focus-visible:ring-[var(--c-sidebar-alt1-border-focus)]"
        )}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

/** Children render only in the panel composition (account card, promo, etc.). */
function SidebarAlt1PanelOnly({ children }: { children: React.ReactNode }) {
  const expanded = usePanelComposition()
  if (!expanded) return null
  return <>{children}</>
}

function SidebarAlt1Footer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const expanded = usePanelComposition()

  return (
    <div
      data-slot="sidebar-alt1-footer"
      className={cn(
        "flex shrink-0 flex-col gap-1 py-2",
        expanded ? "px-3" : "items-center px-2",
        className
      )}
      {...props}
    />
  )
}

function SidebarAlt1Inset({
  className,
  ...props
}: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-alt1-inset"
      className={cn("relative flex min-w-0 flex-1 flex-col", className)}
      {...props}
    />
  )
}

export {
  SidebarAlt1,
  SidebarAlt1Content,
  SidebarAlt1Footer,
  SidebarAlt1Group,
  SidebarAlt1Header,
  SidebarAlt1Inset,
  SidebarAlt1Item,
  SidebarAlt1PanelOnly,
  SidebarAlt1Provider,
  SidebarAlt1Toggle,
  useSidebarAlt1,
}
