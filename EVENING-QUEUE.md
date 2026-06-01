# Evening Queue

This is the to-do list for the evening agent. Fill it during the day. The agent
checks it once each night (~8pm). It only does real work on nights you mark READY,
so this doubles as your "do I have spare credits tonight?" switch.

---

## STATUS: DONE (ran 2026-05-23, manual)

<!--
  Set this to READY on days you want tonight's run to happen.
  Leave it as NOT READY (or DONE) and the agent will check, see it's not ready,
  and exit without doing anything.
  The agent flips it to DONE after a successful run so the same queue can't run twice.
-->

---

## Tonight's tasks

<!--
  Add one task per block. Be specific — the agent runs unattended with no chance
  to ask you a follow-up, so spell out what "done" looks like.
  Good task: "Draft a 1-page outline for the Brightseed case study intro — the
  problem, the audience (hiring managers + Brightseed eng), and the through-line.
  Save as a .md I can edit. Use Becky's_tone.md for voice."
  Thin task: "work on the case study" (too vague — the agent will guess).
-->

- [ ] **Brightseed workflow briefing from Kaelig's "AI agent teams" article** — *process / flow / tools → better quality, with an accessibility learning thread.*

  **Source:** Read `seed/kaelig-agent-teams-extract.md` (at the project root) as your PRIMARY source — it's a full pre-extraction so you don't have to re-fetch the original. You may consult the URL inside that file for extra verbatim quotes, but chunk-read it via a subagent; do NOT fetch the ~86k-char page directly.

  **Becky's framing (honor this):** Her #1 interest is how Kaelig's *process, flow, and tools* produce higher-quality outcomes — translate that into concrete moves for Brightseed. She cares about accessibility but is a self-described complete novice with no a11y judgment yet, and wants things built well. So the briefing must teach a11y in plain, non-intimidating terms and show where process/tooling can carry quality she can't yet judge herself.

  **Produce `workflow-briefing.md`** in today's evening-output folder, grounded in this project's CLAUDE.md, with these sections:
  1. One-page summary of the 8-agent Understand/Build/Verify method and its core principles — emphasize the *process mechanics* (artifact handoffs, push-back gates, iteration budgets, the GIGO quality score), not just the headline outcome.
  2. Mapping table: each transferable *process/tool* idea → where it lands or conflicts in Becky's stack (Figma v3, figma-console MCP, 3-layer tokens, sandbox/Pro Pack, Cowork→preview→merge, Chuan-as-reviewer, the `// BRIGHTSEED-TBD:` stop-rule, the CLAUDE.md→glossary→memory tiers).
  3. **Accessibility, for a novice:** in plain language, what Kaelig's 8-layer a11y auditor actually checks, why he puts it in Build not Verify, and his Tier-3 "permanently human" a11y items (screen-reader feel, hover/motion). Then a practical "how Becky gets well-built a11y *without* expert judgment yet": which checks can be fully automated/tooled (so she can trust them), which need a human gate, and a short starter list of what to learn to look for. Keep it concrete and encouraging — she's learning.
  4. "Already doing it" — where Becky's existing practice already matches his principles, citing specific CLAUDE.md decisions.
  5. The 3–5 highest-leverage changes for better Brightseed quality, each with its tradeoff and rough effort, ordered by leverage.
  6. Sharp open questions / provocations for a follow-up session with Becky — including whether the case study should foreground judgment-placement over speed, and how much a11y rigor is right for an alpha with <10 customers.

  **Do not** present anything as final or implement changes. This is raw material to seed a conversation. Flag any assumptions at the top.

---

## Guardrails (the agent will follow these)

- Save everything to `evening-output/<date>/` as reviewable drafts. Nothing is final.
- Do NOT push to any git repo, open PRs, send email, post to Slack/Linear/Notion,
  or take any irreversible or outbound action. Leave those for Becky to do after review.
- Do NOT edit the live Brightseed design-system files, tokens, sandbox, or Figma.
  If a task implies changing them, produce the change as a draft/diff for review instead.
- If a task is ambiguous, make one reasonable attempt and clearly flag the assumption
  at the top of the output, rather than stalling or doing nothing.
- For anything written in Becky's voice, reference `Becky's_tone.md`.
- Keep the run focused on what's queued. Don't invent extra work to "use up" time.

---

## Run log

<!-- The agent appends a one-line entry here after each run. Newest at top. -->

- 2026-05-23 (manual test run) — 1 task done → evening-output/2026-05-23/SUMMARY.md
