import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { BrightseedLogo } from "@/components/brand/BrightseedLogo";

/* ─────────────────────────────────────────────────────────────────────────
 * Brightseed Logo — Mark + Lockup variants.
 *
 * Sourced from PROJECTS/Brightseed Digital Design/brand/logos/.
 * Sizes (sm/md/lg = 24/48/96 px) all use the same paths at different
 * viewBoxes, so the component holds one path set and the parent sizes via
 * Tailwind h-* utilities.
 *
 * Brand colors (#FF9A31 / #FFA547 / #5C8061 / #B34F90 / #B34F8F / #295133
 * for the mark; #46764F for the wordmark) are baked into the SVG — these
 * are brand-locked literals, NOT design tokens. The mark + wordmark stay
 * the same in light and dark mode by design.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Brand/Logo",
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
        <span className="font-mono text-xs text-[var(--color-text-subtle)]">
          sm — 24px
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BrightseedLogo variant="mark" className="h-12 w-12" />
        <span className="font-mono text-xs text-[var(--color-text-subtle)]">
          md — 48px
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <BrightseedLogo variant="mark" className="h-24 w-24" />
        <span className="font-mono text-xs text-[var(--color-text-subtle)]">
          lg — 96px
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
        <span className="font-mono text-xs text-[var(--color-text-subtle)]">
          h-16 (64px) — hero / marketing
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <BrightseedLogo variant="lockup" className="h-12" />
        <span className="font-mono text-xs text-[var(--color-text-subtle)]">
          h-12 (48px) — default app-shell size
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <BrightseedLogo variant="lockup" className="h-8" />
        <span className="font-mono text-xs text-[var(--color-text-subtle)]">
          h-8 (32px) — compact / footer
        </span>
      </div>
    </div>
  ),
};

export const OnDarkSurface: Story = {
  parameters: { backgrounds: { disable: false } },
  render: () => (
    <div
      className="flex flex-col gap-8 p-12 rounded-lg"
      style={{
        background: "var(--color-sand-950, #1F1F1E)",
      }}
    >
      <BrightseedLogo variant="lockup" className="h-12" />
      <BrightseedLogo variant="mark" className="h-16 w-16" />
      <p className="font-mono text-xs text-[#F9F8F3] opacity-70">
        Mark and wordmark are theme-invariant — the brand colors stay the same
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
        <span className="font-mono text-xs text-[var(--color-text-subtle)]">
          Mark only
        </span>
        <BrightseedLogo variant="mark" className="h-16 w-16" />
      </div>
      <div className="flex flex-col gap-3">
        <span className="font-mono text-xs text-[var(--color-text-subtle)]">
          Lockup
        </span>
        <BrightseedLogo variant="lockup" className="h-16" />
      </div>
    </div>
  ),
};
