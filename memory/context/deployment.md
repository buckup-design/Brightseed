# Deployment, context

**Set up:** May 8, 2026
**Stable URL:** https://brightseed-storybook.vercel.app
**Pipeline:** GitHub repo → Vercel auto-deploy on push

## What's live

The `web/` Storybook builds and ships to Vercel on every push to `main`. Anyone with the URL can view it, no GitHub access required. This is the "shared library" Anna and Chuan can click into without setup.

| Concern | Where it lives |
|---|---|
| Source of truth (code) | `github.com/buckup-design/Brightseed` (private repo) |
| Built site (Storybook) | `brightseed-storybook.vercel.app` (public) |
| Vercel project | `brightseed-storybook` in team `beckybuck-4615s-projects` (Hobby plan) |
| Build trigger | Push to GitHub `main` (auto) |
| Build time | ~45s |

## Vercel project config

- **Root Directory:** `web`
- **Application Preset:** Other (NOT Next.js, we're shipping the Storybook static build, not the Next.js app)
- **Build Command:** `npm run build-storybook`
- **Output Directory:** `storybook-static`
- **Install Command:** default (`npm install`)
- **Region:** `iad1`

## Auto-preview URLs

Every non-main branch automatically gets its own deployment URL:
`brightseed-storybook-git-{branch-slug}-beckybuck-4615s-projects.vercel.app`

When a PR is opened, Vercel posts the preview URL as a PR comment. This is the substrate for the eventual "edit and contribute" loop with Anna and Chuan, push a branch, get a clickable preview.

## What was scoped INTO the first push

Pushed: `web/`, `tokens/`, `bridge/`, `components/`, `README.md`, `CLAUDE.md`, `BrightseedDS.md`, `brightseed-shadcn-mapping.md`, updated `.gitignore`.

## What was held back (added to .gitignore)

| Folder | Why held |
|---|---|
| `brand/` | 178M of brand assets, needs curation before public-ish exposure |
| `memory/` | Personal notes on Anna/Meng/Chuan/Becky, not appropriate for shared repo |
| `vector-pipeline/` | 27M, purpose unclear, curate first |
| `OUTPUTS/` | Mix of canonical output (CompoundScreeningTable.tsx) and one-off artifacts, needs sorting |
| `DOCS/` | Contains third-party content (TJ Pitre webinar transcript), copyright caution |
| `anna's mocks 4-29-26/` | 2.2M of reference PNGs, fine to add later when needed |
| `Hummingbird reference ui.pdf` | Single reference PDF (gitignored). Renamed from `Forager refernce ui.pdf` June 2026. |

Each is a "decide and add later" item, not a permanent exclusion.

## Open follow-ups (from May 8)

1. **Tiempos Headline WOFF2 files:** drop into `web/public/fonts/tiempos/`, uncomment `localFont` in `web/app/layout.tsx`. Until then, display headings use Tiempos Text fallback.
2. **Add Anna and Chuan as GitHub collaborators:** required for them to *edit*. Not required for them to *view* Storybook.
3. **Design the contribution loop:** Becky said hold for now (next 4+ weeks she's the only contributor). Worth revisiting before week 4.
4. **Decide what's case-study-public.** Repo is private today. If hiring managers need to see it, either flip to public (after a curation pass) or share specific artifacts directly.

## One-time setup Becky completed (May 8, 2026)

Captured here so future Claude sessions know these are done and not to re-prompt:
- Installed Homebrew (`/opt/homebrew`)
- Installed GitHub CLI (`brew install gh`)
- Authenticated `gh` via web browser flow (HTTPS protocol)
- Authorized Vercel's GitHub App on the `Brightseed` repo only (not "all repos")
- Created Vercel project `brightseed-storybook` and connected it to GitHub

`git push` from her Mac now uses gh's stored credentials, no password prompts.

## Constraints worth knowing

- **First push had to come from Becky's Mac, not Claude's Linux sandbox.** The FUSE mount Claude uses can't clear `.git/index.lock` cleanly. Pattern: Claude stages files via Edit/Write, Becky runs `git commit && git push` on her Mac.
- **Vercel Hobby plan = 1 project remaining slot was used.** Future deploys (e.g. a separate Hummingbird production project) may need a Pro upgrade.
- **GitHub repo visibility = private.** Vercel still deploys from it (it has read access via the GitHub App), but the deployed Storybook site itself is public, anyone with the URL can view.
- **Vercel's Application Preset must be "Other" for Storybook builds.** Letting it auto-detect Next.js (because `web/` has next.config.ts) would deploy the Next.js app, not Storybook.
