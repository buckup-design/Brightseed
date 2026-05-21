import type { Preview } from "@storybook/nextjs-vite";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "../app/globals.css";

/*
 * Load Geist into the Storybook preview iframe.
 *
 * Geist is only applied in the Next.js layout (app/layout.tsx), which Storybook
 * never renders — so without this, every story and docs page falls back to
 * system-ui instead of Geist. (The bridge's --font-sans lives in Tailwind's
 * `@theme inline` block, which isn't emitted to :root, so the only --font-sans
 * that reaches the page is tokens/typography.css's literal "Geist" — a family
 * name nothing is registered under.)
 *
 * Importing the geist next/font wrappers here generates the @font-face. Applying
 * the variable classes defines --font-geist-sans/-mono, and forcing
 * --font-sans/--font-mono on <html> to the real Geist family makes
 * var(--font-sans) (referenced by body + the shadcn bridge) resolve to Geist
 * everywhere. Runs once at preview load, so it covers stories and pure-MDX docs.
 */
if (typeof document !== "undefined") {
  const root = document.documentElement;
  root.classList.add(GeistSans.variable, GeistMono.variable);
  root.style.setProperty(
    "--font-sans",
    GeistSans.style?.fontFamily ?? "var(--font-geist-sans)"
  );
  root.style.setProperty(
    "--font-mono",
    GeistMono.style?.fontFamily ?? "var(--font-geist-mono)"
  );
}

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
