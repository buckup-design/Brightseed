import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";
import React from "react";

/*
 * Geist + Geist Mono load via .storybook/preview-head.html (Google Fonts CDN),
 * NOT the `geist` npm package. The package does `import localFont from
 * "next/font/local"`, which @storybook/nextjs-vite's Vite build can't resolve in
 * the preview config ("default" is not exported) — it fails the Storybook build.
 * A <link> in preview-head can't break the build. tokens/typography.css already
 * sets --font-sans: "Geist" and --font-mono: "Geist Mono", so loading those
 * families by name in the iframe head is all that's needed for stories + docs to
 * render in Geist. (Geist is only wired via next/font in app/layout.tsx, which
 * Storybook's iframe never uses, so without this it falls back to system-ui.)
 */

const preview: Preview = {
  parameters: {
    // Sidebar order. Without this, Storybook falls back to default ordering and
    // the sections land alphabetically. Pinning the order puts the intro doc
    // first, Foundations next, then Components/Blocks/Auth.
    // Sections not listed here fall to the bottom in default order.
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Getting Started",
          "Design.mdx",
          "Prototyping Workflow",
          "Foundations",
          "Components",
          "Blocks",
          "Auth",
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
  },
  globalTypes: {
    theme: {
      description: "Brightseed light/dark theme",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme ?? "light";
      // Apply data-theme to the root for the dark theme override in semantics.css
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", theme);
      }
      // Paint the preview surface with the active theme. Without this, the
      // Canvas/Docs preview stays white while dark-theme text flips to a light
      // value — so transparent/outline components are invisible until a hover
      // state adds a fill. The wrapper carries its own data-theme so the subtree
      // resolves the right tokens even in Docs inline previews.
      return React.createElement(
        "div",
        {
          "data-theme": theme,
          style: {
            background: "var(--color-surface-default)",
            color: "var(--color-text-default)",
            padding: "2rem",
            borderRadius: "8px",
          },
        },
        React.createElement(Story)
      );
    },
  ],
};

export default preview;
