import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brightseed Sandbox",
  description: "AI prototyping playground for the Brightseed design system",
};

/*
 * Tiempos — Brightseed display family for marketing H1 / H2 / H3.
 *
 * Currently disabled to avoid breaking the build before font files exist.
 * To enable:
 *   1. License Tiempos from Klim Type Foundry. We're standardizing on Tiempos
 *      Text (Medium / Semibold / Bold) until Tiempos Headline is acquired —
 *      sizes/weights/tracking will hold; only the family-name preference list
 *      in tokens/typography.css changes.
 *   2. Drop WOFF2 files at `sandbox/public/fonts/tiempos/` matching the paths
 *      below (gitignore the directory — fonts are licensed assets, not source).
 *   3. Uncomment the `localFont(...)` block + the `${tiempos.variable}` token
 *      on the <html> element below. Restart `npm run dev`.
 *
 * Until then, the marketing display surface falls through to the serif stack
 * defined in tokens/typography.css ("Tiempos Headline" → "Tiempos Text" →
 * Iowan Old Style → Georgia → serif). On a Mac with Tiempos Text installed
 * locally, that stack will resolve to the system font automatically — useful
 * for design-time comparison even before WOFF files are wired.
 */
// import localFont from "next/font/local";
// const tiempos = localFont({
//   src: [
//     { path: "../public/fonts/tiempos/TiemposText-Medium.woff2",   weight: "500", style: "normal" },
//     { path: "../public/fonts/tiempos/TiemposText-Semibold.woff2", weight: "600", style: "normal" },
//     { path: "../public/fonts/tiempos/TiemposText-Bold.woff2",     weight: "700", style: "normal" },
//   ],
//   variable: "--font-tiempos",
//   display: "swap",
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
