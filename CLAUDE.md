# Brightseed Digital Design: Project Brief

> **This is the canonical rules doc.** A rule or value is stated once, here or in the CSS, other docs point to it, never restate it. Dated decision history is not kept here; it lives in git. When a doc disagrees with `tokens/*.css` or Storybook, the running system wins.

## What this project is

This project builds **Quill**, an AI-ready design system, and evolves the visual brand for **Hummingbird**, Brightseed's biotech compound-screening application. The deliverable is a production design system Brightseed's team can build on. The design bar is high: Hummingbird is an enterprise product and needs to look like one.

**Naming:** **Quill** = the design system (this project's deliverable). **Hummingbird** = the Brightseed application that Quill skins. **Forager** = the AI discovery model that powers Hummingbird. In these docs, "screens / surfaces / regions / the product UI" means Hummingbird; "the model / discovery engine" means Forager.

**Website:** https://www.brightseedbio.com/ · **App:** Hummingbird (dense data tables, charts, canvas-style UIs), powered by the Forager AI model.

The deliverable is **the workflow** as much as the design system: an end-to-end Cowork → preview → merge pipeline that lets non-engineers prototype Hummingbird screens without breaking production.

## Memory pointer

- `memory/` (local only, not in the repo), memory-management format: `glossary.md`, `people/`, `projects/`, `context/`.

Tiered lookup: this file → `memory/glossary.md` → `memory/people|projects|context/`. If a term isn't in any of those, ask.

## Tech stack

Next.js + shadcn/ui + Tailwind CSS · color via CSS custom properties (no hardcoded hex) · Vercel hosting · Figma (shadcn base, re-skinned to Brightseed) · GitHub (`github.com/buckup-design/Brightseed`).

---

## Design system: architecture & rules

Three-layer token system. The CSS in `tokens/` is the source of truth for all names and values; this section is the rules, not a value list. (What was once split into separate "intents" and "semantics" tiers is now one merged semantic layer, there is no `intents.css`.)

```
Primitives   --p-color-forest-700        raw values, organized by $type
   ↓
Semantics    --ds-color-surface-success  ← the only tier that touches primitives
   ↓
Components   --c-button-bg: var(--ds-color-...) ← component-scoped tokens, emitted --c-{component}-*
             bg-[var(--c-button-bg)]            ← each --c-{component}-* aliases one global --ds-*
```

**Token prefixes**

| Layer | Prefix | Example |
|---|---|---|
| Primitive | `--p-{type}-*` | `--p-color-forest-700`, `--p-radius-md`, `--p-space-4` |
| Semantic | `--ds-*` | `--ds-color-surface-success`, `--ds-shape-radius-md` |
| Component (scoped) | `--c-{component}-*` | `--c-alert-surface-success: var(--ds-color-surface-success)`; used as `bg-[var(--c-alert-surface-success)]` |

Primitives are organized by `$type` (the W3C tokens axis): `--p-color-*`, `--p-radius-*` / `--p-space-*` / `--p-border-width-*`, `--p-font-family-*` / `--p-font-size-*` / `--p-font-weight-*`. The bare `--color-*` primitive names are fully retired. **Not primitives, deliberately:** shadow (`--ds-shadow-*`, a color recipe) and display roles `h1/h2/h3` (`--ds-text-display-*`).

**Rules**

◆ **No tier-skipping.** Component code references its own component-scoped tokens `--c-{component}-*` only, never a global `--ds-*` (e.g. `--ds-color-*`), a primitive, or a raw value directly. Each `--c-{component}-*` token aliases exactly one global `--ds-*` semantic; these definitions live in `tokens/components.css`, one block per component, generated 1:1 from each component's needs. The global `--ds-*` semantics remain the only tier that touches primitives. The prefix encodes the tier (`--p-` / `--ds-` / `--c-`), so the discipline is greppable: component code may reference only `--c-*`; a `--c-*` definition may reference only a global `--ds-*`. (Decided June 2026, BSDS-102: the component tier is Quill's public API for AI-assisted prototyping, so it carries a distinct emitted prefix, SLDS-style, rather than sharing `--ds-`.) (Dark theme needs no overrides in `components.css`: a `--c-{component}-*` token resolves `var(--ds-*)` at point of use, so the `data-theme="dark"` swap on the global `--ds-*` flows straight through.)

◆ **No hardcoded values.** No hex, px, or font names in component styles. Use `var(--c-{component}-*)` or Tailwind arbitrary refs (`bg-[var(--c-alert-surface-success)]`). CSS-variable arbitrary refs are allowed; hardcoded-hex arbitrary values are not.

◆ **Semantic intent.** Tokens name usage (`--ds-color-surface-default`), not appearance.

◆ **Light-first.** Defaults assume a light background. Dark theme swaps semantic tokens via `data-theme="dark"` on an ancestor, never write dark-mode-specific component code.

◆ **Corner radii** flow through the component-scoped token (`--c-{component}-shape-radius-*` → `--ds-shape-radius-*` → `--p-radius-*`), never raw pixels.

◆ **Brand-poetic names forbidden in code.** Names like "Chlorophyll," "Deep Forest," and "Garlic Bloom" must not appear anywhere in code. Everywhere else use functional names (`lime/400`, `forest/900`, `sand/100`). Seeing one elsewhere = a regression to fix.

◆ **If no token exists** for what you need, flag `// BRIGHTSEED-TBD: [BLOCKING] <reason>` and stop. Don't improvise.

**Key brand anchors** (values live in `tokens/`):

| Role | Token | Value |
|---|---|---|
| Primary surface | `--ds-color-surface-brand` | deep forest |
| Primary action | `--ds-color-action-primary` | `#CDE67B` lime-300 (hover lime-400, pressed lime-500) |
| Default background | `--ds-color-surface-default` | `#FFFFFF` light / `#1F1F1E` sand-950 dark |

Color scale names: forest, lime, sand, cyan, blue, yellow, orange, lavender, orchid, red, neutral (renamed from green/indigo/purple). Charts use `--chart-cat-1`…`--chart-cat-8` (separate `--chart-*` namespace); never brand lime or forest as a data series.

---

## Current status

| Area | Status |
|---|---|
| Token system (3-tier, dark theme, shadcn bridge); component-scoped tokens in `tokens/components.css` emitted as `--c-{component}-*` (renamed from `--ds-{component}-*` June 7, 2026, BSDS-102). **All of `web/components/ui/` reads its own `--c-{component}-*` only** — 47 blocks in `components.css`: 37 serve `ui/`, the other 10 serve `components/quill/`. The last 16 migrated off the bridge July 16, 2026. (Six `ui/` files carry no tokens of their own by design: the `chip`/`tag`/`number-badge` wrappers inherit `--c-badge-*` through the shared Badge engine, and `badge-icons`, `collapsible`, `evidence-tag` are structural.) | ✅ Complete |
| Token gaps the `ui/` migration surfaced (grep `BRIGHTSEED-TBD` in `web/components/ui/`) — all closed July 2026: `--ds-shadow-xs` now exists as a full form-control shadow scale; the radius scale added `--p-radius-2xs` and bumped `--p-radius-xs` to the 4px Checkbox step (BREAKING); the disabled fade is unified on `--ds-disabled-text-opacity`, the few remaining `opacity-50` being decorative and kept verbatim. Values in `tokens/shape.css` | ✅ Complete |
| Two latent bugs the migration exposed but did **not** cause: `input-group`'s `calc(var(--radius)-5px)`; `sidebar`'s `shadow-[0_0_0_1px_hsl(var(--sidebar-border))]`. Both were in fact closed by the July 16 `ui/` migration itself — `var(--radius)` appears nowhere in `ui/` code and the sidebar ring is now `var(--c-sidebar-border-default)`. Row was stale; verified + closed July 16, 2026 | ✅ Complete |
| **The stock shadcn sidebar is gone** (July 16, 2026). `sidebar-alt1` — the composition-swap experiment — won, took the name `sidebar`, and stock was deleted along with everything that only existed to serve it: App Shell 4, the Pro Block nav parts (`nav-main`, `nav-projects`, `team-switcher`, `nav-user`), the old hummingbird shell, and five stories. `components/pro-blocks/application/` no longer exists. One sidebar, one `--c-sidebar-*` block | ✅ Complete |
| `components/quill/` — Anna's proposal (Collab Playground `88:1547`) built out: `app-shell-quill` (**Blocks/**), `team-switcher` (**Blocks/**), `nav-user-quill` (**Components/**), `settings-modal`, `avatar-picker-dialog`, `feedback-dialog` (all **Blocks/**). Settings-modal reworked + promoted July 17 2026: rail/panes render from one data-driven `groups` config (a section = one rail row + one pane; add a group to extend) with two navigable **Placeholder** groups as the worked example; a Profile **Appearance** row (System/Light/Dark segmented `ToggleGroup`, lucide icons) that drives the theme live via controlled `appearance`/`onAppearanceChange` (app owns persistence, threaded through `app-shell-quill`); and a real content-pane scroll with sticky heading — the fix was `grid-rows-[minmax(0,1fr)]` + `min-h-0`, since `DialogContent`'s content-sized grid row was clipping, not scrolling (latent, predated the rework) | ✅ All quill compositions promoted to **Blocks/** (App Shell, Team Switcher, Settings, Avatar Picker, Feedback); `nav-user-quill` in **Components/** |
| Sidebar values, all measured off Otter and now documented on the `Components/Sidebar` docs page rather than in a spec doc: 240px panel / 56px rail, 150ms wipe, 300ms toggle reveal, 700ms tooltips (+300ms Radix skip-delay), 24px icons, 40px rows, lime-50 + forest-800 selected. `sidebar-alt1-spec.md` deleted July 16 2026 once the story and the component carried it | ✅ Complete |
| Sidebar's mobile nav had an invisible-but-tappable toggle and no visible close — pre-existing, shipped when this became the only sidebar. Fixed July 17, 2026: the toggle's opacity-reveal is gated on `!isMobile`, so on mobile it renders solid and *is* the close control; mobile-viewport regression stories added to `Components/Sidebar` + `Blocks/App Shell Quill` (each asserts the toggle is opacity 1) | ✅ Complete |
| `[CONCERN]` Open on the sidebar: the toggle rests at opacity 0 (Otter's behaviour), never compared against ~40% for discoverability. Noted on the `Components/Sidebar` docs page | 🔲 Needs a design call |
| Figma v3 (`shadcn Brightseed v3 (with pro blocks)`), primitives + tag tokens, ~50-var Brightseed Mode, Quill Button/Badge port, local Ring focus system, Logo/Login/Input sets, Geist + Tiempos | ✅ Complete |
| Web app (`/web/`, Next.js 16 + Tailwind 4 + Storybook 10), Button + Badge to spec; Sign In 2; form primitives; Alert/AlertDialog/Table/Switch/Spinner/Sonner; BrightseedLogo + Login. The Pro Block nav parts and App Shell 4 are gone — see the sidebar row above | ✅ Complete |
| Infra: Vercel auto-deploys `main` → https://brightseed-storybook.vercel.app | ✅ In sync |
| Hummingbird surfaces (Compound/Plant/Strategy cards) | 🟡 To be re-derived on `ui/` primitives |
| DoseResponseChart, StatCard | 🔲 API spec done, impl pending |
| Prototyping-data layer — decided **Full MSW**, client cut landed July 21 2026. Disposable `web/mocks/` (a fake `/api/*` backend over the existing fixtures) + a permanent `web/lib/api.ts` fetch client + `web/hooks/use-resource.ts`. Wired into Storybook (`.storybook/preview.ts`: direct worker start + a loader that applies per-story `parameters.msw.handlers` — **not** `msw-storybook-addon`, whose SB10 support is unconfirmed) and `next dev` (client `MSWProvider` + the `/workspace` route). Proof: `WORK IN PROGRESS/Workspace (Connected)` (Default/Loading/Empty/Error) with an on-demand detail fetch — `WorkspaceCanvas.resolveDetail` went **async** (Sheet shows a Spinner while it resolves). `tokens/` stays SoT; the seam is delete-`mocks/`-and-point-`lib/api.ts`-at-a-host. **Deferred fast-follow:** RSC/server fetches (`mocks/server.ts` + root `instrumentation.ts`) | ✅ Client cut complete |
| Brand evolution / color studies, icon system (line-art, hummingbird) | 🔲 In progress |
| BrightseedLogo canonical vectors; Tiempos Headline license; Input `size` prop; Figma `--c-*` mirror + Code Connect (parked, no trigger, see Figma section) | 🔲 Deferred / open |
| Onboard Anna as collaborator (GitHub + Storybook + Figma) | ✅ GitHub + Storybook done June 3, 2026 (both now multi-contributor); co-editing the Library Figma file. See `collaboration/` |

---

## Key files

| File | Purpose |
|---|---|
| `CLAUDE.md` | This file: canonical rules, conventions, status. |
| `tokens/` | Token CSS: source of truth for names + values. `components.css` holds the component-scoped `--c-{component}-*` tokens (one block per component; each aliases one global `--ds-*`). |
| `bridge/globals.css` | shadcn bridge: maps Brightseed tokens onto shadcn variable names. Nearly vestigial after the July 2026 `ui/` fork and the sidebar retirement — it serves the login pages and story chrome, and **not** `web/components/ui/`. Its `--sidebar-*` block is dead; see the Web app section. |
| `README.md` | Short orientation pointing to CSS + Storybook. |
| `web/` | Next.js 16 + Tailwind 4 + Storybook 10 production app. `tokens/` + `bridge/` here are symlinks to root. |
| `web/components/quill/` | Quill-owned app compositions (app shell, team switcher, footer account menu, settings, feedback). Reads `--c-*` only, same discipline as `ui/`, and explicitly **not** bridge-themed. |
| `collaboration/` | How exploration, prototyping, review, and merge fit together, plus machine + push-access setup. |
| `DOCS/archive/` | Superseded docs kept for the record, each with a header saying what replaced it. Not a reference. |
| `DESIGN.md` | **Canonical design guidance**, in the [Google design.md format](https://github.com/google-labs-code/design.md): YAML front matter carrying machine-readable tokens for coding agents, plus the prose guidance. Repo root is where the format expects it. Storybook's `Design.mdx` page renders this file rather than duplicating it, so the two cannot drift — edit here, never there. Verify changes with `npx @google/design.md lint DESIGN.md`. |

---

## Working rules: read before any task

1. **Generating UI?** The token rules above + the live CSS/Storybook are the source of truth. Composition guidance and component-usage rules live in Storybook → Design.mdx (`web/stories/DesignGuidelines.mdx`).
2. **Hummingbird is data-dense.** Dense tables, charts, canvas UIs. "Wizard" patterns are wrong; stateful configuration panels are right.
3. **Line-art visual style:** icons/illustration are clean line art, never 3D or filled.
4. **Never hand-roll an SVG glyph.** Use the approved icon library (Storybook → Foundations → Icons). Not in the inventory → flag it, don't improvise paths.
5. **Hummingbird is alpha**, a small number of customer POCs. Speed of prototyping > code quality. Heavy review tooling / AI code-review actions / formal PR review are premature. **Hold the line only on brand quality + token discipline:** code cleanliness underneath can be loose.
6. **Document as you go.** Name things clearly and keep work legible to an outside reader: what was the problem, what was tried, what was chosen.
7. **GitHub management is Claude's job, not Becky's.** Don't ask her to copy URLs or click through Settings. Claude has working git credentials in the `~/dev/Brightseed` clone (`gh` authed as `buckup-design`, osxkeychain helper) — commit, push, branch, and use `gh` directly. (The `plugin:engineering:github` MCP had an OAuth bug Cowork's SDK can't speak; use git + `gh` from the clone, not that flow.)
8. **Work from `~/dev/Brightseed`, never the Documents copy.** macOS TCC blocks the Claude Preview MCP inside `~/Documents/CLAUDE COWORK/…`, so the live working copy is the `~/dev/Brightseed` clone (same pattern as the Portfolio site and Varo) — edit, run, preview, commit, and push from there. The Documents copy is a stale reference kept only because Cowork auto-loads its `CLAUDE.md`; treat `~/dev` as canonical. Both point at the same `buckup-design/Brightseed` remote. Fresh-machine setup: `cd ~/dev/Brightseed/web && npm install`.
9. **Default to local preview; push to `main` at checkpoints.** Work like the Portfolio site: iterate in the working tree and verify each change in the local Storybook (`preview_start name=brightseed-storybook`, port 6006; or `npm run storybook` from `web/`) before claiming done. Batch a handful of changes, then commit + push to `main` only when Becky says ship — `main` auto-deploys to https://brightseed-storybook.vercel.app. Running locally on the Mac, verification is now trustworthy (no Linux-sandbox caveat). New components still land in WORK IN PROGRESS (rule 10), and `main` stays the convergence gate (`collaboration/workflow.md`).
10. **New components start in "WORK IN PROGRESS".** Every new component's Storybook stories go under the `WORK IN PROGRESS` section, pinned last in the sidebar (below Blocks) via `storySort` in `web/.storybook/preview.ts`. Promote to `Components/*` only when Becky says it's done.

**Push-back protocol** (chat + code comments): `[BLOCKING]` stop until resolved (code: `// BRIGHTSEED-TBD: [BLOCKING] <reason>`; chat: state it first) · `[CONCERN]` proceed but log the reservation · `[SUGGESTION]` take or leave. Keep flags atomic so they read without conversation context.

---

## Component & system specs (current state)

Values point to `tokens/semantics.css`; component appearance lives in Storybook; Figma IDs are listed for Figma work.

**Tag colors** (forest, lime, cyan, blue, yellow, orange, lavender, orchid + red, sand) are decorative, color never implies status. For status, compose icon + text with semantic intent tokens (`--success/info/warning/critical-*`). Tags intentionally skip the intent layer.

**Button:** variant state ladders are in `tokens/semantics.css`. Rules:
- **Hover changes surface + text color only, never font-weight.** Text steps one increment "more pronounced" (darker in light, lighter in dark). Focus and pressed carry their own signals (ring / depressed surface).
- **Lime (primary):** surface lime-300 → 400 → 500 (default/hover/pressed); text forest-800 → 900 → 950. lime-300 = `#CDE67B`.
- **Secondary:** flat sand steps 100 → 200 → 300, disabled sand-50. No overlays.
- **Destructive:** soft tint, red-100 surface / red-600 text (light), red-900 / red-300 (dark). Not solid red.
- **Disabled (uniform):** surface = `color-mix(variant default surface, --ds-color-disabled-surface-overlay 50%)`; text + icon = the variant's normal foreground at `--ds-disabled-text-opacity` (0.55), applied at exactly **one** DOM level (`data-slot="button-content"`) so opacity doesn't multiply.
- **Loading ≠ disabled.** `loading` sets HTML `disabled` + `data-loading="true"` + `aria-busy`; the disabled fade excludes `[data-loading="true"]`; spinner replaces the leading icon.
- **Corner radii** bound to tokens, never hardcoded: standard sizes `rounded-md` (8px), xl/icon-xl `rounded-4xl` (26px).

**Link vs Linktext:** two distinct components, two state machines, don't collapse:
- **Link:** inline `<a>`, always underlined, blue scale (`--ds-color-text-link-*`), anchor pseudo-class states. Figma set `28590:36956`.
- **Linktext:** button-shaped, never underlined (`--ds-color-text-link-brand`), button states. Light mode rests on forest-800 and brightens to forest-550 on hover (dark default -> bright, branded green). Dark mode uses the lime scale (lime-300 default / lime-200 hover), so standalone text passes AA on the dark surface.

**Focus rings** (system invariant): all reference the local Brightseed Ring set (`26482:628558`), 1px stroke + 1px offset, instance at `(-1,-1)` sized `body+2`, `Shape=*` variant matching body radius, color via instance stroke override. No per-instance cornerRadius overrides. Variant colors: Default/Outline/Ghost lime-500, Secondary sand-300, Destructive red-500, Linktext lime-500.

**Badge:** two axes, `variant` (12 colors) × `kind` (3 visual treatments). One color recipe so tag-dense tables don't shout: default surface step-100 / text step-700; hover surface step-200; focus surface step-100 + ring step-500. (Old shadcn `verified` + `secondary` color variants removed; `destructive`→`red`.)

The three `kind` values (renamed June 5, 2026 — `primary`→**Chip**, `secondary`→**Tag**, `number` unchanged):
- **Chip** — interactive pill, `rounded-full`, carries hover + focus. Has optional inline start/end slots (icon/dot) driven by component properties + a `Brightseed Tag Mode` variable-modes cascade (`tag/active-color`); swap targets must bind inner `Vector` stroke to `tag/active-color`.
- **Tag** — informational/**static** tight tag: `cr=2`, horizontal padding `spacing/1` (4px), hugs content. **No hover, no focus state, by design** (not interactive). The hover/focus recipe above applies to Chip + Number only.
- **Number** — count chip, unchanged.

Exposed in the web app as **three separate components** — `Chip`, `Tag`, `NumberBadge` (`web/components/ui/{chip,tag,number-badge}.tsx`), thin wrappers that preset `kind` over the shared `Badge` engine. Each gets its own Storybook entry (`Components/Chip`, `Components/Tag`, `Components/Badge Number`); `Badge` is now the internal engine with no story of its own. Consumers use the wrappers (`<Chip>`, `<Tag>`, `<NumberBadge>`), not `<Badge kind>`. (`NumberBadge`, not `Number`, to avoid shadowing the JS global.)

**Dark-mode semantic intent surfaces** (recipe; values in `tokens/semantics.css` `[data-theme="dark"]`): surface = `color-mix(intent-step 10–15%, sand-950)`; border = `color-mix(intent-step 46%, transparent)`; **text = neutral `--ds-color-text-default`** (no semantic tint in dark, signal lives in surface + border); icon = same hue as border, solid.

---

## Figma, canonical references & quirks

**Figma's role (decided June 7, 2026): sketchpad, not spec.** Figma is for brand evolution, color studies, and fast loose exploration. The system of record for components, tokens, and screens is Storybook + the `tokens/` CSS. Consequences: the component-token tier (`--c-*`) is **not** mirrored into Figma variables, and Code Connect stays parked, neither has a revival trigger. A Figma mock is an input to a code prototype, never a spec to match pixel-for-pixel.

**File:** `Brightseed Library (BB+AM collab)`, key `0zRpsdiJxOtnOoXEAeLPwA` (current canonical, June 3 2026 onward; updated version of v3, co-edited by Becky + Anna). WIP happens in `Collab Playground`, key `P3ZaaH0lNgFzBbQROvTK4L`. Prior v3 file `shadcn Brightseed v3 (with pro blocks)` (key `ZZPjoeJ447MWuzNi3LL1BL`) is superseded; node IDs below carried over from it (Brightseed Blocks `26465:212221` matches both), re-verify any ID that doesn't resolve in the Library file.

**IDs:** Button page `34:6`; Button COMPONENT_SET `37:931` (330 variants); Quill Button skeleton `26465:249160`; Brightseed Blocks page `26465:212221`; Chip set `26480:627833`; Tag set `26480:628051`; NumberBadge set `17100:10130` (Figma sets renamed to match code exports, June 6 2026); Cards / StrategyCard set `26584:379615` (Hovered × Favorited axes, on the Cards page); local Ring set `26482:628558`; Brightseed Mode collection `26462:212204`. **Brightseed Mode** (~50 vars) mirrors shadcn slot vocab (`base/primary`, `base/primary-hover`, `base/link-brand`, …) for name-match rebinds against Pro Pack components.

**Quirks (operational):**
- **Chunk bulk mutations into batches of ≤12** per `figma_execute`, the WebSocket bridge times out ~30s, and on timeout the work often completes server-side but no response returns (confusing state). Probe between batches.
- **`createNodeFromSvg` does not inherit `fill="none"`:** set `fill="none"` explicitly on every `<path>`, or closed paths render solid black. Verify child VECTORs have `fills: []` after creation.
- **`figma_arrange_component_set` recreates** the set via `combineAsVariants()` (decoupled duplicate), apply rebindings to the arranged set, not the original.
- **`swapComponent` drops color overrides** that happen to match the new master's default. Capture each instance's pre-swap binding, swap, re-apply if it changed.
- **Mirror canonical shadcn patterns exactly, never invent.** Pro Pack frames are often locked (readable, not editable, by design). Can't access a canonical reference → pause and ask. The doc-skeleton "Skeleton" pattern uses two tiers of purple dashed border (`SOLID rgb(151,71,255)`, 1px, INSIDE, `dashPattern [10,5]`); cells FIXED-sized, centered.

---

## Web app (`/web/`), operational

Next.js 16 (App Router) + Tailwind 4 + Storybook 10, deployed to Vercel, **production, not staging.** Originally rebased on the shadcndesign.com Pro Pack; almost nothing of it survives — the nav Pro Blocks and App Shell 4 were deleted July 16, 2026 with the stock sidebar, and `components/pro-blocks/` is now a single e-commerce logo. Geist via the `geist` npm package (`next/font/google` is blocked in-sandbox). Theme toggle via `data-theme="dark"` on `<html>`.

**The `ui/` layer is forked (July 16, 2026).** It used to be "Button + Badge are the paint surface, the bridge themes everything else". That is no longer true: **every component in `web/components/ui/` now reads its own `--c-{component}-*` tokens** and none of them style through shadcn slot classes. Two consequences, both load-bearing:
- **The bridge's job has nearly evaporated.** It no longer themes `ui/`, and the Pro Block markup it used to serve is gone. What's left is the login pages (`app/login`, `app/marketing/*/login`, `components/auth`, `components/login-form.tsx`) and story demo chrome. Its `--sidebar-*` block is now **dead** — nothing renders through `bg-sidebar`/`text-sidebar-*` since stock left. Left in place rather than removed, because the shadcn CLI re-injects stock `--sidebar-*` values on install and the bridge block is what has always overridden them; delete it only alongside the `@theme inline` mapping in `app/globals.css`.
- **The whole `ui/` layer must now be defended on every install, not just Button + Badge** (see the Defend gotcha below). The corollary is that Quill no longer takes upstream shadcn fixes for free — a11y patches and Radix bumps to a forked primitive have to be hand-merged. `ui/sidebar.tsx` is the extreme case: it shares nothing with upstream but the name.

**Run (local, from the `~/dev/Brightseed` clone):** `cd ~/dev/Brightseed/web && npm install`, then `npm run storybook` (6006, the default preview surface) or `npm run dev` (3000). In Cowork/Claude Code, prefer `preview_start name=brightseed-storybook` (config in the Cowork-root `.claude/launch.json`). Don't run from the Documents copy — TCC blocks preview there (rule 8).

**`npm run dev` / `build` pass `--webpack` (July 21 2026), not the Next 16 default (Turbopack).** Turbopack refuses to resolve any import whose realpath escapes the project root, and `web/tokens` + `web/bridge` are symlinks into the repo root that `app/globals.css` `@import`s — so Turbopack 500s every route (`"leaves the filesystem root"`). Webpack follows the symlinks with the root left at `web/`. The obvious `turbopack: { root: "../" }` fix also works but widens Turbopack's file-watcher to the whole parent tree (incl. `web/node_modules`) and OOM'd the machine — **do not re-add it** (noted in `next.config.ts`). Storybook (Vite) is unaffected — it ignores `next.config.ts` and already follows the symlinks.

**Pro Block install pattern:**
```bash
yes n | npx --yes shadcn@latest add @shadcndesign/<block-name> --yes
```
The `yes n |` is critical, it answers overwrite prompts `n`, preserving customized files (Button/Badge); without it the CLI hangs. **Inspect before install:** `curl -sS -H "X-License-Key: ${SHADCNDESIGN_LICENSE_KEY}" "https://www.shadcndesign.com/api/registry/<name>" | jq .` and read `files[].path`, `registryDependencies`, `cssVars`, `tailwind`. Missing-transitive-dep render error → install the stock primitive (no `@shadcndesign/` prefix). Registry wiring is in `web/components.json`; license key in `web/.env.local` (gitignored).

**Gotchas:**
- **Tailwind v4 `@source` directives go AFTER all `@import`s:** between imports silently invalidates the token/bridge load (every var resolves empty). Defensive `@source` for `app/`, `components/`, `stories/`, `lib/`, `hooks/`.
- **Sidebar tokens:** the CLI still inlines stock `hsl()` `--sidebar-*` values + a `.dark` block on install. Delete those; `bridge/globals.css` already defines `--sidebar-*` against Brightseed semantics and wins. Re-delete if re-injected. Note this is now purely defensive housekeeping — **our sidebar does not read those vars at all**, it reads `--c-sidebar-*`. Nothing breaks if the CLI wins; it just leaves lies in the bridge.
- **Defend the whole `ui/` layer, not just Button + Badge** (widened July 16, 2026 when `ui/` was forked onto `--c-*`). Every file in `web/components/ui/` is now customized, so any `shadcn add` / Pro Block install can clobber real work. The `yes n |` prefix is what actually protects them — it answers `n` to every overwrite prompt — so **never drop it**. Verify rather than trust: `sha256sum` the directory before and after and diff the two lists.
  ```bash
  cd ~/dev/Brightseed/web && shasum -a 256 components/ui/*.tsx > /tmp/ui-pre.txt
  yes n | npx --yes shadcn@latest add @shadcndesign/<block> --yes
  shasum -a 256 -c /tmp/ui-pre.txt   # every line must say OK
  ```
  Anything that fails the check: `git checkout HEAD -- web/components/ui/<file>.tsx`. (The `button-badge-snapshot` branch predates the fork and only covers Button/Badge/Chip/Tag/NumberBadge; `HEAD` is the better restore point now. Badge is the internal engine; Chip/Tag/NumberBadge are the public wrappers.)

**Tiempos type system:** display = **Tiempos Fine RegularItalic** (italic intrinsic; h1 56/60, h2 40/44, h3 28/34; differentiation by size + tracking). Tiempos Text (Medium/Semibold/Bold) loaded for body emphasis. WOFF2 at `web/public/fonts/tiempos/`. Allowed families on Brightseed-canonical pages: **Geist, Geist Mono, Tiempos Text, Tiempos Fine**. Stock Pro Pack reference pages are exempt from font discipline.
