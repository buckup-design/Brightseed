# Quill

**The design system behind Hummingbird, Brightseed's compound-discovery application.**

Quill is a Brightseed-skinned fork of [shadcn/ui](https://ui.shadcn.com): a three-tier CSS-variable token system, a component library, and the application blocks composed from it.

It is built to be **prototyped against by prompting**. The token vocabulary and component API are shaped so that an AI assistant assembles a screen out of components that already exist — already on-brand, already themed, already handling their own states — instead of inventing a new button every time. The constraint is the point: a small, closed, greppable vocabulary is what makes generated UI reviewable.

**Live component library → [brightseed-storybook.vercel.app](https://brightseed-storybook.vercel.app)**

## Where the truth lives

This README orients; it does not duplicate. For anything specific, go to the source — those can't go stale:

| Question | Source |
|---|---|
| What tokens exist, and what are their values? | the CSS in [`tokens/`](tokens/) |
| What does a component look like, in every variant and state? | [the live Storybook](https://brightseed-storybook.vercel.app) |
| What's the design guidance, and what should an agent read? | [`DESIGN.md`](DESIGN.md) |
| What are the rules and conventions? | [`CLAUDE.md`](CLAUDE.md) |
| How do design and engineering hand off? | [`collaboration/`](collaboration/) |

When a doc disagrees with `tokens/*.css` or Storybook, the running system wins.

## The token architecture

Three tiers. Each may reference only the tier above it, and the prefix encodes the tier — so the discipline is greppable rather than a matter of convention:

```
--p-color-lime-300            #CDE67B                          primitive — a raw value
    ↓
--ds-color-action-primary     var(--p-color-lime-300)          semantic — named for UI function
    ↓
--c-button-action-primary     var(--ds-color-action-primary)   component-scoped
    ↓
bg-[var(--c-button-action-primary)]                            what button.tsx actually writes
```

Two rules carry it:

1. **Component code references only `--c-{component}-*`** — never a global `--ds-*`, never a primitive, never a raw value.
2. **Each `--c-*` definition aliases exactly one global `--ds-*`.** Component tokens are aliases, not new values, so the palette can't quietly fork.

Why a third tier rather than using semantics directly: it gives every component a small, self-describing vocabulary (`--c-button-*`, `--c-alert-*`) that is closed and enumerable. A violation becomes a string match instead of a judgment call — `grep 'var(--ds-' components/ui/` should return nothing, and today it does. That checkability is what makes the system safe to point an LLM at. Definitions live in [`tokens/components.css`](tokens/components.css), one block per component, generated from each component's actual usage.

**Light-first, one code path.** Dark theme swaps the semantic tier under `[data-theme="dark"]`. Component tokens resolve `var(--ds-*)` at point of use, so the swap flows straight through — there is no dark-mode-specific component code anywhere in the system.

## Running it

```bash
cd web && npm install
npm run storybook   # component library, localhost:6006
npm run dev         # the Next.js app, localhost:3000
```

Node 20+. `main` auto-deploys Storybook to Vercel.

## Consuming the tokens

```css
/* globals.css — @import statements must come first */
@import "tailwindcss";
@import "@/tokens/index.css";
@import "@/bridge/globals.css";   /* only if you also use stock shadcn components */
```

Toggle dark by setting `data-theme="dark"` on `<html>`.

## Repo map

| Path | What it is |
|---|---|
| [`DESIGN.md`](DESIGN.md) | Design guidance in the [Google design.md format](https://github.com/google-labs-code/design.md) — machine-readable tokens in front matter, rationale in prose. What a coding agent reads. Storybook renders this file; it isn't duplicated. |
| [`tokens/`](tokens/) | The token CSS. Source of truth for every name and value. |
| [`web/`](web/) | Next.js 16 + Tailwind 4 + Storybook 10. `tokens/` and `bridge/` here are symlinks to the root copies. |
| `web/components/ui/` | The forked shadcn primitives — 43 components, each reading its own `--c-*` tokens. |
| `web/components/quill/` | Application compositions: app shell, team switcher, settings, feedback, account menu, nav lists. |
| `web/components/hummingbird/` | Product surfaces: the workspace canvas, result cards, report document. |
| `web/stories/` | Storybook — 65 stories, plus the Foundations and guidelines pages. |
| [`bridge/globals.css`](bridge/globals.css) | Maps Brightseed tokens onto stock shadcn variable names. Now nearly vestigial: `ui/` no longer routes through it. |
| [`DOCS/`](DOCS/) | The Hummingbird object model, prototyping notes, and archived decisions. |
| [`collaboration/`](collaboration/) | How exploration, prototyping, review, and merge fit together. |
| [`CLAUDE.md`](CLAUDE.md) | Canonical rules, conventions, and current status. |

## State of things

Alpha, in active development, and honest about which is which.

**Settled** — the token system and dark theme; all 43 `ui/` primitives migrated onto component-scoped tokens; the application shell, sidebar, settings, and dialog patterns.

**In flight** — the Hummingbird product surfaces (workspace canvas, result detail, report document). These live under **WORK IN PROGRESS** in the Storybook sidebar and are promoted to `Components/` or `Blocks/` only once reviewed.

**Not yet built** — a prototyping data layer (mock API or fixtures) so prototypes can render realistic data without a backend. This is the next meaningful unlock.

**Known gaps**, stated plainly because they're the useful thing to review:

- Accessibility is an intent, not a verified property. `@storybook/addon-a11y` is wired up and ARIA is written deliberately, but nothing here has had an expert audit.
- Forking `ui/` bought full token control at the cost of free upstream fixes. Accessibility patches and Radix bumps to a forked primitive now have to be hand-merged.
- There is no test suite. At this stage the review surface is Storybook plus a Vercel preview, which is a deliberate trade for prototyping speed — and a decision worth revisiting as the product firms up.
