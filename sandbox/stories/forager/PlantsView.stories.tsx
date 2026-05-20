import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlantsView } from "@/components/forager/plants-view";

/* ─────────────────────────────────────────────────────────────────────────
 * PlantsView — full Forager plants result screen.
 *
 * Reference mock: anna's mocks 4-29-26/filtered to plants.png
 *
 * Composes the PlantCard into a realistic page layout: icon rail sidebar +
 * chat panel placeholder + main content (back link, page title, filter bar,
 * card grid). Chat panel is visual scaffold only — to be replaced with the
 * styled live component once Becky audits whether the existing one is
 * reusable.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Forager/Screens/Plants View",
  component: PlantsView,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PlantsView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
