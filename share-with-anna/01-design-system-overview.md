# Design System Overview

A three-layer design token system for Forager, built on shadcn/ui. One base palette, mapped through CSS variables, with full light and dark theme coverage.

## Token architecture

```
Primitives  →  Intents  →  Semantics  →  Component code
--p-color-lime-300  →  --action-primary-300  →  --ds-color-action-primary  →  bg-[var(--ds-color-action-primary)]
```

**Layer 1 — Primitives** (`--p-color-*`). Raw hue scales, 11 steps each (50–950). Eleven scales: forest, lime, sand, cyan, blue, yellow, orange, lavender, orchid, red, neutral — plus white and black. No semantic meaning; just values.

**Layer 2 — Intents** (`--{role}-{step}`, e.g. `--action-primary-300`, `--success-50`). Role-name aliases pointing at primitives via `var()`. Pure indirection — no values duplicated.

**Layer 3 — Semantics** (`--ds-*`, e.g. `--ds-color-action-primary`). Named for UI function, not appearance. **This is the only layer component code references.** Full light + dark coverage lives here.

The semantic prefix is `--ds-`. There is no bare `--color-*` semantic layer — if you see one in an older note, it's stale; the live tokens are all `--ds-*`.

## Key brand tokens

| Role | Token | Value | Notes |
|------|-------|-------|-------|
| Primary surface | `--ds-color-surface-brand` | deep forest | the brand green |
| Primary action | `--ds-color-action-primary` | `#CDE67B` (lime 300) | hover → lime 400, pressed → lime 500 |
| Default background | `--ds-color-surface-default` | `#FFFFFF` (light) | warm sand still anchors alt surfaces |
| Dark mode base | `--ds-color-surface-default` (dark) | `#1F1F1E` (sand 950) | warm dark neutral |

Chart colors use `--chart-cat-1` through `--chart-cat-8` in order (note: the chart family uses the `--chart-*` namespace, separate from `--ds-*`). Never use brand lime or brand green for data series — those read as "action," not "data."

## Theming

Light is the default. Dark theme is a token override that fires when an ancestor carries `data-theme="dark"`:

```css
darkMode: ['selector', '[data-theme="dark"]']
```

You never write dark-mode-specific component code. You set `data-theme="dark"` on `<html>` (or any wrapper) and the semantic tokens swap underneath the components.

## Core rules

- Component code references **semantic `--ds-*` tokens only** — never primitives, intents, or raw values.
- State variants (`-hover`, `-active`, `-disabled`) exist as their own semantic tokens. Don't fake a disabled state with inline opacity on the whole element.
- Hardcoded hex is forbidden in component styles. Use `var(--ds-color-*)` or Tailwind arbitrary syntax: `bg-[var(--ds-color-surface-success)]`.
- Numeric data columns: always `tabular-nums` and `font-mono`.
- Corner radii reference shape tokens (`--ds-shape-radius-*`), never raw pixels — that's how sizes stay consistent.

## Where it lives

- **Token CSS:** `tokens/*.css` (`primitives.css`, `intents.css`, `semantics.css`, `shape.css`, `charts.css`, `typography.css`). Import `index.css` to get everything.
- **shadcn bridge:** `bridge/globals.css` maps Brightseed tokens onto shadcn's variable names, so stock shadcn components paint in-brand automatically.
- **Live library:** https://brightseed-storybook.vercel.app — every component, variant, and state, in both themes.
