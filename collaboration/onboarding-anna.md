# Onboarding Anna — Setup Checklist & Session Plan

*Internal. Your runbook for getting Anna on the files and a plan for the 3–4 hour session.*

GitHub mechanics are mine to handle — you don't touch Settings or copy URLs. Where I need something from you, it's flagged **[need from you]**.

## Pre-session setup (do before Anna arrives)

### A. Repo access — I execute this

- [ ] **[need from you]** Anna's GitHub username (or the email on her GitHub account).
- [ ] I add her as a collaborator on `github.com/buckup-design/Brightseed` via the GitHub connector.
- [ ] I enable **branch protection on `main`** (no direct pushes; merge via PR) so her prototypes can't ship by accident — *pending your nod on workflow decision #2.*
- [ ] I confirm **Vercel preview deploys** are on for branches, so every branch gets a live preview URL.

### B. Orientation — all in Storybook (nothing to download)

- [ ] Anna's entry point is the **Getting Started** page in Storybook (`web/stories/GettingStarted.mdx`), which points to Foundations (live token reference), Design.mdx (design language + composition + component usage), and Components.
- [ ] Hand her the live URL — that *is* the handoff: https://brightseed-storybook.vercel.app

### C. Figma

- [ ] **[need from you]** Share the canonical `shadcn Brightseed v3` file with Anna (viewer or editor — your call).
- [ ] Decide and state out loud what her new file *is* relative to v3 (workflow decision #1 — sandbox, not canonical).

### D. Cowork

- [ ] Anna installs the Cowork desktop app and connects the `web/` folder (her own local clone of the repo) as a working directory.
- [ ] Confirm she can run the basics on her Mac: `cd web && npm install && npm run storybook`.

## The first-change dry run (the moment she "leaves able to contribute")

The session succeeds when Anna does this herself, start to finish:

1. Create a branch (`anna/first-screen` or similar).
2. Open `web/` in Cowork; paste `02-token-reference.md` into the prompt.
3. Prompt a small, real change — e.g., a Card variant or a simple Forager screen.
4. Run `npm run storybook`, see it render, toggle dark mode.
5. Push the branch; open the Vercel preview URL.
6. You + Anna react on the preview.
7. You merge (or decide it stays a prototype).

If she can do that loop unaided, she's contributing. Everything else is depth.

## Suggested session shape (3–4 hours)

You chose to cover all three surfaces. Here's a sequence that front-loads the fragile part (the prototyping loop) so if time runs short, the most important thing already landed.

| Block | Time | Focus |
|---|---|---|
| **1. Orient** | 30 min | Walk the design system together — `00`→`01`, then Storybook live. Anchor on the one rule: reference `--ds-*`, don't invent. |
| **2. Prototyping loop** | 75 min | The hard, never-before-exercised part. Do the dry run above *together* once, then have Anna drive a second one solo. This is the make-or-break block — protect its time. |
| **3. Figma co-design** | 45 min | Share v3; agree what her sandbox file is vs. canonical. Do one small reconciliation so the handoff direction is concrete, not theoretical. |
| **4. Workflow + close** | 30 min | Agree the role split, where feedback lives, and what she'll try before next session. |
| **Buffer** | 30 min | Things will run long. The prototyping block is where to spend it. |

## Honest watch-outs

- **The prototyping loop has never been run by a second person.** Budget for friction in block 2 — npm installs, a stale preview, a token that doesn't resolve. That's why it goes first and gets the buffer.
- **Don't let block 3 (Figma) eat block 2.** Figma is the comfortable, familiar surface; the prototyping loop is the one that actually delivers the case study. If you're behind, shrink Figma, not prototyping.
- **You're the convergence gate.** It's fine — good, even — for Anna's first prototypes to be "wrong" by system standards. The workflow assumes she diverges and you converge. Resist fixing her process; just decide what graduates.
