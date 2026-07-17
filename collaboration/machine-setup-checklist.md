# Machine Setup Checklist

*Internal. What to install on a fresh machine to work on Brightseed. Two profiles: Anna (collaborator) and Becky's second machine (full owner). Most of it overlaps; the differences are called out.*

## Quick mental model

There are really only three things to install: **Node.js**, **Git**, and the **Claude desktop app** (Cowork mode). Everything else is either an account/access grant (GitHub, Figma, Vercel) or a one-time `npm install` inside the repo. You do not install npx, Next.js, Tailwind, Storybook, or shadcn separately, those all come down with `npm install` or run on the fly via `npx`.

## Shared base (both machines)

### 1. Node.js

- Install Node 20 LTS or newer (the repo runs Next.js 16 / React 19 / Tailwind 4 / Storybook 10).
- Easiest on Mac: install via [nodejs.org](https://nodejs.org) or `brew install node`.
- This also gives you `npm` and `npx` automatically. Nothing else to install for those.

### 2. Git + a code editor

- Git (Macs usually have it; `git --version` to check, or `brew install git`).
- VS Code is the common pick, optional but recommended.

### 3. Clone the repo and install dependencies

```bash
git clone https://github.com/buckup-design/Brightseed
cd Brightseed/web
npm install
npm run storybook    # component library on http://localhost:6006
# or
npm run dev          # the Next.js app on http://localhost:3000
```

> **Mac vs Linux gotcha:** run `npm install` natively on each machine. Never copy a `node_modules/` folder between machines, the binaries are platform-specific and will break.

### 4. Claude desktop app (Cowork mode)

- Install the Claude desktop app with Cowork mode enabled.
- Connect the local `web/` folder (your own clone) as a working directory.

## Anna only (collaborator profile)

Anna prototypes on existing components and reviews screens. She does **not** need the Pro Pack license or Vercel/push credentials, those are owner-level.

- [ ] **GitHub:** Becky/Claude adds Anna as a collaborator on `buckup-design/Brightseed` (Anna just needs a GitHub account; access is granted, not installed).
- [ ] **Figma:** Becky shares the canonical `shadcn Brightseed v3` file (viewer or editor). Figma desktop app optional, the browser works fine.
- [ ] **Orientation, no download:** her entry point is the live Storybook at https://brightseed-storybook.vercel.app and the Getting Started page.
- [ ] Confirm she can run `cd web && npm install && npm run storybook` on her Mac.

She can skip `.env.local` / the Pro Pack key entirely unless she's fetching brand-new Pro Blocks (which is Becky's systematize step, not Anna's).

## Becky's second machine only (full owner profile)

Everything in the shared base, plus the secrets and credentials that let you push, deploy, and pull premium blocks.

- [ ] **GitHub push access:** set up an SSH key (or GitHub CLI / credential login) on the new machine so you can push, not just clone. `gh auth login` is the quickest path if you use the GitHub CLI.
- [ ] **`web/.env.local`:** create it with the shadcndesign Pro Pack key:
  ```
  SHADCNDESIGN_LICENSE_KEY=<your key>
  ```
  Copy the key from your existing machine's `web/.env.local`. It's gitignored on purpose, so it won't come down with the clone. Treat it like a password, don't paste it in chat or commits.
- [ ] **Vercel:** log into the Vercel account that hosts the Storybook deploy if you'll manage deploys from this machine.
- [ ] **Figma:** sign in with editor access to `shadcn Brightseed v3`. Desktop app recommended here since you do real Figma work.
- [ ] **Fonts:** nothing to do. Geist comes via npm; Tiempos WOFF2 files live in the repo at `web/public/fonts/tiempos/`.

## Sanity check (either machine)

After setup, you should be able to:

1. `cd web && npm install` with no errors.
2. `npm run storybook` and see the component library render at :6006.
3. Toggle dark mode in Storybook.
4. (Owner) push a test branch and see a Vercel preview URL appear.

If all four work, the machine is ready.
