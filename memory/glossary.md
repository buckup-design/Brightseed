# Glossary

Internal terms, project codenames, and shorthand specific to the Brightseed engagement.

## Project codenames

| Codename | What it is |
|---|---|
| **Forager** | Brightseed's biotech compound screening platform — the application surface this project designs for. Conversational AI thread on the left, structured result surfaces on the right. Currently alpha (3 customer POCs, <10 by EOY 2026). |
| **Quill** | Brightseed's customized fork of shadcn/ui — the design system as it lives inside the v3 Figma file. Renamed from "Mantel" on May 6, 2026. Quill = shadcn + Brightseed Mode rebind + custom Brightseed-spec tweaks (Button hover ladder, Badge inline-slot architecture, etc.). |
| **Brightseed** | The biotech company. Decodes plant compounds at scale. Brand carries hummingbird + line-art motifs, "Deep Forest" + "Lime" anchor. https://www.brightseedbio.com/ |

## Internal vocabulary

| Term | Meaning |
|---|---|
| **v3 file** | "shadcn Brightseed v3 (with pro blocks)" — canonical Figma file. Key `ZZPjoeJ447MWuzNi3LL1BL`. Set up May 6, 2026. |
| **v2 file** | "shadcn for Brightseed v2" — archived predecessor. Key `7ERrLXGke73xn3dCCsI2h6`. Used May 8 as the source for Lucide icon restoration. |
| **Brightseed Mode** | Variable collection in v3 (~50 variables) that maps shadcn slot vocabulary (`base/background`, `base/primary`, etc.) to Brightseed primitives. Lets any Pro Pack component be Brightseed-port'd via name-match rebind. |
| **Brightseed Tag Mode** | Separate v3 variable collection (10 modes: Neutral, Red, forest, lime, cyan, blue, yellow, orange, lavender, orchid) used for the Primary Badge inline-slot color cascade via `tag/active-color`. |
| **Tag colors** | The 8 decorative hues for tag-dense Forager surfaces (forest, lime, cyan, blue, yellow, orange, lavender, orchid). Color does NOT imply status — for status meaning, compose icon + text. |
| **Pro Pack / Pro Blocks** | The shadcn Pro paid block set. Pages named "Pro Blocks (Application/Landing/E-commerce)" host its showcase. Pro Pack components are heavily reused as a starting point for Brightseed ports. |
| **Linktext** | The Button variant that's button-shaped but reads as a link. Lime text, never underlined. Distinct from the inline `<a>` Link component (blue, always underlined). Different state machines — do not collapse. |
| **The matrix / the Quill matrix** | The dashed-purple-line component-doc grid showing every variant × state cell as live component instances. Canonical Quill location: `Components - Quill` SECTION on the Button page (id `26465:249160`). |
| **The bridge** | `bridge/globals.css` — maps shadcn variable names to Brightseed semantic tokens. "Intentionally thin" — never extend it to expose state ladders; reach for `[var(--color-...)]` arbitrary values in the cva instead. |
| **The web app** (formerly "the sandbox") | `/web/` — Next.js 16 + Tailwind 4 + Storybook 10 production app, deploys to Vercel. Built Apr 30, 2026; renamed `sandbox/` → `web/` June 2026 (single-contributor production app, not a staging area). |
| **Cowork** | Anthropic's desktop tool for non-engineers to drive AI workflows. The case study workflow: Anna/Meng prompt in Cowork → Vercel preview → Becky reviews → merge. |

## Acronyms

| Term | Meaning | Context |
|---|---|---|
| DS | Design System | |
| PR | Pull Request | |
| AA / AAA | WCAG accessibility level | AA is the contrast bar we hold |
| POC | Proof Of Concept | Forager's customer engagement tier (3 today) |
| GLP-1 | Class of weight-loss drugs | Forager use-case example |
| GRAS | Generally Recognized As Safe | FDA term, common in Forager UI |
| IP | Intellectual Property | Patents, freedom-to-operate |
| SOP | Standard Operating Procedure | |

## Locked-in convention shorthand

| Phrase | Meaning |
|---|---|
| "the lime ladder" | The 3-step lime surface progression: lime-300 default → lime-400 hover → lime-500 pressed. Forest text steps in lockstep: forest-800 / 900 / 950. |
| "soft destructive" | The Apr 2026 destructive treatment: red-100 surface + red-600 text (NOT solid red-500 + white). Matches Tag recipe. |
| "ghost-label trick" | The Button's CSS-grid stack pattern that reserves SemiBold width invisibly so hover-weight bump never causes layout shift. |
| "the cascade" | The May 7 Primary Badge architecture using `Brightseed Tag Mode` collection + `tag/active-color` variable to color inline icons per variant — replaced fragile per-variant nested overrides. |
| "stamp behavior" | Apr 2026 decision for Verified-style badges: don't make a Verified variant, compose icon + text instead. |
| "weekly calibration" | Friday ritual reviewing how Becky and Claude worked that week + reviewing the Linear cycle. |

## Things that are NOT the thing

| Looks like | Actually is |
|---|---|
| `Badg Primary` | Typo for "Badge Primary" — fixed May 8. Quill Primary Badge component_set (id `26480:627833`). |
| `Mantel` | Old name for Quill (renamed May 6, 2026). If you see Mantel anywhere, it's stale. |
| Brand color names ("Chlorophyll", "Garlic Bloom", "Eschscholzia Californica") | Forbidden in code. Live ONLY in `Obsolete/brand-colors-reference.md` as historical record. Code uses functional names (`lime-400`, `forest-900`). |
| Original shadcn Badge (`26:169`) | The pre-Quill Badge that was rebound on May 8 — its 24 consumers across Spinner/Card/Table/Input now point to Quill Primary. |
| Tiempos Headline | NOT licensed yet (May 8). Display scale uses Tiempos Text (4 weights) as a placeholder. |
