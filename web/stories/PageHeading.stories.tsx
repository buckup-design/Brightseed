import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PageHeading } from "@/components/ui/page-heading";

/* ─────────────────────────────────────────────────────────────────────────
 * PageHeading — a page/section title with an optional description. The h1 + p
 * pattern that opens most product surfaces (the agent home greeting, a list
 * masthead, an empty state). Product UI, so Geist, not the Tiempos display
 * face.
 *
 * `align` centers or left-aligns the block; `as` sets only the heading element
 * (for one-h1-per-page correctness) without changing the visual size.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Page Heading",
  component: PageHeading,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    align: { control: "inline-radio", options: ["left", "center"] },
    size: { control: "inline-radio", options: ["sm", "md"] },
    as: { control: "inline-radio", options: ["h1", "h2", "h3"] },
    title: { control: "text" },
    description: { control: "text" },
  },
  args: {
    title: "Reports",
    description: "Every formula brief and analysis you've generated.",
    align: "left",
    size: "md",
    as: "h1",
  },
  decorators: [
    (Story) => (
      <div className="w-[40rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageHeading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Title + description, left-aligned — the default masthead. */
export const Default: Story = {};

/** No description — the title stands alone. */
export const TitleOnly: Story = {
  args: { description: undefined },
};

/** Centered — the agent-home greeting this component was factored out to cover. */
export const Centered: Story = {
  args: {
    title: "What can I help you create today?",
    description:
      "I’m Hummingbird, your agent for innovating new product concepts.",
    align: "center",
    size: "md",
  },
};

/** Compact (`size="sm"`) — the list masthead that sits above a toolbar (Reports, Projects). */
export const Compact: Story = {
  args: { size: "sm" },
};
