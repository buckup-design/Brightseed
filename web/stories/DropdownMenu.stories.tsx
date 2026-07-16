import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import {
  ArrowUpDownIcon,
  EyeIcon,
  ListFilterIcon,
  MoreVerticalIcon,
  PinIcon,
  Trash2Icon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────────────────────────────────
 * DropdownMenu, the ⋮ overflow / Filter / Sort control on every Hummingbird
 * list surface (Conversations, Reports).
 *
 * Two jobs, two shapes:
 *   - Item        — a command. Delete, Pin, View. `variant="destructive"`
 *                   tints the item critical.
 *   - RadioItem   — single-select view state. Filter and Sort must show which
 *                   option is live, so they read as radios, not commands.
 *
 * Menus carry view state; Select is for form fields.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Dropdown Menu",
  component: DropdownMenu,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem>Open</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
        <DropdownMenuItem>Rename</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const ConversationOverflow: Story = {
  name: "Conversation card ⋮",
  render: () => (
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
  ),
};

export const ReportOverflow: Story = {
  name: "Report card ⋮",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Report actions">
          <MoreVerticalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <PinIcon />
            Pin
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EyeIcon />
            View
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

// Radio menus own their selection, so they render through a small component
// rather than a bare render function.
function FilterMenu() {
  const [filter, setFilter] = React.useState("all");
  const label = { all: "All", active: "Active", archived: "Archived" }[filter];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ListFilterIcon />
          Filter: {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Show</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
          <DropdownMenuRadioItem value="all">
            All conversations
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="active">
            Active only
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="archived">
            Archived only
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Filter: Story = {
  name: "Filter (single-select)",
  render: () => <FilterMenu />,
};

function SortMenu() {
  const [sort, setSort] = React.useState("recent");
  const label = { recent: "Most recent", oldest: "Oldest first", title: "By title" }[
    sort
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ArrowUpDownIcon />
          Sort: {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
          <DropdownMenuRadioItem value="recent">
            Most recent
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">
            Oldest first
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="title">By title</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const Sort: Story = {
  name: "Sort (single-select)",
  render: () => <SortMenu />,
};

export const WithLabelsAndShortcuts: Story = {
  name: "Labels, groups, shortcuts",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Report actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Report</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Continue edit
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Run full IP analysis
            <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            Export as PDF
            <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2Icon />
          Discard and return
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const InsetAlignment: Story = {
  name: "Inset (aligns with icon items)",
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Mixed items</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuItem>
          <PinIcon />
          Pin
        </DropdownMenuItem>
        <DropdownMenuItem>
          <EyeIcon />
          View
        </DropdownMenuItem>
        <DropdownMenuItem inset>Rename</DropdownMenuItem>
        <DropdownMenuItem inset>Duplicate</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
