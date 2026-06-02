# Prototyping Guide

How to take a Forager screen from idea to a previewable build using the design system. The point of the system is that you can move at the speed of describing what you want — the tokens and components carry the polish.

## The loop

```
idea  →  prompt in Cowork (with the token reference)  →  preview in Storybook  →  refine  →  ship
```

### 1. Open the app in Cowork

The app lives in the `web/` folder — a Next.js + Storybook project. Open that folder as your Cowork working directory. The AI working in that folder already reads the project's conventions; you bring the intent.

### 2. Describe the screen, and hand it the vocabulary

Prompt in plain language — "a compound detail card with a header, a dose-response chart, and a row of source tags." Two things make the output land on-brand instead of generic:

- **Paste `02-token-reference.md`** (or point to it) alongside your prompt. That gives the AI the exact `--ds-*` vocabulary to reference, so it reaches for `--ds-color-action-primary` instead of inventing a green.
- **Name existing components** when you can. The system already has Button, Badge, Card, Table, Alert, and more — building on them beats describing from scratch. Browse them in Storybook first.

### 3. Preview

Run the library locally to see what you built:

```bash
cd web
npm install        # first time, and after any new dependency
npm run storybook  # component library at localhost:6006
npm run dev        # full Next.js app at localhost:3000
```

Toggle light/dark with the theme switch in the Storybook toolbar — your screen should hold up in both without any extra work, because the tokens handle it.

### 4. Refine against the system, not around it

When something looks off, the fix is almost always "use the right token," not "override with a custom value." If you find yourself wanting a color or size that has no token, that's a signal — flag it rather than hardcoding. A missing token is a system gap worth a real decision, not a one-off patch.

### 5. Ship

Changes reach the live Storybook (https://brightseed-storybook.vercel.app) through the project's git flow. Your access and the exact push/preview steps are set up separately — once you're in, a merge to the main branch auto-deploys.

## Things that keep prototypes on-brand

- **Reference, don't invent.** `--ds-*` tokens and existing components first. New patterns only when nothing fits.
- **Light-first.** Build for light; dark comes free via the token override. Don't write dark-specific styles.
- **Tag colors are decorative.** Use them to tell items apart, not to signal status. Status = icon + text.
- **Icons from the approved set** (Storybook → Icons). If it's not there, flag it — don't draw a new glyph.
- **Data series** use `--chart-*` colors, never brand lime or forest.

## When in doubt

Storybook is the source of truth for *how things look*; the token CSS is the source of truth for *what's available*. If a written doc disagrees with either, the running system wins — and the disagreement is worth flagging so the docs get fixed.
