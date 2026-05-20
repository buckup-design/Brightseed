import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brightseed Sandbox",
  description: "AI prototyping playground for the Brightseed design system",
};

/*
 * Tiempos Text is loaded via @font-face in tokens/typography.css.
 * That path works in BOTH Next.js (public/ served at root) and Storybook
 * (which serves public/ via .storybook/main.ts staticDirs). next/font/local
 * was tried first but doesn't reach Storybook, since stories don't render
 * through this layout — preview.ts only loads globals.css.
 */

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
