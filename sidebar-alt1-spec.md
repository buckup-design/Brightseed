# Sidebar Alt1 — component spec

> Status: spec approved decisions below, implementation pending. Component: `web/components/ui/sidebar-alt1.tsx`. Story: `Components/Sidebar Alt1`. The stock shadcn `sidebar.tsx` stays untouched; this is a parallel component, not a replacement (yet).

## Problem

shadcn's `collapsible="icon"` mode morphs one composition in place: width animates while labels clip and fade, group headers vanish, and tooltips get bolted onto every item to compensate. The transition reads as janky and the collapsed state is a degraded version of the expanded one rather than a designed artifact.

Otter.ai's nav does this better. Measured live on otter.ai (June 7, 2026, logged-in web app) to get real values instead of guesses.

## What Otter actually does (measured)

The core trick: **collapsed and expanded are two distinct compositions, and the transition is a clip-reveal wipe, not a morph.**

| Property | Value |
|---|---|
| Expanded width | 240px |
| Collapsed rail width | 56px |
| Width transition | `width 150ms cubic-bezier(0.4, 0, 0.2, 1)` on the outer wrapper |
| Clipping | Nav root is `overflow: hidden`; inner content laid out at final width |
| Content swap | Entering composition mounts instantly (~1 frame after click) at full opacity, no per-label fade or slide. The widening/narrowing container reveals/hides it |
| Toggle reveal | Toggle button always in DOM, `opacity: 0`, fades to 1 over `300ms cubic-bezier(0.4, 0, 0.2, 1)` when the pointer enters the nav (JS-toggled class, not CSS `:hover`) |
| Toggle position | Expanded: fixed slot in the header row, left of the other header controls. Collapsed: occupies the logo slot; logo yields on hover |
| Logo resize | `width/height 100ms cubic-bezier(0, 0, 0.2, 1)` |
| Rail metrics | 56px rail, 40×40px item hit areas, 24px icons, 16px horizontal content padding |
| Rail curation | Account card, promo card, and section labels do not exist in the rail DOM at all. Channels / DMs / Folders each collapse to one representative group icon |

Why this feels better: labels never reflow or clip mid-animation because the entering layout is fully formed before the wipe starts, and 150ms is fast enough to read as one gesture.

## Decisions (Becky, June 7, 2026)

- Capture all four qualities: hover-revealed toggle, two distinct compositions, rail content curation, transition feel.
- Expanded panel **pushes** content. No overlay.
- Base: **shadcn `sidebar.tsx` primitives**, altered. Keep `SidebarProvider`, cookie persistence, Cmd+B shortcut, mobile sheet behavior.
- Build **standalone**; do not swap into the Pro Block App Shell yet.
- Clicking a group icon in the rail **expands the nav** (no popover, no direct navigation).
- Default expanded on first visit; persist last state per user (shadcn's cookie mechanism).
- Name: same as current component plus `-alt1` → `sidebar-alt1.tsx`, `SidebarAlt1*` exports.

## Anatomy

```
<SidebarAlt1Provider>                      state machine, cookie, Cmd+B (from shadcn)
  <SidebarAlt1>                            outer wrapper: overflow-hidden, animates width
    <SidebarAlt1Header>                    logo slot + toggle slot (+ optional actions)
    <SidebarAlt1Content>
      <SidebarAlt1Item icon label />       plain item: rail = icon only, panel = icon + label
      <SidebarAlt1Group icon label>        curated group
        ...items                            panel: header + children. rail: ONE group icon
      </SidebarAlt1Group>
    <SidebarAlt1PanelOnly>                 children render only when expanded
                                            (account card, promo card, etc.)
  <SidebarAlt1Inset>                       main content; reflows when nav width changes
</SidebarAlt1Provider>
```

Two compositions, conditionally rendered on `state` (`expanded` / `collapsed`):

- **Rail (56px):** toggle/logo slot, then one 40×40 icon per `Item` and per `Group`. Nothing inside `PanelOnly` renders. Rail icons and the toggle show tooltips on hover (side right, no delay), added June 7, 2026; panel items don't (labels are visible).
- **Panel (240px):** full composition with labels, group headers, `PanelOnly` content.

## Behavior

**Toggle**
- Always mounted, `opacity: 0` at rest, fades in over 300ms when pointer enters the nav root; fades out on leave. Also revealed on any `:focus-visible` within the nav (keyboard users must be able to find it; Otter doesn't handle this, we do).
- Expanded: fixed slot in the header row. Collapsed: occupies the logo slot, logo crossfades out on hover. The slot position never shifts during hover, only opacity changes.
- `aria-label`: "Close navigation" / "Open navigation". `aria-expanded` on the toggle.

**Transition (the heart of the component)**
1. On toggle, swap the composition immediately (rail ↔ panel, fully formed, full opacity).
2. Animate the wrapper width 56 ↔ 240 over 150ms `cubic-bezier(0.4, 0, 0.2, 1)`.
3. Inner content is laid out at the *destination* width (fixed inner width, not fluid), so text never rewraps mid-transition; the overflow-hidden wrapper clips it.
4. Content area pushes/reflows alongside (it animates implicitly by sitting next to the animating wrapper).
5. `prefers-reduced-motion: reduce` → swap with no width animation.

**Rail group icons**
- Click expands the nav. After expansion, scroll the clicked group into view and move focus to its header.
- Group icon shows active styling if any child route is active.

**State**
- shadcn's existing machinery: cookie persistence, `Cmd+B`, `useSidebar()` context (rename hook `useSidebarAlt1` to avoid collision). Default expanded.
- Mobile: keep shadcn's Sheet behavior as-is (offcanvas overlay below `md`). Out of scope to redesign.

## Implementation notes

- Copy `web/components/ui/sidebar.tsx` → `sidebar-alt1.tsx`. Strip the `collapsible="icon"` morph styling (`group-data-[collapsible=icon]:*` classes), the per-item tooltip plumbing, and the clickable rail edge (`SidebarRail`). Add the composition swap and the hover-revealed toggle.
- Suffix all exports (`SidebarAlt1`, `SidebarAlt1Provider`, …) so both components can coexist in Storybook and future screens.
- Structural constants (56px, 240px, 150ms, 300ms) follow shadcn's existing pattern: CSS vars set by the component (`--sidebar-alt1-width`, `--sidebar-alt1-width-rail`). These are layout constants, not brand decisions.

**Tokens** (one block in `tokens/components.css`, each aliasing one global `--ds-*`):

```
--c-sidebar-alt1-surface            → --ds-color-surface-default
--c-sidebar-alt1-border             → --ds-color-border-default
--c-sidebar-alt1-item-text          → (text default)
--c-sidebar-alt1-item-text-active   → (text brand/active)
--c-sidebar-alt1-item-surface-hover → --ds-color-surface-alt
--c-sidebar-alt1-item-surface-active→ (selected surface)
--c-sidebar-alt1-group-label-text   → (text subtle)
--c-sidebar-alt1-shape-radius-item  → --ds-shape-radius-* (item hover/active pill)
--c-sidebar-alt1-ring               → --ds-color-border-focus
```

Exact `--ds-*` targets to be confirmed against `tokens/semantics.css` at implementation time. Component code references `--c-sidebar-alt1-*` only.

- `[CONCERN]` No motion primitives exist in the token system (durations, easings). v1 hardcodes 150ms/300ms/cubic-beziers as structural constants in the component, same bucket as the widths. If a second component needs motion values, promote to `--p-duration-*` / `--p-easing-*` then.
- `[SUGGESTION]` Otter reveals the toggle only on hover. Consider keeping the toggle at ~40% opacity at rest instead of 0 for discoverability; decide in Storybook with both variants side by side.

## Storybook stories

`web/stories/SidebarAlt1.stories.tsx`, entry `WORK IN PROGRESS/Sidebar Alt1` (per the WIP rule in CLAUDE.md; promotes to `Components/Sidebar Alt1` when done):

1. **Default** — expanded, generic Hummingbird-flavored content (items + two groups + PanelOnly account card slot), live toggle.
2. **Collapsed** — starts in rail state.
3. **Group expansion** — collapsed; clicking a group icon expands and focuses that group.
4. **Dark** — `data-theme="dark"` wrapper; no component-level dark code.

Icons come from the approved icon inventory (Storybook → Foundations → Icons), never hand-rolled SVG.

## Out of scope (v1)

App Shell / Pro Block integration, rail popover flyouts, mobile redesign, tooltip system, Figma counterpart (Figma is sketchpad, not spec).
