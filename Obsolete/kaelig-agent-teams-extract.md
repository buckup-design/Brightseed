# Seed: Kaelig, "Building design system components with AI agent teams"

**Source:** https://www.kaelig.fr/design-system-components-with-ai-agent-teams/
**Author:** Kaelig Deloumeau-Prigent
**Purpose of this file:** Pre-extracted source material for the evening "workflow-briefing"
task. Use this as the PRIMARY source so the run doesn't depend on re-fetching the original
(it's an ~86k-character page that errors on a direct fetch). If you need additional verbatim
quotes, chunk-read the URL via a subagent, do NOT fetch it directly into context.

---

## Core thesis

Single-prompt Figma-to-code works for prototypes, but production design-system components
have a quality bar (real tokens, ARIA, theming, screen-reader experience) that prompting alone
can't consistently hit. The author's answer is an 8-agent pipeline that turns a Figma file into
a production React component in ~1 hour, but the real breakthrough wasn't full autonomy. It was
discovering a quality ceiling and redesigning the system as a *thought partner*: "create
structured space for human judgment at the moments where judgment matters most."

## The method, 8 agents across 3 phases

No agent sees the full picture; each gets a focused context window and produces a specific
artifact that downstream agents consume.

**Understand** (no code written, "the phase that matters most"):
- *Design Analyst*, extracts the full spec from Figma → `brief.md` + `figma-raw.json`.
- *Library Researcher*, audits every dependency's full API surface → `component-rules.md`
  (CR-* mandatory, AR-* advisory).
- *Component Architect*, designs the API/composition → `architecture.md` with named handoff
  notes; gated by a conversational human review.

**Build:**
- *Code Writer*, generates TS + CSS modules + barrel exports.
- *Accessibility Auditor*, runs an 8-layer a11y stack. Deliberately placed in Build, not Verify,
  so the audit→fix→re-audit loop is as tight as possible while the component is still malleable.
- *Story Author*, writes CSF-Factories Storybook stories with play-function interaction tests.

**Verify:**
- *Visual Reviewer*, screenshot-compares Storybook vs. Figma across 9 dimensions (GAN-like).
  Has a no-regression rule (revert any fix that downgrades a previously-PASS dimension) and a
  2%-improvement diminishing-returns stop.
- *Quality Gate*, runs TS compile / lint / format.

**End-to-end loop ("vibe RLHF"):** edit a skill → run the pipeline on a Figma component → test in
Storybook → run the pipeline's own multi-agent review pass → observe failures → encode each
failure as a rule → re-run. Feedback is applied not to model weights but to the rules/context
wrapping the model; the reward signal is human judgment; ~45-min loop.

## Concrete mechanics & tooling

- **Figma access:** Figma Console MCP (TJ Pitre's; WebSocket plugin in the desktop app, expands
  instance children, resolves variable bindings to token names, reaches padding/gaps) is primary;
  Figma REST API is the degraded fallback. Nathan Curtis's *Specs* plugin (YAML `$token` refs
  inside frames, e.g. `$space.component.stack.padding.xx-small`) is the preferred token source;
  bound variables are the fallback.
- **Three structural patterns:** (a) artifact-based handoffs, agents communicate via structured
  docs with mandatory fields, never chat messages, because they run in separate context windows;
  missing data is flagged `[PENDING]`/`[UNRESOLVED]`, never silently omitted; (b) fresh-context
  validation, validators get isolated context; (c) iteration budgets, every looping agent has a
  max (Visual Reviewer 5, A11y Auditor 3, Quality Gate 1 retry).
- **Push-back protocol:** `[BLOCKING]` (stop, ask human), `[CONCERN]` (proceed with rationale),
  `[SUGGESTION]`.
- **GIGO quality score:** deterministic 0.0–1.0, starts at 1.0, only decreases (REST fallback
  −0.30, each unresolved token −0.02). Below 80% the pipeline *hard-stops* and offers three
  choices: fix the input, supply a mapping manually, or explicitly accept degraded output.
- **Token discipline:** no hardcoded values; `var(--token)` only, no fallbacks (`var(--x, #333)`
  masks a missing token); JS reads CSS vars at runtime via `getComputedStyle`. The Quality Gate
  greps for a bad token prefix and fails the build if found.
- **Three persistence layers:** `workarounds.md` (raw log) → Memory (promoted, loads everywhere)
  → Skill files (hardened, agent-specific pre-flight checks). Rules migrate upward over time.
- **Other tools:** Claude Code Agent Teams (lateral comms; the orchestrator is the single writer
  to `pipeline-state.yaml`), Context7 MCP (library docs), Storybook MCP, Kieran Klaassen's
  Compound Engineering workflow, MCP canary detection.

## Claims vs. a traditional / single-agent workflow

- **Benefits:** 2 days / 40 commits manual → ~1–3 hrs, zero human-written component lines; 27/27
  fabricated tokens in v0.2 → zero from v0.3 on (after 3 rules), permanently. "Rules compound."
  Human gates made the pipeline *faster*, not slower (decide once, upfront, cheaply).
- **The vibe-coding failure mode:** agent + human share the same blind spots, the author
  hand-rolled ~300 lines of keyboard navigation that `@floating-ui/react` already provided; the
  "missing conversation" had no structural place to happen.
- **Three-tier failure framework:** 18 Tier-1 rules / 9 Tier-2 tooling / 6 Tier-3 human; the
  author believes the ~½ / ¼ / ⅕ ratio generalizes.
- **Failure modes:** agents are "confidently, systematically wrong in ways that pass their own
  validation" (tests check behavior, not appearance, so 27 fabricated tokens shipped "passing");
  cross-agent drift (research happened but knowledge didn't flow, fixed architecturally, not
  with prompts); the quality ceiling (correct ≠ excellent, the pipeline could follow rules but
  not *question* them). Caveat: it only works because a human is in the loop; cites a Stanford
  sycophancy study as the deeper risk.
- **Tier-3 (permanently human):** screen-reader testing, hover/mouse-path feel, motion specs
  (live outside Figma), detached frames, selection-control × cardinality, pixel verification of
  custom indicators.

## Key verbatim quotes

- "I built a complex design system React component from a Figma file without manually writing a
  single line of code."
- "Single-prompt figma-to-code works fine for prototypes, but production components have a quality
  bar that prompting alone can't consistently reach."
- "The breakthrough was redesigning the system to be a thought partner – not replacing the human,
  but creating structured space for human judgment where it matters most."
- "Agent systems can be confidently, systematically wrong in ways that pass their own validation."
- "The research happened. The knowledge just didn't flow."
- "The absence of data is itself data."
- "The push-back protocol is the single most transferable idea in this piece... it's the
  difference between a pipeline and a team."
- "Garbage in, garbage out – but instead of silently producing garbage, the pipeline tells you the
  garbage is coming and lets you decide."
- "Share less context than you think you need."
- "The most honest thing an agent system can do is tell you where it stops."

## Other notable points

- The Accessibility Auditor lives in Build (not Verify) on purpose, shortest possible
  audit→fix→re-audit loop while the component is still malleable.
- The Architect writes a "Deferred Features – Forward Architecture" sketch for anything it punts,
  so first-pass scoping doesn't force a later rewrite.
- The pipeline can't be tested inside itself, you need a real component in a real repo (the test
  was Intuit's Menu, chosen because it's the hardest IDS component).
