/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#e5e5e5",
        input: "#e5e5e5",
        background: "#ffffff",
        foreground: "#0a0a0a",
        card: "#ffffff",
        "card-foreground": "#0a0a0a",
        muted: "#f5f5f5",
        "muted-foreground": "#737373",
        accent: "#f5f5f5",
        "accent-foreground": "#0a0a0a",
        primary: "#171717",
        "primary-foreground": "#fafafa",
        "badge-compound": "#f5f5f5",
        "filter-orange": "#f97316",
        "filter-orange-foreground": "#fff7ed",
        sidebar: "#fafafa",
        // Decorative evidence sparkline bars (CompoundCard footer), from Figma.
        "chart-1": "#e88f3e",
        "chart-2": "#98698c",
        "chart-3": "#112458",
        "chart-4": "#648361",
      },
      borderRadius: {
        xl: "14px",
      },
      fontFamily: {
        sans: [
          "Basis Grotesque Pro",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        xs: "0px 1px 2px 0px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};
