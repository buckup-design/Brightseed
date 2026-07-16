import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StarIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const meta = {
  title: "Components/Popover",
  component: Popover,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Evidence filters</PopoverTitle>
          <PopoverDescription>
            Narrow the results panel to a single evidence type.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};

export const Alignment: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex gap-3 pt-24">
      {(["start", "center", "end"] as const).map((align) => (
        <Popover key={align}>
          <PopoverTrigger asChild>
            <Button variant="outline">align=&quot;{align}&quot;</Button>
          </PopoverTrigger>
          <PopoverContent align={align} className="w-56">
            <PopoverHeader>
              <PopoverTitle>Aligned {align}</PopoverTitle>
              <PopoverDescription>
                Content aligns to the {align} edge of the trigger.
              </PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};

export const FeedbackWidget: Story = {
  name: "Feedback widget",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Feedback</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Send feedback</PopoverTitle>
          <PopoverDescription>
            Tell us what is working and what is not.
          </PopoverDescription>
        </PopoverHeader>

        <div className="mt-4 flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  className="text-[var(--ds-color-icon-subtle)] hover:text-[var(--ds-color-icon-favorite-active)]"
                >
                  <StarIcon className="size-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fb-category">Category</Label>
            <Select>
              <SelectTrigger id="fb-category">
                <SelectValue placeholder="General feedback" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General feedback</SelectItem>
                <SelectItem value="bug">Bug report</SelectItem>
                <SelectItem value="feature">Feature request</SelectItem>
                <SelectItem value="usability">Usability issue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fb-body">Details</Label>
            <Textarea id="fb-body" placeholder="What happened?" rows={3} />
          </div>

          <Button className="w-full">Submit</Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
