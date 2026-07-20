import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { CheckYourEmail } from "@/components/auth/CheckYourEmail";

/* ─────────────────────────────────────────────────────────────────────────
 * Check Your Email — the password-reset confirmation screen, the surface a
 * user lands on right after submitting "Forgot your password?" on the Login.
 *
 * Composes the Quill Card + Button; the mail mark is the lucide envelope tinted
 * with --ds-color-icon-success (forest green). Theme switches via the toolbar
 * Theme toggle (data-theme on <html>) — the card, text, and green all swap.
 *
 * WORK IN PROGRESS until Becky signs off; promote to Blocks/ (next to Login).
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "WORK IN PROGRESS/Check Your Email",
  component: CheckYourEmail,
  parameters: { layout: "fullscreen" },
  args: {
    email: "becky@buckupconsulting.com",
  },
} satisfies Meta<typeof CheckYourEmail>;

export default meta;
type Story = StoryObj<typeof meta>;

const frame = (node: React.ReactNode) => (
  <div className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
    <div className="w-full max-w-md">{node}</div>
  </div>
);

export const Default: Story = {
  render: (args) => frame(<CheckYourEmail {...args} />),
};

/** A long address still wraps cleanly inside the card instead of overflowing. */
export const LongEmail: Story = {
  args: { email: "becky.buck.consulting.team@a-very-long-domain-name.example.com" },
  render: (args) => frame(<CheckYourEmail {...args} />),
};
