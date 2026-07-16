import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* Dialog is the general-purpose modal. For a decision the user must resolve
 * before continuing (destructive or blocking), use AlertDialog instead — it
 * has no dismiss affordance by design. */

const meta = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create formula brief</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create formula brief</DialogTitle>
          <DialogDescription>
            Pick a target health benefit to start a brief. You can refine the
            details once the brief is open.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="brief-benefit">Target health benefit</Label>
            <Select>
              <SelectTrigger id="brief-benefit">
                <SelectValue placeholder="Select a benefit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metabolic">Metabolic health</SelectItem>
                <SelectItem value="gut">Gut health</SelectItem>
                <SelectItem value="cognitive">Cognitive health</SelectItem>
                <SelectItem value="immune">Immune support</SelectItem>
                <SelectItem value="cardio">Cardiovascular health</SelectItem>
                <SelectItem value="skin">Skin health</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="brief-name">Brief name (optional)</Label>
            <Input id="brief-name" placeholder="Q3 metabolic concept" />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Create brief</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Simple: Story = {
  name: "Title and description only",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">About this report</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About this report</DialogTitle>
          <DialogDescription>
            Generated from conversation &ldquo;Metabolic health, Q3&rdquo; on
            15 July 2026. IP analysis is informational and is not legal advice.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  ),
};

export const WithoutCloseButton: Story = {
  name: "Without the corner close button",
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Run full IP analysis</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Run full IP analysis?</DialogTitle>
          <DialogDescription>
            This takes about 25 seconds and appends a freedom-to-operate report
            and a patentability verdict to this concept.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Not now</Button>
          </DialogClose>
          <Button>Run analysis</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
