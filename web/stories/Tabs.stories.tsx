import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="compounds" className="w-[480px]">
      <TabsList>
        <TabsTrigger value="compounds">Compounds</TabsTrigger>
        <TabsTrigger value="plants">Plant Sources</TabsTrigger>
      </TabsList>
      <TabsContent value="compounds" className="mt-4 text-sm text-muted-foreground">
        Compounds tab content.
      </TabsContent>
      <TabsContent value="plants" className="mt-4 text-sm text-muted-foreground">
        Plant sources tab content.
      </TabsContent>
    </Tabs>
  ),
};
