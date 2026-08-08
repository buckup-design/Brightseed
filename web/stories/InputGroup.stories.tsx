import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  ArrowUpIcon,
  BeakerIcon,
  CopyIcon,
  FlaskConicalIcon,
  LeafIcon,
  SearchIcon,
  SparklesIcon,
  XIcon,
} from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";

/* ─────────────────────────────────────────────────────────────────────────
 * InputGroup, a single field that swallows its own affordances: the compound
 * search box, the µM/mg unit fields on a formula brief, and the Forager prompt
 * composer with its send button.
 *
 * The group is a shell — it owns border, radius, focus ring and error ring, and
 * it derives all of them from its children. Three things follow from that, and
 * all three are easy to get wrong:
 *
 *   1. The control must be InputGroupInput / InputGroupTextarea. Those carry
 *      data-slot="input-group-control", which is what the group's focus and
 *      error rings key off. A bare <Input> renders but leaves the shell inert
 *      — and paints its own second border inside the group's.
 *   2. Addons must be DIRECT children. Every alignment rule is a `has-[>...]`
 *      selector; wrap an addon in a div and the layout silently doesn't apply.
 *   3. Nothing cascades. `aria-invalid` goes on the control, not the group.
 *      Disabling needs BOTH `disabled` on the control (to stop input) AND
 *      data-disabled="true" on the group (to fade the addons) — see Disabled.
 *
 * align is per-addon, not per-group: inline-start/end sit beside the control,
 * block-start/end stack above/below and flip the group to a column.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Input Group",
  component: InputGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// Galleries render several groups at once, so no single set of args describes
// them. They opt out of the meta-bound args typing rather than fake one.
type GalleryStory = StoryObj;

export const Default: Story = {
  render: (args) => (
    <InputGroup {...args} className="w-96">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search compounds…" />
    </InputGroup>
  ),
};

export const InlineStart: Story = {
  name: "Addon: inline-start",
  render: () => (
    <InputGroup className="w-96">
      <InputGroupAddon align="inline-start">
        <LeafIcon />
      </InputGroupAddon>
      <InputGroupInput defaultValue="Berberis vulgaris" />
    </InputGroup>
  ),
};

export const InlineEnd: Story = {
  name: "Addon: inline-end",
  render: () => (
    <div className="flex w-96 flex-col gap-1.5">
      <Label htmlFor="ig-dose">Screening concentration</Label>
      <InputGroup>
        <InputGroupInput id="ig-dose" defaultValue="40" inputMode="decimal" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>µM</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const BothInlineEnds: Story = {
  name: "Addons: both inline ends",
  render: () => (
    <InputGroup className="w-96">
      <InputGroupAddon align="inline-start">
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput defaultValue="Biochanin A" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label="Clear search">
          <XIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const BlockStart: Story = {
  name: "Addon: block-start",
  render: () => (
    <InputGroup className="w-96">
      <InputGroupAddon align="block-start" className="border-b">
        <InputGroupText>
          <FlaskConicalIcon />
          Formula brief · Metabolic health
        </InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="Note the rationale for this compound set…" />
    </InputGroup>
  ),
};

export const BlockEnd: Story = {
  name: "Addon: block-end",
  render: () => (
    <InputGroup className="w-96">
      <InputGroupTextarea defaultValue="Berberine shows a consistent HbA1c reduction across the clinical set. Pair with Quercetin?" />
      <InputGroupAddon align="block-end" className="border-t">
        <InputGroupText>Clinical · 12 studies</InputGroupText>
        <InputGroupButton size="xs" className="ml-auto">
          <CopyIcon />
          Copy
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const ButtonSizes: GalleryStory = {
  name: "InputGroupButton sizes",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-4">
      {(["xs", "sm"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-16 text-sm text-[var(--ds-color-text-subtle)]">
            {size}
          </span>
          <InputGroup className="w-80">
            <InputGroupInput defaultValue="Carvacrol" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size={size}>Screen</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      ))}
      {(["icon-xs", "icon-sm"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-16 text-sm text-[var(--ds-color-text-subtle)]">
            {size}
          </span>
          <InputGroup className="w-80">
            <InputGroupInput defaultValue="Carvacrol" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton size={size} aria-label="Screen compound">
                <BeakerIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      ))}
    </div>
  ),
};

export const ButtonVariants: GalleryStory = {
  name: "InputGroupButton variants",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-4">
      {(["ghost", "default", "outline", "secondary"] as const).map((variant) => (
        <InputGroup key={variant} className="w-80">
          <InputGroupInput defaultValue="Quercetin" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant={variant} size="sm">
              {variant}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <InputGroup data-disabled="true" className="w-96">
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput defaultValue="Berberine" disabled />
      <InputGroupAddon align="inline-end">
        <InputGroupText>µM</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-1.5">
      <Label htmlFor="ig-invalid">Screening concentration</Label>
      <InputGroup>
        <InputGroupInput
          id="ig-invalid"
          defaultValue="-40"
          aria-invalid
          aria-describedby="ig-invalid-msg"
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>µM</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <p
        id="ig-invalid-msg"
        className="text-sm text-[var(--ds-color-text-critical)]"
      >
        Concentration must be greater than 0 µM.
      </p>
    </div>
  ),
};

export const PromptComposer: GalleryStory = {
  name: "Forager prompt composer",
  parameters: { layout: "padded" },
  render: () => (
    <div className="w-[36rem] rounded-[var(--ds-shape-radius-lg)] border border-[var(--ds-color-border-default)] p-4">
      <p className="mb-3 text-sm text-[var(--ds-color-text-subtle)]">
        Which compounds in Coptis chinensis move fasting glucose?
      </p>
      <InputGroup>
        <InputGroupTextarea placeholder="Ask Forager about a health benefit…" />
        <InputGroupAddon align="block-end">
          <InputGroupText>
            <SparklesIcon />
            Forager v1.3
          </InputGroupText>
          <InputGroupButton
            size="icon-sm"
            variant="default"
            className="ml-auto"
            aria-label="Send message"
          >
            <ArrowUpIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
};

export const ResultsToolbar: GalleryStory = {
  name: "Workspace results toolbar",
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex w-[42rem] flex-col gap-3 rounded-[var(--ds-shape-radius-lg)] border border-[var(--ds-color-border-default)] p-4">
      <div className="flex items-center gap-3">
        <InputGroup className="flex-1">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Filter 214 compounds…" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>214</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup className="w-56">
          <InputGroupAddon>
            <InputGroupText>Biomarker</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput defaultValue="HbA1c" />
        </InputGroup>
      </div>
      <p className="text-sm text-[var(--ds-color-text-subtle)]">
        Berberine · Biochanin A · Quercetin · Carvacrol — evidence: Clinical,
        Animal, In vitro, Predicted
      </p>
    </div>
  ),
};
