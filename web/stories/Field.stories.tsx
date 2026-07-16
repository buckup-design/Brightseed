import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

/* ─────────────────────────────────────────────────────────────────────────
 * Field, the layout kit that wraps a control in its label, help text and
 * error. Every Hummingbird form surface is built from it: the formula brief,
 * the report composer's settings, the IP-analysis run sheet.
 *
 * Field owns no control. It is a `role="group"` wrapper that lays out
 * whatever you put inside it, so the control keeps its own props.
 *
 * Two things the code will not tell you:
 *
 *   1. Invalid and disabled are `data-invalid` / `data-disabled` on the
 *      Field, NOT `aria-invalid` / `disabled`. Those attributes only recolour
 *      the label and error text. The control still needs its own
 *      `aria-invalid` / `disabled` — set both, or the input keeps a resting
 *      border under a red message.
 *
 *   2. A FieldLabel that *wraps* a Field becomes a selection card: it grows a
 *      border, 16px padding, and lights lime when the control inside reports
 *      `data-state=checked`. The nesting is the API, not a hack.
 *
 * `orientation="responsive"` reads the `@md/field-group` container, so it is
 * inert unless the Field is inside a FieldGroup. Bare, it stays vertical.
 *
 * This repo has no RadioGroup, so FieldSet's radio-group gap selector never
 * fires. Single-select in a form is Select; radio menus are DropdownMenu.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Field",
  component: Field,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: { type: "radio" },
      options: ["vertical", "horizontal", "responsive"],
    },
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <div className="w-96">
      <Field {...args}>
        <FieldLabel htmlFor="brief-name">Brief name</FieldLabel>
        <Input id="brief-name" placeholder="Q3 metabolic concept" />
        <FieldDescription>
          Shown on the brief card and in any report generated from it.
        </FieldDescription>
      </Field>
    </div>
  ),
};

export const Vertical: Story = {
  name: "Orientation: vertical",
  render: () => (
    <div className="w-96">
      <Field orientation="vertical">
        <FieldLabel htmlFor="target-biomarker">Primary biomarker</FieldLabel>
        <Select>
          <SelectTrigger id="target-biomarker">
            <SelectValue placeholder="Select a biomarker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hba1c">HbA1c</SelectItem>
            <SelectItem value="fasting-glucose">Fasting glucose</SelectItem>
            <SelectItem value="homa-ir">HOMA-IR</SelectItem>
          </SelectContent>
        </Select>
        <FieldDescription>
          Forager ranks compounds against this readout first.
        </FieldDescription>
      </Field>
    </div>
  ),
};

/* Horizontal puts the label and control on one line. The label takes the
 * free space (`flex-auto`), so the control sits hard right — which is why it
 * suits switches and short numeric inputs, not long text entry. */
export const Horizontal: Story = {
  name: "Orientation: horizontal",
  render: () => (
    <div className="w-96">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="include-predicted">
            Include predicted evidence
          </FieldLabel>
          <FieldDescription>
            Adds compounds with no Clinical or Animal study behind them yet.
          </FieldDescription>
        </FieldContent>
        <Switch id="include-predicted" defaultChecked />
      </Field>
    </div>
  ),
};

/* Responsive stacks below the FieldGroup's @md breakpoint and goes horizontal
 * above it. Resize the canvas to see it flip — it measures the FieldGroup, not
 * the viewport. */
export const Responsive: Story = {
  name: "Orientation: responsive",
  render: () => (
    <FieldGroup className="max-w-2xl">
      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel htmlFor="gras-only">GRAS compounds only</FieldLabel>
          <FieldDescription>
            Restricts results to compounds with Generally Recognized As Safe
            status.
          </FieldDescription>
        </FieldContent>
        <Switch id="gras-only" />
      </Field>
      <Field orientation="responsive">
        <FieldContent>
          <FieldLabel htmlFor="min-sources">Minimum natural sources</FieldLabel>
          <FieldDescription>
            Drops compounds sourced from fewer plants than this.
          </FieldDescription>
        </FieldContent>
        <Input
          id="min-sources"
          type="number"
          defaultValue={2}
          className="md:w-24"
        />
      </Field>
    </FieldGroup>
  ),
};

/* FieldTitle is FieldLabel's non-`<label>` twin: same type, no `htmlFor`, no
 * click-to-focus. Use it when the group has no single control to point at. */
export const WithFieldTitle: Story = {
  name: "FieldTitle (label with no control to bind)",
  render: () => (
    <div className="w-96">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Freedom-to-operate scan</FieldTitle>
          <FieldDescription>
            Last run 14 July 2026 against 4 jurisdictions.
          </FieldDescription>
        </FieldContent>
        <Button variant="outline" size="sm">
          Re-run
        </Button>
      </Field>
    </div>
  ),
};

export const Invalid: Story = {
  name: "Invalid (data-invalid + FieldError)",
  render: () => (
    <div className="w-96">
      <Field data-invalid="true">
        <FieldLabel htmlFor="invalid-name">Brief name</FieldLabel>
        <Input
          id="invalid-name"
          aria-invalid="true"
          defaultValue=""
          placeholder="Q3 metabolic concept"
        />
        <FieldError>A brief name is required before you can save.</FieldError>
      </Field>
    </div>
  ),
};

/* FieldError also takes an `errors` array straight from a form library. One
 * entry renders as a line; two or more render as a bullet list, de-duplicated
 * by message. Passing children wins over `errors`. */
export const InvalidWithErrorList: Story = {
  name: "Invalid (errors array)",
  render: () => (
    <div className="w-96">
      <Field data-invalid="true">
        <FieldLabel htmlFor="invalid-dose">Dose range (mg/day)</FieldLabel>
        <Input id="invalid-dose" aria-invalid="true" defaultValue="0-9000" />
        <FieldError
          errors={[
            { message: "Upper bound exceeds the studied range for Berberine." },
            { message: "Lower bound must be greater than 0." },
          ]}
        />
      </Field>
    </div>
  ),
};

/* `data-disabled` on the Field fades the label and title only. The control is
 * disabled on its own — both are needed. */
export const Disabled: Story = {
  render: () => (
    <div className="w-96">
      <Field data-disabled="true">
        <FieldLabel htmlFor="disabled-jurisdiction">
          Patentability jurisdiction
        </FieldLabel>
        <Select disabled>
          <SelectTrigger id="disabled-jurisdiction">
            <SelectValue placeholder="US, EP, JP, CN" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="us">United States</SelectItem>
          </SelectContent>
        </Select>
        <FieldDescription>
          Locked while the IP analysis is running.
        </FieldDescription>
      </Field>
    </div>
  ),
};

export const SelectionCards: Story = {
  name: "Selection cards (FieldLabel wrapping a Field)",
  render: () => (
    <FieldSet className="w-96">
      <FieldLegend variant="label">Evidence types</FieldLegend>
      <FieldDescription>
        Compounds must carry at least one of the selected evidence types.
      </FieldDescription>
      <FieldGroup>
        <FieldLabel htmlFor="ev-clinical">
          <Field orientation="horizontal">
            <Checkbox id="ev-clinical" defaultChecked />
            <FieldContent>
              <FieldTitle>Clinical</FieldTitle>
              <FieldDescription>
                Human trials. The strongest claim support, and the smallest set.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>

        <FieldLabel htmlFor="ev-animal">
          <Field orientation="horizontal">
            <Checkbox id="ev-animal" defaultChecked />
            <FieldContent>
              <FieldTitle>Animal</FieldTitle>
              <FieldDescription>
                In vivo models. Directional for metabolic and gut endpoints.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>

        <FieldLabel htmlFor="ev-invitro">
          <Field orientation="horizontal">
            <Checkbox id="ev-invitro" />
            <FieldContent>
              <FieldTitle>In Vitro</FieldTitle>
              <FieldDescription>
                Cell-based assays. Mechanism only — no dose translation.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>

        <FieldLabel htmlFor="ev-predicted">
          <Field orientation="horizontal">
            <Checkbox id="ev-predicted" />
            <FieldContent>
              <FieldTitle>Predicted</FieldTitle>
              <FieldDescription>
                Forager inference with no published study behind it.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </FieldGroup>
    </FieldSet>
  ),
};

export const FieldSetAndLegend: Story = {
  name: "FieldSet + FieldLegend variants",
  render: () => (
    <div className="flex w-full max-w-3xl flex-col gap-10">
      <FieldSet>
        <FieldLegend>Compound scope</FieldLegend>
        <FieldDescription>
          The default. Section-sized, for the top of a form.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="legend-source">Natural source</FieldLabel>
            <Input id="legend-source" defaultValue="Berberis vulgaris" />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend variant="label">Compound scope</FieldLegend>
        <FieldDescription>
          Label-sized, for a subgroup nested inside a larger form.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="label-source">Natural source</FieldLabel>
            <Input id="label-source" defaultValue="Coptis chinensis" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  ),
};

/* FieldSeparator carries optional inline content, which sits on the rule with
 * the page surface knocked out behind it. Bare, it is just a rule. */
export const Separators: Story = {
  name: "FieldSeparator",
  render: () => (
    <FieldGroup className="max-w-md">
      <Field>
        <FieldLabel htmlFor="sep-compound">Compound</FieldLabel>
        <Input id="sep-compound" defaultValue="Berberine" />
      </Field>
      <FieldSeparator />
      <Field>
        <FieldLabel htmlFor="sep-benefit">Health benefit</FieldLabel>
        <Input id="sep-benefit" defaultValue="Metabolic" />
      </Field>
      <FieldSeparator>Or</FieldSeparator>
      <Field>
        <FieldLabel htmlFor="sep-paste">Paste a compound list</FieldLabel>
        <Textarea
          id="sep-paste"
          placeholder="Berberine, Biochanin A, Quercetin, Carvacrol"
        />
      </Field>
    </FieldGroup>
  ),
};

export const FormulaBrief: Story = {
  name: "Formula brief (real surface)",
  parameters: { layout: "padded" },
  render: () => (
    <form
      className="mx-auto flex w-full max-w-xl flex-col gap-8 rounded-[var(--ds-shape-radius-lg)] border border-[var(--ds-color-border-default)] p-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <FieldSet>
        <FieldLegend>New formula brief</FieldLegend>
        <FieldDescription>
          Forager screens its compound library against this brief and returns a
          ranked shortlist.
        </FieldDescription>

        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="fb-name">Brief name</FieldLabel>
            <Input id="fb-name" defaultValue="Q3 metabolic concept" />
          </Field>

          <Field>
            <FieldLabel htmlFor="fb-benefit">Target health benefit</FieldLabel>
            <Select defaultValue="metabolic">
              <SelectTrigger id="fb-benefit">
                <SelectValue placeholder="Select a benefit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metabolic">Metabolic health</SelectItem>
                <SelectItem value="gut">Gut health</SelectItem>
                <SelectItem value="cognitive">Cognitive health</SelectItem>
                <SelectItem value="immune">Immune support</SelectItem>
                <SelectItem value="cardiovascular">
                  Cardiovascular health
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              Drives which biomarkers Forager weights in the ranking.
            </FieldDescription>
          </Field>

          <Field data-invalid="true">
            <FieldLabel htmlFor="fb-biomarker">Primary biomarker</FieldLabel>
            <Input
              id="fb-biomarker"
              aria-invalid="true"
              defaultValue="HbA1c, HOMA-IR"
            />
            <FieldError>
              Pick a single primary biomarker — add the rest as secondary.
            </FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="fb-notes">Notes for the brief</FieldLabel>
            <Textarea
              id="fb-notes"
              placeholder="Consumer beverage format. Prefer compounds with a known GRAS pathway."
            />
            <FieldDescription>
              Free text. Included verbatim in any report generated from this
              brief.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSeparator />

      <FieldSet>
        <FieldLegend variant="label">Screening options</FieldLegend>
        <FieldGroup>
          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="fb-gras">GRAS compounds only</FieldLabel>
              <FieldDescription>
                Excludes anything without a Generally Recognized As Safe
                pathway.
              </FieldDescription>
            </FieldContent>
            <Switch id="fb-gras" defaultChecked />
          </Field>

          <Field orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="fb-ip">Run IP analysis on save</FieldLabel>
              <FieldDescription>
                Appends freedom-to-operate and patentability verdicts. Adds
                about 25 seconds.
              </FieldDescription>
            </FieldContent>
            <Switch id="fb-ip" />
          </Field>

          <Field data-disabled="true" orientation="responsive">
            <FieldContent>
              <FieldLabel htmlFor="fb-share">Share with the workspace</FieldLabel>
              <FieldDescription>
                Available once the brief has been saved.
              </FieldDescription>
            </FieldContent>
            <Switch id="fb-share" disabled />
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="submit">Create brief</Button>
      </div>
    </form>
  ),
};
