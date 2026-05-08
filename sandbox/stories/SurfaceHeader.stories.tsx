import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Filter, ListOrdered, Plus } from "lucide-react"

import { SurfaceHeader } from "@/components/forager/surface-header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const meta = {
  title: "Forager/SurfaceHeader",
  component: SurfaceHeader,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof SurfaceHeader>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The Strategies surface header — eyebrow project name + page title +
 * goal subtitle + simple toolbar (count, filters, sort).
 */
export const Strategies: Story = {
  args: {
    eyebrow: "Project · GLP-1 + Lean Muscle",
    title: "Strategies",
    subtitle:
      "Help individuals on GLP-1 weight-loss drugs retain lean muscle mass",
    actions: (
      <Button variant="ghost" size="sm">
        <Plus />
        New strategy
      </Button>
    ),
    toolbar: (
      <>
        <span className="text-xs font-medium text-[var(--color-text-subtle)] tabular-nums">
          4 strategies
        </span>
        <span className="h-3 w-px bg-[var(--color-border-subtle)]" />
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
        >
          <Filter className="size-3.5" />
          Show filters
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-subtle)] hover:text-[var(--color-text-default)]"
        >
          <ListOrdered className="size-3.5" />
          Sorted by relevance
        </button>
      </>
    ),
  },
}

/**
 * The Compounds/Plants surface header — back link, longer title (truncates if
 * needed), tab toggle for Compounds vs Plants, plus filter and sort controls.
 */
export const CompoundsPlants: Story = {
  args: {
    backLink: { href: "/strategies", label: "Back to strategies" },
    eyebrow: "Strategy · GLP-1 + Lean Muscle",
    title: "Shift microbiome towards propionate producers",
    toolbar: (
      <>
        <Tabs defaultValue="compounds">
          <TabsList>
            <TabsTrigger value="compounds">Compounds</TabsTrigger>
            <TabsTrigger value="plants">Plant sources</TabsTrigger>
          </TabsList>
        </Tabs>
        <span className="ml-auto text-xs font-medium text-[var(--color-text-subtle)] tabular-nums">
          5 results
        </span>
      </>
    ),
  },
}

export const Minimal: Story = {
  args: { title: "Samples" },
}
