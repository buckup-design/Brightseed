import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ─────────────────────────────────────────────────────────────────────────
 * Checkbox — multi-select. Every filter facet, every row-selection column,
 * every "and also include…" list in Hummingbird. For a single on/off setting
 * that applies immediately, use Switch instead.
 *
 * One box, no axes. Unlike Switch there is no `size` and no `variant` — a
 * 16px box is the whole component, so it lines up with body text in a dense
 * table row. Anything wider is a different control.
 *
 * Two things the code will not tell you:
 *
 *   - Label pairs by SIBLING, not by nesting. Label fades itself via
 *     `peer-disabled:`, which compiles to a `~` combinator, so the Label must
 *     be a following sibling of the Checkbox inside the same parent. Nest the
 *     Checkbox inside the Label and the disabled fade silently stops working.
 *
 *   - `checked="indeterminate"` is the correct API for a select-all header,
 *     and the state is wired, but the Indicator only ever draws a check glyph
 *     — so today indeterminate is visually identical to checked. Live with it
 *     or reach for the header cell's own affordance; do not fork the component.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    checked: { control: { type: "select" }, options: [true, false, "indeterminate"] },
    disabled: { control: { type: "boolean" } },
    required: { control: { type: "boolean" } },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { "aria-label": "Clinical evidence only" },
  render: (args) => <Checkbox {...args} />,
};

export const Checked: Story = {
  args: { defaultChecked: true, "aria-label": "Clinical evidence only" },
  render: (args) => <Checkbox {...args} />,
};

export const Indeterminate: Story = {
  name: "Indeterminate (renders as a check — see header)",
  args: { checked: "indeterminate", "aria-label": "Select all compounds" },
  render: (args) => <Checkbox {...args} />,
};

export const Disabled: Story = {
  args: { disabled: true, "aria-label": "Predicted evidence" },
  render: (args) => <Checkbox {...args} />,
};

export const DisabledChecked: Story = {
  name: "Disabled + checked",
  args: { disabled: true, defaultChecked: true, "aria-label": "GRAS status confirmed" },
  render: (args) => <Checkbox {...args} />,
};

export const Invalid: Story = {
  name: "Invalid (aria-invalid)",
  render: () => (
    <div className="flex w-80 flex-col gap-2">
      <div className="flex items-center gap-2">
        <Checkbox id="cb-gras" aria-invalid required />
        <Label htmlFor="cb-gras">
          I confirm GRAS status has been reviewed for this formula
        </Label>
      </div>
      <p className="text-sm text-[var(--ds-color-text-critical)]">
        Required before the formula brief can be shared.
      </p>
    </div>
  ),
};

export const WithLabel: Story = {
  name: "With label",
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="cb-clinical" defaultChecked />
      <Label htmlFor="cb-clinical">Clinical evidence only</Label>
    </div>
  ),
};

export const WithDescription: Story = {
  name: "With description",
  render: () => (
    <div className="flex w-80 items-start gap-2">
      <Checkbox id="cb-predicted" className="mt-0.5" />
      <div className="flex flex-col gap-1">
        <Label htmlFor="cb-predicted">Include predicted compounds</Label>
        <p className="text-sm text-[var(--ds-color-text-subtle)]">
          Forager-inferred matches with no published study behind them yet.
          Useful for early exploration, not for a formula brief.
        </p>
      </div>
    </div>
  ),
};

/* A facet panel owns its selection, so it renders through a component rather
 * than a bare render function. */
function EvidenceFacet() {
  const kinds = ["Clinical", "Animal", "In Vitro", "Predicted"];
  const [selected, setSelected] = React.useState<string[]>(["Clinical", "Animal"]);

  const toggle = (kind: string) =>
    setSelected((prev) =>
      prev.includes(kind) ? prev.filter((k) => k !== kind) : [...prev, kind]
    );

  return (
    <div className="flex w-64 flex-col gap-4 rounded-lg border border-[var(--ds-color-border-subtle)] p-4">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-medium">Evidence type</legend>
        {kinds.map((kind) => (
          <div key={kind} className="flex items-center gap-2">
            <Checkbox
              id={`facet-${kind}`}
              checked={selected.includes(kind)}
              onCheckedChange={() => toggle(kind)}
            />
            <Label htmlFor={`facet-${kind}`}>{kind}</Label>
          </div>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-sm font-medium">Health benefit</legend>
        {["Metabolic", "Gut", "Cognitive", "Immune", "Cardiovascular"].map(
          (benefit) => (
            <div key={benefit} className="flex items-center gap-2">
              <Checkbox id={`benefit-${benefit}`} defaultChecked={benefit === "Metabolic"} />
              <Label htmlFor={`benefit-${benefit}`}>{benefit}</Label>
            </div>
          )
        )}
      </fieldset>

      <p className="text-sm text-[var(--ds-color-text-subtle)]">
        {selected.length} of {kinds.length} evidence types shown
      </p>
    </div>
  );
}

export const FilterPanel: Story = {
  name: "Filter panel (stateful facets)",
  parameters: { layout: "padded" },
  render: () => <EvidenceFacet />,
};

const results = [
  {
    id: "berberine",
    compound: "Berberine",
    source: "Berberis vulgaris",
    evidence: "Clinical",
    biomarker: "HbA1c",
  },
  {
    id: "biochanin-a",
    compound: "Biochanin A",
    source: "Trifolium pratense",
    evidence: "Animal",
    biomarker: "Fasting glucose",
  },
  {
    id: "quercetin",
    compound: "Quercetin",
    source: "Allium cepa",
    evidence: "In Vitro",
    biomarker: "HOMA-IR",
  },
  {
    id: "carvacrol",
    compound: "Carvacrol",
    source: "Origanum vulgare",
    evidence: "Predicted",
    biomarker: "HOMA-IR",
  },
];

/* Row selection is the checkbox's real job on the results canvas: pick the
 * compounds that go into a formula brief. The header box is tri-state. */
function ResultsSelection() {
  const [selected, setSelected] = React.useState<string[]>(["berberine"]);

  const allChecked = selected.length === results.length;
  const someChecked = selected.length > 0 && !allChecked;

  const toggleRow = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                aria-label="Select all compounds"
                checked={allChecked ? true : someChecked ? "indeterminate" : false}
                onCheckedChange={(value) =>
                  setSelected(value === true ? results.map((r) => r.id) : [])
                }
              />
            </TableHead>
            <TableHead>Compound</TableHead>
            <TableHead>Natural source</TableHead>
            <TableHead>Evidence</TableHead>
            <TableHead>Biomarker</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((row) => (
            <TableRow key={row.id} data-state={selected.includes(row.id) ? "selected" : undefined}>
              <TableCell>
                <Checkbox
                  aria-label={`Select ${row.compound}`}
                  checked={selected.includes(row.id)}
                  onCheckedChange={() => toggleRow(row.id)}
                />
              </TableCell>
              <TableCell className="font-medium">{row.compound}</TableCell>
              <TableCell className="italic">{row.source}</TableCell>
              <TableCell>{row.evidence}</TableCell>
              <TableCell>{row.biomarker}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--ds-color-text-subtle)]">
          {selected.length} of {results.length} compounds selected
        </p>
        <Button size="sm" disabled={selected.length === 0}>
          Add to formula brief
        </Button>
      </div>
    </div>
  );
}

export const ResultsTable: Story = {
  name: "Results table row selection",
  parameters: { layout: "padded" },
  render: () => <ResultsSelection />,
};
