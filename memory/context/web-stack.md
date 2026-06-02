# Web stack — context

**Path:** `/web/` (subfolder of the main repo)
**Built:** Apr 30, 2026
**Deployed:** May 8, 2026 — live at https://brightseed-storybook.vercel.app (see `memory/context/deployment.md`)
**Purpose:** Anna and Meng's AI-prompting target. Where they prompt against Quill components in Cowork to see "feels like" Forager screens before any production code lands.

## Stack
- Next.js 16 (App Router)
- Tailwind 4
- Geist via npm `geist` package (NOT `next/font/google` — Google Fonts blocked from sandbox)
- Tiempos display family — currently disabled in `app/layout.tsx`, awaiting WOFF2 files
- shadcn/ui components copied from `shadcn-ui/ui` GitHub (new-york-v4 registry, radix base) — imports rewritten from `@/registry/new-york-v4/...` to `@/components/ui/...`
- Storybook 10 with `@storybook/nextjs-vite`, `addon-docs`, `addon-a11y`
- Theme toggle in Storybook toolbar via `data-theme="dark"` on `<html>`
- `tokens/` and `bridge/` symlinked to canonical files at repo root — single source of truth, edits flow both ways

## Run
**Always from Becky's Mac, never trust Claude's Linux sandbox node_modules:**
```bash
cd web
npm install        # required after any dependency changes
npm run storybook  # localhost:6006
npm run dev        # localhost:3000 (Next.js)
```

## Constraints (established Apr 30, 2026)
- Claude's bash sandbox is Linux. Any `node_modules/` installed there has Linux-native binaries that fail on macOS (rolldown is a known offender).
- **Workflow rule:** Claude writes source files (cross-platform). Becky runs `npm install` on her Mac. Don't trust verification done in Claude's sandbox alone.
- Network egress is restricted by Cowork allowlist. github.com IS allowlisted (so cloning works). `ui.shadcn.com` may not be — copy components from a cloned shadcn-ui/ui repo instead of using `npx shadcn add`.
- `next/font/google` is blocked. Use `geist` npm package or `next/font/local` for licensed fonts.
- FUSE filesystem mount has occasional `EPERM` errors on `unlink` of build artifacts. Usually self-resolves; not a blocker.

## Key files
| Path | Purpose |
|---|---|
| `app/layout.tsx` | Root layout; Geist wired, Tiempos commented out (awaiting WOFF2 files) |
| `app/globals.css` | Tailwind v4 base + token imports + bridge + custom variants (`hovered`, `focused`, `pressed`, `disabled-state`, `loading-state`) |
| `components/ui/button.tsx` | Full Brightseed-spec port (the reference pattern for future ports) |
| `components/ui/badge.tsx` | Full Brightseed-spec port (May 8, 2026) — 12 variants × 3 kinds |
| `stories/Button.stories.tsx` | Quill matrix parity grid + spotlight stories |
| `stories/Badge.stories.tsx` | Quill matrix parity grid + spotlight stories |
| `stories/Typography.stories.tsx` | DisplayScale + DisplayVsBody (Tiempos) |

## Component porting playbook
See CLAUDE.md "Button — web/ React implementation (Apr 30, 2026)" for the full pattern. Summary:
1. Confirm semantic tokens with full state ladders exist in `tokens/semantics.css`
2. Reference them via Tailwind arbitrary values: `bg-[var(--color-...)]`, never via the bridge alias for state ladders
3. Use `hovered` / `focused` / `pressed` / `disabled-state` / `loading-state` custom variants from globals.css
4. Expose `data-slot` hooks for any state-dependent DOM levels (fade targets, animation containers)
5. Build a Quill-style matrix story in stories file (forces every state of every variant to be visible at once)

## shadcndesign Pro Pack registry + license key (verified May 22, 2026)
The web/ app was rebased onto the shadcndesign.com Pro Pack on May 8, 2026 (see CLAUDE.md "Pro Pack rebuild"). The authenticated registry is the install path now — this **supersedes** the older "copy components from a cloned `shadcn-ui/ui` repo" note in the Constraints section above (that workaround was for the public `ui.shadcn.com` registry; the `@shadcndesign` registry works via the CLI with the license key).

- **Registry wiring:** `web/components.json` → `registries["@shadcndesign"]`: URL `https://www.shadcndesign.com/api/registry/{name}`, header `X-License-Key: ${SHADCNDESIGN_LICENSE_KEY}`.
- **Key:** `web/.env.local` → `SHADCNDESIGN_LICENSE_KEY` (prefix `SD-2…`), gitignored. Treat like a password — never paste in chat, screenshots, or commits. Rotate via Polar customer portal / hi@shadcndesign.com.
- **Verified May 22, 2026:** key authenticates — registry returned **HTTP 200** for a Pro Block fetch. There is no separate "activation" step; the key just works as the request header. Config was already in place from the May 8 rebuild — May 22 was a confirmation, not a setup.
- **Install pattern (run on Becky's Mac):** `yes n | npx --yes shadcn@latest add @shadcndesign/<block> --yes`. The `yes n |` answers overwrite prompts `n`, protecting the customized Button/Badge. Inspect-first: `curl -sS -H "X-License-Key: ${SHADCNDESIGN_LICENSE_KEY}" "https://www.shadcndesign.com/api/registry/<block>" | jq .` (env var auto-loads when run from inside `web/`; otherwise `source .env.local` first).

## shadcndesign Claude skills — installed + tested, left as-is (May 22, 2026)
Installed `@shadcndesign/skills-claude` from the registry. The CLI resolved the registry's `~/.claude/skills/` target **relative to the project**, so the files landed at `web/.claude/skills/` (project-local) — NOT home `~/.claude/skills/`. They work as Brightseed project skills but aren't global across Becky's other projects.

Files:
- `generate-code/SKILL.md` — Figma frame → production React/TSX (Pro-Block-aware).
- `import-variables/SKILL.md` + `scripts/convert-colors.js` — Figma design variables → CSS custom properties.

Test results:
- **`convert-colors.js` math is accurate** — 13/13 graded cases pass. Verified by running the actual installed script against independently-known values: white/black/mid-gray anchors, canonical Ottosson sRGB→OKLCH for pure R/G/B, and textbook HSL. (Harness lived in the scratchpad, not committed — declined saving as a regression test.)
- **But they do NOT run plug-and-play in Cowork** (they're Claude Code–format skills):
  - They reference `mcp__figma__*` (4 tools) and `mcp__shadcn__*` (6 registry tools: `search_items_in_registries`, `get_add_command_for_items`, `get_audit_checklist`, …). Cowork exposes `mcp__Figma__*` (capital F) + a UUID Figma server + `figma-console`, and `mcp__Shadcn_UI__*` (a different, smaller toolset with NO registry-search tools). Tool IDs are case-sensitive and the shadcn toolset differs, so the named dependencies don't resolve here.
  - `import-variables` assumes a vanilla single-`globals.css` `:root`/`.dark` layout. Brightseed authors colors in **hex** across `tokens/*.css` (globals.css is just the bridge), so its format-detection + edit steps target the wrong file, and — because we author in hex — the (correct) color-conversion math is a **no-op passthrough** for Brightseed; it only earns its keep on oklch/hsl-authored projects.
- **Decision: leave as-is** — kept as reference, not adapted. To make them usable in Cowork later: (1) remap the `mcp__figma__*` / `mcp__shadcn__*` references to the connected MCP names, and (2) rework `import-variables` Steps 3 + 12 around the 3-layer `tokens/` architecture.
