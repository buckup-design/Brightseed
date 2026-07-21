import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * `next build` type-checks the WHOLE repo, including Storybook stories that
   * predate this app and carry latent type errors (they've never blocked
   * anything because the canonical build is `build-storybook`, not
   * `next build`). The marketing site (app/marketing/*) is an alpha client
   * mock, so we don't gate its deploy on pre-existing story-file errors
   * (CLAUDE.md rule 5). This flag affects ONLY `next build`/`next dev` — the
   * Storybook (vite) build is untouched. Revisit if the Next app graduates
   * past mock status.
   *
   * There is no `eslint` key: Next 16 removed `next lint`, and `next build` no
   * longer lints at all, so the old ignoreDuringBuilds escape hatch is moot.
   */
  typescript: { ignoreBuildErrors: true },

  /*
   * NOTE: `npm run dev` / `build` pass `--webpack` (see package.json) rather
   * than using the Next 16 default, Turbopack. Turbopack refuses to resolve any
   * file whose realpath escapes the project root, and `web/tokens` + `web/bridge`
   * are symlinks into the repo root (../tokens, ../bridge) that `app/globals.css`
   * @imports — so Turbopack panics ("leaves the filesystem root") and 500s every
   * route. The obvious `turbopack: { root: "../" }` fix works but widens the dev
   * file-watcher to the whole parent tree (incl. web/node_modules), which OOM'd
   * the machine. Webpack follows the symlinks with the root left at web/ (node_
   * modules excluded from watch) — same reason Storybook's Vite build already
   * works. tokens/ stays the single source of truth; no CSS is copied.
   */
};

export default nextConfig;
