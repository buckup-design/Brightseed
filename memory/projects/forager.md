# Forager

**Codename:** Forager
**Status:** Alpha — 3 customer POCs today, fewer than 10 by EOY 2026
**Owner at Brightseed:** Meng (VP Platform)

## What it is
Brightseed's biotech compound screening platform. Scientists feed it a research goal — "help individuals on GLP-1 weight-loss drugs retain lean muscle mass" — and Forager surfaces strategies, compounds, and plant sources from Brightseed's proprietary dataset, with evidence, feasibility, and IP/legal signals attached.

Conversational interaction model: AI chat thread on the left runs alongside structured result surfaces on the right. Pivoting the search ("now also show me secondary compounds that strengthen this effect") doesn't require leaving the page.

## Users
Biotech research scientists and bioactive-product strategists at partner enterprises. Domain-fluent (GRAS, IP whitespace, gene targets, freedom-to-operate). High tolerance for information density. Won't be impressed by friendliness; will be impressed by signal-to-noise.

## Strategic principles (locked)
- Tokens over values. Component code references the semantic layer; never hardcode hex/px/font.
- Brand-poetic names live only in the brand reference file. Code uses functional names.
- Cards are the lazy answer for dense data. Don't reach for a card grid when a comparison matrix or table would do the job better.
- Forager is data-dense. Patterns like "wizard" are wrong here; configuration panels with stateful nodes are right.
- Speed of prototyping > code cleanliness, because the platform is alpha. Hold the line on brand quality and token discipline only.
- The case study is the workflow. The design system is one ingredient; the artifact is the end-to-end Cowork → preview → merge pipeline.

## Anti-references
- Generic SaaS dashboard cream
- Healthcare-app teal-and-white
- Crypto/AI neon-on-black

## Current screens / components in flight
| Component | Status |
|---|---|
| CompoundScreeningTable | ✅ Production-ready |
| DoseResponseChart | 🔲 API spec done, implementation pending |
| StatCard | 🔲 API spec done, implementation pending |
| Demo screens from Anna's mocks (Compounds + Plants views) | 🔲 Open |
| PlantCard / CompoundCard / StrategyCard | 🔲 Open — see "Card types" below |

## Card types (from Anna's 4-29-26 mocks)

Three card types compose the main result surfaces. Source mocks:
`anna's mocks 4-29-26/filtered to plants.png`, `filtered to compounds.png`,
`strategies view.png`. Content is approximately accurate; typography and
visual hierarchy need rebuilding to Brightseed/Quill standards.

### PlantCard
Used in the Plants view. One card per plant species linked to the active strategy.
- **Header**: leaf icon + scientific name in italic serif (e.g. "Foeniculum vulgare (Fennel)"), with a green "Bioactive potential" badge in the top-right
- **One-liner**: strategy summary ("Shifts rumen microbiome towards propionate producers.")
- **Evidence prose**: 2-line summary of compound action on biological targets
- **Tag row 1** (compounds): chemical/compound name pills with overflow "+N more"
- **Microlabel**: "Forager predicted bioactives"
- **Tag row 2** (bioactives): gene/protein pills (NF-kB, HIF-1α, etc.) with overflow
- **Footer badges**: green "GRAS" (regulatory status) + orange "IP Landscape" (with warning glyph)

### CompoundCard
Used in the Compounds view. One card per compound that supports the active strategy.
- **Header**: orange molecule icon + compound name (sans, not italic), with a small chart-glyph + confidence score (e.g. "85%") in the top-right
- **One-liner**: mechanism summary ("Selectively inhibits methanogens & gram-positive bacteria; enriches Prevotella spp...")
- **Linked plant**: microlabel "Linked plant" + underlined plant name(s)
- **Tag row** (bioactives): gene/protein pills with overflow
- **Footer badges**: sand-colored category tag ("Animal - cow", "Animal - ruminants") + orange "IP Landscape"

### StrategyCard
Used in the Strategies overview grid. One card per candidate strategy for a research goal.
- **Header**: strategy one-liner (bold) + detailed description below (subtler)
- **Body — three evidence rows**, each with a status glyph:
  - Green check → "Evidence: what's in literature + predicted"
  - Yellow warning → "Feasibility: formula and safety concerns"
  - Red blocked → "Legal: freedom to operate"
- **Footer actions**: "Tell me more" (outline button) + "Explore compounds" (linktext)

Shared concerns across all three: light card surface on the alt grid bg,
medium radius, hairline border, hover lift, focus ring via Brightseed
focus token. Status colors map to the Brightseed semantic intents
(success / warning / critical) — not raw red/yellow/green.

## Reference files
- `BrightseedDS.md` — AI agent source of truth (paste alongside prompts for Forager UI generation)
- `anna's mocks 4-29-26/` — reference screenshots
