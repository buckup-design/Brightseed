# Workflow briefing, what Kaelig's "AI agent teams" could change for Brightseed

*Generated May 23, 2026 from the queued evening task. This is **legwork + provocations:** raw material to seed a conversation with Becky, not a set of decisions. Where I had to assume something, it's flagged inline as **[assumption]**.*

**Source:** Kaelig Deloumeau-Prigent, "Building design system components with AI agent teams" (`seed/kaelig-agent-teams-extract.md`).

**Becky's framing for this briefing:** primary interest is how his *process, flow, and tools* make higher-quality outcomes; secondary, she cares about accessibility but is a self-described novice with no a11y judgment yet and wants things built well. Both threads are addressed below.

---

## 1. The method in one page

Kaelig's claim is narrow and worth stating precisely: *single-prompt Figma-to-code is fine for prototypes, but production components have a quality bar prompting alone can't consistently reach.* His fix is not a better prompt, it's a **pipeline of 8 narrow agents**, each with its own small context window, each producing a specific document the next agent consumes. Three phases:

**Understand (no code is written here, he calls it "the phase that matters most").**
- *Design Analyst* reads Figma and writes down the full spec.
- *Library Researcher* audits what the dependencies already give you, and writes mandatory rules (CR-*) and advisory ones (AR-*).
- *Component Architect* designs the API and composition before a line of code exists, and this step is **gated by a human conversation**.

**Build.**
- *Code Writer* generates the component.
- *Accessibility Auditor* runs an 8-layer check, deliberately placed here, *inside Build*, so the fix loop is tight while the code is still soft.
- *Story Author* writes Storybook stories with interaction tests.

**Verify.**
- *Visual Reviewer* screenshot-compares Storybook against Figma across 9 dimensions, with a rule that it must never make a previously-passing dimension worse.
- *Quality Gate* runs compile / lint / format.

The mechanics that make it a *team* and not just a script:

- **Artifact handoffs, not chat.** Agents talk only through structured documents with required fields. Missing information is written down as `[PENDING]` or `[UNRESOLVED]`, *never silently dropped*. ("The absence of data is itself data.")
- **A push-back protocol.** Any agent can raise `[BLOCKING]` (stop, ask a human), `[CONCERN]` (proceed, but here's my reservation), or `[SUGGESTION]`. Kaelig calls this "the single most transferable idea in this piece... the difference between a pipeline and a team."
- **A GIGO quality score.** A deterministic number from 1.0 down (a Figma REST fallback costs −0.30, each unresolved token −0.02). Below 80% the pipeline **hard-stops** and makes you choose: fix the input, map it by hand, or explicitly accept degraded output. It refuses to confidently produce garbage.
- **Iteration budgets.** Every looping agent has a hard cap (Visual Reviewer 5, A11y 3, Quality Gate 1 retry) so nothing spins forever.
- **"Vibe RLHF."** When something comes out wrong, you don't re-prompt, you write a rule, and the rule lives in the system forever. He went from 27 fabricated tokens to zero after three rules, permanently. "Rules compound."

The deepest finding is a caution: agents can be *"confidently, systematically wrong in ways that pass their own validation."* His own worst bug was hand-writing 300 lines of keyboard navigation that a library already provided, because the conversation that would have caught it "had no structural place to happen." The whole architecture exists to give judgment a place to happen.

---

## 2. How each idea lands on your stack

| Kaelig's idea | Where it lands in Brightseed | Fit |
|---|---|---|
| **Understand phase before any code** (Library Researcher + Architect) | Your loop today is paste `BrightseedDS.md` + prompt → generate. You have no explicit "what does the Pro Pack already give us / what's the API" step, even though your sandbox's whole premise is *"Pro Blocks are pure composition layers; our Button/Badge are the paint surface."* | **Biggest gap. Highest leverage.** That premise currently lives in your head and in CLAUDE.md prose, not in a step the agent must perform. |
| **Push-back protocol** `[BLOCKING]`/`[CONCERN]`/`[SUGGESTION]` | You already have the seed of this: the `// BRIGHTSEED-TBD:` rule ("if no token exists, flag and stop, don't improvise"). That *is* a `[BLOCKING]` gate, you just have one level, not three. | **Partial, extend, don't invent.** |
| **GIGO quality score + hard-stop** | Directly aimed at your documented figma-console pain: the ~30s WebSocket timeout where "work completes server-side but the response never returns," leaving state ambiguous (CLAUDE.md rule #9). A score that refuses to proceed on a partial Figma read is the structural answer to that. | **Strong fit.** |
| **Token discipline: `var(--token)` only, no fallbacks, grep-gate the build** | You already mandate semantic-tokens-only and no hardcoded hex. You do **not** yet have an automated gate that *fails the build* when someone reaches past semantics or hardcodes a value. | **Partial, you have the rule, not the enforcement.** |
| **Three persistence layers** (`workarounds.md` → Memory → Skill files) | Maps almost exactly onto your `CLAUDE.md → glossary.md → memory/` tiers. | **Already doing it** (see §4). |
| **8-layer a11y auditor, placed in Build** | You have `addon-a11y` in Storybook and the `design:accessibility-review` skill installed, but a11y is currently a thing you *could* run, not a step that *must* pass before something is "done." | **Partial, the tool exists, the gate doesn't.** Detailed in §3. |
| **Visual Reviewer: screenshot Storybook vs. Figma** | Your verification today is "Claude writes source, Becky runs `npm run storybook` and eyeballs it on her Mac." That's a human visual review with no automated screenshot-diff against the Figma source of truth. | **Gap, but maybe an intentional one at alpha** (see §6). |
| **Iteration budgets / fresh-context validation** | Not formalized. You do chunk Figma ops into ≤12 (rule #9), a cousin of an iteration budget, but for timeout reasons, not validation discipline. | **Minor / optional.** |
| **"Vibe RLHF", encode failures as compounding rules** | This *is* what your "Locked-in decisions" log is: the ghost-label width hack, chunk-into-12, the lost-color-binding swap edge case, each one a rule born from a specific failure. | **Already doing it, intuitively** (see §4). |

---

## 3. Accessibility, explained for where you are

You said you're a novice here and don't trust your own judgment yet. Good news: a large chunk of "built well" in a11y is exactly the kind of thing you can hand to tooling and *trust*, precisely because you're a novice. The trick is knowing which parts those are.

**What Kaelig's 8-layer auditor is really checking** (plain-language version of the things any good a11y check looks at):

1. **Is it the real element?** A button should be a `<button>`, a link a real `<a>`, not a `<div>` dressed up to look like one. Real elements come with keyboard and screen-reader behavior for free.
2. **Keyboard operability.** Can you reach and operate it with Tab / Enter / Space / Escape / arrow keys, with no mouse?
3. **Visible focus.** When you Tab to it, can you *see* where you are? (Your variant-aware focus-ring system is already doing this job, that's a11y work you've already done without calling it that.)
4. **Color contrast.** Text and UI need enough contrast (WCAG AA: 4.5:1 for body text, 3:1 for large text and UI). You've *already* done real a11y engineering here, the lime-300 retune (`#CAE279 → #CDE67B`) to get `forest-800` text to pass AA on the button was a textbook contrast fix.
5. **Screen-reader sense.** Does a screen reader announce the thing in a way that makes sense? Does a state change (loading, pressed, expanded) get announced? (Your Button sets `aria-busy` when loading, again, a11y you've already shipped.)
6. **ARIA, used sparingly.** The rule professionals live by: *no ARIA is better than bad ARIA.* Reach for a real element first.
7. **Touch targets** big enough to tap (~44px).
8. **Motion** respects "reduce motion" preferences.

**Why he puts the auditor in Build, not Verify:** so the audit→fix→audit loop happens while the code is still soft and cheap to change, instead of as a final gate where fixes are expensive. The lesson for you: a11y is cheapest when it's checked *as* you build a component, not bolted on before handoff.

**How you get well-built a11y without expert judgment yet:** the part that matters most for you:

- **Trust the machine for these (fully automatable, ~green-checkmark confidence):** color contrast, missing labels/alt text, invalid ARIA, role misuse, "is this a real button," basic tab-order presence. Your `addon-a11y` panel (axe-core under the hood) catches these. **Concrete starter rule: a component isn't "done" until its Storybook a11y panel is green.** You don't need judgment to enforce that, you need the habit.
- **These still need a human, and it won't be you alone at first (Kaelig's "Tier-3, permanently human" list):** whether the *screen-reader narration actually makes sense in sequence*, whether *keyboard focus lands somewhere sensible*, whether *hover and motion feel right*, whether a custom control's semantics match how it looks. These are judgment calls, but they're learnable, and they're a small list.
- **A short "learn to look for it" starter kit** (15 minutes each, no expertise required):
  1. **Unplug the mouse.** Tab through a component. If you get stuck or can't tell where you are, that's a finding, you don't need to know the fix to log it.
  2. **Turn on VoiceOver** (Cmd-F5 on Mac) and listen to one component. If what it says is confusing to *you*, it's confusing to everyone.
  3. **Read the addon-a11y panel** and just notice what it flags. Over a few weeks you'll start recognizing the repeat offenders.
  4. **Ask one question of every control: "is this a real button/link, or a div pretending?"** That single question prevents a surprising share of real-world a11y bugs.

The honest framing: automated tooling reliably catches maybe a third of a11y issues, but it catches them *completely and without judgment*, which is exactly what a novice needs. The rest is a human-judgment loop you grow into. Kaelig's structure is useful to you specifically because it names which third the machine owns.

---

## 4. Where you're already doing this

It's worth seeing how much of his thesis you've already converged on independently, this is reassuring, and it's also case-study gold.

- **"Vibe RLHF" = your "Locked-in decisions" log.** Every entry in CLAUDE.md is a failure encoded as a permanent rule: the ghost-label width-reservation (then its reversal), "chunk Figma ops into ≤12" after repeated timeouts, the `swapComponent` lost-color-binding edge case. You're already doing reward-signal-is-human-judgment, applied to context rather than weights.
- **His three persistence layers = your memory tiers.** `workarounds.md → Memory → Skill files` is structurally your `CLAUDE.md → glossary.md → memory/`. You even have the promotion instinct (tiered lookup: "this file → glossary → people/projects/context. If a term isn't there, ask").
- **His `[UNRESOLVED]`-never-omit rule = your `// BRIGHTSEED-TBD:` stop-rule.** Same principle: surface the gap loudly, don't paper over it.
- **"Mirror canonical patterns, never invent" (your rule #10) is his Library-Researcher discipline** stated as a law. He builds an agent to enforce it; you've written it as a rule. (Open question: is a rule enough, or does it need to be a step?, see §5.)
- **Real a11y work already shipped:** AA-passing contrast retunes, variant-aware visible focus rings, `aria-busy` on loading. You undersell yourself as a "complete novice", you've been doing component-level a11y; you just haven't had the vocabulary or a checklist.

---

## 5. The highest-leverage changes to consider

Ordered by leverage. Each is a *candidate*, not a recommendation, tradeoffs included for the conversation.

1. **Add an explicit "Understand" step before UI generation.** Before generating a Forager component, have the agent first produce a short spec doc: what the Pro Pack / shadcn primitive already provides, what the component's API should be, what's missing. *Tradeoff:* adds a few minutes up front; *payoff:* directly prevents the "reinvented what the library already gave us" failure, which is the exact bug Kaelig flags and the exact risk your composition-layer premise runs. **Lowest cost, highest payoff.** **[assumption: you'd want this lightweight, a paragraph, not an 8-agent pipeline, given alpha speed.]**
2. **Turn `// BRIGHTSEED-TBD:` into a 3-level push-back protocol.** Keep BLOCKING (stop), add CONCERN (proceed with logged reservation) and SUGGESTION. *Payoff:* this is what makes Chuan's review *structured*, he responds to flagged gates instead of reading raw code, which is exactly the role you've scoped for him ("visual + intent confirmation, not code-quality judgment"). *Tradeoff:* a small amount of convention to maintain.
3. **Make "addon-a11y panel is green" a definition-of-done.** *Payoff:* buys you the automatable third of a11y for free and builds your eye over time. *Tradeoff:* nearly none, the tool is already installed.
4. **A lightweight input-quality gate for Figma reads.** Not his full GIGO score, just: if the figma-console read is partial or timed out, *stop and say so* rather than generating from incomplete data. *Payoff:* turns your documented timeout-ambiguity pain into an explicit halt. *Tradeoff:* needs a way to detect "partial."
5. **A grep-gate in CI/sandbox for token discipline.** Fail the build if component code hardcodes hex/px or references past the semantic layer. *Payoff:* enforces the rule you already hold by hand. *Tradeoff:* you're at alpha; a build gate may be premature (see §6), this might be a "bring back at PMF" item.

---

## 6. Provocations for our session

These are the questions I'd want to push you on, live:

- **Is the case study's headline wrong?** It currently leads with *speed* ("non-engineers prototype at the speed of typing without breaking production"). Kaelig's whole piece argues speed is becoming table stakes and the real craft is *where you deliberately placed the human gates*. Your strongest hiring narrative might be **"here is the judgment-placement I designed into an AI design-system workflow":** not velocity. Do you buy that? It would reframe the whole artifact.
- **How much of this is right for an alpha with <10 customers?** Your own rule #6 says speed > code quality at this stage, and to bring heavy review tooling back at PMF. Several of Kaelig's mechanisms (full GIGO scoring, CI grep-gates, screenshot-diff) are *production* discipline. Which of these earn their place *now*, and which are "write the rule down, build the gate later"?
- **Where exactly does Chuan fit?** Kaelig's Tier-3 "permanently human" list (screen-reader feel, motion, pixel-checking custom indicators) is a candidate job description for Chuan's review gate. Does framing his role as "owns the Tier-3 judgment calls; tooling owns the rest" match what you want from him?
- **A11y: how far, how fast?** Given you're learning, is the right move (a) green-panel-as-done now and grow your eye over months, or (b) something more ambitious? What's the a11y bar Brightseed's *enterprise funding* audience will expect to see?
- **What's the smallest version of "Understand" worth doing?** A full 8-agent pipeline is overkill for you. Is the right unit a one-paragraph "what does the primitive already give us" check, a reusable skill, or something else?

---

*Next step (recommended): a working session where we pick which of §5's candidates are worth it for Brightseed's stage, and settle the case-study reframe in §6. That's the judgment part, the part this doc deliberately did not decide for you.*
