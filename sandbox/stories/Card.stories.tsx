import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Carvacrol</CardTitle>
        <CardDescription>
          Selectively inhibits methanogens & gram-positive bacteria; enriches
          Prevotella spp.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Origanum vulgare; Thymus vulgaris
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm">View detail</Button>
        <Button size="sm" variant="outline">
          Compare
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Cinnamaldehyde</CardTitle>
        <CardDescription>
          Inhibits hyper-ammonia producing bacteria; shifts toward propionate.
        </CardDescription>
        <CardAction>
          <Button size="sm" variant="ghost">
            85%
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="text-muted-foreground text-sm">
        Cinnamomum spp.
      </CardContent>
    </Card>
  ),
};
