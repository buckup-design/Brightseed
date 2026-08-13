import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { BrightseedLogo } from "@/components/brand/BrightseedLogo";

/* ─────────────────────────────────────────────────────────────────────────
 * Brightseed Logo, Mark + Lockup variants.
 *
 * Sourced from PROJECTS/Brightseed Digital Design/brand/logos/.
 * Sizes (sm/md/lg = 24/48/96 px) all use the same paths at different
 * viewBoxes, so the component holds one path set and the parent sizes via
 * Tailwind h-* utilities.
 *
 * Brand colors (#FF9A31 / #FFA547 / #5C8061 / #B34F90 / #B34F8F / #295133
 * for the mark; #46764F for the wordmark) are baked into the SVG, these
 * are brand-locked literals, NOT design tokens. The mark + wordmark stay
 * the same in light and dark mode by design.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Foundations/Logo",
  component: BrightseedLogo,
  parameters: { layout: "padded" },
} satisfies Meta<typeof BrightseedLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Mark: Story = {
  render: () => (
    <div className="flex items-end gap-12">
      <div className="flex flex-col items-center gap-2">
        <BrightseedLogo variant="mark" className="h-6 w-6" />
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          sm, 24px
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BrightseedLogo variant="mark" className="h-12 w-12" />
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          md, 48px
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BrightseedLogo variant="mark" className="h-24 w-24" />
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          lg, 96px
        </span>
      </div>
    </div>
  ),
};

/**
 * Tile (added June 7, 2026): app-icon treatment, mark on a pale-lime
 * rounded-square. Canonical = MediaAsset.svg / Figma `Sidebar / MediaAsset`
 * (Sidebar 07 block header). App-icon contexts only — the app-shell /
 * sidebar header uses tile-mark instead (Aug 13, 2026: the square read too
 * hot on the dark sidebar).
 */
export const Tile: Story = {
  render: () => (
    <div className="flex items-end gap-12">
      <div className="flex flex-col items-center gap-2">
        <BrightseedLogo variant="tile" className="h-8 w-8" />
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          32px, app icon
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BrightseedLogo variant="tile" className="h-16 w-16" />
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          64px
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BrightseedLogo variant="tile" className="h-24 w-24" />
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          96px
        </span>
      </div>
    </div>
  ),
};

/**
 * Tile-mark (added Aug 13, 2026): the tile's mark without the rounded
 * square — same tighter 32×32 geometry, no plinth. The app-shell / sidebar
 * header treatment in both light and dark mode (theme-invariant brand
 * colors, per Collab Playground 142:4874).
 */
export const TileMark: Story = {
  render: () => (
    <div className="flex items-end gap-12">
      <div className="flex flex-col items-center gap-2">
        <BrightseedLogo variant="tile-mark" className="h-8 w-8" />
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          32px, sidebar header
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BrightseedLogo variant="tile-mark" className="h-16 w-16" />
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          64px
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BrightseedLogo variant="tile-mark" className="h-24 w-24" />
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          96px
        </span>
      </div>
    </div>
  ),
};

export const Lockup: Story = {
  render: () => (
    <div className="flex flex-col gap-12 max-w-3xl">
      <div className="flex flex-col gap-2">
        <BrightseedLogo variant="lockup" className="h-16" />
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          h-16 (64px), hero / marketing
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <BrightseedLogo variant="lockup" className="h-12" />
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          h-12 (48px), default app-shell size
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <BrightseedLogo variant="lockup" className="h-8" />
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          h-8 (32px), compact / footer
        </span>
      </div>
    </div>
  ),
};

export const OnDarkSurface: Story = {
  parameters: { backgrounds: { disable: false } },
  render: () => (
    <div
      data-theme="dark"
      className="flex flex-col gap-8 p-12 rounded-lg"
      style={{
        background: "var(--ds-color-surface-default)",
      }}
    >
      <BrightseedLogo variant="lockup" className="h-12" />
      <BrightseedLogo variant="mark" className="h-16 w-16" />
      <p className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
        Mark and wordmark are theme-invariant, the brand colors stay the same
        on light and dark surfaces. Forest-green wordmark on sand-950 passes
        contrast.
      </p>
    </div>
  ),
};

export const Comparison: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          Mark only
        </span>
        <BrightseedLogo variant="mark" className="h-16 w-16" />
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
          Lockup
        </span>
        <BrightseedLogo variant="lockup" className="h-16" />
      </div>
    </div>
  ),
};
