import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import { ChatPanel } from "@/components/forager/chat-panel"

const meta = {
  title: "Forager/ChatPanel",
  component: ChatPanel,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex h-screen w-[420px] border border-[var(--color-border-subtle)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { contextLine: "Asking about this strategy" },
}

export const NoContextLine: Story = {}

export const NoQuickPrompts: Story = {
  args: {
    contextLine: "Asking about this strategy",
    quickPrompts: [],
  },
}

export const Empty: Story = {
  args: {
    messages: [],
    contextLine: "New conversation",
  },
}
