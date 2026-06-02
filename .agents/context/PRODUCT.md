# PRODUCT.md, Hummingbird (Brightseed)

> Distilled from CLAUDE.md and BrightseedDS.md for the impeccable skill loader. CLAUDE.md and BrightseedDS.md remain the canonical sources; if anything here drifts from them, those files win.

## register

product

(Hummingbird is an internal-facing biotech application, design SERVES the product, not the marketing surface. Brightseed.com is the brand register; that's not in scope here.)

## Product purpose

Hummingbird is Brightseed's biotech compound-screening application, powered by the Forager AI discovery model. Scientists feed it a research goal ("help individuals on GLP-1 weight-loss drugs retain lean muscle mass," for example), and Forager surfaces strategies, compounds, and plant sources from Brightseed's proprietary dataset, with evidence, feasibility, and IP/legal signals attached. The interaction model is conversational: an AI chat thread on the left runs alongside structured result surfaces on the right, so a user can pivot the search ("now also show me secondary compounds that strengthen this effect") without leaving the page.

The product is alpha. Three customer POCs today, fewer than ten by end of 2026. The bar is "real enough to win an enterprise raise"; it is not yet "scaled to general availability."

## Users

The application's primary users are biotech research scientists and bioactive-product strategists at partner enterprises. They are not casual users. They come to Hummingbird with a real research goal, dense domain vocabulary (GRAS, IP whitespace, gene targets, freedom-to-operate), and a high tolerance for information density. They will not be impressed by friendliness; they will be impressed by signal-to-noise.

Internally, three people drive the product:
- **Anna:** consultant, acting Head of Design. Mocks fast and loose; pragmatic.
- **Meng:** VP Platform Development. Background in philosophy, CS, ML. Talk to him as a technical peer.
- **Chuan:** scientist on Meng's team. Brilliant but not a web engineer. Future "PR reviewer" on the AI prompting workflow, but only if review tooling does the heavy lifting.

The current redesign exercise also has a hiring-manager audience: Becky is using the work as a case study of her evolved process with AI tooling.

## Brand

Brightseed: a biotech company decoding plant compounds at scale. The brand carries hummingbird-and-line-art motifs, a "Deep Forest" + "Lime" color anchor, and a calm-but-cutting-edge posture. Confident, scientifically credible, never gimmicky. Hummingbird is the application surface where that brand has to translate to dense data UI without losing its identity.

## Tone

Calm, precise, scientifically literate. Not chatty. Not anxious. Hummingbird copy treats users as peers, short, declarative, no condescending microcopy. Errors and empty states should feel like a colleague telling you what they noticed, not a cheerful onboarding bot.

## Strategic principles (locked, see CLAUDE.md for full set)

- Tokens over values. Component code references the semantic layer; never hardcode hex/px/font.
- Brand-poetic names live only in the brand reference file. Code uses functional names (`forest-700`, `lime-300`).
- Cards are the lazy answer for dense data. Don't reach for a card grid when a comparison matrix or table would do the job better.
- Hummingbird is data-dense. Patterns like "wizard" are wrong here; configuration panels with stateful nodes are right.
- Speed of prototyping > code cleanliness, because the platform is alpha. Hold the line on brand quality and token discipline only.
- The case study is the workflow. The design system is one ingredient; the artifact is the end-to-end Cowork → preview → merge pipeline that lets non-engineers prototype Hummingbird screens at the speed of typing.

## Anti-references

What Hummingbird should NOT look or feel like:
- Generic SaaS dashboard cream, soft cards, big number hero, "Welcome back, [Name]!"
- Healthcare-app teal-and-white, sterile, cliché.
- Crypto/AI neon-on-black, overstimulated, untrustworthy.
- Notion / Linear minimalism by reflex, there's a reason to be denser and more domain-specific than that.
- Fast-and-loose mock energy, Anna's mocks are correct in concept but low-fidelity in chrome and rhythm; the redesign needs to feel rendered, not sketched.

Specifically banned in implementation: side-stripe borders (more than 1px on a card edge as a colored accent), gradient text, decorative glassmorphism, the hero-metric template, and identical-card grids that repeat icon + heading + paragraph endlessly.

## Constraints

- Tech: Next.js 16 + Tailwind 4 + shadcn/ui (new-york-v4 registry) + Storybook 10. Everything in `/web/`.
- Tokens: three-layer system (primitives → intents → semantics). CSS custom properties, never hex.
- Theme: light is default; dark via `data-theme="dark"` on an ancestor. Components are theme-agnostic.
- Verification flow: Claude writes source files. Becky runs `npm install` and `npm run storybook` on her Mac because Linux node_modules from Claude's bash sandbox don't run on macOS. Don't trust verification done in Claude's sandbox alone.
- Network: github.com is allowlisted from Claude's bash sandbox; ui.shadcn.com is unreliable. For new shadcn components, clone the repo and copy files, don't `npx shadcn add`.
- Fonts: use the `geist` npm package, never `next/font/google` (Google Fonts blocked from sandbox).

## Success for THIS engagement (the redesign exercise)

Two bars:
1. Internal: Anna, Meng, Chuan can look at a web/ Storybook story or a `/app/...` route and say "yes, that's what Hummingbird should feel like", and use it as a target Cowork can prompt against.
2. External: A hiring manager looking at the case study sees the workflow, not just the pixels, they understand how Becky used AI tooling to design a system, port it to React, and produce a credible enterprise-grade application surface.

Both bars are about credibility, not novelty. The redesign should not surprise anyone with a wild new visual language; it should restructure Anna's mocks into something that looks rendered, on-brand, and inhabited.
