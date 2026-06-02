# Brightseed Design System

A three-layer design token system for Hummingbird, Brightseed's biotech compound-screening application. Built on shadcn/ui + Tailwind, with one base palette mapped through CSS variables and full light/dark theming.

## Where the truth lives

This README orients; it does not duplicate. For anything specific, go to the source, those can't go stale:

- **Token names + values** → the CSS in `tokens/` (`primitives.css`, `semantics.css`, `shape.css`, `charts.css`, `typography.css`). Import `index.css` to get everything.
- **How components look** → the live library at https://brightseed-storybook.vercel.app (every variant + state, both themes).
- **Rules + conventions** → `CLAUDE.md` (the canonical rules doc). Don't rely on rule statements copied into other files.

## The three layers

```
Primitives  →  Semantics  →  Components
--p-color-lime-300   →   --ds-color-action-primary   →   bg-[var(--ds-color-action-primary)]
```

- **Primitives** (`--p-{type}-*`), raw values, organized by type. The palette. Never used in components.
- **Semantics** (`--ds-*`), named for UI function; the only layer that touches primitives. (The old separate "intents" tier is merged into this layer.)
- **Components:** component code references the semantic layer only. Optional `--c-{component}-*` escape hatch for a local value with no semantic home.

## Using it in a Next.js + shadcn project

```css
/* globals.css */
@import '@/tokens/index.css';
@import '@/bridge/globals.css';
```

```ts
/* tailwind config */
darkMode: ['selector', '[data-theme="dark"]']
```

Toggle dark by setting `data-theme="dark"` on `<html>`. The semantic tokens swap underneath; you never write dark-specific component code.

## Repo map

- `tokens/`, the token CSS (source of truth for names + values).
- `bridge/globals.css`, maps Brightseed tokens onto shadcn's variable names.
- `web/`, the Next.js + Storybook app (production). `tokens/` and `bridge/` here are symlinks to the root copies.
- `CLAUDE.md`, canonical rules, conventions, and current status.
- Storybook (https://brightseed-storybook.vercel.app), the live design-system handoff: Getting Started, Foundations, Design.mdx, Components.
