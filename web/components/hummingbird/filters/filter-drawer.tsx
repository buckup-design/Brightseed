"use client";

/**
 * FilterDrawer — the expandable narrowing surface above the Workspace results
 * grid. Two bands: three facet clouds (Benefit / Compound Classes / Biological
 * Targets), then three score panels (Feasibility / Novelty / Safety).
 *
 * Ported from Anna's `propolis-filters` demo (branch `anna/filter-demo`). The
 * structure and every label are hers; what changed is that it now composes Quill
 * primitives (Slider, Switch, Select, Popover) instead of hand-rolled controls,
 * and reads Brightseed semantics instead of the demo's hardcoded orange.
 *
 * Token tier: a Hummingbird leaf app surface, so it reads global --ds-* directly
 * (the result-card / results-panel precedent). Every primitive it composes
 * carries its own --c-* block; the two tiers never mix inside one file.
 *
 * Fully controlled: it owns no filter state, it renders `state` and reports every
 * change through `onChange`. The canvas above it holds the one copy, so the
 * result count in the toolbar and the grid below can never disagree with the
 * controls.
 */

import * as React from "react";
import { Info } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { FilterCard } from "./filter-card";
import {
  FEASIBILITY_LABELS,
  SCORE_RANGES,
  SOLUBILITY_LABELS,
  THREE_POINT_LABELS,
  TOXICITY_LABELS,
  scoreLabelFormatter,
  toggleFacetSelection,
  type FacetSelection,
  type FilterGroup,
  type FilterState,
} from "./filter-model";

// "Any" cannot be the empty string: Radix Select reserves "" to mean "no value
// selected", and an Item carrying it throws. The sentinel maps back to "" — the
// model's own no-filter value — at the boundary below.
const ANY_FORMAT = "__any__";

// ─── Score slider ────────────────────────────────────────────────────────────

/**
 * A labelled score slider with its current step spelled out beside the title.
 * That readout is not decoration: it is the non-colour cue that carries the
 * value, since the Slider's fill and track are ~1:1 in greyscale (see ui/slider).
 */
function ScoreSlider({
  label,
  min,
  max,
  value,
  onChange,
  formatValue,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        {/* Plain text, not a <Label htmlFor>: role="slider" lives on Radix's
            thumb, which htmlFor cannot reach, so the accessible name comes from
            the aria-label below and a htmlFor here would only look associated. */}
        <span className="text-sm font-medium text-[var(--ds-color-text-default)]">
          {label}
        </span>
        <span className="shrink-0 text-sm text-[var(--ds-color-text-subtle)]">
          {formatValue(value)}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={1}
        value={[value]}
        onValueChange={([next]) => onChange(next)}
        aria-label={label}
        aria-valuetext={formatValue(value)}
      />
    </div>
  );
}

// ─── Switch row ──────────────────────────────────────────────────────────────

function SwitchRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = React.useId();
  return (
    <div className="flex items-center gap-3">
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="text-sm font-medium">
        {label}
      </Label>
    </div>
  );
}

// ─── Panel ───────────────────────────────────────────────────────────────────

function ScorePanel({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <h3 className="text-xs font-medium uppercase tracking-wide text-[var(--ds-color-text-subtle)]">
          {title}
        </h3>
        <Tooltip>
          {/* A real button, not a bare icon: the hint has to be reachable by
              keyboard, and Tooltip only shows on focus for something focusable. */}
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`About ${title} filters`}
              className="flex size-4 items-center justify-center rounded-[var(--ds-shape-radius-sm)] text-[var(--ds-color-icon-subtle)] outline-none focus-visible:ring-1 focus-visible:ring-[var(--ds-color-border-focus)]"
            >
              <Info className="size-3.5" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-56">{hint}</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

// ─── Drawer ──────────────────────────────────────────────────────────────────

export interface FilterDrawerProps {
  benefitGroup: FilterGroup;
  classGroup: FilterGroup;
  targetGroup: FilterGroup;
  productFormatOptions: string[];
  state: FilterState;
  onChange: (next: FilterState) => void;
  className?: string;
}

export function FilterDrawer({
  benefitGroup,
  classGroup,
  targetGroup,
  productFormatOptions,
  state,
  onChange,
  className,
}: FilterDrawerProps) {
  // One patch helper rather than 13 handlers — the drawer is a controlled form
  // over a flat state bag, and every control changes exactly one key.
  const set = React.useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
      onChange({ ...state, [key]: value }),
    [onChange, state]
  );

  const facets: {
    group: FilterGroup;
    selected: FacetSelection;
    key: "benefits" | "classes" | "targets";
  }[] = [
    { group: benefitGroup, selected: state.benefits, key: "benefits" },
    { group: classGroup, selected: state.classes, key: "classes" },
    { group: targetGroup, selected: state.targets, key: "targets" },
  ];

  return (
    <TooltipProvider>
    <div
      className={cn(
        // @container, not viewport breakpoints: this drawer lives inside the
        // Workspace's resizable split view, so its own width has nothing to do
        // with the window's. A `min-[44rem]:` media query reads the VIEWPORT and
        // happily keeps three columns inside a 560px panel on a wide monitor —
        // which is exactly the case that matters.
        "@container",
        "flex flex-col gap-4 border-b border-[var(--ds-color-border-subtle)]",
        "bg-[var(--ds-color-surface-default)] px-4 py-4",
        className
      )}
      // The toolbar's toggle owns aria-expanded/aria-controls pointing here, so
      // this needs a stable id and an accessible name of its own.
      id="workspace-filter-drawer"
      role="group"
      aria-label="Result filters"
    >
      {/* Facet clouds. Collapse to one column under 44rem of CONTAINER width, so
          the chips keep a usable width in a narrowed split view. */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-4 @min-[44rem]:grid-cols-3">
        {facets.map((facet) => (
          <FilterCard
            key={facet.group.id}
            group={facet.group}
            selected={facet.selected}
            onToggle={(label) =>
              onChange({
                ...state,
                [facet.key]: toggleFacetSelection(state[facet.key], label),
              })
            }
          />
        ))}
      </div>

      <hr className="border-[var(--ds-color-border-subtle)]" />

      <div className="grid grid-cols-1 gap-x-6 gap-y-6 @min-[44rem]:grid-cols-3">
        <ScorePanel
          title="Feasibility"
          hint="How practical the compound is to formulate and deliver at product scale."
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="filter-product-format" className="text-sm font-medium">
              Product format
            </Label>
            <Select
              value={state.productFormat === "" ? ANY_FORMAT : state.productFormat}
              onValueChange={(value) =>
                set("productFormat", value === ANY_FORMAT ? "" : value)
              }
            >
              <SelectTrigger id="filter-product-format" size="sm" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY_FORMAT}>Any</SelectItem>
                {productFormatOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SwitchRow
            label="Does not require delivery technology"
            checked={state.requiresNoDeliveryTech}
            onChange={(v) => set("requiresNoDeliveryTech", v)}
          />

          <ScoreSlider
            label="Acceptable formulation score"
            min={SCORE_RANGES.easeOfFormulation.min}
            max={SCORE_RANGES.easeOfFormulation.max}
            value={state.formulationScore}
            onChange={(v) => set("formulationScore", v)}
            formatValue={scoreLabelFormatter(FEASIBILITY_LABELS)}
          />

          <ScoreSlider
            label="Minimum solubility score"
            min={SCORE_RANGES.solubility.min}
            max={SCORE_RANGES.solubility.max}
            value={state.solubilityScore}
            onChange={(v) => set("solubilityScore", v)}
            formatValue={scoreLabelFormatter(SOLUBILITY_LABELS)}
          />
        </ScorePanel>

        <ScorePanel
          title="Novelty"
          hint="Freedom to operate and how defensible a patent position would be."
        >
          <ScoreSlider
            label="Minimum FTO score"
            min={SCORE_RANGES.fto.min}
            max={SCORE_RANGES.fto.max}
            value={state.ftoScore}
            onChange={(v) => set("ftoScore", v)}
            formatValue={scoreLabelFormatter(THREE_POINT_LABELS)}
          />

          <ScoreSlider
            label="Minimum patentability score"
            min={SCORE_RANGES.patentability.min}
            max={SCORE_RANGES.patentability.max}
            value={state.patentabilityScore}
            onChange={(v) => set("patentabilityScore", v)}
            formatValue={scoreLabelFormatter(THREE_POINT_LABELS)}
          />
        </ScorePanel>

        <ScorePanel
          title="Safety"
          hint="Toxicity ceiling plus the regulatory routes the compound already has open."
        >
          <ScoreSlider
            label="Acceptable toxicity score"
            min={SCORE_RANGES.admet.min}
            max={SCORE_RANGES.admet.max}
            value={state.admetScore}
            onChange={(v) => set("admetScore", v)}
            formatValue={scoreLabelFormatter(TOXICITY_LABELS)}
          />

          <SwitchRow
            label="No GHS hazard code"
            checked={state.noGhsHazard}
            onChange={(v) => set("noGhsHazard", v)}
          />

          <SwitchRow
            label="(US) available in a GRAS source"
            checked={state.requiresGras}
            onChange={(v) => set("requiresGras", v)}
          />

          <SwitchRow
            label="(EU) available in non-novel food"
            checked={state.requiresNonNovel}
            onChange={(v) => set("requiresNonNovel", v)}
          />
        </ScorePanel>
      </div>
    </div>
    </TooltipProvider>
  );
}
