# Brightseed Icon System — Rules

Source: analysis of [Demo Icon Library](https://www.figma.com/design/EnAf4CmIjVCujbzyVkfdLG/) + existing Brightseed badge-icon work (May 2026).
Target page: "Icon sets for components" — node `26646:876956` in `ZZPjoeJ447MWuzNi3LL1BL`.

---

## 1. Component anatomy — every icon, no exceptions

```
COMPONENT "IconName"        ← fixed canvas, clip content ON
  └── VECTOR "Vector"       ← paths here. no fills. strokes only.
```

- Outer frame: clip content enabled
- Inner child: named exactly **`Vector`**, at **`children[0]`** — this position and name are load-bearing
- Outer frame: fills `[]`, strokes `[]`
- Vector child: fills `[]`, strokes = the icon color (see Color section below)
- When authoring via `createNodeFromSvg`: `fill="none"` on every `<path>` — the root `<svg fill="none">` does NOT cascade to children in Figma's plugin API. After creation, verify all child VECTOR nodes have `fills: []`. (CLAUDE.md rule #12.)

**Why `children[0]` / "Vector" is load-bearing:** Figma's instance swap preserves overrides only when source and destination share the same child structure at the same index with the same name. Naming drift or index shifts break color bindings on swap. This is a hard constraint from badge-icon work (May 2026).

---

## 2. Canvas sizes

| Use case | Canvas | Notes |
|---|---|---|
| Standard UI icon (nav, button slot, inline) | 16 × 16 | The demo library's baseline |
| Badge / inline slot icon (Leaf, Rat, Dot) | 14 × 14 | Existing Brightseed spec |
| Status icon with bg circle (Success/Warning/Critical) | 24 × 24 | Existing on icon page |

Never hardcode pixel sizes in component code. Reference the `--icon-N` CSS custom property scale. The demo library uses `var(--icon-4, 16px)` for 16px icons — adopt the same convention. Exact scale steps (`--icon-1` through `--icon-N`) to be defined when the first size-variant consumer appears.

---

## 3. Naming convention

**PascalCase. Direction/modifier first, noun second.**

```
ChevronDown        ✓     (not DownChevron)
ArrowUpRight       ✓     (not RightUpArrow)
HamburgerMenu      ✓
DotsSixVertical    ✓
OctagonAlert       ✓
```

**Filled variants:** append `Filled` suffix to the exact base name. These are **separate COMPONENT nodes**, not variants of a COMPONENT_SET.

```
Calendar           ← line art
CalendarFilled     ← filled, sibling component
Bell / BellFilled
Chat / ChatFilled
```

**Badge-slot icons:** `Noun-badge` — lowercase hyphen suffix.

```
Leaf-badge
Rat-badge
Dot-badge
```

Only make a `Filled` variant when there's a concrete UI use case (e.g. active nav state). Don't pre-build filled variants speculatively.

---

## 4. Color — how icons get their color

Icons must never have baked-in color. Two patterns depending on context:

**Badge-slot icons (14×14):** Inner Vector strokes bound to the variable `tag/active-color` in the `Brightseed Tag Mode` collection. The Variable Modes cascade on the parent Badge component drives the actual color — 10 modes (Neutral, Red, forest, lime, cyan, blue, yellow, orange, lavender, orchid). Never override the stroke to a hardcoded value on a badge-slot icon.

**General UI icons (16×16):** Bind Vector strokes to a semantic icon token from `tokens/semantics.css`. The full icon color vocabulary — already defined and locked (May 2026):

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-icon-default` | `sand-900` | `sand-50` | Standard icons — nav, actions, labels |
| `--color-icon-subtle` | `sand-700` | `sand-300` | Secondary / supporting icons, timestamps |
| `--color-icon-disabled` | `sand-500` | `sand-600` | Disabled state |
| `--color-icon-inverse` | `sand-50` | `sand-900` | Icons on dark/brand surfaces |
| `--color-icon-inverse-subtle` | `sand-300` | `sand-700` | Secondary icons on dark surfaces |
| `--color-icon-brand` | `lime-400` | `lime-400` | Brand accent — theme-invariant |
| `--color-icon-success` | `success-700` | `success-300` | Semantic success |
| `--color-icon-info` | `info-700` | `info-300` | Semantic info |
| `--color-icon-warning` | `warning-700` | `warning-300` | Semantic warning |
| `--color-icon-critical` | `critical-700` | `critical-300` | Semantic error/critical |
| `--color-icon-data` | `data-cyan-700` | `data-cyan-300` | Chart/data series (cyan) |
| `--color-icon-data-lavender` | `data-lavender-700` | `data-lavender-300` | Chart series — lavender |
| `--color-icon-data-orange` | `data-orange-700` | `data-orange-300` | Chart series — orange |
| `--color-icon-data-orchid` | `data-orchid-700` | `data-orchid-300` | Chart series — orchid |
| `--color-icon-favorite-inactive` | `sand-300` | `sand-700` | Star/pin on card hover, unfavorited |
| `--color-icon-favorite-active` | `yellow-500` | `yellow-500` | Favorited/pinned — theme-invariant |

**Default rule:** use `--color-icon-default` unless there's a specific reason to use another. Never reach past semantics to intents or primitives. Never hardcode hex on an icon.

---

## 5. Category grouping on canvas

Group icons into labeled frames by semantic category. Suggested Brightseed categories (adapt as needed):

| Frame name | Contents |
|---|---|
| `Chevrons` | ChevronDown, ChevronUp, ChevronRight, ChevronLeft, ChevronDoubleRight/Left |
| `Arrows` | ArrowLeft, ArrowRight, ArrowUp, ArrowDown, ArrowUpRight, etc. |
| `Actions` | Plus, Minus, X, Copy, Search, Edit, Trash, More, Drag, Bookmark |
| `Status` | Check, CheckCircle, Warning, Lightning, Info, X (error) |
| `Data` | Filter, Sort, Chart, Table, Expand, Collapse |
| `Navigation` | Calendar, Bell, Chat, People, Home, Settings |
| `Forager` | Compound, Plant, Strategy, Screening-domain icons |
| `Brand` | Hummingbird motif, Brightseed-specific |

Each frame: category name is the frame name. Icons in a row, consistent spacing.

---

## 6. Component descriptions

Every icon component should have a Figma component description documenting semantic meaning — not just the visual shape. Format: `Primary use / Secondary use`.

```
Calendar       → "Schedule / Course"
Bell           → "Notification / Alert"
Check          → "Success / Confirm / Complete"
HamburgerMenu  → "Mobile nav / Overflow menu"
```

This is a searchability and handoff aid. AI agents read these descriptions when selecting icons for component assembly.

---

## 7. Badge-slot icons — extended rules

These are the 14×14 icons used as swap targets in the Primary Badge `Inline Start` / `Inline End` slots (Leaf-badge, Rat-badge, Dot-badge). Additional constraints beyond the base anatomy:

1. Outer COMPONENT frame: 14×14, fills `[]`, strokes `[]`
2. Inner child at `children[0]` named `Vector`
3. Vector: fills `[]`, strokes bound to `tag/active-color`, **1px CENTER** alignment
4. When adding a new badge-slot icon: add it to `preferredValues` on both `Inline Start` and `Inline End` props of the Primary Badge component set

**Dot-badge special pattern:** Uses a 0×0 LINE node at `children[0]` named `Vector`, `strokeWeight=4`, `strokeCap=ROUND`. A round cap on a zero-length line produces a filled-looking 4px circle from a single stroke. Preserves the same `children[0].strokes[0]` binding path as Leaf/Rat, so swap compatibility is maintained.

---

## 8. The icon page in v3

**File:** `shadcn Brightseed v3 (with pro blocks)` (`ZZPjoeJ447MWuzNi3LL1BL`)
**Page node:** `26646:876956` — "Icon sets for components"

This page is for **component-specific icon groups** — clusters of icons that travel together as a unit inside one component. Currently holds:

- `FavoriteIcon` — state: boolean (unfilled / filled star)
- `StatusIcon` — state: "Success" | "Warning" | "Critical" (icon + colored bg circle)
- Badge slot icons: `Leaf-badge`, `Rat-badge`, `Dot-badge`

**General icon library** (all reusable UI icons) goes in a separate section on this page or a new page, to be established when the first batch of general icons lands. When that section exists, add its node ID here.

---

## Icon inventory

### `AlertIcon` — COMPONENT_SET
**Node ID:** `26649:1059244`
**Section:** "Alert Icons" section `26649:1059245`, on the Lucide Icons page (`1:433`)
**Axes:** `Variant = Info | Success | Warning | Critical` × `Style = Default | Sparkles | Shield | Circle | Octagon`
**Size:** 24×24
**Color binding:** Each variant's Vector stroke bound to the matching Brightseed semantic variable:
- Info → `base/icon-info` (`VariableID:26593:386081`)
- Success → `base/icon-success` (`VariableID:26593:386080`)
- Warning → `base/icon-warning` (`VariableID:26593:386082`)
- Critical → `base/icon-critical` (`VariableID:26593:386083`)

**Valid combinations (9):**

| Variant | Style | Lucide source |
|---|---|---|
| Info | Default | Lucide Icon / Info |
| Info | Sparkles | Lucide Icon / Sparkles |
| Success | Default | Lucide Icon / CircleCheck |
| Success | Shield | Lucide Icon / ShieldCheck |
| Warning | Default | Lucide Icon / TriangleAlert |
| Warning | Circle | Lucide Icon / CircleAlert |
| Warning | Shield | Lucide Icon / ShieldAlert |
| Critical | Default | Lucide Icon / CircleX |
| Critical | Octagon | Lucide Icon / OctagonX |

---

### Alert component — `Variant=Default/Destructive/Info/Success/Warning`
**Component set node:** `26:160` (frame "Alert") on the Alert page (`21:322`)
**Storybook parity:** full — 5 Figma variants match the 5 `alert.tsx` variants

**Correct icon color bindings (as of May 28, 2026):**

| Variant | Icon | Icon color variable | Dark mode value |
|---|---|---|---|
| Default | Lucide Icon / CircleAlert | `base/foreground` | `sand-50` |
| Destructive | Lucide Icon / OctagonX | `base/icon-destructive` | `red-400` at 80% |
| Info | Lucide Icon / Info | `base/icon-info` | `blue-300` |
| Success | Lucide Icon / CircleCheck | `base/icon-success` | `forest-600` |
| Warning | Lucide Icon / TriangleAlert | `base/icon-warning` | `yellow-200` at 80% |

**Background / text / border bindings per variant:**

| Variant | Background | Text | Border |
|---|---|---|---|
| Default | `base/card` | `base/foreground` | `base/border` |
| Destructive | `base/surface-critical` | `base/text-critical` | `base/border-critical` |
| Info | `base/surface-info` | `base/text-info` | `base/border-info` |
| Success | `base/surface-success` | `base/text-success` | `base/border-success` |
| Warning | `base/surface-warning` | `base/text-warning` | `base/border-warning` |

**Lesson:** `base/text-warning` ≠ `base/icon-warning` — use the icon-scoped token for icon strokes, not the text token, even when they resolve to similar values. Caught during build (May 28, 2026).

---

## 9. What to document when adding new icons

When Claude creates a new icon via `figma_execute` or `createNodeFromSvg`:

1. Place inside the correct category frame (create it if it doesn't exist)
2. Confirm `children[0]` is named `Vector` and has `fills: []`
3. Bind strokes to the correct color variable (`tag/active-color` for badge-slot, TBD semantic token for general)
4. Set component description in Figma
5. Update `preferredValues` on Badge set if it's a badge-slot icon
6. Add the icon name and ID to this file under a new "Icon inventory" section (to be started when library grows)
