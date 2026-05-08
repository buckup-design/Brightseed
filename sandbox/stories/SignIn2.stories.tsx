import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { SignIn2 } from "@/components/pro-blocks/application/sign-in/sign-in-2"

/* ─────────────────────────────────────────────────────────────────────────
 * Sign In 2 — first Pro Block landed via the @shadcndesign registry
 * (May 8, 2026). Smoke-test story for the rebuild approach.
 *
 * The block is a pure composition layer. It references stock shadcn primitives
 * by name (Button, Checkbox, Field, InputGroup, Separator) — not @shadcndesign
 * forks of those primitives. So what actually paints this story is:
 *
 *   1. Our customized Button (preserved during install — sha256 verified)
 *   2. The newly-installed stock primitives (Checkbox, Field, InputGroup)
 *   3. The Brightseed token bridge in app/globals.css
 *
 * What to look for in this story:
 *   - The "Sign in" CTA paints in lime (--color-action-primary) via the bridge.
 *     Hover should bump font weight Medium → SemiBold without layout shift,
 *     since this is our customized Button under the hood.
 *   - The "Sign in with Google" / "Sign in with Apple" outline buttons paint in
 *     sand on white via --color-action-secondary-* — also through the bridge.
 *   - All neutral text + surfaces should flow Brightseed semantics through
 *     shadcn variable names (bg-background → --color-surface-default, etc.).
 *
 * Known cosmetics — deferred to a later re-skin pass:
 *   - "Forgot password?" and "Sign up" inline links ride on --color-text-default
 *     (neutral), not --color-text-link-brand (lime). Pro Pack default behavior.
 *   - Right-side hero image points at ui.shadcn.com/placeholder.svg — may show
 *     a broken-image icon if the domain is unreachable from the dev environment.
 *   - The "Sign in" H1 uses Tailwind text-3xl + Geist semibold. Consistent with
 *     the Geist-for-product / Tiempos-for-marketing rule (May 8 decision).
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Pro Blocks/Application/Sign In 2",
  component: SignIn2,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SignIn2>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
