# Collaboration Workflow, Becky + Anna

*How design exploration and the design system stay in sync without either one blocking the other.*

The goal: exploration, prototyping, and review of Hummingbird screens can happen without breaking production or eroding token discipline. The system carries the polish; the workflow keeps the two roles from stepping on each other.

## Roles

| | Owns | Doesn't own |
|---|---|---|
| **Anna** | Visual direction, loose exploration (her Figma file), prototyping "feels-like" screens in Cowork, reviewing built screens for intent + look | The token system, what becomes canonical, the main branch |
| **Becky** | The design system, tokens, components, brand discipline. The gate on what gets systematized. Reconciling Anna's explorations into the canonical system | Slowing Anna's exploration down to system speed |
| **Claude** | Plumbing, GitHub, branches, scaffolding, token work, accuracy passes, the prototyping loop's mechanics | Brand/visual judgment calls (those are yours) |

The principle underneath: **exploration diverges, the system converges.** Exploration is deliberately unconstrained; the design-system owner decides what is load-bearing enough to enter the system. Exploration is not expected to happen inside components - the system exists precisely so it does not have to.

## The change lifecycle

```
explore → prototype → preview → review → systematize → merge → live
```

1. **Explore:** Anna mocks loosely in her Figma file, or just describes the intent.
2. **Prototype:** prompt in Cowork against `web/`, referencing the token reference. Produces a real, previewable screen built on system components.
3. **Preview:** Storybook locally (`npm run storybook`) or a Vercel preview deploy off a branch.
4. **Review:** you + Anna react on the preview. Lightweight: visual + intent confirmation, not code review. (Heavy review tooling is premature at alpha, hold that line.)
5. **Systematize:** *your* call: does this become a reusable component/token, or stay a one-off prototype? This is the brand-quality gate.
6. **Merge:** to `main`, which auto-deploys to the live Storybook.

## Three decisions you still need to make

These aren't rhetorical, they each change how tomorrow's setup should work, and only you can call them.

### 1. What is Anna's new Figma file *relative to* the canonical v3 file?

You now have two Figma files: the canonical `shadcn Brightseed v3` (the built system) and Anna's new file (her loose exploration, which I don't have access to yet). If both are treated as "real," you'll get drift, "Anna's green" vs. the system lime, divergent type, etc.

**My recommendation:** Anna's file is explicitly a *sandbox*, not a source of truth. Nothing in it is canonical until it's reconciled into v3 + the token system. Name it that way out loud so neither of you mistakes an exploration for a decision. *Your call, but decide it before tomorrow, because it determines how you frame the Figma share.*

> **[BLOCKING for the Figma part of the workflow]** I can't see Anna's new file yet. If you want me to help reconcile her explorations into the system, I'll need access (Figma connector or the file link). Until then, the Figma co-design surface is something you'll drive manually.

### 2. How do you keep Anna's prototypes from shipping to the live Storybook by accident?

`web/` has been sole-contributor and everything on `main` ships. The case-study promise is "prototype at the speed of typing *without breaking production*." That promise needs an actual guardrail: Anna works on branches with preview deploys; `main` is protected; merges are deliberate.

**My recommendation:** I set up branch protection on `main` + Vercel preview deploys for branches. Then Anna can prototype freely on a branch, see a live preview URL, and nothing reaches production until you merge. This is the single most important piece of "able to contribute safely." *If you agree, I'll do it as part of onboarding, it's plumbing, not a judgment call.*

### 3. Where does feedback live?

Across Cowork chat, Figma comments, Vercel preview comments, and verbal, feedback will scatter fast. Pick one home for "decisions and open threads" so nothing gets lost between surfaces.

**My recommendation:** keep it lightweight and in one place you both already look, a running notes doc or the Vercel preview toolbar threads. Don't stand up a tracker for two people at alpha. *Your call on which.*

## What "good" looks like after onboarding

Anna can: open `web/` in Cowork, prompt a screen with the token reference, see it on a preview URL, and react to it, all without touching `main` or needing you to unblock her. You stay the convergence point: you decide what graduates from prototype to system.
