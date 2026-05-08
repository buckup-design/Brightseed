# Brightseed Digital Design — Project Brief

## What this project is

A pro bono engagement to build an AI-ready design system and evolve the visual brand for **Forager**, Brightseed's biotech compound screening platform. The work serves two audiences simultaneously:

1. **Brightseed's engineering team** — a functional, production-ready design system they can actually use.
2. **Outside reviewers** - documentation showing how the system was built and why.

The design bar is high. Hummingbird is an enterprise product and needs to look like one. "Good enough" here is a much higher bar than most early-stage projects.

**Website:** https://www.brightseedbio.com/
**App:** Forager (biotech compound screening — dense data tables, charts, canvas-style UIs)

---

## Memory pointer

Project memory lives in two complementary places:
- `.agents/context/` — distilled context loaders (`PRODUCT.md`, `DESIGN.md`, handoff files). What the impeccable skill / general agents read.
- `memory/` — standard memory-management format (May 8, 2026): `glossary.md` (internal terms, codenames, "things that are NOT the thing"), `people/{anna, meng, chuan, becky-buck}.md`, `projects/{forager, quill}.md`, `context/{v3-figma, sandbox-stack, deployment}.md`. What the productivity:memory-management skill expects.

Tiered lookup: this file → `memory/glossary.md` → `memory/people|projects|context/`. If a term isn't in any of those, ask.

---

## Team

| Person | Role | Notes |
|---|---|---|
| Becky Buck | Design lead (pro bono) | Running the design system + brand evolution |
| Anna | Consultant / acting Head of Design | Drives visual direction at the mock layer. Active collaborator on the repo and the Figma library since June 2026. |
| Meng | VP, Platform Development | Owns the platform side of Hummingbird. |
| Chuan | Platform team, reports to Meng | Confirms prototypes for visual + intent fit. |

---

## Tech stack

- **Framework:** Next.js + shadcn/ui + Tailwind CSS
- **Color:** CSS custom properties (`var(--color-*)`) — no hardcoded hex in component code
- **Hosting:** Vercel
- **Figma:** shadcn/ui Figma file as base (Becky is re-skinning it to Brightseed brand)
- **Repository:** GitHub

---

## Design system architecture

Three-layer token system. Read `BrightseedDS.md` before generating any Forager UI.

```
Layer 1 — Primitives    --color-forest-700
          ↓ var()
Layer 2 — Intents       --success-700
          ↓ var()
Layer 3 — Semantics     --color-surface-success   ← component code references THIS layer
```

**Hard rules:**
- Component code references semantic tokens only. Never reach past semantics to intents or primitives.
- Never hardcode hex, px, rem, or font strings in component code.
- Light theme is default. Dark theme = `data-theme="dark"` on ancestor element — do not write dark-mode-specific component code.
- If no token exists for what you need, flag with `// BRIGHTSEED-TBD:` and stop. Do not improvise.
- Corner radii on components reference shape tokens (`--shape-radius-*` in CSS, `border-radius/rounded-*` in Figma). Never hardcode pixel radii on individual variants — that's how drift happens between sizes.

---

## Key brand tokens

| Role | Token | Value | Brand name |
|---|---|---|---|
| Primary surface | `--color-surface-brand` | `#305536` | Deep Forest |
| Primary action | `--color-action-primary` | `#CDE67B` | Lime 300 (default) — shifts to Lime 400 on hover, Lime 500 on pressed |
| Default background | `--color-surface-default` | `#FFFFFF` | White (Sand `#F9F8F3` retired as default surface, Apr 2026 — still in palette) |
| Dark base | `--color-surface-default` (dark) | `#1F1F1E` | Sand 950 (warm dark neutral) |

Chart colors: use `--chart-cat-1` through `--chart-cat-8` in order. Never use brand lime or brand green for data series.

---

## Current status

| Area | Status |
|---|---|
| Token vocabulary (all 3 layers) | ✅ Complete |
| Dark theme | ✅ Defined (visual QA pending) |
| shadcn/ui CSS bridge | ✅ Complete |
| Brightseed primitives wired in Figma (10 scales × 11 steps) | ✅ Complete (Apr 2026) |
| Tag tokens (decorative color set for badges) | ✅ Complete (Apr 2026) |
| Button component — full size scale incl. XL | ✅ Complete (Apr 2026) |
| Button — Linktext variant (rename from Link/brand, no underline) | ✅ Complete (Apr 2026) |
| Button — variant-aware focus rings (Ring instance, replaces DROP_SHADOW) | ✅ Complete (Apr 2026) |
| Button — destructive variant refactored to soft style (red-100 surface + red-600 text) | ✅ Complete (Apr 2026) |
| Button — hover behavior: text steps "more pronounced" + Medium → SemiBold weight | ✅ Complete (Apr 2026) |
| Button — lime button surface ladder shifted (lime-300 default, lime-400 hover, lime-500 pressed); lime-300 retuned to #CDE67B for AA | ✅ Complete (Apr 2026) |
| Button — disabled state defined as overlay rule (sand-100 50% on surface, sand-700 60% on text), uniform across variants, theme-aware | ✅ Complete (Apr 2026) |
| Link component — inline `<a>` for body copy, 5-state pseudo-class machine | ✅ Complete (Apr 2026) |
| Badge component — restyled to consistent hierarchy + 8 new colors | ✅ Complete (Apr 2026) |
| CompoundScreeningTable | ✅ Production-ready |
| DoseResponseChart | 🔲 API spec done, implementation pending |
| StatCard | 🔲 API spec done, implementation pending |
| Brand evolution / color studies | 🔲 In progress (HTML prototype + Figma exploration) |
| Icon system | 🔲 In progress (line art style, hummingbird motif) |
| Sandbox repo (Next.js + Storybook + shadcn) | ✅ Foundation built (Apr 30, 2026) — see `sandbox/` |
| Sandbox Button — Brightseed React port (full Figma Quill matrix parity) | ✅ Complete (Apr 30, 2026) |
| Brightseed-specific component tweaks ported from Figma to sandbox React | 🟡 In progress — Button + Badge done; 14 other shadcn components still stock |
| Demo screens from Anna's mocks (Compounds + Plants views) | 🟡 Scrapped May 8, 2026 — to be rebuilt on Pro Block primitives. Branch: `pro-blocks-rebuild` |
| shadcndesign.com Pro Pack registry wired (license-key auth via env var) | ✅ Complete (May 8, 2026) — see "Pro Pack rebuild" decision below |
| `@shadcndesign/sign-in-2` installed + Storybook story + Brightseed-themed via bridge | ✅ Complete (May 8, 2026) |
| `@shadcndesign/app-shell-4` installed + Storybook story + sidebar bridge mappings | ✅ Complete (May 8, 2026) |
| `button-badge-snapshot` recovery branch at commit `5333cd1` | ✅ Created (May 8, 2026) |
| v3 Figma file (`shadcn Brightseed v3 (with pro blocks)`) — canonical source going forward | ✅ Set up (May 6, 2026) |
| v3 — Brightseed Mode collection (16 → ~50 vars after Quill port + state ladders + alpha overlays) | ✅ Complete (May 6, 2026) |
| v3 — Sidebar correction (`base/sidebar` = `base/background` = white/sand-950) | ✅ Complete (May 6, 2026) |
| v3 — App Shell 4 + Sign In 2 (light + dark) on Brightseed Blocks page, rebound | ✅ Complete (May 6, 2026) |
| v3 — Sign In 2 link-text AA upgrade (`base/link-brand` = lime-700/lime-300) | ✅ Complete (May 6, 2026) |
| v3 — Canonical Button master at parity with Quill (330 variants × 10 sizes incl. xl/icon-xl, 168px columns) | 🟡 Mostly complete (May 6, 2026) — see open items below |
| v3 — Components - Quill section ported, fully bound to Brightseed Mode | ✅ Complete (May 6, 2026) |
| Mantel → Quill rename (Brightseed customized DS = "Quill") | ✅ Complete (May 6, 2026) |
| Brand-link uses lime not forest | ✅ Complete (May 6, 2026) |
| v3 — Secondary Badge cr=2 across all 36 variants (incl. inner Focus body frames) | ✅ Complete (May 7, 2026) |
| v3 — Secondary Badge horizontal padding = `spacing/1` (4px), hug content, no min width | ✅ Complete (May 7, 2026) |
| v3 — Local Brightseed `Ring` component_set with `Shape` variant axis (xs/sm/md/lg/xl/2xl/3xl/4xl/full) | ✅ Complete (May 7, 2026) |
| v3 — 12 Secondary Badge focus rings migrated to local Ring `Shape=xs` | ✅ Complete (May 7, 2026) |
| v3 — 55 Button focus rings migrated to local Ring (`Shape=md` × 44, `Shape=4xl` × 11) | ✅ Complete (May 7, 2026) |
| v3 — Focus ring stroke weight unified at 1px (was 2px on Buttons) | ✅ Complete (May 7, 2026) |
| v3 — Focus ring offset unified at 1px (was 3px on Buttons) | ✅ Complete (May 7, 2026) |
| v3 — `custom/outline` aliased to `base/border` (sand-200 light / sand-700 dark) | ✅ Complete (May 7, 2026) |
| v3 — Custom badge icon family (`Badge/Lucide Icon/Leaf-badge`, `Rat-badge`; `Badge/Status/Dot-badge`) — 10×10 outer, stroke-bound inner Vector | ✅ Complete (May 7, 2026) |
| v3 — Primary Badge inline-slot architecture (4 component properties: `Show Inline Start/End` booleans + `Inline Start/End` instance-swap) | ✅ Complete (May 7, 2026) |
| v3 — `Brightseed Tag Mode` variable collection (10 modes) + `tag/active-color` cascade for inline-mark color | ✅ Complete (May 7, 2026) |
| v3 — Primary Badges matrix expanded to 6 columns (Default/Hover/Focus + Status Dot/Front Icon/Back Icon) | ✅ Complete (May 7, 2026) |
| Quill frame renamed to "Quill Components" | ✅ Complete (May 7, 2026) |
| Pro Blocks consumers rebound from original shadcn Badge (`26:169`) and Badge Number (`17100:10130`) to Quill custom badges | ✅ Complete (May 8, 2026) — 24 instances swapped to Quill Primary across Spinner/Card/Table/Input pages. Pro Blocks pages had zero direct consumers (Badges sealed inside Card/Sheet masters). Badge Number left as-is per Becky's call (May 8 Quill = default shadcn version w/ color rebind from May 6). |
| v3 — Lucide icon library restored (1469 local components, post-deletion-recovery via v2 paste + detach + promote) | ✅ Complete (May 8, 2026) |
| v3 — Geist set as default everywhere (136 stray Inter Medium labels rebound across Components-Quill, Components master overlay, Badge page) | ✅ Complete (May 8, 2026) |
| v3 — Tiempos display scale in Figma (`display/h1` Bold 56/60, `display/h2` Semibold 40/44, `display/h3` Medium 28/34) | ✅ Complete (May 8, 2026) |
| `tokens/typography.css` + sandbox @theme inline `--font-display` wiring | ✅ Complete (May 8, 2026) |
| Sandbox Badge React port — Quill parity (12 variants × 3 kinds × inline slots) | ✅ Complete (May 8, 2026) |
| Tiempos Headline license + WOFF2 files placed at `sandbox/public/fonts/tiempos/` + uncomment localFont in layout.tsx | 🔲 Open — currently using Tiempos Text fallback |
| First real push to `github.com/buckup-design/Brightseed` — sandbox/, tokens/, bridge/, components/, design system .md docs | ✅ Complete (May 8, 2026) — repo previously had only initial commit; .gitignore updated to hold back brand/, memory/, vector-pipeline/, OUTPUTS/, DOCS/, anna's mocks 4-29-26/ |
| Vercel project `brightseed-storybook` — auto-deploys Storybook on push to `main`, preview URLs per branch | ✅ Complete (May 8, 2026) — live at https://brightseed-storybook.vercel.app, build ~45s, see `memory/context/deployment.md` |
| Add Anna and Chuan as GitHub collaborators (required to edit; not required to view deployed Storybook) | 🔲 Open — deferred until contribution loop is designed |
| Design the contribution loop for Anna/Chuan (push branch → preview → review → merge) | 🔲 Open — Becky is sole contributor for next 4+ weeks; revisit before week 4 |

---

## Key files

| File | Purpose |
|---|---|
| `BrightseedDS.md` | AI coding agent source of truth — paste this alongside prompts for Forager UI generation |
| `brightseed-shadcn-mapping.md` | Wiring guide for Figma variable collections |
| `README.md` | Token architecture overview and usage instructions |
| `tokens/` | CSS token files (primitives, intents, semantics, shape, charts) |
| `bridge/globals.css` | shadcn/ui bridge — maps Brightseed tokens to shadcn variables |
| `components/CompoundScreeningTable.tsx` | Reference implementation |
| `sandbox/` | Next.js 16 + Tailwind 4 + Storybook 10 playground (Apr 30, 2026). Anna and Meng's AI prompting target. |
| `sandbox/components/ui/` | 15 shadcn components copied from official `shadcn-ui/ui` repo |
| `sandbox/stories/` | Storybook stories — one per component, plus seeded Forager-flavored examples |
| `anna's mocks 4-29-26/` | Reference screenshots ("filtered to compounds.png", "filtered to plants.png") that drive the demo screens |
| `DOCS/AI that knows (and uses) your design system.md` | TJ Pitre webinar transcript on AI + design system workflow — informed the sandbox approach |

---

## Sandbox (`/sandbox/`) — built Apr 30, 2026

A Next.js 16 + Tailwind 4 + Storybook 10 playground built as a subfolder of the main repo so Anna, Meng, and Chuan can prompt against the design system in Cowork and see "feels like" mocks before any production code lands. **The workflow IS the case study, not just the design system.**

**Stack:**
- Next.js 16 (App Router) + Tailwind 4
- Geist via npm `geist` package (NOT `next/font/google`)
- shadcn/ui components copied from `shadcn-ui/ui` GitHub repo (new-york-v4 registry, radix base), with `@/registry/new-york-v4/...` imports rewritten to `@/components/ui/...`, `@/lib/...`, `@/hooks/...`
- Storybook 10 with `@storybook/nextjs-vite`, `addon-docs`, `addon-a11y`
- Theme toggle in Storybook toolbar via `data-theme="dark"` on `<html>`
- Bridge wired in `app/globals.css` using Tailwind v4 `@theme inline`
- `tokens/` and `bridge/` are **symlinks** to the canonical files at the repo root — single source of truth, edits flow both ways

**Installed (15 components):** button, card, badge, input, avatar, tabs, select, toggle-group, toggle, breadcrumb, sidebar, separator, sheet, skeleton, tooltip — plus `hooks/use-mobile.ts`.

**Storied (14):** all of the above in `sandbox/stories/*.stories.tsx`. Sidebar uses the icon-rail collapsible variant that matches Anna's mocks.

**Verified Apr 30, 2026:** stock shadcn components paint correctly through the bridge — lime primary, sand secondary, soft red destructive all render as designed. **Brightseed-specific React-side tweaks are NOT yet applied** — the deeper Figma spec (lime ladder for hover/active, hover weight bump with ghost label, opacity-based disabled, variant-aware focus rings, Linktext button variant, etc.) lives in Figma but hasn't been ported to the React components. That's open work.

**To run (always from your Mac, never trust Claude's Linux sandbox node_modules):**
```bash
cd sandbox
npm install         # required after Claude installs anything — Linux node_modules has wrong native binaries
npm run storybook   # localhost:6006
npm run dev         # localhost:3000 (Next.js)
```

**Constraints discovered Apr 30, 2026 — important for future Claude sessions:**
- Claude's bash sandbox is Linux; any `node_modules/` installed there has Linux-native binaries that fail on macOS (rolldown is a known offender). **Workflow rule:** Claude writes source files (cross-platform), Becky runs `npm install` on Mac. Don't trust verification done in Claude's sandbox alone.
- Network egress from Claude's bash sandbox is restricted by Cowork allowlist. github.com IS allowlisted (so `git clone https://github.com/shadcn-ui/ui.git` works for grabbing components). `ui.shadcn.com` may not be reliably allowlisted, so the shadcn CLI's `init` and `add` commands can fail to fetch the registry — even after adding the domain to Cowork settings, the bash sandbox proxy doesn't always pick up the change. **Workaround:** clone the repo, copy files from `apps/v4/registry/new-york-v4/{ui,hooks,lib}/`, rewrite import paths.
- `next/font/google` is blocked (Google Fonts unreachable from sandbox). Use the `geist` npm package instead — it bundles the font as a JS module.
- FUSE filesystem mount has occasional `EPERM` errors on `unlink` of build artifacts (`.next/`, `stories/assets/`). Usually self-resolves on retry; not a blocker.

---

## What Claude should know before starting any Brightseed task

1. **Read `BrightseedDS.md` first** if generating UI code.
2. **This is a case study.** Every significant decision should be documentable — what was the problem, what was tried, what was chosen and why.
3. **Forager is data-dense.** Dense tables, charts, canvas-style UIs. Patterns like "wizard" are wrong here — configuration panels with stateful nodes are right.
4. **Line art visual style** — icons and illustration use clean line art, not 3D or filled styles.
5. **Document as you go.** Write comments, name things clearly, and keep code readable for an outside reader, not just functional.
6. **Forager is alpha (3 customer POCs, <10 by EOY 2026).** Speed of prototyping > code quality. Heavy review tooling, AI code review GitHub Actions, formal PR review — all premature for this stage. Bring them back when there's PMF and real engineering. **Hold the line on brand quality and token discipline only** — those are what make the prompted UI look on-brand. Code cleanliness underneath can be sloppy.
7. **The case study is the workflow, not just the design system.** Becky designed an end-to-end Cowork → preview → merge pipeline that lets non-engineers (Anna, Meng, Chuan) prototype Forager screens at the speed of typing without breaking production. Document the workflow as the headline artifact, with the design system as one ingredient.
8. **GitHub management is Claude's job, not Becky's.** Becky has stated this as a hard rule. Don't ask her to copy URLs, navigate folder pickers, click through Settings to find connectors, etc. Use the GitHub Connector (already authenticated at the Cowork platform level) and Claude in Chrome (also connected) before falling back to "tell me what to do" instructions. The `plugin:engineering:github` MCP plugin had an OAuth bug as of Apr 30, 2026 — uses an OAuth dialect Cowork's SDK doesn't speak — so don't waste cycles retrying that flow. Path that works: GitHub Connector + project context, or Claude in Chrome to drive github.com directly.
9. **Chunk Figma bulk operations into batches of ≤12.** The `figma-console` WebSocket bridge has a ~30-second round-trip timeout. Any single `figma_execute` call that mutates many nodes — cloning component variants, walking and rebinding hundreds of fills, batch variable creation — risks blowing past it. **Critical wrinkle:** when the call times out, the work usually completes server-side anyway, but the response never returns. That makes state confusing — the next call may see "no it isn't done" or "it's already done," depending on timing. The rule is: chunk variant clones, mass rebinds, and similar bulk Figma mutations into batches of ≤12 per `figma_execute` call. Verify state with a small probe call between batches. Established May 2026 after multiple timeouts on Button master rebind + xl-variant cloning runs.
10. **Mirror canonical shadcn patterns exactly — never invent.** When shadcn provides a visual or structural pattern in the Pro Pack file (component layouts, doc skeletons, naming, etc.), copy it verbatim. The Pro Pack frames are usually locked, which means the API can READ them but the user can't easily edit them — that's by design, not a barrier. **If you can't access a canonical reference (locked, missing, ambiguous), pause and ask, don't approximate.** Canonical example: the **purple-dashed-line "Skeleton" pattern** for component documentation matrices uses **two tiers of dashed border** — an outer wrapper frame AND each individual cell wrapped in its own dashed-bordered frame. Stroke spec: `SOLID rgb(151, 71, 255)` (purple), `1px`, `INSIDE` alignment, `dashPattern [10, 5]`. Cell frames use FIXED sizing with `primaryAxisAlignItems: 'CENTER'` and `counterAxisAlignItems: 'CENTER'` so the component instance centers in the cell. Canonical source: `21123:52947` (Pro Pack Badge Number skeleton). Established May 7, 2026 after a refactor where Claude built a single big-border Examples frame instead of per-cell borders.

---

## Locked-in decisions (Apr 2026)

### Color palette renames
The original primitive scales had three names that no longer reflect the brand. These were renamed everywhere — primitives, intents, semantics, charts, HTML, mapping doc, BrightseedDS.md.

| Was | Now | Why |
|---|---|---|
| `--color-green-*` | `--color-forest-*` | Anchored to "Deep Forest" brand color. "Green" was generic. |
| `--color-indigo-*` | `--color-lavender-*` | Brand-tuned violet (H=287°). "Indigo" implied a stock tailwind hue. |
| `--color-purple-*` | `--color-orchid-*` | Anchored to "Garlic Bloom" brand color. |

Same renames in Figma: `brightseed/forest/*`, `brightseed/lavender/*`, `brightseed/orchid/*`.

### Page background: white, not Sand (Apr 2026)
`--color-surface-default` (light theme) was repointed from `--color-sand-50` (`#F9F8F3`, warm off-white) to `--color-white` (`#FFFFFF`). Sand stays in the palette and continues to anchor warmer surfaces — `--color-surface-alt` (sidebars, table alt rows, inset panels) is still `--color-sand-100`, hover/active states still use the sand scale, and `--color-text-inverse` on dark surfaces is still `--color-sand-50` (warm white reads better on Deep Forest than pure white). Only the page-level surface concept moved to white.

`--color-action-secondary` was refactored to alias `--color-surface-default` directly (semantic-to-semantic), capturing the "secondary buttons match page bg" relationship explicitly. Same change in Figma — `colors/background-light` now aliases to `brightseed colors/base/white`. The `--color-white` and `--color-black` primitives were added at the top of `tokens/primitives.css`.

### Tag colors are decorative, not semantic
The 8 tag colors (forest, lime, cyan, blue, yellow, orange, lavender, orchid) are for visual differentiation in tag-dense Forager surfaces — compound source taxonomies, screening categories, etc. **Color does not imply status.** A `cyan` badge does not mean "info"; an `orange` badge does not mean "caution". For status meaning, use icon + text composition, not color.

This intentionally skips the intent layer for tag tokens — flatter architecture, fewer tokens to maintain. If you need a semantic intent (success/warning/error/info), use `--success-*`, `--warning-*`, `--critical-*`, `--info-*` from the intent layer.

### Badge component recipe (locked)
All 12 Badge variants share one recipe so a tag-dense table doesn't visually shout:
- Default: surface = step-100, text = step-700
- Hover: surface = step-200 (one shade darker), text = step-700
- Focus: surface = step-100 (same as default), text = step-700, ring = step-500 (hue-specific)

Removed: `verified` (use icon + text for stamp behavior), `secondary` (folded into `default`). Renamed: `destructive` → `red`. Outline and Ghost variants follow shadcn defaults.

### Figma quirk worth knowing
The `figma_arrange_component_set` MCP tool **recreates** the set via `combineAsVariants()` rather than rearranging in place. This produces a duplicate component set that's decoupled from the original. Apply rebindings to the **arranged** set (the one wrapped in the `Component Container` frame), not the original. Canonical set IDs as of Apr 2026: Button = `28550:49190`, Badge = `28552:78730`.

### Tailwind palette retired
The Figma file no longer carries the stock tailwind hue scales (amber, emerald, fuchsia, gray, indigo, mauve, neutral, olive, pink, purple, rose, sky, slate, stone, taupe, teal, violet, zinc — 26 scales × 11 steps = 286 variables). They were deleted Apr 2026.

What remains:
- **`1. Brightseed Foundations`** collection — 3 universal primitives (`brightseed colors/base/{transparent, black, white}`). This is the renamed `1. TailwindCSS` collection.
- **`Brightseed Primitives`** collection — 10 hue scales × 11 steps. Naming: `brightseed/{scale}/{step}`.

What changed in the wiring:
- Dark-mode shadcn surfaces (`--background`, `--card`, `--popover`, `--secondary`, `--muted`, `--accent`, `--sidebar`, etc.) now alias `brightseed/sand/*` instead of cool stock grays. Warm sand undertone in dark theme.
- Destructive-dark (`--destructive`, `--destructive-foreground`) repointed from tailwind/red to `brightseed/red`.
- Legacy `--chart-1` through `--chart-5` slots remapped to brand palette (forest/orange/cyan/red/lavender). The richer 8-slot `--chart-cat-N` system in `tokens/charts.css` is preferred for new chart work.

If older docs or AI prompts reference `tailwind colors/{scale}/{step}` as a primitive source, that's obsolete. Single source of truth is `brightseed/{scale}/{step}`.

**Resolved Apr 2026:** `tokens/semantics.css` and `BrightseedDS.md` now use `brightseed/sand/*` as the dark-theme anchor, matching the Figma shadcn Theme variables. Forest exits surface vocabulary in dark mode entirely; it stays only as text on the lime button (`forest-800` light/dark, `forest-900` hover, `forest-950` active). Brand-context link colors moved to lime in May 2026 — see "Brand-link uses lime, not forest" decision below.

**Resolved Apr 2026 (Linktext part superseded May 2026):** Button focus rings are variant-aware. Default/Outline/Ghost use `--color-border-focus` (lime/500, theme-invariant). Secondary uses `--color-border-focus-secondary` (sand/300 light, sand/500 dark — matches Figma `base/ring`). Destructive uses `--color-border-focus-destructive` (red/500). Linktext uses `--color-border-focus-link-brand` — repointed from forest/500 to lime/500 in May 2026 (same value as Default; kept as a separate token name for namespace clarity).

### Link vs Linktext (two distinct components, two state machines)
The system splits inline body-copy links from button-shaped link affordances by component, not by token. They share no state machine and shouldn't be collapsed.

| | Link component | Linktext (Button variant) |
|---|---|---|
| Element | inline `<a>` inside running text | `<button>` styled to look like a link |
| Underlined | always | never |
| Color scale | blue (`--color-text-link-*`) | lime (`--color-text-link-brand`) — same family as primary action |
| State machine | `:link / :visited / :hover / :focus / :active` (anchor pseudo-classes) | `default / hover / focus / loading / disabled / pressed` (button states) |
| Size axis | none — inherits parent typography | sm / default / lg / xl / xs |
| Figma location | own page named `Link` (component set `28590:36956`) | inside Button component set as `Variant=Linktext/default` |

Tokens for Link state machine:
- `:link` → `--color-text-link-default` (blue-600 light, blue-500 dark)
- `:hover` → `--color-text-link-default-hover` (blue-700 light, blue-400 dark — note: dark-mode hover goes LIGHTER, opposite of typical convention; intentional)
- `:visited` → `--color-text-link-visited` (sand-700 light, sand-300 dark — warm/settled, deliberately not in the blue scale)
- `:active` → `--color-text-link-active` (blue-900 light, blue-200 dark)

### Brand-poetic names are forbidden in code (Apr 2026)
"Chlorophyll", "Deep Forest", "Garlic Bloom", "Eschscholzia Californica", "Ocean", "Sand" — none of these appear in any system file. `tokens/`, `bridge/`, `BrightseedDS.md`, `brightseed-shadcn-mapping.md`, `README.md`, `CLAUDE.md`, `audit-2026-04-28.md` all use functional names (`lime/400`, `forest/900`, `sand/100`, etc.). The brand names live ONLY in `brand/brand-colors-reference.md` as historical record. If you see one of these names in any other file, it's a regression — fix it.

### IconPlaceholder simplification (Apr 2026)
The IconPlaceholder master component (`21003:91178`) previously contained five icon-set instances (Lucide, HugeIcon, Phosphor, Tabler, Remix), with only Lucide visible by default. The four hidden alternatives were removed — they were eating component structure and (per a Figma rendering quirk) causing visible misalignment in `icon-xl` button instances. The IconPlaceholder now contains only Lucide. Affects all 330+ Button instances downstream.

### Quill section is the canonical Button display (Apr 2026)
The Brightseed Button matrix lives in the `Components - Quill` SECTION on the Button page (id `26465:249160`). It uses the shadcn doc-skeleton format: rows are Variant × Size (bracketed), columns are State, dashed-purple grid lines between cells. 55 rows × 6 cols = 330 populated cells. The original `Components - shadcn` empty skeleton has been retired.

### Destructive button: soft style, not solid red (Apr 2026)
Destructive went from solid red-500 fill + white text to a soft tinted treatment: red-100 surface + red-600 text in light theme; red-900 surface + red-300 text in dark theme. This matches the Tag recipe pattern (surface=step-100, text=step-600/700, hover steps up). Reasons: (1) consistency with how every other tinted surface in the system is built, (2) reads as "destructive" without screaming, which fits the "data-dense, calm" feel of Forager. Figma's prior implementation used alpha-tinted variables (`custom/destructive\10 dark:destructive\20`) — those are no longer the canonical destructive surface; the new path is `base/destructive` aliasing to `brightseed/red/100` (light) and `brightseed/red/900` (dark). Companion tokens: `base/destructive-hover` (red-200/red-800), `base/destructive-active` (red-300/red-700), `base/destructive-disabled` (red-50/red-950), `base/destructive-foreground` (red-600/red-300), `base/destructive-foreground-hover` (red-700/red-200). The shadcn bridge (`bridge/globals.css`) was updated to repoint `--destructive-foreground` from `--color-text-inverse` (white) to `--color-text-on-action-critical` (red text), since white-on-pink is unreadable.

### Button hover: weight bump + one step more pronounced (Apr 2026)
On `:hover`, every button variant does two things at once: text color steps one increment "more pronounced" (in light theme this means physically darker; in dark theme, physically lighter — the "more contrast" interpretation of darker), and font weight steps from Medium (500) to SemiBold (600). Hover only — `:focus-visible` carries its own signal via the variant-aware ring; `:active`/`pressed` carries its own via the depressed surface; layering weight onto those would over-signal.

Variant-by-variant text bindings:
- Default (lime): `forest-800 → forest-900` (theme-invariant — same in dark mode)
- Secondary / Outline / Ghost: `sand-900 → sand-950` (light); in dark, both default and hover are `sand-50` because we hit the boundary — weight bump alone carries the hover signal
- Destructive: `red-600 → red-700` (light), `red-300 → red-200` (dark)
- Linktext: `lime-700 → lime-800` (light), `lime-300 → lime-200` (dark — lighter step = "more pronounced on dark"). Updated May 2026 — was forest-800 → forest-900 / forest-300 → forest-200 in the original Apr 2026 spec.

The shift to `forest-800` baseline for primary-foreground (text on lime button) was deliberate — gave the hover rule somewhere to step *to* without inventing a `forest-1000`. Linktext text used to share that forest baseline; in May 2026 it moved to the lime scale (see "Brand-link uses lime, not forest" decision below).

**Layout shift mitigation — ghost label.** SemiBold glyphs are physically wider than Medium. In live HTML, the Button component renders the label twice: once at SemiBold but invisible (reserves width), once at the live weight on top. The button always sizes to the wider SemiBold version, so hover never grows it. Geist is variable, so weight transitions smoothly via `font-variation-settings` over 120ms. See `BrightseedDS.md` §4 "Button hover behavior" for the JSX/CSS pattern. Figma renders the static states without width reservation, so the hover variant in the matrix may appear ~1px wider than default — that's a Figma representation artifact, not a production issue.

New Figma variables created (in collection `3. Mode`): `base/primary-foreground-hover`, `base/secondary-foreground-hover`, `base/accent-foreground-hover`, `base/destructive-hover`, `base/destructive-foreground-hover`, `base/destructive-active`, `base/destructive-disabled`. Existing variables repointed: `base/primary-foreground` (forest-900 → forest-800, theme-invariant), `base/destructive` (alpha-tinted → red-100/900), `base/destructive-foreground` (deep red → red-600/300), `base/link-brand` and `base/link-brand-hover` (then forest, repointed again to lime in May 2026 — see "Brand-link uses lime, not forest" decision below).

### Lime button surface ladder + lime-300 retune (Apr 2026)
The lime button surface ladder shifted down one step to give the "more pronounced on hover" rule headroom on the surface side, mirroring what was done with text. Default = lime-300 (was lime-400), hover = lime-400 (was lime-500), pressed = lime-500 (was lime-600). Disabled stays at lime-100.

The lime-300 primitive value was retuned `#CAE279 → #CDE67B` so that `forest-800` text passes WCAG AA on the new default surface (4.57:1 vs the 3.73:1 the old combo was hitting on lime-400). Contrast across all three states with the retune:
- Default: `forest-800` on lime-300 (`#CDE67B`) — 4.57:1 ✓
- Hover: `forest-900` on lime-400 — 5.00:1 ✓
- Pressed: `forest-950` on lime-500 — 6.43:1 ✓

Pressed state required a third text step. `forest-800` and `forest-900` both fail AA on lime-500 (2.83 / 3.80), so the lime button is the one variant in the system with a `-active` text token: `--color-text-on-action-primary-active` (`forest-950`, the "Floor" anchor). Mirrors the surface ladder being three steps deep. New Figma variables: `base/primary-hover` (lime-400), `base/primary-active` (lime-500), `base/primary-foreground-active` (forest-950). `base/primary` was repointed lime-400 → lime-300.

Other places lime-300 appears: `--color-text-tag-lime` in dark mode (the tag system's lime text). The retune from `#CAE279` to `#CDE67B` is a hair lighter — barely perceptible in tag contexts, no other downstream effect to chase. `--color-icon-brand` and `--chart-datapoint-highlight` still alias `--action-primary-400` (lime-400) — they're independent of the button surface and were left in place. Could rewire if brand icons should track the button default, but no decision yet.

### Button disabled state — surface overlay + text alpha (Apr 2026)
Disabled is uniform across variants. Surface uses a desaturating overlay against the active default-state surface; text and icon use the variant's normal foreground at a single shared opacity. No per-variant `*-foreground-disabled` token.

**The rule:**
- Disabled surface = `color-mix(in srgb, <variant default-state surface>, var(--color-disabled-surface-overlay) 50%)`
- Disabled text + icon = the variant's normal foreground token, applied at `var(--disabled-text-opacity)` (`0.55`)

**In CSS:** keep the variant's normal foreground on the label and icon; drop opacity to `var(--disabled-text-opacity)` in the disabled selector. Apply opacity to the label element and the icon element directly — not to the button as a whole, so the surface stays at full opacity.

**In Figma:** TEXT and IconPlaceholder slots in every Disabled-state cell of the Button component bind their `opacity` property to the number variable `disabled/text-opacity = 55` (Figma's OPACITY scope reads FLOAT variables as 0-100, so the variable value is `55`, not `0.55`). Bind only on the **direct children** of each variant — the visible label TEXT and the IconPlaceholder slot — not on nested instances inside the IconPlaceholder. Stacking opacity at multiple levels multiplies (0.55 × 0.55 = 0.30) and produces a ghosted result.

**Theme handling.** The surface overlay swaps per theme (light: `sand-100`; dark: `sand-700`) so the surface rule pulls toward light or dark sand depending on context. Text alpha is theme-invariant — same `0.55` in both modes — because the variant's regular foreground token already has a light/dark variant, and opacity composites correctly over either disabled surface.

**Why opacity, not a baked text token:** the previous rule baked disabled text via `color-mix(text, sand-700, 60%)` to produce a flat hex per theme. That worked for high-contrast surfaces (lime) but produced too-subtle a fade on already-pale surfaces (destructive's red-100 disabled `#F9ECE7` against red-600 `#C9092E` only changed ~6 RGB points per channel — disabled cells were nearly indistinguishable from default). Opacity composites against the actual disabled surface, so the fade scales with the surface, and one rule covers every variant. It also removed 10 tokens from the system (5 variants × 2 themes): the `*-foreground-disabled` family is gone.

**Why color-mix on surface but not on text:** the surface overlay still produces an opaque flat hex, which is the right move for surfaces — we want the disabled surface to be a specific color on the page-bg, not a translucent layer. Text/icon are the foreground sitting on top of that surface; opacity is the right tool there because it lets the surface bleed through, which is what creates the "fading into the background" feel of disabled.

**Why 0.55:** the working sketch in Figma (the "examples we want to match" frame) used `0.60` for the lime example and `0.54` for destructive. `0.55` splits them and applies uniformly across variants. Tunable in one place — change the `disabled/text-opacity` variable and every disabled state across both themes updates.

**WCAG note:** disabled UI is exempt from WCAG 1.4.3 contrast requirements. At `0.55` opacity, the worst-case composited contrast in the system is destructive disabled (`red-600 #C9092E` on `#F9ECE7` → ~3.4:1). We've accepted that tradeoff in exchange for the "clearly inactive" read. If you ever need AA-level disabled, raise opacity to `~0.70`.

**Figma variables.** Surface-disabled tokens are still flat hexes per theme (computed from the surface color-mix expression): `base/primary-disabled` (#E0ECB4 light, #9AA66C dark), `base/destructive-disabled` (#F9ECE7 / #573335), `base/secondary-disabled` (#F9F8F6 / #44423E). The `*-foreground-disabled` family was deleted (Apr 2026) — disabled cells now bind text fill to the variant's normal foreground (`base/primary-foreground`, `base/destructive-foreground`, etc.) and bind text/icon opacity to `disabled/text-opacity`.

**Lime button special note:** the lime button's active state is theme-invariant (lime-300 surface, forest-800 text in both modes), but its disabled surface is NOT theme-invariant — the surface overlay swaps per theme, so light-mode disabled is sage-pastel (#E0ECB4) while dark-mode disabled is muted olive (#9AA66C). This is a deliberate tradeoff. If you ever want lime disabled to also be theme-invariant, override `base/primary-disabled` in dark mode to match the light value.

### Secondary button — flat step tokens, no overlays (Apr 2026)
Secondary used to fake state changes by stacking a translucent white overlay (`alpha/80` at 20%) on top of a single base fill for hover, and dimming the whole button via node-opacity (`opacity/opacity-60`) for pressed. That made Secondary the only variant in the system not following the "step-darker on hover" pattern Default(lime) and Destructive use, and the visual direction was actually inverted (hover got *lighter*, not more pronounced).

Refactored Apr 2026 to match the other variants: three flat-step tokens, one solid fill per state, surface gets one step darker per interaction step. Same mental model as `base/primary` → `base/primary-hover` → `base/primary-active` and `base/destructive` → `base/destructive-hover` → `base/destructive-active`.

| State | Token | Light | Dark |
|---|---|---|---|
| Default | `base/secondary` | `sand-100` | `sand-900` |
| Hover | `base/secondary-hover` | `sand-200` | `sand-800` |
| Pressed | `base/secondary-active` | `sand-300` | `sand-700` |
| Disabled | `base/secondary-disabled` | `sand-50` | `sand-950` |

**Ladder anchor (corrected Apr 2026).** An interim version of this refactor anchored Secondary at page-bg (`base/background` → white in light, sand-950 in dark) on the theory that Secondary should "merge with page bg." That made the button invisible on white surfaces (including the doc skeleton matrix itself) and made disabled even more invisible. Bumped the ladder up one step so Secondary is now a faint solid sand bg with no border — visibly distinct from page bg at default, steps darker per interaction, and disabled fades toward page bg (sand-50) rather than disappearing into it.

In the Button component set, every Secondary cell across all 10 sizes has a single solid fill bound to one of the four tokens — no second overlay fill, no node-opacity binding. The earlier `alpha/80` second-fill on hover and `opacity/opacity-60` node-opacity on pressed were both removed. Those two utility variables still exist elsewhere — not deleted.

New Figma variables created in collection `3. Mode`: `base/secondary-hover` and `base/secondary-active`. Existing variables repointed: `base/secondary` (was → `colors/secondary-light/dark`, now → `brightseed/sand/100` light, `sand/900` dark), `base/secondary-disabled` (now → `brightseed/sand/50` light, `sand/950` dark).

### Button corner radii — fully bound, never hardcoded (Apr 2026)
Every Button cell across all 6 variants × 10 sizes × 6 states (330 cells) has its `cornerRadius` bound to a Figma variable, never to a raw pixel number. Two radius tokens cover the size axis:

| Sizes | Token | Value |
|---|---|---|
| xs, default, sm, lg, icon, icon-xs, icon-sm, icon-lg | `border-radius/rounded-md` | 8px |
| xl, icon-xl | `border-radius/rounded-4xl` | 26px |

**What got fixed.** The xl and icon-xl rows had hardcoded `cornerRadius = 24` numbers with no variable binding. Becky caught that the Secondary xl had drifted to `8` (probably from a Figma copy/paste action that didn't carry the local value), and the inconsistency could only happen because nothing was holding the value in place. All xl + icon-xl cells are now bound to `border-radius/rounded-4xl`. We also bumped the value from 24 → 26 to land on the existing radius scale instead of inventing a button-specific radius token (24 wasn't a step in the existing `radius/{md, lg, xl, 2xl, 3xl, 4xl}` ladder; 26 = 4xl is).

**Audit invariant.** A passing audit of the Button set means every cell has `boundVariables.topLeftRadius` set. If any cell shows a hardcoded number, that's a regression — re-bind it.

**CSS side.** `tokens/shape.css` declares the full `--shape-radius-{xs, sm, md, lg, xl, 2xl, 3xl, 4xl, round}` scale to mirror the Figma `radius/*` family, with conventions documenting which token each component uses. Component code references `--shape-radius-md` for the standard button sizes and `--shape-radius-4xl` for xl.

### Button — sandbox React implementation (Apr 30, 2026)
Until this work, the Brightseed Button spec lived only in Figma (the Quill matrix at `26465:249160`). The React component in `sandbox/components/ui/button.tsx` and its full-matrix story in `sandbox/stories/Button.stories.tsx` are the first stock shadcn component ported to Brightseed spec parity. Five decisions worth knowing about before extending the pattern to other components (Badge is the obvious next candidate).

**Custom Tailwind variants for dual-trigger states.** The Quill matrix shows every state of every variant statically — hover, focus, pressed, disabled, loading — but real users get those states via `:hover`, `:focus-visible`, `:active`, `:disabled` pseudo-classes. Writing two sets of state classes (one for stories, one for production) doubles the cva and guarantees drift. Solution: `@custom-variant` declarations in `sandbox/app/globals.css` that wrap real pseudo-classes AND a `data-force-state` attribute in `:is()`:

```css
@custom-variant hovered (&:is(:hover, [data-force-state="hover"]));
@custom-variant focused (&:is(:focus-visible, [data-force-state="focus"]));
@custom-variant pressed (&:is(:active, [data-force-state="active"]));
@custom-variant disabled-state (&:is(:disabled:not([data-loading="true"]), [data-force-state="disabled"]));
@custom-variant loading-state (&:is([data-force-state="loading"], [data-loading="true"]));
```

In the cva, `hovered:bg-X` fires for both real mouseover AND when a story passes `data-force-state="hover"`. Single declaration, two trigger surfaces. `disabled-state` deliberately excludes `[data-loading="true"]` so loading buttons don't get the disabled visual (see "Loading is its own state" below). These variants are component-agnostic — Badge, Input, Select, etc. can use them too.

**Ghost-label width reservation for the Medium → SemiBold hover bump.** The Figma spec for the hover weight bump (see "Button hover" subsection above) requires a width-reservation pattern in production CSS — SemiBold glyphs are physically wider than Medium, so a naive `hover:font-semibold` makes the button grow on hover and shoves adjacent content. React implementation: wrap children in a CSS grid stack with two cells sharing `col-start-1 row-start-1`. The first cell is invisible and always SemiBold (reserves width); the second is the live label, inherits weight from the button, transitions smoothly via the variable-font axis. The grid auto-sizes to the wider of the two — always the SemiBold ghost — so the button never grows.

The trick is skipped when (a) `asChild` is true (Slot expects exactly one child and we don't own its structure) or (b) the size is icon-only (no text → font-weight irrelevant). Three `data-slot` hooks are exposed for downstream selectors: `button-content` (the grid wrapper), `button-ghost` (invisible reservation copy), `button-live` (visible copy on top).

**Tokens via arbitrary CSS-variable values, not bridge aliases.** The shadcn → Brightseed bridge (`bridge/globals.css`) maps single-tier names: `bg-primary` → `--color-action-primary` default state only. That works for a static default but doesn't expose the `-hover`, `-active`, `-disabled` ladder steps required by the Quill matrix. Component code references the full semantic ladder via Tailwind arbitrary values:

```
bg-[var(--color-action-primary)]
hovered:bg-[var(--color-action-primary-hover)]
pressed:bg-[var(--color-action-primary-active)]
disabled-state:bg-[var(--color-action-primary-disabled)]
```

The bridge stays "intentionally thin" per its own comment — don't extend it to expose every state token. Any component that needs full state ladders (Badge, Input, Select, future tag-button hybrids) follows the same pattern: `[var(--color-X)]` not `bg-X`. BrightseedDS.md §3.3 already permits this ("CSS variable arbitrary refs are allowed. Hardcoded hex arbitrary values are not.").

Same applies to focus rings: variant-aware ring colors are written as `focused:ring-[var(--color-border-focus-{variant})]/50`. Tailwind v4's `/opacity` modifier compiles arbitrary CSS-variable colors to `color-mix()`, so the alpha works without a separate ring-alpha token.

**Loading is its own state, not disabled-with-spinner.** First-pass implementation made loading imply `disabled` and overlaid a spinner on top of a faded button — visually correct but semantically wrong. "Disabled" means inactive ("don't bother me, I'm broken"); "Loading" means active ("I'm working, wait for me"). Conflating them dilutes both signals.

Final design: `loading={true}` sets `disabled={true}` on the HTML element (HTML `disabled` blocks both clicks AND keyboard activation, no extra JS needed) AND `data-loading="true"`. The `disabled-state` Tailwind variant excludes `[data-loading="true"]`, so the disabled fade does NOT apply to loading buttons. The button keeps its default surface; the spinner replaces the leading icon position (or, for icon-only sizes, replaces the icon entirely). `aria-busy="true"` is set so screen readers announce in-progress.

If both `disabled={true}` and `loading={true}` are passed, loading wins visually because `disabled-state` is excluded. That's an edge case — if a caller really wants disabled visual + spinner, they shouldn't mix the two props.

**Disabled fade applied at exactly one DOM level.** The Figma rule from the "Button disabled state" subsection above is "bind only on the direct children of each variant — the visible label TEXT and the IconPlaceholder slot — not on nested instances." Stacking opacity at multiple DOM levels multiplies (0.55 × 0.55 = 0.30) and produces a ghosted result. React implementation: `disabled-state:[&_[data-slot=button-content]]:opacity-[var(--disabled-text-opacity)]` targets the single content wrapper. Cascading opacity to its descendants (ghost label, live label, icons, text) gives one effective layer — no stacking. Same hook works for both text-bearing and icon-only sizes since both wrap their content in `data-slot="button-content"`.

**What this means for porting other components.** The pattern is portable. To port Badge, Input, or any other component to Brightseed spec parity: (1) confirm the semantic tokens with full state ladders exist in `tokens/semantics.css` (already done for primary/secondary/critical; will need extension for tag-color states if Badge gets the same treatment), (2) reference them via arbitrary values in cva, (3) use the `hovered`/`focused`/`pressed`/`disabled-state`/`loading-state` custom variants from globals.css, (4) expose `data-slot` hooks for any state-dependent DOM levels (fade targets, animation containers). The story-side `data-force-state` pattern works for any component, not just Button. The Quill-style story matrix can be templated.

**Verification footnote.** Per the sandbox constraints (Linux node_modules from Claude's bash sandbox don't run on macOS), the React Button was verified visually in Storybook by Becky on her Mac, not in Claude's sandbox. Verification flow stays "Claude writes source, Becky runs `npm install` + `npm run storybook`."

### Brand-link uses lime, not forest (May 2026)

Linktext text color and brand-link focus ring moved from the forest scale to the lime scale. Decided May 6, 2026 during the v3 file rebuild after a reskin experiment showed the lime treatment of brand-context links reading as the right "this is the brand action" affordance — same family as the primary button surface, signaling that Linktext is the inline relative of the lime CTA.

**Token changes — `tokens/semantics.css`:**

| Token | Was (forest) | Now (lime) | Notes |
|---|---|---|---|
| `--color-text-link-brand` (light) | `forest-800` (#3f6947) | `lime-700` (#6f7e01) | AA on white (~6.3:1). Stepped down from lime-300 because lime-300 on white is ~1.7:1 — fine as a button surface, unreadable as standalone text. |
| `--color-text-link-brand-hover` (light) | `forest-900` | `lime-800` (#525c08) | One step "more pronounced" — same hover ladder rule as other variants. |
| `--color-text-link-brand` (dark) | `forest-300` | `lime-300` (#CDE67B) | Theme-invariant with the lime button surface. AA on sand-950. |
| `--color-text-link-brand-hover` (dark) | `forest-200` | `lime-200` (#e0f6ab) | Lighter step = "more pronounced on dark." |
| `--color-border-focus-link-brand` | `forest-500` (via `--surface-brand-500`) | `lime-500` (via `--action-primary-500`) | Same value as `--color-border-focus` (Default). Kept as a separate token name in case Linktext focus ever diverges again. |

**Why a deeper lime step in light, not lime-300:** the Pro Pack's stock "Sign up" link in Sign In / 2 uses `base/primary` (lime-300) directly as text color. That looks recognizably brand but fails WCAG AA on white (~1.7:1). For Brightseed's own brand-link token we step down to lime-700 in light to pass AA, accepting a small visual divergence from Pro-Pack-as-shipped. Pro Pack components stay at lime-300 as scaffolding; ported components built against `--color-text-link-brand` use the AA-passing step. Same divergence pattern as other places where Pro Pack vocabulary differs from Brightseed-spec.

**What didn't change:** `--color-text-on-action-primary` (text on lime button surface) is still forest-800 / forest-900 / forest-950 across the three surface states. Forest stays as the text-on-lime-surface family; lime is now the text-as-brand-link family. They're sibling roles in the lime-button system.

**Downstream:**
- ✅ v3's Brightseed Mode collection already has `base/link-brand` and `base/link-brand-hover` (lime-700/lime-300 light, lime-300/lime-200 dark). Added during the May 6 reskin experiment.
- Sign In 2 in Brightseed Blocks (all in use) page already has its "Sign up" link-text rebound from `base/primary` to `base/link-brand` for AA compliance.
- Sandbox React Button's Linktext variant (`sandbox/components/ui/button.tsx`) references `--color-text-link-brand` via CSS variable; semantics.css updates flow through automatically. When extending `bridge/globals.css`, consider adding `--link-brand: var(--color-text-link-brand)` so cva can reference it via the bridge name as well as direct CSS variable.

### v3 file structure (May 6, 2026)

The canonical Figma file going forward is **"shadcn Brightseed v3 (with pro blocks)"** (file key `ZZPjoeJ447MWuzNi3LL1BL`). The previous standalone Brightseed file is archived as historical record.

**Key pages:**

- **`Brightseed Blocks (all in use) 🔷`** (id `26465:212221`) — curated page for Brightseed-port'd blocks and component instances. Has 16 section dividers laid out (App Shells, Sign In, Sign Up, Buttons, Cards, Page Headers, Navbars, Settings, Examples, Table Headers, Sections, Section Headers, Section Footers, Empty Sections, Description Lists, Pro Blocks Components). Currently populated:
  - **App Shells:** Pro Blocks / App Shell / 4 (light + dark)
  - **Sign In:** Pro Blocks / Sign In / 2 (light + dark) — with brand-link AA upgrade applied to "Sign up" text
  - **Buttons:** 6 INSTANCES of the canonical Button master, one per variant (Default, Secondary, Destructive, Outline, Ghost, Link). Live component instances — they auto-update when the master changes.

- **`Button`** (id `34:6`) — canonical home for the Button COMPONENT_SET and its doc skeleton.
  - Components SECTION (`296:5340`) wraps the Button master (`37:931`) — now 330 variants × 10 sizes × 6 states, fully bound to Brightseed Mode, in 1008-wide layout matching Quill.
  - Components - Quill SECTION (`26465:249160`) — manual doc skeleton, 7,684 nodes, fully Brightseed-bound (3,466 rebinds done May 6).

**Brightseed Mode collection in v3** — ~50 variables (was 16 from initial bridge experiment, extended to 47 with Quill state ladders, then to ~50 with destructive alpha-overlay mappings). Naming mirrors shadcn slot vocabulary (`base/background`, `base/primary`, `base/primary-hover`, `base/link-brand`, etc.) for direct name-match rebinds against Pro Pack components.

**Open items for next session (start here):**

1. **Row size labels for new xl + icon-xl rows.** The Components master's doc-skeleton overlay has size labels for the original 8 rows (xs, default, sm, lg, icon, icon-xs, icon-sm, icon-lg) per chunk but not for the new xl + icon-xl rows. Need to clone existing row labels and reposition for each chunk. ~11 new label clones for non-Link chunks + 1 for Link.

2. **Fine-tune chunk label heights** if any of the 6 chunk labels (Default/Secondary/Destructive/Outline/Ghost/Link) have visible mismatch with their chunk content extent. Spot-check after row labels are added.

3. **Visually verify in Figma:** open the Components master, scroll through all 6 chunks, look for any cell-button misalignments or coloring artifacts. The May 6 work was done programmatically; a human visual pass will catch anything subtle.

4. **Optional:** consider whether to add the missing alpha overlay slot mappings for any other Pro Pack vars surfaced during future component ports (e.g., when porting Card or Input components).

### Secondary Badges — shape + padding (May 7, 2026)

The `Secondary Badges` component_set on the Badge page (id `26480:628051`) was tightened for tag-dense Forager surfaces where labels can be as short as three characters (e.g. `AkT`).

**Shape — cornerRadius=2 across all 36 variants.** Every variant in the set is now `cr=2` (literal numeric, unbound). For Focus-state variants, both the parent COMPONENT and the inner `Badge` body FRAME were updated — the inner body frame previously had a `radius/full` binding override that needed clearing. The reference variant (Default-Default at `26480:628052`) sets the canonical look; all other variants match.

**Padding — `spacing/1` (4px) horizontal, hugging content, no min width.** All 24 non-Focus variants and all 12 Focus inner body frames have `paddingLeft` and `paddingRight` bound to `spacing/1` (`VariableID:1:4`, resolves to 4px). `primaryAxisSizingMode` is `AUTO` (hug content), so a 3-char label produces a tight badge while a 5-char label expands accordingly. Vertical padding stays at 2px (already bound), `itemSpacing` stays at 4px (already bound).

**Why 4 not 2:** initial pass set padding to literal `2` to match the v2 reference, but `2` isn't a token. `spacing/1` (4px) is the closest existing token in the system; the 2px increase reads slightly more breathable without losing the "tight badge for tag-dense rows" goal. Locked in May 7 after a side-by-side check.

**What this enables:** more secondary badges fit per row in tables and chip-stacks, supporting Forager's data-dense layouts without forcing column wrapping.

### Local Brightseed `Ring` component_set (May 7, 2026)

The shared `Ring` component used for focus indicators across Buttons and Badges is a **remote** library component (`remote: true`, key `5b773ee1a2a5f12b9fdda2d0457e621dfdf794a9`) imported from the shadcn Pro Pack. Its inner rectangle's `cornerRadius` was hard-bound to `border-radius/rounded-full` at the master level. Every consumer that wanted a non-pill focus ring (e.g., a Button at rounded-md) had to override `cornerRadius` per-instance — fragile and unverifiable as a system invariant.

A **local Brightseed `Ring` component_set** was built on the Badge page (id `26482:628558`) with a single `Shape` variant axis. Each variant binds the inner rectangle's `cornerRadius` at the master level to a matching `border-radius/rounded-X` token:

| Variant | cornerRadius var | Resolved value |
|---|---|---|
| `Shape=xs` | `border-radius/rounded-xs` | 2 |
| `Shape=sm` | `border-radius/rounded-sm` | 6 |
| `Shape=md` | `border-radius/rounded-md` | 8 |
| `Shape=lg` | `border-radius/rounded-lg` | 10 |
| `Shape=xl` | `border-radius/rounded-xl` | 14 |
| `Shape=2xl` | `border-radius/rounded-2xl` | 18 |
| `Shape=3xl` | `border-radius/rounded-3xl` | 22 |
| `Shape=4xl` | `border-radius/rounded-4xl` | 26 |
| `Shape=full` | `border-radius/rounded-full` | 9999 |

**Master spec.** Each variant is 61w × 24h (matching the remote Ring's master). Inner rectangle is named `Ring`, fills are `[]`, strokes are 1px solid OUTSIDE with the default Pro-Pack focus-ring grey color (replaced per consumer via override), `constraints: { horizontal: 'STRETCH', vertical: 'STRETCH' }`. The STRETCH constraints are critical — without them, the inner rectangle stays at the master's 61×24 size when an instance is resized smaller (e.g., a 53×20 Badge focus ring), causing the stroke to extend past the parent frame on the right and bottom.

**Variant naming axis is intentionally `Shape=xs` etc., not `Size=xs`.** The component_set has only one axis; "Shape" is the property name because the values are radius tokens, not size tokens. Using a name like Size would imply width/height variation that doesn't exist.

**Stroke weight and color stay variable per consumer.** The master has 1px stroke (the system-wide default — see "Focus ring stroke + offset unification" below). Consumers set their variant-specific focus color via override on the instance's inner-rect stroke. When swapping an instance, color overrides are preserved IF the source override was bound to a non-default variable; if the source override happened to match the new master's default value, Figma drops the override and the new master's default is used (see "Focus ring migration footnote: lost-color binding edge case" below).

**Where it sits in the file.** On the Badge page, positioned at `(-526, 1080)`, just below the existing `Components` section. Considered moving to a shared "Components" page later when more components join the local-override pattern; not worth doing yet.

**Why local rather than refactoring the remote.** Three options were on the table: (A) refactor the remote shared Ring into a Shape-aware set in its source library; (B) create a separate local `BadgeFocusRing` and leave Buttons on the remote Ring; (C) build a single local Ring set covering both badges and buttons. (C) chosen — A would break stock Pro Pack consumers that aren't ours; B forks the system with two parallel Ring components; C generalizes the pattern at the v3 file boundary, leaves the remote Ring untouched for any stock Pro Pack uses still in the file, and lets all our Brightseed-customized consumers reference one local set.

### Focus ring stroke + offset unification at 1px (May 7, 2026)

Buttons and Badges had divergent focus ring geometries:

| | Was | Now |
|---|---|---|
| Badge focus ring stroke | 1px | 1px |
| Badge focus ring offset (gap between body and ring) | 1px | 1px |
| Button focus ring stroke | 2px | **1px** |
| Button focus ring offset | 3px | **1px** |

**Why unify.** The original Button focus rings used a 2px stroke at 3px offset, with the inner rect's `cornerRadius` set to literal `body_cr + 1` per instance. Two issues: (1) the 2px stroke and 3px offset were per-component decisions with no system-wide grounding, and (2) the offset+1 cornerRadius math was an approximation — for visually concentric ring corners, ring `cr` should equal `body_cr + offset` exactly (so cr=11 for a default-size button with offset=3, not cr=9). At 3px offset the corner mismatch was visible; at 1px offset it's negligible.

**The unification.** All focus rings — Badge and Button — now use 1px stroke + 1px offset. With a 1px offset, the corner mismatch between a Shape variant's master-bound `cornerRadius` and the body's `cornerRadius` is at most 1px, which reads as concentric to the eye even when geometrically the radii are equal rather than offset-adjusted. This means we can keep Shape variants bound to plain `radius/{xs,sm,md,...}` tokens without per-instance compensation.

**What this means going forward.** When porting another component to the local Ring set: the consumer sets the Ring instance position to `(-1, -1)` and size to `(body.width + 2, body.height + 2)`, picks the `Shape=*` variant matching the body's `cornerRadius`, and lets the master handle stroke weight (1px). No per-instance corner override needed.

### Button focus ring migration to local Ring set (May 7, 2026)

All 55 Button focus variants in the canonical Button COMPONENT_SET (`37:931`) had their Ring instances migrated to the local Brightseed Ring set:

- **44 variants** at default sizes (xs, default, sm, lg, icon, icon-xs, icon-sm, icon-lg) → `Shape=md` (cr=8 via `radius/md`).
- **11 variants** at xl-family sizes (xl, icon-xl) → `Shape=4xl` (cr=26 via `radius/4xl`).

Each ring was repositioned to `(-1, -1)` and resized to `body+2`, stroke weight set to 1, and any legacy cornerRadius binding on the inner rectangle cleared. The instance-level color binding (variant-specific focus color: lime-700 for Default, sand-300 for Secondary, red-500 for Destructive, etc.) was preserved through the swap automatically by Figma — no restoration needed for any of the 55.

The remote shadcn Ring component is no longer referenced by any Brightseed-customized Button focus variant. Stock Pro Pack consumers (if any are still parked on the file outside the Quill section) still reference it.

### Focus ring migration footnote: lost-color binding edge case (May 7, 2026)

When `instance.swapComponent(newMain)` runs, color overrides on the instance's children are preserved only if the source override binds to a variable **different from the new master's default** for that paint slot. If the source override happened to match the new master's default (e.g., both were bound to the same library variable), Figma interprets the override as redundant and drops it on swap.

This bit during the Badge focus ring migration: 3 of 12 Badge focus rings (Default, Outline, Ghost — all bound to the same Pro Pack `base/ring` color variable) lost their stroke color binding after swap, falling back to the new master's default unbound stroke color. Those 3 were re-bound manually to the original library variable to restore the focus color.

For the Button focus ring migration, all 55 retained their bindings — likely because each Button variant has a distinct focus color variable (lime, sand, red, etc.), none of which matched the new master's default.

**Mitigation for future ports:** capture each instance's pre-swap color binding before the swap, swap, then re-apply if `afterColor !== beforeColor`. The badge migration code does this; reuse the pattern.

### `custom/outline` aliased to `base/border` (May 7, 2026)

`custom/outline` (Pro Pack `3. Mode` collection, `VariableID:17378:14652`) was a hardcoded grey RGBA at 50% alpha — a Pro Pack default that never reflected Brightseed's sand-toned outline color. It's now aliased in both light + dark modes to `base/border` (Brightseed Mode), which resolves to sand-200 (light) / sand-700 (dark). Theme-aware sand outline, system-clean.

**Alpha caveat.** The previous value had 50% alpha for a soft-outline feel; `base/border` is full opacity. Outlines bound through `custom/outline` will read sharper in v3 than they did in v2. If any specific use needs the soft 50% feel back, that's a per-use alpha decision (not a system-level token).

### What this means for Claude in future sessions

**System invariants for focus rings going forward:**
- All focus rings reference the local Brightseed Ring component_set (`26482:628558`), variant-selected by `Shape=*` matching the body's `cornerRadius`.
- Stroke weight: 1px (master default).
- Offset: 1px from the body in both x and y, instance sized `body+2`.
- Color: variant-specific, set at the instance level via stroke color override.
- No per-instance `cornerRadius` overrides — shape comes from the variant.

**When porting another component (Input, Card, etc.) to use the local Ring set:**
1. Identify the body's `cornerRadius` and pick the matching `Shape` variant.
2. Insert a Ring instance positioned at `(-1, -1)` sized `body+2`.
3. Override the inner rect's stroke color to the variant's focus color.
4. Don't touch stroke weight or cornerRadius bindings — let the master cascade.

**Shape variants currently in the local Ring set:** xs, sm, md, lg, xl, 2xl, 3xl, 4xl, full. If a new component needs a shape outside this list (e.g., `Shape=none` for a square focus ring), add a variant to the set — don't override per-instance.

### Primary Badge inline-slot architecture (May 7, 2026)

Primary Badge gained optional leading and trailing slots — for icons or status dots — without expanding the variant count. The set stays at 36 variants (12 Variant × 3 State). Behavior is added via component properties on the SET, with color tracking handled by a Variable Modes cascade.

**Set:** `26480:627833` (`Quill Components > Primary Badges > Component Set Wrapper > Badge`).

**4 component properties on the set:**
- `Show Inline Start` — BOOLEAN, default `false`. Bound to leading slot's `visible`.
- `Inline Start` — INSTANCE_SWAP, default `Leaf-badge` (`26485:632020`). preferredValues: `[Leaf-badge, Rat-badge, Dot-badge]`. Bound to leading slot's `mainComponent`.
- `Show Inline End` — BOOLEAN, default `false`. Bound to trailing slot's `visible`.
- `Inline End` — INSTANCE_SWAP, default `Leaf-badge`, same preferredValues. Bound to trailing slot's `mainComponent`.

**Slot structure (replaces the legacy IconPlaceholder slots):**
Every variant has `[leading slot] [text] [trailing slot]` as direct children — except Focus variants where the slots live inside `variant.children[1]` (the inner `Badge` frame, with the Ring outside). Slots are 10×10 INSTANCE nodes hidden by default. Auto Layout HUG, so badge auto-resizes when slots become visible.

**The Figma idiosyncrasy this architecture solves.**
First-pass implementation used per-variant nested overrides on `slot.children[0].strokes[0].boundVariables.color` — pointing each variant's slot inner stroke to that variant's text token. This worked for the common path (toggle `Show Inline Start`, leave `Inline Start` at default Leaf), but broke when the user explicitly picked "Leaf-badge" from the dropdown — i.e., set the property to its own default value. Figma's runtime optimizes "set property = default" into a no-op revert to master, bypassing the variant's nested override. The slot rendered in `base/foreground` (Leaf-badge's master stroke binding) instead of the variant's text color. Rare bug but real.

**The robust fix: Variable Modes cascade.**

The icon/dot color now travels through a single Brightseed-local variable, `tag/active-color`, whose value is mode-dependent. Each Primary Badge variant has `explicitVariableModes` set to its tag mode, and the cascade propagates to whatever instance lives in the slot — Leaf, Rat, Dot, or future custom marks. No nested overrides needed.

**Setup:**
1. **Variable collection `Brightseed Tag Mode`** with 10 modes:
   - `Neutral` → aliased to `base/foreground`
   - `Red` → aliased to `base/tag-red-text`
   - `forest`, `lime`, `cyan`, `blue`, `yellow`, `orange`, `lavender`, `orchid` → aliased to their respective `base/tag-{X}-text` variables
   - Each `base/tag-{X}-text` token already handles light/dark modes natively, so theme propagates automatically through the alias chain.
2. **Variable `tag/active-color`** in that collection — type COLOR, value per mode is the alias listed above.
3. **Icon components** (`Leaf-badge`, `Rat-badge`, `Dot-badge`) — inner Vector strokes bound to `tag/active-color` (was `base/foreground`).
4. **Per-variant `explicitVariableModes`** — each of the 36 Primary Badge variants has the new collection's mode set explicitly:
   - `Default`, `Outline`, `Ghost` variants → `Neutral` mode
   - `Red` variant → `Red` mode
   - 8 tag-color variants → their matching mode
5. **Phase-3 nested stroke overrides retired** — at the cleanup step, every variant's slot inner Vector strokes were rebound to `tag/active-color` (matching master), so the override is a logical no-op. The Variable Mode cascade is the single source of truth.

**Why 10 modes, not 12.**
Figma caps mode count at 10 per collection on this account. With 12 Variant values, three had to share. `Default`, `Outline`, and `Ghost` were collapsed into a shared `Neutral` mode pointing at `base/foreground`. This produces a small visual divergence on the `Default` variant: badge text is `base/secondary-foreground` (warm sand), but inline icon/dot is `base/foreground` (cooler dark). At 8×8 line-art scale, the difference is barely perceptible — accepted trade-off. If 10-mode cap is ever raised or a re-architecture is warranted, the path is split `Default` into its own mode.

**Why the icon authoring pattern matters.**
For the cascade to work, every icon component used as a swap target must have its inner stroke bound to `tag/active-color`. New custom icons added to the system follow this pattern:
- Outer COMPONENT frame: 10×10, fills `[]`, strokes `[]`.
- Inner element at `children[0]` named `Vector` (consistency for swap-override compatibility — see Dot subsection below).
- Inner element fills `[]`, strokes bound to `tag/active-color`.
- 1px stroke weight, CENTER alignment for line-art icons.

**Dot component — stroke-as-fill technique.**
The `Badge/Status/Dot-badge` component uses a 0×0 LINE node at `children[0]` named `Vector`, with `strokeWeight=4`, `strokeCap=ROUND`, `strokeAlign=CENTER`, no fills. The round cap on the zero-length line produces a perfect 4×4 filled-looking circle from a single stroke — same color-binding path as Leaf/Rat (`children[0].strokes[0]`). This means swapping Leaf ↔ Rat ↔ Dot inside any badge slot preserves the color binding via Figma's structural-match swap behavior.

**Matrix layout: 6 columns.**
The Quill > Primary Badges purple skeleton was widened from 3 columns (Default / Hover / Focus) to 6, adding example columns:
- `Status Dot` — instance with `Show Inline Start: true`, `Inline Start: Dot-badge`
- `Front Icon` — instance with `Show Inline Start: true`, `Inline Start` left at default (Leaf via mode)
- `Back Icon` — instance with `Show Inline End: true`, `Inline End` left at default (Leaf via mode)

Implementation: existing variant set kept at 315w with its automatic dashed border. New `Examples` frame (291w) added as a sibling inside `Component Set Wrapper`, with matching purple-dashed border. 36 example instances placed at calculated `x,y` positions (97-pitch columns, 64-pitch rows) inside the Examples frame. Column Headers extended to 606w with 6 labels: 5 non-last columns at 97w, last at 73w. Grid Column resized to 606w, Primary Badges parent to 671w.

### What this means for Claude in future sessions

**Adding a new custom icon for use in Primary Badge slots:**
1. Build the component as 10×10 outer frame, inner `Vector` child at `children[0]`, no fills, strokes bound to `tag/active-color`, 1px CENTER stroke.
2. Add to `preferredValues` of the `Inline Start` and `Inline End` properties on the Primary Badge set so it appears in the curated swap dropdown.
3. No per-variant rebinding needed — the cascade handles color automatically.

**The Phase-4 test container (`Phase 4 - Inline Slot Test`) was deleted by Becky after C landed.** The matrix's new example columns serve as the canonical demonstration.

**Open follow-ups documented elsewhere in the status table:**
- Pro Blocks consumers still reference original shadcn `Badge` (`26:169`) and `Badge Number` (`17100:10130`) on the `Components` SECTION. Need to rebind to the Quill custom badges. Note: `Badge Number` may not have a direct Quill equivalent — surface that gap during the rebind.

### Pro Pack rebuild — sandbox rebased on shadcndesign.com (May 8, 2026)

The sandbox was rebased from stock shadcn-ui copies to the shadcndesign.com Pro Pack (purchased via Polar). Premise: case study reads stronger as "bought a Pro Pack and re-skinned through a token bridge" than "copied stock and customized." Branch: `pro-blocks-rebuild`. Recovery point: `button-badge-snapshot` branch at `5333cd1`.

**What landed:** `@shadcndesign/sign-in-2` + 5 modern form primitives (Checkbox, Field, InputGroup, Label, Textarea); `@shadcndesign/app-shell-4` + 4 nav helpers (NavMain, NavProjects, NavUser, TeamSwitcher) + Collapsible (transitive dep shadcndesign forgot to declare). Storybook stories for both. Both paint full Brightseed via the bridge — no manual re-skinning needed.

**Premise validated:** shadcndesign Pro Blocks are pure composition layers. They reference STOCK shadcn primitives by name (`button`, `checkbox`, `input`, `sidebar`, etc.) — not their own forks. So our customized Button + Badge ARE the paint surface; the bridge handles theming for everything else.

**Registry wiring** lives in `sandbox/components.json` `registries` block — URL `https://www.shadcndesign.com/api/registry/{name}`, header `X-License-Key: ${SHADCNDESIGN_LICENSE_KEY}`. Token is in `sandbox/.env.local` (gitignored). Required first install: `@shadcndesign/styles` — purely additive `.heading-*` / `.container-padding-x` / `.section-padding-y` / `.section-title-gap-*` utility classes. No CSS vars, no clobbering. Fully verified safe for the bridge.

**Install pattern (canonical, do this every time):**

```bash
yes n | npx --yes shadcn@latest add @shadcndesign/<block-name> --yes
```

The leading `yes n |` is critical. shadcn CLI 4.x's `--yes` flag confirms config prompts but does NOT auto-answer overwrite prompts (those default to `N`, but the CLI waits for stdin). Without `yes n |` piping `n` to stdin, the install hangs forever on the first existing-file prompt (typically `button.tsx`). The `n` answers preserve all customized files (Button, Badge, anything you've spec-ported); the CLI skips them and proceeds with new files.

If a block install fails to render with "Failed to fetch dynamically imported module" in the Storybook iframe, the cause is usually a missing transitive dep that shadcndesign didn't declare. Grep the new pro-blocks files for `from "@/components/ui/<name>"`, check if `<name>.tsx` exists in `components/ui/`, and install any missing ones via `npx shadcn@latest add <name>` (no `@shadcndesign/` prefix — stock shadcn). Discovered via Collapsible during App Shell 4 install.

**Inspect before install** is the rule. Fetch the registry payload first to see what files would be written, what `registryDependencies` cascade in, what `cssVars` or `tailwind` config changes are proposed:

```bash
curl -sS -H "X-License-Key: ${SHADCNDESIGN_LICENSE_KEY}" \
  "https://www.shadcndesign.com/api/registry/<block-name>" | jq .
```

The most important fields to read: `files[].path` (will any path overlap with customized components?), `registryDependencies` (will the cascade try to pull stock versions of customized primitives?), `cssVars` (will the install touch our token bridge?), `tailwind` (will it modify Tailwind config?). For shadcndesign blocks, `cssVars` and `tailwind` are typically `null` — the only file edits beyond `files[]` are `app/globals.css` mutations the CLI does internally.

**Tailwind v4 — `@source` directives go AFTER all `@import` statements.** CSS spec requires all `@import` at the top of the stylesheet, before any other rule. `@source` is non-`@import` content — placing it between imports silently invalidates everything after. Symptom: tokens/bridge stop loading, every Brightseed CSS variable resolves to empty string. Diagnosed once via Chrome MCP DOM inspection, fixed in `sandbox/app/globals.css`. Don't repeat.

Tailwind v4 auto-detects content sources, but auto-detection misses runtime-added directories (e.g., `components/pro-blocks/` populated mid-session by Pro Block installs). Defensive `@source` directives in `app/globals.css` cover all the standard locations: `app/`, `components/`, `stories/`, `lib/`, `hooks/`. Restart Storybook/Next.js after adding new top-level directories.

**Sidebar tokens — bridge them, don't let the CLI inline stock values.** When a Sidebar-consuming block (App Shell 4, etc.) installs, the shadcn CLI auto-injects `--sidebar`, `--sidebar-foreground`, `--sidebar-primary`, `--sidebar-primary-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring` as hardcoded `hsl()` values in `app/globals.css`, with a `.dark` selector for dark mode. **Both wrong for our setup:** (1) hardcoded values bypass the bridge and paint the sidebar in stock cool grays instead of Brightseed sand, (2) we use `[data-theme="dark"]` not `.dark`, so the dark override doesn't even fire.

**Fix:** delete the auto-injected `:root { --sidebar: hsl(...) }` and `.dark { ... }` blocks from `app/globals.css`, define the same tokens in `bridge/globals.css` aliasing to Brightseed semantics. Sidebar surface = `--color-surface-default` (white/sand-950, per v3 May 6 decision). Sidebar primary = `--color-action-primary` (lime). Accent = `--color-surface-alt`. Border = `--color-border-default`. Ring = `--color-border-focus`. Dark theme cascades automatically through the existing `[data-theme="dark"]` selector in `tokens/semantics.css`. Single source of truth, no per-install maintenance. If the CLI re-injects on a future Sidebar install, delete it again — bridge wins.

**Defending Button + Badge during installs.** Branch `button-badge-snapshot` is a permanent recovery point. If a future install ever does corrupt them despite the `yes n |` defense, restore with:

```bash
git checkout button-badge-snapshot -- \
  sandbox/components/ui/button.tsx \
  sandbox/components/ui/badge.tsx \
  sandbox/stories/Button.stories.tsx \
  sandbox/stories/Badge.stories.tsx
```

Pre-install verification ritual: `sha256sum components/ui/button.tsx components/ui/badge.tsx`. Re-run after install. Hashes must match. They have through both Sign In 2 and App Shell 4 installs to date.

**Forager surfaces deferred.** The 5 Forager composition components (ChatPanel, CompoundCard, PlantCard, StrategyCard, SurfaceHeader) and their 2 demo pages (compounds, strategies) were deleted on May 8, 2026 to make room for the rebuild. To be re-derived on top of Pro Block primitives — not before more Pro Blocks land (Cards in particular, per Becky's roadmap; she said "we're not ready for [App Shell] 3 until I make a few additional card components"). `app/page.tsx` is currently a placeholder pointing users to Storybook.
