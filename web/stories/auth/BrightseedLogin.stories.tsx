import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { BrightseedLogin } from "@/components/auth/BrightseedLogin";

/* ─────────────────────────────────────────────────────────────────────────
 * Brightseed Login, translation of the v3 Figma `Brightseed / Login / 1`
 * COMPONENT_SET (Mode={light, dark}) into React.
 *
 * Forms a complete two-pane sign-in experience: form pane on the left,
 * marketing pane (Image Slot) on the right with the lime gradient + line
 * art hummingbird/botanical + Tiempos Fine Italic "6x faster" text overlay.
 *
 * The form pane consumes:
 *   - BrightseedLogo (mark variant)
 *   - Quill Button at Variant=Secondary, Size=xl for OAuth
 *   - Quill Button at Variant=Default, Size=xl for the SIGN IN CTA
 *   - Quill Button at Variant=Linktext for "Forgot your password" + "Sign up"
 *   - Stock Input at h-12 (matching the Brightseed Size=lg Figma variant)
 *   - sr-only Label for accessibility (visually labelless inputs)
 *
 * Theme switches via the Storybook toolbar Theme toggle (data-theme on <html>).
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Auth/BrightseedLogin",
  component: BrightseedLogin,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof BrightseedLogin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-5xl">
        <BrightseedLogin />
      </div>
    </div>
  ),
};
