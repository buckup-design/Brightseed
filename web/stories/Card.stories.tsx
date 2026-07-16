import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MoreVerticalIcon, PinIcon, Trash2Icon } from "lucide-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

/* ─────────────────────────────────────────────────────────────────────────
 * Card, the container behind the Conversations and Reports lists and the
 * Settings sections.
 *
 * Card is bridge-themed rather than token-bearing: it styles through the
 * shadcn slot vocabulary (bg-card, text-card-foreground), which bridge/
 * globals.css maps onto Brightseed semantics. It carries no --c-card-*
 * block, same as Sheet and Tabs.
 *
 * CardAction parks a control (⋮, a badge) in the header's right column; it
 * relies on CardHeader's has-data-[slot=card-action] grid, so it must be a
 * child of CardHeader.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Metabolic health, Q3</CardTitle>
        <CardDescription>
          Eight messages · last active 2 hours ago
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--ds-color-text-subtle)]">
          14 compounds and 3 combinations surfaced so far.
        </p>
      </CardContent>
    </Card>
  ),
};

export const ConversationCard: Story = {
  name: "Conversation card",
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Metabolic health, Q3</CardTitle>
        <CardDescription>2 hours ago · 8 messages</CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Conversation actions">
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem variant="destructive">
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" size="sm">
          Open
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ReportCard: Story = {
  name: "Report card",
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Berberine + Biochanin A</CardTitle>
        <CardDescription>Created 15 July 2026</CardDescription>
        <CardAction>
          <Tag variant="yellow">Draft</Tag>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--ds-color-text-subtle)]">
          Recommended combination for metabolic health, with formulation and
          IP assessment.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm">
          View
        </Button>
        <Button variant="ghost" size="sm">
          <PinIcon />
          Pin
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const SettingsSection: Story = {
  name: "Settings section",
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose what Hummingbird tells you about.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notify-reports">Report ready</Label>
          <Switch id="notify-reports" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="notify-ip">IP analysis complete</Label>
          <Switch id="notify-ip" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="notify-digest">Weekly digest</Label>
          <Switch id="notify-digest" />
        </div>
      </CardContent>
    </Card>
  ),
};

export const Anatomy: Story = {
  name: "Anatomy (all slots)",
  parameters: { layout: "padded" },
  render: () => (
    <Card className="w-96">
      <CardHeader className="border-b">
        <CardTitle>CardTitle</CardTitle>
        <CardDescription>CardDescription</CardDescription>
        <CardAction>
          <Tag variant="default">CardAction</Tag>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm">CardContent</p>
      </CardContent>
      <CardFooter className="border-t">
        <Button size="sm">CardFooter</Button>
      </CardFooter>
    </Card>
  ),
};
