# web/ — the Next.js + Storybook app

Canonical rules live in the repo-root `CLAUDE.md` and `DESIGN.md`. This file is
only what you need *before* running or editing anything in here.

## This is NOT the Next.js you know

Next 16 has breaking changes; APIs, conventions and file structure may all differ
from your training data. Read the relevant guide in `node_modules/next/dist/docs/`
before writing code, and heed deprecation notices. The same caution applies to
Storybook 10 and Tailwind 4 — check the installed `.d.ts`, don't trust recall.

## Running it

```bash
npm install
npm run storybook   # port 6006 — the default surface, and the system of record
npm run dev         # port 3000
```

**`dev` and `build` pass `--webpack` deliberately.** Turbopack refuses to resolve
imports whose realpath escapes the project root, and `web/tokens` + `web/bridge`
are symlinks into the repo root that `app/globals.css` imports — so Turbopack 500s
every route. Do not "fix" it with `turbopack: { root: "../" }`: that works, but
widens the file watcher to the whole parent tree and OOMs the machine. See
`next.config.ts`.

## Two traps that look like component bugs

- **Restart Storybook after adding a story file or any new directory.** Tailwind
  won't generate arbitrary values (`h-[320px]`, `bg-[var(--c-*)]`) from files
  created after the server started, so layouts silently collapse. The tell is
  tokens resolving fine while the classes are missing.
  - Under `next dev` a restart may not be enough: brand-new arbitrary classes
    added to an *already-tracked* file can stay absent from the compiled CSS
    across a full process restart (grep the served CSS for the literal class
    string to confirm). Then `rm -rf .next` — the whole directory, no need to be
    surgical about `.next/cache` — and restart again.
- **Geist comes from the `geist` npm package,** not `next/font/google`, which is
  blocked in-sandbox.
