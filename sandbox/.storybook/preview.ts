import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";

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
      // Apply data-theme to the root for the dark theme override in semantics.css
      if (typeof document !== "undefined") {
        const theme = context.globals.theme ?? "light";
        document.documentElement.setAttribute("data-theme", theme);
      }
      return Story();
    },
  ],
};

export default preview;
