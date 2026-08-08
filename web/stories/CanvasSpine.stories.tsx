import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import {
  ResultCard,
  type ComboResult,
  type PredictedResult,
  type SingleResult,
} from "@/components/hummingbird/cards/result-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tag } from "@/components/ui/tag";

/* ─────────────────────────────────────────────────────────────────────────
 * THROWAWAY decision harness — delete once the canvas spine is chosen.
 *
 * Two ways to get the Figma's dark chrome/content separation (frame 142:4874,
 * which puts chrome DARKER than content):
 *
 *   A · CHROME DOWN   canvas stays sand-950; chrome drops to a new sand-975.
 *   B · CONTENT UP    canvas lifts to sand-900; chrome stays sand-950.
 *                     (What the Figma literally draws.)
 *
 * Both are shown on the SAME surfaces on purpose. Judging this on the New chat
 * screen alone flatters B — that screen has almost nothing painted on the
 * canvas. The result cards and the chip strip are where B's cost shows: the
 * dark intent tints are color-mix(…, sand-950) BY CONSTRUCTION, so on a
 * sand-900 ground they collapse toward invisible. The predicted card is the
 * clearest tell — its whole body is surface-success.
 *
 * The values below are literals only because this is a disposable comparison
 * rig, not shipped styling. Nothing here should be copied into a component.
 * ───────────────────────────────────────────────────────────────────────── */

const SAND_950 = "#1f1f1e"; // today's canvas + chrome
const SAND_900 = "#2a2925"; // the Figma's dark canvas
const SAND_975 = "#141413"; // proposed chrome step (variant A)

const SINGLE: SingleResult = {
  type: "single",
  name: "Resveratrol",
  benefit: "Longevity & Cellular",
  score: 0.85,
  targets: ["SIRT1", "AMPK", "NF-κB"],
  categories: ["Polyphenol", "Antioxidant"],
  evidence: "clinical",
};

const COMBO: ComboResult = {
  type: "combo",
  names: ["Berberine", "Sulforaphane"],
  benefit: "Metabolic & Weight",
  score: 0.88,
  targets: ["AMPK", "Nrf2", "PCSK9", "GLP-1"],
  categories: [],
  evidence: "clinical",
};

const PREDICTED: PredictedResult = {
  type: "predicted",
  name: "Brightseed-HBPB0049946",
  benefit: "Cognitive & Mental",
  score: 0.82,
  targets: ["BDNF", "TrkB"],
  categories: ["Alkaloid"],
  evidence: "predicted",
};

/** One variant rendered as a chrome-rail + canvas frame. */
function Scene({
  label,
  note,
  canvas,
  chrome,
}: {
  label: string;
  note: string;
  canvas: string;
  chrome: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <div className="text-sm font-medium text-[var(--ds-color-text-default)]">{label}</div>
        <div className="text-xs text-[var(--ds-color-text-muted)]">{note}</div>
      </div>

      <div className="flex overflow-hidden rounded-lg" style={{ height: 470 }}>
        {/* chrome rail */}
        <div
          className="flex w-[150px] shrink-0 flex-col gap-1 p-3"
          style={{ backgroundColor: chrome }}
        >
          <div className="mb-2 text-[11px] font-semibold text-[var(--ds-color-text-default)]">
            Brightseed
          </div>
          {["New chat", "Conversations", "Projects", "Reports"].map((n, i) => (
            <div
              key={n}
              className="rounded-md px-2 py-1.5 text-[11px]"
              style={
                i === 0
                  ? {
                      backgroundColor: "var(--ds-color-surface-selected-brand)",
                      color: "var(--ds-color-text-brand)",
                    }
                  : { color: "var(--ds-color-text-muted)" }
              }
            >
              {n}
            </div>
          ))}
        </div>

        {/* canvas */}
        <div
          className="flex flex-1 flex-col gap-3 overflow-hidden p-4"
          style={{ backgroundColor: canvas }}
        >
          <div className="text-[11px] uppercase tracking-wide text-[var(--ds-color-text-muted)]">
            Results on the canvas
          </div>
          <div className="grid grid-cols-3 gap-3">
            <ResultCard result={SINGLE} />
            <ResultCard result={COMBO} />
            <ResultCard result={PREDICTED} />
          </div>

          <div className="mt-1 text-[11px] uppercase tracking-wide text-[var(--ds-color-text-muted)]">
            Intent + tag fills, painted directly on the canvas
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status="completed" />
            <StatusBadge status="draft" />
            <Tag variant="orange">Orange</Tag>
            <Tag variant="yellow">Yellow</Tag>
            <Tag variant="cyan">Cyan</Tag>
            <Tag variant="red">Red</Tag>
            <Tag variant="lavender">Lavender</Tag>
            <Tag variant="orchid">Orchid</Tag>
            <Tag variant="default">Neutral</Tag>
          </div>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "WORK IN PROGRESS/Canvas Spine A-B",
  parameters: { layout: "fullscreen", previewPadding: false },
  decorators: [
    (Story) => (
      <div className="min-h-svh bg-[var(--ds-color-surface-default)] p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Both variants stacked, so the same elements line up for comparison. */
export const Compare: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Scene
        label="TODAY — flush"
        note="chrome sand-950 · canvas sand-950 · no separation"
        chrome={SAND_950}
        canvas={SAND_950}
      />
      <Scene
        label="A — CHROME DOWN (recommended)"
        note="chrome sand-975 #141413 · canvas sand-950 · 1.117:1 · nothing on the canvas moves"
        chrome={SAND_975}
        canvas={SAND_950}
      />
      <Scene
        label="B — CONTENT UP (the Figma literal)"
        note="chrome sand-950 · canvas sand-900 #2a2925 · 1.133:1 · watch the predicted card + the tag row"
        chrome={SAND_950}
        canvas={SAND_900}
      />
    </div>
  ),
};
