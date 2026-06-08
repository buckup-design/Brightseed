import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

/* ─────────────────────────────────────────────────────────────────────────
 * Foundations / Color Scales, the Brightseed primitive hue scales.
 *
 * Layer 1 of the 2-layer token system (primitives → semantics).
 * Each scale runs 50→950. Component code references SEMANTIC tokens, never
 * these primitives directly, this page is the reference for what the raw
 * scales contain.
 *
 * Swatches render from the live --p-color-{scale}-{step} tokens (defined in
 * tokens/primitives.css via the bridge), and each hex label is read back from
 * the rendered swatch, so the swatch and its label can never drift, and the
 * page updates automatically if a token value changes.
 *
 * Layout mirrors the v2 Figma "UI Color Scales" board (28498:7764). Labels are
 * functional; brand-origin names (Deep Forest, Chlorophyll, Garlic Bloom, …)
 * are intentionally omitted here per the "no brand-poetic names in code"
 * decision.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Foundations/Color Scales",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

type Scale = {
  key: string; // token slug → --p-color-{key}-{step}
  label: string;
  desc: string;
  steps?: readonly number[]; // override default STEPS for scales with half-steps (e.g. forest-550)
  notes?: Record<number, string>;
};

/* Order + descriptors mirror the Figma board, using functional language. */
const SCALES: Scale[] = [
  { key: "sand", label: "Sand", desc: "Warm neutral surface", notes: { 50: "Surface anchor" } },
  {
    key: "forest",
    label: "Forest",
    desc: "Brand green",
    steps: [50, 100, 200, 300, 400, 500, 550, 600, 700, 800, 900, 950],
    notes: { 550: "Linktext hover", 800: "Linktext default", 900: "Brand surface" },
  },
  {
    key: "lime",
    label: "Lime",
    desc: "Brand action green",
    notes: { 300: "Action · default", 400: "Action · hover", 500: "Action · pressed" },
  },
  {
    key: "cyan",
    label: "Cyan",
    desc: "Informational",
    notes: { 500: "Fill", 600: ">3:1 on Sand", 700: "AA on Sand ✓" },
  },
  { key: "blue", label: "Blue", desc: "Informational", notes: { 900: "Info anchor" } },
  {
    key: "yellow",
    label: "Yellow",
    desc: "Warning / caution",
    notes: { 500: "Warning fill", 700: "AA on Sand ✓" },
  },
  { key: "orange", label: "Orange", desc: "Accent", notes: { 500: "Accent anchor" } },
  {
    key: "red",
    label: "Red",
    desc: "Error & critical",
    notes: { 500: "Error fill", 600: "AA on Sand ✓" },
  },
  {
    key: "lavender",
    label: "Lavender",
    desc: "Extended violet",
    notes: { 500: "More violet", 700: "AA on Sand ✓" },
  },
  { key: "orchid", label: "Orchid", desc: "Pink-mauve / data viz", notes: { 700: "Brand anchor" } },
];

/** Convert "rgb(r, g, b)" / "rgba(...)" → "#rrggbb". */
function rgbToHex(rgb: string): string {
  const m = rgb.match(/\d+(\.\d+)?/g);
  if (!m || m.length < 3) return rgb;
  return (
    "#" +
    m
      .slice(0, 3)
      .map((n) => Math.round(Number(n)).toString(16).padStart(2, "0"))
      .join("")
  );
}

function Swatch({
  scaleKey,
  step,
  note,
}: {
  scaleKey: string;
  step: number;
  note?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [hex, setHex] = React.useState("");
  React.useEffect(() => {
    if (ref.current) setHex(rgbToHex(getComputedStyle(ref.current).backgroundColor));
  }, []);
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div
        ref={ref}
        className="h-14 rounded-md border border-[var(--ds-color-border-subtle)]"
        style={{ backgroundColor: `var(--p-color-${scaleKey}-${step})` }}
      />
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] font-medium text-[var(--ds-color-text-default)]">{step}</span>
        <span className="font-mono text-[10px] text-[var(--ds-color-text-subtle)]">{hex}</span>
        {note && (
          <span className="mt-0.5 text-[10px] text-[var(--ds-color-text-subtle)]">{note}</span>
        )}
      </div>
    </div>
  );
}

function ScaleRow({ scale }: { scale: Scale }) {
  const steps = scale.steps ?? STEPS;
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <h3
          className="text-sm font-semibold"
          style={{ color: `var(--p-color-${scale.key}-700)` }}
        >
          {scale.label}
        </h3>
        <span className="text-sm text-[var(--ds-color-text-subtle)]">/ {scale.desc}</span>
        <span className="font-mono text-[11px] text-[var(--ds-color-text-subtle)]">
          --p-color-{scale.key}-*
        </span>
      </div>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((s) => (
          <Swatch key={s} scaleKey={scale.key} step={s} note={scale.notes?.[s]} />
        ))}
      </div>
    </section>
  );
}

export const Scales: Story = {
  render: () => (
    <div className="flex flex-col gap-9 p-8">
      <header className="flex flex-col gap-2">
        <h2
          className="text-[var(--ds-color-text-default)]"
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "2.5rem",
            lineHeight: 1.1,
            letterSpacing: "-0.015em",
          }}
        >
          Color Scales
        </h2>
        <p className="max-w-prose text-sm text-[var(--ds-color-text-subtle)]">
          The Brightseed primitive hue scales, Layer 1 of the token system
          (primitives → semantics). Each scale runs 50→950. Component
          code references semantic tokens, never these primitives directly. Token
          pattern: <code className="font-mono text-xs">--p-color-{`{scale}`}-{`{step}`}</code>.
        </p>
      </header>
      {SCALES.map((scale) => (
        <ScaleRow key={scale.key} scale={scale} />
      ))}
    </div>
  ),
};
