# Brightseed Design System

A three-layer design token system for Forager — Brightseed's biotech compound screening platform. Built on shadcn/ui with a single base palette mapped to CSS variables, supporting light and dark themes.

## Structure

```
tokens/
  primitives.css     # Layer 1: 10 color hue scales (green, lime, sand, ...)
  intents.css        # Layer 2: role-name aliases (action-primary, success, ...)
  semantics.css      # Layer 3: UI-function tokens + dark theme override
  shape.css          # Radius, border width, shadow
  charts.css         # Data visualization tokens (categorical, sequential, diverging)
  index.css          # Entry point — import this one file to get everything

bridge/
  globals.css        # shadcn/ui bridge — maps Brightseed tokens to shadcn variables

components/
  CompoundScreeningTable.tsx   # Reference implementation (sortable data table)
```

## Token Architecture

```
Primitives  →  Intents  →  Semantics  →  Component code
--color-lime-300  →  --action-primary-300  →  --color-action-primary  →  bg-primary (via bridge)
```

- **Layer 1 — Primitives:** Raw hue scales, 11 steps each (50–950), OKLCH color space. No semantic meaning.
- **Layer 2 — Intents:** Role-name aliases pointing to primitive scales via `var()`. Pure indirection — no values duplicated.
- **Layer 3 — Semantics:** What component code references. Named for UI function (`--color-surface-default`, `--color-action-primary`, etc.). Full light + dark theme coverage in one file.

## Key Brand Decisions

| Role | Token | Value | Name |
|------|-------|-------|------|
| Primary surface | `--color-surface-brand` | `#305536` | Deep Forest |
| Primary action | `--color-action-primary` | `#CAE279` | Chlorophyll |
| Default background | `--color-surface-default` | `#F9F8F3` | Sand |
| Dark mode base | `--color-surface-default` (dark) | `#133019` | Floor |

## Usage

### In a new Next.js + shadcn project

1. Copy `tokens/` and `bridge/` into your project.

2. In your `globals.css`:
```css
@import '@/tokens/index.css';
@import '@/bridge/globals.css';
```

3. Enable dark mode in `tailwind.config.ts`:
```ts
darkMode: ['selector', '[data-theme="dark"]']
```

4. Toggle dark mode by setting `data-theme="dark"` on the `<html>` element.

### Naming conventions

| Layer | Pattern | Example |
|-------|---------|---------|
| Primitive | `--color-{hue}-{step}` | `--color-lime-300` |
| Intent | `--{role}-{step}` | `--action-primary-300` |
| Semantic | `--color-{category}-{role}-{state}` | `--color-action-primary-hover` |
| Component | `--{component}-{element}-{property}-{state}` | `--table-row-background-selected` |

### Rules

- Component code references **semantic tokens only** — never primitives or intents directly.
- State variants (`-hover`, `-active`, `-disabled`) exist on semantic tokens — never use inline opacity for disabled states.
- Hardcoded hex values are forbidden in component code. Use `var(--color-*)` or Tailwind's arbitrary reference syntax `bg-[var(--color-surface-success)]`.
- For numeric data columns: always use `tabular-nums` and `font-mono`.
- Chart categorical colors: assign `--chart-cat-1` through `--chart-cat-8` in order. Never use brand lime or brand green for data series.

## Status

| Layer | Status |
|-------|--------|
| Token vocabulary (all 3 layers) | ✅ Complete |
| Dark theme | ✅ Defined (visual QA pending) |
| shadcn/ui bridge | ✅ Complete |
| CompoundScreeningTable | ✅ Production-ready |
| DoseResponseChart | 🔲 API spec complete, implementation pending |
| StatCard | 🔲 API spec complete, implementation pending |
| AssayTimeSeries | 🔲 API spec complete, implementation pending |
| CompoundBadge | 🔲 API spec complete, implementation pending |
| Figma variables | 🔲 Mapping guide written, entry pending |
