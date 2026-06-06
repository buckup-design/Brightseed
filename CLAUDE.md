# Brightseed Digital Design: Project Brief

> **This is the canonical rules doc.** A rule or value is stated once, here or in the CSS, other docs point to it, never restate it. Dated decision history is not kept here; it lives in git. When a doc disagrees with `tokens/*.css` or Storybook, the running system wins.

## What this project is

A pro bono engagement to build **Quill**, an AI-ready design system, and evolve the visual brand for **Hummingbird**, Brightseed's biotech compound-screening application. The deliverable is a production design system Brightseed's team can build on. The design bar is high: Hummingbird is an enterprise product and needs to look like one.

**Naming:** **Quill** = the design system (this project's deliverable). **Hummingbird** = the Brightseed application that Quill skins. **Forager** = the AI discovery model that powers Hummingbird. In these docs, "screens / surfaces / regions / the product UI" means Hummingbird; "the model / discovery engine" means Forager.

**Website:** https://www.brightseedbio.com/ · **App:** Hummingbird (dense data tables, charts, canvas-style UIs), powered by the Forager AI model.

The deliverable is **the workflow** as much as the design system: an end-to-end Cowork → preview → merge pipeline that lets non-engineers prototype Hummingbird screens without breaking production.

## Memory pointer

- `memory/`, memory-management format: `glossary.md`, `people/`, `projects/`, `context/`.

Tiered lookup: this file → `memory/glossary.md` → `memory/people|projects|context/`. If a term isn't in any of those, ask.

## Team

| Person | Role | Notes |
|---|---|---|
| Becky Buck | Design lead (pro bono) | Runs the design system + brand evolution. |
| Anna | Consultant / acting Head of Design | Drives visual direction at the mock layer. Active collaborator on the repo and the Figma library since June 2026. |
| Meng | VP, Platform Development | Owns the platform side of Hummingbird. |
| Chuan | Platform team, reports to Meng | Confirms prototypes for visual + intent fit. |

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
Components   --ds-button-bg: var(--ds-color-...) ← component-scoped semantics, grouped as --c-button
             bg-[var(--ds-button-bg)]            ← each --ds-{component}-* aliases one global --ds-*
```

**Token prefixes**

| Layer | Prefix | Example |
|---|---|---|
| Primitive | `--p-{type}-*` | `--p-color-forest-700`, `--p-radius-md`, `--p-space-4` |
| Semantic | `--ds-*` | `--ds-color-surface-success`, `--ds-shape-radius-md` |
| Component (scoped semantic) | `--ds-{component}-*`, grouped under the `--c-{component}` label | `--ds-alert-surface-success: var(--ds-color-surface-success)`; used as `bg-[var(--ds-alert-surface-success)]` |

Primitives are organized by `$type` (the W3C tokens axis): `--p-color-*`, `--p-radius-*` / `--p-space-*` / `--p-border-width-*`, `--p-font-family-*` / `--p-font-size-*` / `--p-font-weight-*`. The bare `--color-*` primitive names are fully retired. **Not primitives, deliberately:** shadow (`--ds-shadow-*`, a color recipe) and display roles `h1/h2/h3` (`--ds-text-display-*`).

**Rules**

◆ **No tier-skipping.** Component code references its own component-scoped semantics `--ds-{component}-*` only, never a global `--ds-*` (e.g. `--ds-color-*`), a primitive, or a raw value directly. Each `--ds-{component}-*` token aliases exactly one global `--ds-*` semantic; these definitions live in `tokens/components.css`, grouped under a `--c-{component}` label (the label names the component group, it is not itself an emitted variable) and generated 1:1 from each component's needs. The global `--ds-*` semantics remain the only tier that touches primitives. (Dark theme needs no overrides in `components.css`: a `--ds-{component}-*` token resolves `var(--ds-*)` at point of use, so the `data-theme="dark"` swap on the global `--ds-*` flows straight through.)

◆ **No hardcoded values.** No hex, px, or font names in component styles. Use `var(--ds-{component}-*)` or Tailwind arbitrary refs (`bg-[var(--ds-alert-surface-success)]`). CSS-variable arbitrary refs are allowed; hardcoded-hex arbitrary values are not.

◆ **Semantic intent.** Tokens name usage (`--ds-color-surface-default`), not appearance.

◆ **Light-first.** Defaults assume a light background. Dark theme swaps semantic tokens via `data-theme="dark"` on an ancestor, never write dark-mode-specific component code.

◆ **Corner radii** flow through the component-scoped token (`--ds-{component}-shape-radius-*` → `--ds-shape-radius-*` → `--p-radius-*`), never raw pixels.

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
| Token system (3-tier, dark theme, shadcn bridge); component-scoped `--ds-{component}-*` tokens in `tokens/components.css` (grouped under `--c-{component}` labels), all 12 token-bearing components rewired to read their own `--ds-{component}-*` only (June 5, 2026) | ✅ Complete |
| Figma v3 (`shadcn Brightseed v3 (with pro blocks)`), primitives + tag tokens, ~50-var Brightseed Mode, Quill Button/Badge port, local Ring focus system, Logo/Login/Input sets, Geist + Tiempos | ✅ Complete |
| Web app (`/web/`, Next.js 16 + Tailwind 4 + Storybook 10, on Pro Pack), Button + Badge to spec; Pro Blocks (App Shell 4, Sign In 2, nav); form primitives; Alert/AlertDialog/Table/Switch/Spinner/Sonner; BrightseedLogo + Login | ✅ Complete |
| Infra: Vercel auto-deploys `main` → https://brightseed-storybook.vercel.app | ✅ In sync |
| Hummingbird surfaces (Compound/Plant/Strategy cards) | 🟡 To be re-derived on Pro Block primitives |
| DoseResponseChart, StatCard | 🔲 API spec done, impl pending |
| Brand evolution / color studies, icon system (line-art, hummingbird) | 🔲 In progress |
| BrightseedLogo canonical vectors; Tiempos Headline license; Tiempos webfont domain confirm (ask Meng); Input `size` prop | 🔲 Deferred / open |
| Onboard Anna as collaborator (GitHub + Storybook + Figma) | ✅ GitHub + Storybook done June 3, 2026 (both now multi-contributor); co-editing the Library Figma file. See `collaboration/` |

---

## Key files

| File | Purpose |
|---|---|
| `CLAUDE.md` | This file: canonical rules, conventions, status. |
| `tokens/` | Token CSS: source of truth for names + values. `components.css` holds the component-scoped `--ds-{component}-*` tokens (grouped under `--c-{component}` labels; each aliases one global `--ds-*`). |
| `bridge/globals.css` | shadcn bridge: maps Brightseed tokens onto shadcn variable names. Intentionally thin. |
| `README.md` | Short orientation pointing to CSS + Storybook. |
| `web/` | Next.js 16 + Tailwind 4 + Storybook 10 production app. `tokens/` + `bridge/` here are symlinks to root. |
| `collaboration/` | Internal: workflow + Anna onboarding. |
| `brightseed-shadcn-mapping.md` | Figma variable-collection wiring guide. |
| `DOCS/DESIGN.mdx` | Storybook design guidelines (symlink to `web/stories/DesignGuidelines.mdx`). |

---

## Working rules: read before any task

1. **Generating UI?** The token rules above + the live CSS/Storybook are the source of truth. Composition guidance and component-usage rules live in Storybook → Design.mdx (`web/stories/DesignGuidelines.mdx`).
2. **Hummingbird is data-dense.** Dense tables, charts, canvas UIs. "Wizard" patterns are wrong; stateful configuration panels are right.
3. **Line-art visual style:** icons/illustration are clean line art, never 3D or filled.
4. **Never hand-roll an SVG glyph.** Use the approved icon library (Storybook → Foundations → Icons). Not in the inventory → flag it, don't improvise paths.
5. **Hummingbird is alpha**, a small number of customer POCs. Speed of prototyping > code quality. Heavy review tooling / AI code-review actions / formal PR review are premature. **Hold the line only on brand quality + token discipline:** code cleanliness underneath can be loose.
6. **Document as you go.** Name things clearly and keep work documentable, what was the problem, what was tried, what was chosen.
7. **GitHub management is Claude's job, not Becky's.** Don't ask her to copy URLs or click through Settings. Use the GitHub Connector or Claude in Chrome. (The `plugin:engineering:github` MCP had an OAuth bug Cowork's SDK can't speak, don't retry that flow.)
8. **Sandbox can't delete files or push** (FUSE mount, no git creds). Claude preps edits + hands Becky an exact command block for deletes/symlinks/commits/pushes. Clear stale locks at the top: `rm -f .git/index.lock .git/HEAD.lock .git/objects/maintenance.lock`.
9. **Sandbox is Linux; Becky's machine is macOS.** Any `node_modules/` Claude installs has Linux-native binaries that break on macOS (rolldown). Claude writes source; Becky runs `npm install` + `npm run storybook` on her Mac. Don't trust sandbox-only verification.

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
- **Linktext:** button-shaped, never underlined, lime scale (`--ds-color-text-link-brand`), button states. Brand-link is lime (lime-700 light / lime-300 dark, stepped down from the lime-300 button surface so standalone text passes AA).

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

**File:** `Brightseed Library (BB+AM collab)`, key `0zRpsdiJxOtnOoXEAeLPwA` (current canonical, June 3 2026 onward; updated version of v3, co-edited by Becky + Anna). WIP happens in `Collab Playground`, key `P3ZaaH0lNgFzBbQROvTK4L`. Prior v3 file `shadcn Brightseed v3 (with pro blocks)` (key `ZZPjoeJ447MWuzNi3LL1BL`) is superseded; node IDs below carried over from it (Brightseed Blocks `26465:212221` matches both), re-verify any ID that doesn't resolve in the Library file.

**IDs:** Button page `34:6`; Button COMPONENT_SET `37:931` (330 variants); Quill Button skeleton `26465:249160`; Brightseed Blocks page `26465:212221`; Primary Badges set `26480:627833` (= **Chip** kind); Secondary Badges set `26480:628051` (= **Tag** kind, Figma object not yet renamed); local Ring set `26482:628558`; Brightseed Mode collection `26462:212204`. **Brightseed Mode** (~50 vars) mirrors shadcn slot vocab (`base/primary`, `base/primary-hover`, `base/link-brand`, …) for name-match rebinds against Pro Pack components.

**Quirks (operational):**
- **Chunk bulk mutations into batches of ≤12** per `figma_execute`, the WebSocket bridge times out ~30s, and on timeout the work often completes server-side but no response returns (confusing state). Probe between batches.
- **`createNodeFromSvg` does not inherit `fill="none"`:** set `fill="none"` explicitly on every `<path>`, or closed paths render solid black. Verify child VECTORs have `fills: []` after creation.
- **`figma_arrange_component_set` recreates** the set via `combineAsVariants()` (decoupled duplicate), apply rebindings to the arranged set, not the original.
- **`swapComponent` drops color overrides** that happen to match the new master's default. Capture each instance's pre-swap binding, swap, re-apply if it changed.
- **Mirror canonical shadcn patterns exactly, never invent.** Pro Pack frames are often locked (readable, not editable, by design). Can't access a canonical reference → pause and ask. The doc-skeleton "Skeleton" pattern uses two tiers of purple dashed border (`SOLID rgb(151,71,255)`, 1px, INSIDE, `dashPattern [10,5]`); cells FIXED-sized, centered.

---

## Web app (`/web/`), operational

Next.js 16 (App Router) + Tailwind 4 + Storybook 10, deployed to Vercel, **production, not staging.** Rebased on the shadcndesign.com Pro Pack; Pro Blocks are pure composition over stock shadcn primitives, so the customized Button + Badge are the paint surface and the bridge themes everything else. Geist via the `geist` npm package (`next/font/google` is blocked in-sandbox). Theme toggle via `data-theme="dark"` on `<html>`.

**Run (on Mac):** `cd web && npm install && npm run storybook` (6006) / `npm run dev` (3000).

**Pro Block install pattern:**
```bash
yes n | npx --yes shadcn@latest add @shadcndesign/<block-name> --yes
```
The `yes n |` is critical, it answers overwrite prompts `n`, preserving customized files (Button/Badge); without it the CLI hangs. **Inspect before install:** `curl -sS -H "X-License-Key: ${SHADCNDESIGN_LICENSE_KEY}" "https://www.shadcndesign.com/api/registry/<name>" | jq .` and read `files[].path`, `registryDependencies`, `cssVars`, `tailwind`. Missing-transitive-dep render error → install the stock primitive (no `@shadcndesign/` prefix). Registry wiring is in `web/components.json`; license key in `web/.env.local` (gitignored).

**Gotchas:**
- **Tailwind v4 `@source` directives go AFTER all `@import`s:** between imports silently invalidates the token/bridge load (every var resolves empty). Defensive `@source` for `app/`, `components/`, `stories/`, `lib/`, `hooks/`.
- **Sidebar tokens:** the CLI inlines stock `hsl()` `--sidebar-*` values + a `.dark` block. Delete those; define `--sidebar-*` in `bridge/globals.css` aliasing Brightseed semantics (surface = `--ds-color-surface-default`, primary = `--ds-color-action-primary`, accent = `--ds-color-surface-alt`, border = `--ds-color-border-default`, ring = `--ds-color-border-focus`). Bridge wins; re-delete if re-injected.
- **Defend Button + Badge:** recovery branch `button-badge-snapshot`. Pre/post-install `sha256sum components/ui/button.tsx components/ui/badge.tsx components/ui/chip.tsx components/ui/tag.tsx components/ui/number-badge.tsx` must match; restore via `git checkout button-badge-snapshot -- web/components/ui/button.tsx web/components/ui/badge.tsx web/components/ui/chip.tsx web/components/ui/tag.tsx web/components/ui/number-badge.tsx web/stories/Button.stories.tsx web/stories/Chip.stories.tsx web/stories/Tag.stories.tsx web/stories/BadgeNumber.stories.tsx`. (Badge is the internal engine; Chip/Tag/NumberBadge are the public wrappers. The old `Badge.stories.tsx` was removed when the stories split.)

**Tiempos type system:** display = **Tiempos Fine RegularItalic** (italic intrinsic; h1 56/60, h2 40/44, h3 28/34; differentiation by size + tracking). Tiempos Text (Medium/Semibold/Bold) loaded for body emphasis. WOFF2 at `web/public/fonts/tiempos/` (Klim webfont license held; confirm the Vercel domain is registered). Allowed families on Brightseed-canonical pages: **Geist, Geist Mono, Tiempos Text, Tiempos Fine**. Stock Pro Pack reference pages are exempt from font discipline.
