import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const meta = {
  title: "Components/Alert",
  component: Alert,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["default", "info", "success", "warning", "destructive"],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert>
      <InfoIcon />
      <AlertTitle>Batch ready for review.</AlertTitle>
      <AlertDescription>
        Twelve compounds finished analysis. Open the batch to verify yields.
      </AlertDescription>
    </Alert>
  ),
};

export const Info: Story = {
  render: () => (
    <Alert variant="info">
      <InfoIcon />
      <AlertTitle>New batch available.</AlertTitle>
      <AlertDescription>
        Batch QFR-512 is ready for assignment. Review and accept to start.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <CircleCheckIcon />
      <AlertTitle>Compound verified.</AlertTitle>
      <AlertDescription>
        Quercetin (QFR-118) passed all quality checks at 84% yield.
      </AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert variant="warning">
      <TriangleAlertIcon />
      <AlertTitle>Yield below threshold.</AlertTitle>
      <AlertDescription>
        Three compounds in this batch fell under 60%. Review before submitting.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <OctagonXIcon />
      <AlertTitle>Sample failed quality check.</AlertTitle>
      <AlertDescription>
        Compound QFR-411 fell below the 50% yield threshold. Re-run analysis or
        discard the batch.
      </AlertDescription>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <Alert variant="success">
      <CircleCheckIcon />
      <AlertTitle>Compound verified.</AlertTitle>
    </Alert>
  ),
};

export const NoIcon: Story = {
  render: () => (
    <Alert variant="info">
      <AlertTitle>Heads up.</AlertTitle>
      <AlertDescription>
        Without an icon the alert collapses to a single text column.
      </AlertDescription>
    </Alert>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3 max-w-2xl">
      <Alert>
        <InfoIcon />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>
          Neutral surface — informational, no semantic weight.
        </AlertDescription>
      </Alert>
      <Alert variant="info">
        <InfoIcon />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>
          Soft blue surface — informational with semantic weight.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheckIcon />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Soft forest surface — positive confirmation.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <TriangleAlertIcon />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Soft yellow surface — caution, action recommended.
        </AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <OctagonXIcon />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>
          Soft red surface — error or destructive state.
        </AlertDescription>
      </Alert>
    </div>
  ),
};
