import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import * as React from "react"
import { Info, Share2, Trash2 } from "lucide-react"

import {
  StrategyCard,
  type KebabAction,
  type PillarStatus,
} from "@/components/ui/strategy-card"

/* ─────────────────────────────────────────────────────────────────────────
 * StrategyCard stories — parity with the design intent sketched in
 * Figma node 239:19427 ("strategy card" frame in "Brightseed DS color studies").
 *
 * Same matrix philosophy as Button: every cell uses real component output,
 * with the hover state forced via `data-force-state="hover"` on the card.
 * The `card-hovered` Tailwind variant (defined in globals.css) maps that
 * attribute to the same descendant rules a live :hover triggers.
 * ───────────────────────────────────────────────────────────────────────── */

const SAMPLE_KEBAB_ACTIONS: KebabAction[] = [
  { label: "Tell me more", icon: Info },
  { label: "Share strategy", icon: Share2 },
  { label: "Hide this card", icon: Trash2, destructive: true },
]

const meta = {
  title: "Components/StrategyCard",
  component: StrategyCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: {
    title: "Stimulate mTOR / IGF-1 signaling",
    mechanism: "Amino acid sensing → increased casein synthesis",
    evidence: { status: "positive", label: "Significant evidence" },
    feasibility: { status: "caution", label: "Doubtful" },
    legal: { status: "negative", label: "Crowded patent space" },
    kebabActions: SAMPLE_KEBAB_ACTIONS,
  },
  argTypes: {
    favorited: { control: { type: "boolean" } },
    loading: { control: { type: "boolean" } },
  },
} satisfies Meta<typeof StrategyCard>

export default meta
type Story = StoryObj<typeof meta>

/* ───────────────────────────────────────────────────────────────────────
 * Spotlight stories — quick scans for individual aspects of the spec.
 * ─────────────────────────────────────────────────────────────────────── */

export const Default: Story = {}

export const Favorited: Story = {
  args: { favorited: true },
}

export const Hover: Story = {
  args: { "data-force-state": "hover" } as Partial<typeof meta.args>,
}

export const FavoritedHover: Story = {
  args: {
    favorited: true,
    "data-force-state": "hover",
  } as Partial<typeof meta.args>,
}

export const Loading: Story = {
  args: { loading: true },
}

export const AllPositive: Story = {
  args: {
    evidence: { status: "positive", label: "Significant evidence" },
    feasibility: { status: "positive", label: "Probable" },
    legal: { status: "positive", label: "None found" },
  },
}

export const AllNegative: Story = {
  args: {
    evidence: { status: "negative", label: "No evidence" },
    feasibility: { status: "negative", label: "Doubtful" },
    legal: { status: "negative", label: "Crowded patent space" },
  },
}

/** No kebab — for strategies that don't have overflow actions. */
export const NoKebab: Story = {
  args: { kebabActions: [] },
}

/* Two-up layout that mirrors the "filtered to compounds" reference — useful
 * for verifying the card holds up at typical Forager viewport widths. */
export const TwoUp: Story = {
  parameters: { layout: "padded" },
  render: (args) => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 max-w-[900px]">
      <StrategyCard
        {...args}
        title="Stimulate mTOR / IGF-1 signaling"
        mechanism="Amino acid sensing → increased casein synthesis"
        favorited
        evidence={{ status: "positive", label: "Significant evidence" }}
        feasibility={{ status: "caution", label: "Doubtful" }}
        legal={{ status: "negative", label: "Crowded patent space" }}
      />
      <StrategyCard
        {...args}
        title="Activate AMPK / fatty-acid oxidation"
        mechanism="Energy-sensing kinase → reduced lipogenesis"
        evidence={{ status: "positive", label: "Significant evidence" }}
        feasibility={{ status: "caution", label: "Plausible" }}
        legal={{ status: "positive", label: "None found" }}
      />
      <StrategyCard
        {...args}
        title="Modulate gut microbiome diversity"
        mechanism="Polyphenol → SCFA producer enrichment"
        evidence={{ status: "caution", label: "Emerging evidence" }}
        feasibility={{ status: "positive", label: "Probable" }}
        legal={{ status: "caution", label: "Related patents found" }}
      />
      <StrategyCard
        {...args}
        title="Inhibit hepatic gluconeogenesis"
        mechanism="G6Pase suppression → fasting glucose drop"
        evidence={{ status: "negative", label: "No evidence" }}
        feasibility={{ status: "positive", label: "Probable" }}
        legal={{ status: "negative", label: "Crowded patent space" }}
      />
    </div>
  ),
}

/* ───────────────────────────────────────────────────────────────────────
 * Quill matrix — rows × columns parity grid.
 * Mirrors the same pattern Button.stories.tsx uses for its 330-cell matrix.
 * ─────────────────────────────────────────────────────────────────────── */

type StateKey = "default" | "hover" | "favorited" | "favorited-hover" | "loading" | "error"

const STATES: Array<{ key: StateKey; label: string; description?: string }> = [
  { key: "default", label: "Default" },
  { key: "hover", label: "Hover" },
  { key: "favorited", label: "Favorited" },
  { key: "favorited-hover", label: "Favorited + Hover" },
  { key: "loading", label: "Loading" },
  {
    key: "error",
    label: "Error",
    description:
      "No card-level visual change per spec — load errors surface as an app-level toast.",
  },
]

type ContentCombo = {
  key: string
  caption: string
  evidence: PillarStatus
  feasibility: PillarStatus
  legal: PillarStatus
}

const CONTENTS: ContentCombo[] = [
  {
    key: "all-positive",
    caption: "All positive",
    evidence: { status: "positive", label: "Significant evidence" },
    feasibility: { status: "positive", label: "Probable" },
    legal: { status: "positive", label: "None found" },
  },
  {
    key: "all-caution",
    caption: "All caution",
    evidence: { status: "caution", label: "Emerging evidence" },
    feasibility: { status: "caution", label: "Plausible" },
    legal: { status: "caution", label: "Related patents found" },
  },
  {
    key: "all-negative",
    caption: "All negative",
    evidence: { status: "negative", label: "No evidence" },
    feasibility: { status: "negative", label: "Doubtful" },
    legal: { status: "negative", label: "Crowded patent space" },
  },
  {
    key: "sketch-top-left",
    caption: "Mixed (green / yellow / red)",
    evidence: { status: "positive", label: "Significant evidence" },
    feasibility: { status: "caution", label: "Doubtful" },
    legal: { status: "negative", label: "Crowded patent space" },
  },
  {
    key: "sketch-top-right",
    caption: "Mostly good",
    evidence: { status: "positive", label: "Significant evidence" },
    feasibility: { status: "caution", label: "Plausible" },
    legal: { status: "positive", label: "None found" },
  },
  {
    key: "sketch-bottom-left",
    caption: "Mid-range",
    evidence: { status: "caution", label: "Emerging evidence" },
    feasibility: { status: "positive", label: "Probable" },
    legal: { status: "caution", label: "Related patents found" },
  },
]

function QuillCell({
  state,
  content,
}: {
  state: StateKey
  content: ContentCombo
}) {
  // Map the state key to component props.
  const props: Record<string, unknown> = {
    title: "Stimulate mTOR / IGF-1 signaling",
    mechanism: "Amino acid sensing → increased casein synthesis",
    evidence: content.evidence,
    feasibility: content.feasibility,
    legal: content.legal,
    kebabActions: SAMPLE_KEBAB_ACTIONS,
  }

  if (state === "favorited" || state === "favorited-hover") {
    props.favorited = true
  }
  if (state === "hover" || state === "favorited-hover") {
    props["data-force-state"] = "hover"
  }
  if (state === "loading") {
    props.loading = true
  }
  // "error" is intentionally identical to default per spec.

  return (
    <div className="flex justify-center">
      <StrategyCard {...(props as React.ComponentProps<typeof StrategyCard>)} />
    </div>
  )
}

export const QuillMatrix: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Full state × content matrix. Rows are content combinations (the three pure-status combos plus three from Becky's sketch). Columns are the six states. Toggle theme in the toolbar to verify dark-mode parity.",
      },
    },
  },
  render: () => (
    <div className="bg-[var(--color-surface-default)] p-8 text-[var(--color-text-default)]">
      <header className="mb-8 max-w-3xl">
        <h1 className="text-2xl font-semibold">StrategyCard — Quill matrix</h1>
        <p className="mt-2 text-sm text-[var(--color-text-subtle)]">
          Every state × content combination. Hover and favorited+hover columns
          force their state via <code>data-force-state="hover"</code>, which the{" "}
          <code>card-hovered</code> custom variant maps to the same descendant
          rules a real <code>:hover</code> would trigger.
        </p>
      </header>

      {/* Column headers */}
      <div
        className="sticky top-0 z-10 mb-4 grid items-end gap-x-6 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-default)] pb-3"
        style={{
          gridTemplateColumns: "minmax(160px, 200px) repeat(6, minmax(280px, 1fr))",
        }}
      >
        <div />
        {STATES.map((state) => (
          <div key={state.key}>
            <div className="font-mono text-xs uppercase tracking-wide text-[var(--color-text-default)]">
              {state.label}
            </div>
            {state.description ? (
              <div className="mt-1 text-xs text-[var(--color-text-subtle)]">
                {state.description}
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Body rows */}
      <div
        className="grid items-start gap-x-6 gap-y-12"
        style={{
          gridTemplateColumns: "minmax(160px, 200px) repeat(6, minmax(280px, 1fr))",
        }}
      >
        {CONTENTS.map((content) => (
          <React.Fragment key={content.key}>
            <div className="pl-2 pt-2 font-mono text-xs text-[var(--color-text-subtle)]">
              {content.caption}
            </div>
            {STATES.map((state) => (
              <QuillCell
                key={`${content.key}-${state.key}`}
                state={state.key}
                content={content}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  ),
}
