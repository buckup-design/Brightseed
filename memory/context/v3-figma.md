# v3 Figma file, context

**Name:** "shadcn Brightseed v3 (with pro blocks)"
**File key:** `ZZPjoeJ447MWuzNi3LL1BL`
**URL:** https://www.figma.com/design/ZZPjoeJ447MWuzNi3LL1BL/shadcn-ui-kit-Brightseed--with-pro-blocks-
**Set up:** May 6, 2026, canonical going forward (v2 archived)

## Page-level structure
76 pages. Key ones:
- **Documentation / Style Guide / Academy:** top, doc-only
- **Icons [READ THE DOCS!]** + **Lucide Icons:** icon library (1469 local Lucide components after May 8 restore)
- **Assets**
- **Brightseed Blocks (all in use) 🔷:** curated home for Brightseed-port'd blocks (id `26465:212221`)
- **Blocks (Official):** stock shadcn block showcase
- **Pro Blocks (Application / Landing Page / E-commerce) 🔷:** paid Pro Pack scaffolding
- **Plugin 🟣**
- **Components:** single text page with nav help
- ~50 individual component pages (Accordion, Alert, …, Toggle, Tooltip)
- **Typography**
- **Utility Components**

Pages named `---` are dividers (empty by design, don't try to delete).

## Variable collections
- **Brightseed Foundations** (renamed from `1. TailwindCSS`), 3 universal primitives: transparent / black / white
- **Brightseed Primitives:** 10 hue scales × 11 steps. Naming `brightseed/{scale}/{step}` (e.g. `brightseed/forest/700`, `brightseed/lime/300`)
- **Brightseed Mode** (~50 vars), bridge surface mapping shadcn slot vocabulary to Brightseed primitives. Names mirror shadcn (`base/background`, `base/primary`, `base/primary-hover`, `base/link-brand`, etc.)
- **Brightseed Tag Mode** (10 modes), tag-active-color cascade for Primary Badge inline-slot color tracking

## Quill conventions
- Local Brightseed `Ring` component_set used for all focus rings (variant: `Shape={xs/sm/md/lg/xl/2xl/3xl/4xl/full}`). Stroke 1px, offset 1px from body.
- `custom/outline` aliased to `base/border` (theme-aware sand-200 / sand-700)
- Brightseed Mode names match shadcn slot names so Pro Pack components can be rebind'd via name-match
- Brand-link uses lime, not forest (May 2026 update)
- Mantel was renamed Quill May 6, if you see Mantel anywhere, it's stale

## Plugin notes (figma-console)
- 30-second WebSocket round-trip timeout; chunk bulk operations into batches of ≤12 mutations per `figma_execute` call
- File-wide `findAllWithCriteria` is too expensive, scan one page at a time
- Per-instance `getMainComponentAsync` is slow at scale; pre-filter by `inst.name` first
- When a call times out, work usually completes server-side; next call may see "already done", verify with a small probe between batches
- "DUPLICATE_PAGE: 5 pages named ---" is a recurring housekeeping warning, those are intentional divider pages, NOT cleanup-required
