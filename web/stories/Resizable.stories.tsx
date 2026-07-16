import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const meta = {
  title: "Components/Resizable",
  component: ResizablePanelGroup,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: { type: "radio" },
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame = ({ children }: { children: React.ReactNode }) => (
  <div className="h-[320px] w-full overflow-hidden rounded-lg border border-[var(--ds-color-border-subtle)]">
    {children}
  </div>
);

const Pane = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <div className="flex h-full flex-col gap-2 p-4">
    <h3 className="text-sm font-medium">{title}</h3>
    <p className="text-sm text-[var(--ds-color-text-subtle)]">{children}</p>
  </div>
);

export const Default: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <Frame>
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize={45} minSize={25}>
          <Pane title="Chat">Ask Forager about a health benefit.</Pane>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={55} minSize={30}>
          <Pane title="Results">14 compounds · 3 combinations</Pane>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Frame>
  ),
};

export const WithHandle: Story = {
  name: "With grip handle",
  args: { orientation: "horizontal" },
  render: (args) => (
    <Frame>
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize={45} minSize={25}>
          <Pane title="Chat">Drag the grip to resize.</Pane>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={55} minSize={30}>
          <Pane title="Results">14 compounds · 3 combinations</Pane>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Frame>
  ),
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <Frame>
      <ResizablePanelGroup {...args}>
        <ResizablePanel defaultSize={60} minSize={25}>
          <Pane title="Report">Recommended combination and formulation.</Pane>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <Pane title="References">25 sources cited.</Pane>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Frame>
  ),
};

export const Workspace: Story = {
  name: "Workspace split",
  render: () => (
    <Frame>
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={40} minSize={25}>
          <Pane title="Conversation">
            Metabolic health, Q3 — 8 messages
          </Pane>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={60} minSize={30}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={65} minSize={25}>
              <Pane title="Compounds">
                Berberine · Biochanin A · Quercetin
              </Pane>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={35} minSize={20}>
              <Pane title="Natural sources">
                Berberis vulgaris · Coptis chinensis
              </Pane>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Frame>
  ),
};
