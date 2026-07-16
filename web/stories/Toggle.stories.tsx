import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import {
  BookmarkIcon,
  FlaskConicalIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

/* ─────────────────────────────────────────────────────────────────────────
 * Toggle, ONE independent on/off button. It is the button-shaped sibling of
 * Switch, not a smaller version of it.
 *
 * Picking the right one:
 *   - Toggle       — an independent boolean the user flips to change what they
 *                    are looking at right now. Filters on the results canvas,
 *                    save-to-brief on a compound. Several may be on at once.
 *   - ToggleGroup  — a set of mutually exclusive options (grid vs list).
 *   - Switch       — a persisted setting in a form or settings panel.
 *
 * Two things the code will not tell you:
 *   - Toggle has no built-in label. An icon-only toggle is an unnamed button
 *     until you give it `aria-label`, and since Brightseed icons stay line-art
 *     (never filled, CLAUDE.md), the on-state SURFACE is the only visual state
 *     signal. Don't ship an icon-only toggle without both.
 *   - On `variant="outline"` the hover surface and the on surface are the same
 *     token (--ds-color-surface-brand-subtle), so a hovered-off toggle looks
 *     identical to an on one. Fine in a toolbar where the pointer is on one
 *     button at a time; wrong if a reader must scan several at a glance.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Toggle",
  component: Toggle,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["default", "outline"],
    },
    size: {
      control: { type: "radio" },
      options: ["sm", "default", "lg"],
    },
    disabled: { control: { type: "boolean" } },
    defaultPressed: { control: { type: "boolean" } },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/* Galleries render several instances at once, so no single set of args
 * describes them. They take a loose story type instead of faking args for an
 * instance that doesn't exist. */
type GalleryStory = StoryObj;

export const Default: Story = {
  args: { children: "Predicted only" },
  render: (args) => <Toggle {...args} />,
};

export const Pressed: Story = {
  name: "On (defaultPressed)",
  args: { children: "Predicted only", defaultPressed: true },
  render: (args) => <Toggle {...args} />,
};

export const Variants: GalleryStory = {
  name: "Variants (default, outline)",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center gap-8">
      <div className="flex items-center gap-2">
        <Toggle variant="default">GRAS</Toggle>
        <Toggle variant="default" defaultPressed>
          GRAS
        </Toggle>
      </div>
      <div className="flex items-center gap-2">
        <Toggle variant="outline">GRAS</Toggle>
        <Toggle variant="outline" defaultPressed>
          GRAS
        </Toggle>
      </div>
    </div>
  ),
};

export const Sizes: GalleryStory = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center gap-4">
      <Toggle variant="outline" size="sm">
        Small
      </Toggle>
      <Toggle variant="outline" size="default">
        Default
      </Toggle>
      <Toggle variant="outline" size="lg">
        Large
      </Toggle>
    </div>
  ),
};

export const IconOnly: GalleryStory = {
  name: "Icon only (aria-label required)",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center gap-3">
      <Toggle variant="outline" size="sm" aria-label="Filter to predicted compounds">
        <SparklesIcon />
      </Toggle>
      <Toggle
        variant="outline"
        size="default"
        aria-label="Filter to GRAS compounds"
        defaultPressed
      >
        <ShieldCheckIcon />
      </Toggle>
      <Toggle
        variant="outline"
        size="lg"
        aria-label="Filter to clinical evidence"
      >
        <FlaskConicalIcon />
      </Toggle>
    </div>
  ),
};

export const Disabled: GalleryStory = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center gap-4">
      <Toggle variant="outline" disabled>
        Clinical evidence
      </Toggle>
      <Toggle variant="outline" disabled defaultPressed>
        Clinical evidence
      </Toggle>
    </div>
  ),
};

/* Toggle carries the stock aria-invalid classes, but it is a view control, not
 * a validated field — there is rarely a reason to mark one invalid. Shown on
 * `outline` because that is the only variant where it renders: the recipe
 * recolours a border, and `variant="default"` has no border to recolour. The
 * critical ring is colour-only and appears at focus width, so tab to it. */
export const Invalid: GalleryStory = {
  name: "aria-invalid (outline only)",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex items-center gap-4">
      <Toggle variant="outline" aria-invalid>
        Clinical evidence
      </Toggle>
      {/* Same aria-invalid, default variant: renders unchanged, because the
          recipe only recolours a border this variant does not have. */}
      <Toggle variant="default" aria-invalid>
        Predicted only
      </Toggle>
    </div>
  ),
};

/* ── Hummingbird surfaces ───────────────────────────────────────────────── */

const RESULT_FILTERS = [
  { value: "predicted", label: "Predicted", Icon: SparklesIcon },
  { value: "gras", label: "GRAS", Icon: ShieldCheckIcon },
  { value: "clinical", label: "Clinical evidence", Icon: FlaskConicalIcon },
] as const;

const COMPOUNDS = [
  { name: "Berberine", source: "Berberis vulgaris", tags: ["clinical", "gras"] },
  { name: "Biochanin A", source: "Trifolium pratense", tags: ["predicted"] },
  { name: "Quercetin", source: "Sophora japonica", tags: ["clinical", "gras"] },
  { name: "Carvacrol", source: "Origanum vulgare", tags: ["gras"] },
];

/* Independent filters own their state, so this renders through a component
 * rather than a bare render function. */
function ResultsToolbar() {
  const [active, setActive] = React.useState<string[]>(["clinical"]);

  const setFilter = (value: string, on: boolean) =>
    setActive((prev) =>
      on ? [...prev, value] : prev.filter((v) => v !== value)
    );

  const matches = COMPOUNDS.filter((c) =>
    active.every((f) => c.tags.includes(f))
  );

  return (
    <div className="flex w-[30rem] flex-col gap-4">
      <div className="flex items-center gap-2">
        {RESULT_FILTERS.map(({ value, label, Icon }) => (
          <Toggle
            key={value}
            variant="outline"
            size="sm"
            pressed={active.includes(value)}
            onPressedChange={(on) => setFilter(value, on)}
          >
            <Icon />
            {label}
          </Toggle>
        ))}
      </div>

      <p className="text-xs text-[var(--ds-color-text-subtle)]">
        {matches.length} of {COMPOUNDS.length} compounds match
      </p>

      <ul className="flex flex-col divide-y divide-[var(--ds-color-border-default)] rounded-[var(--ds-shape-radius-lg)] border border-[var(--ds-color-border-default)]">
        {matches.map((c) => (
          <li key={c.name} className="flex flex-col gap-0.5 px-4 py-3">
            <span className="text-sm font-medium">{c.name}</span>
            <span className="text-xs text-[var(--ds-color-text-subtle)]">
              {c.source}
            </span>
          </li>
        ))}
        {matches.length === 0 && (
          <li className="px-4 py-3 text-sm text-[var(--ds-color-text-subtle)]">
            No compounds match every filter.
          </li>
        )}
      </ul>
    </div>
  );
}

export const ResultsFilters: GalleryStory = {
  name: "Workspace results filters",
  parameters: { layout: "padded" },
  render: () => <ResultsToolbar />,
};

function SaveToBriefRow() {
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="flex w-96 items-center justify-between gap-4 rounded-[var(--ds-shape-radius-lg)] border border-[var(--ds-color-border-default)] px-4 py-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">Berberine</span>
        <span className="text-xs text-[var(--ds-color-text-subtle)]">
          Coptis chinensis · HbA1c −0.9% · Clinical
        </span>
      </div>
      <Toggle
        variant="outline"
        size="sm"
        pressed={saved}
        onPressedChange={setSaved}
        aria-label={
          saved
            ? "Remove Berberine from the formula brief"
            : "Save Berberine to the formula brief"
        }
      >
        <BookmarkIcon />
      </Toggle>
    </div>
  );
}

export const SaveToBrief: GalleryStory = {
  name: "Save a compound to a brief",
  parameters: { layout: "padded" },
  render: () => <SaveToBriefRow />,
};
