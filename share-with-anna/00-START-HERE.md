# Start Here — Forager Design System

Welcome. This folder is the design-system handoff for Forager: the tokens, the rules, and how to prototype screens with them. Read this page first — it's the map. Everything else is the territory.

## What this is

A production design system for Forager, built on **shadcn/ui + Tailwind CSS** with a custom token layer. The whole visual language — color, type, shape, spacing, component states — is expressed as **design tokens** (CSS custom properties). Components never hardcode a color or size; they reference a token. Change the token, every screen updates.

This means you can prototype real, on-brand Forager screens quickly: describe what you want, reference the token vocabulary, and the components paint themselves correctly.

## The one rule that makes everything work

**Component code references the semantic layer only.** There are three tiers:

```
Primitives   --p-color-lime-300        raw values (#CDE67B). No meaning.
   ↓
Intents      --action-primary-300      role aliases. Pure indirection.
   ↓
Semantics    --ds-color-action-primary ← THIS is what you reference
```

When you (or the AI) write or prompt for a screen, reach for `--ds-*` tokens — `--ds-color-action-primary`, `--ds-color-surface-default`, and so on. Never reach past them to a raw hex or a `--p-*` primitive. That single discipline is what keeps prototypes looking on-brand instead of drifting.

## What to read, in order

1. **`01-design-system-overview.md`** — the architecture and the key brand tokens, in two pages. Read this second.
2. **`02-token-reference.md`** — the full token vocabulary and composition rules. This is the document to keep open (or paste into a prompt) while prototyping. Reference, not a read-through.
3. **`03-prototyping-guide.md`** — the actual loop: how to take an idea to a previewable screen.

## Where the live system lives

- **Storybook** — the running, browsable component library with every variant and state: https://brightseed-storybook.vercel.app. When in doubt about what a component looks like, look here, not at a static spec.
- **Token files** — `tokens/*.css` in the repo. The source of truth. If a doc and the CSS disagree, the CSS wins.

## A few load-bearing conventions

- **Light-first.** Every default value assumes a light background. Dark theme is an override applied via `data-theme="dark"` on an ancestor element — you never write dark-mode-specific component styles.
- **No hardcoded values.** No hex codes, pixel values, or font names in component styles. Tokens or Tailwind utilities only.
- **Tag colors are decorative, not semantic.** The eight tag colors differentiate items visually; a color never implies status. For status meaning, use icon + text, not color.
- **Icons come from the approved set** at the Storybook Icons page. If an icon you need isn't there, flag it — don't improvise one.
