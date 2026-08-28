import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// `npm run build:standalone` (mode "standalone") produces a single
// self-contained dist-standalone/index.html — JS, CSS, and every imported
// asset (logo/icons) inlined as data URIs, no separate files, no dev server.
// Just this app's presentation layer, meant to be emailed/opened directly
// (double-click, or drop on a static host) for demoing outside this repo.
// The normal `npm run dev` / `npm run build` paths are untouched.
export default defineConfig(({ mode }) => {
  const standalone = mode === "standalone";
  return {
    base: standalone ? "./" : "/",
    plugins: [react(), ...(standalone ? [viteSingleFile()] : [])],
    build: standalone
      ? { outDir: "dist-standalone", assetsInlineLimit: Number.POSITIVE_INFINITY, cssCodeSplit: false }
      : undefined,
    server: {
      port: process.env.PORT ? Number(process.env.PORT) : 5181,
    },
  };
});
