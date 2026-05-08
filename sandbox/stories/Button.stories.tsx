import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────────────────────────────────
 * Button stories — parity with Figma "Components - Quill" (26465:249160).
 *
 * The Quill matrix is the canonical doc-skeleton for the Brightseed Button:
 * rows = Variant × Size, columns = State (default / hover / focus / pressed /
 * disabled / loading). 5 filled variants × 10 sizes + linktext × 5 text sizes
 * = 55 rows × 6 cols = 330 cells.
 *
 * Every state cell uses real component output. Hover / focus / pressed /
 * disabled / loading are forced via the `data-force-state` attribute (or
 * the `disabled` / `loading` props), which the custom Tailwind variants in
 * sandbox/app/globals.css map to the same classes the live pseudo-classes do.
 * That means: what you see in the matrix is what users see when they
 * actually hover / focus / press the button.
 *
 * Light + dark modes are toggled via the Storybook toolbar's theme switch
 * (already wired to data-theme on <html>).
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "secondary",
        "outline",
        "ghost",
        "destructive",
        "linktext",
      ],
    },
    size: {
      control: { type: "select" },
      options: [
        "xs",
        "sm",
        "default",
        "lg",
        "xl",
        "icon-xs",
        "icon-sm",
        "icon",
        "icon-lg",
        "icon-xl",
      ],
    },
    loading: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Inline icon used throughout the stories ────────────────────────────── */
function PlusIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M8 3v10M3 8h10" />
    </svg>
  );
}

/* ───────────────────────────────────────────────────────────────────────
 * Spotlight stories — quick scans for individual aspects of the spec.
 * ─────────────────────────────────────────────────────────────────────── */

export const Default: Story = {
  args: { variant: "default", children: "Save compound" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Cancel" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Add note" },
};

export const Ghost: Story = {
  args: { variant: "ghost", children: "Filter" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Discard run" },
};

export const Linktext: Story = {
  args: { variant: "linktext", children: "View details" },
};

/* All six variants side-by-side at the default size — quickest visual diff
 * across light + dark mode. */
export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="linktext">Linktext</Button>
    </div>
  ),
};

/* All ten sizes of the default (lime) variant. Confirms the radius jump at
 * xl + icon-xl (--shape-radius-md → --shape-radius-4xl) and icon-only sizes
 * staying square. */
export const AllSizes: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="xs">XS</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra Large</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="icon-xs" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button size="icon-sm" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button size="icon" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button size="icon-lg" aria-label="Add">
          <PlusIcon />
        </Button>
        <Button size="icon-xl" aria-label="Add">
          <PlusIcon />
        </Button>
      </div>
    </div>
  ),
};

/* Six interaction states for the default variant. Useful for verifying the
 * lime ladder + forest text steps without scrolling the full matrix. */
export const States: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3">
      <span className="font-mono text-xs text-[var(--color-text-subtle)]">
        Default
      </span>
      <Button>Save compound</Button>

      <span className="font-mono text-xs text-[var(--color-text-subtle)]">
        Hover
      </span>
      <Button data-force-state="hover">Save compound</Button>

      <span className="font-mono text-xs text-[var(--color-text-subtle)]">
        Focus
      </span>
      <Button data-force-state="focus">Save compound</Button>

      <span className="font-mono text-xs text-[var(--color-text-subtle)]">
        Pressed
      </span>
      <Button data-force-state="active">Save compound</Button>

      <span className="font-mono text-xs text-[var(--color-text-subtle)]">
        Disabled
      </span>
      <Button disabled>Save compound</Button>

      <span className="font-mono text-xs text-[var(--color-text-subtle)]">
        Loading
      </span>
      <Button loading>Save compound</Button>
    </div>
  ),
};

/* Leading-icon convention: icon precedes text, gap follows the size's
 * --btn-gap value. Width-reservation pattern keeps the button stable on
 * hover even though SemiBold glyphs are wider than Medium. */
export const WithIcon: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <PlusIcon />
        New screen
      </Button>
      <Button variant="secondary">
        <PlusIcon />
        Add filter
      </Button>
      <Button variant="outline">
        <PlusIcon />
        Add column
      </Button>
      <Button variant="ghost">
        <PlusIcon />
        Save
      </Button>
      <Button variant="destructive">
        <PlusIcon />
        Remove
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading>Saving</Button>
      <Button variant="secondary" loading>
        Loading
      </Button>
      <Button variant="outline" loading>
        Fetching
      </Button>
      <Button variant="destructive" loading>
        Deleting
      </Button>
      <Button size="icon" loading aria-label="Loading" />
    </div>
  ),
};

/* ───────────────────────────────────────────────────────────────────────
 * Quill matrix — the canonical 330-cell parity grid.
 * Mirrors Figma node 26465:249160.
 * ─────────────────────────────────────────────────────────────────────── */

const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "linktext",
] as const;

const TEXT_SIZES = ["xs", "sm", "default", "lg", "xl"] as const;
const ICON_SIZES = [
  "icon-xs",
  "icon-sm",
  "icon",
  "icon-lg",
  "icon-xl",
] as const;
const ALL_SIZES = [...TEXT_SIZES, ...ICON_SIZES] as const;

type StateKey = "default" | "hover" | "focus" | "active" | "disabled" | "loading";
const STATES: Array<{ key: StateKey; label: string }> = [
  { key: "default", label: "Default" },
  { key: "hover", label: "Hover" },
  { key: "focus", label: "Focus" },
  { key: "active", label: "Pressed" },
  { key: "disabled", label: "Disabled" },
  { key: "loading", label: "Loading" },
];

type Variant = (typeof VARIANTS)[number];
type Size = (typeof ALL_SIZES)[number];

function QuillCell({
  variant,
  size,
  state,
}: {
  variant: Variant;
  size: Size;
  state: StateKey;
}) {
  const isIconSize = size.startsWith("icon");
  // linktext × icon-* doesn't exist in the Figma matrix — render a placeholder
  // so the grid alignment stays consistent.
  if (variant === "linktext" && isIconSize) {
    return (
      <div className="flex h-9 items-center justify-center text-xs text-[var(--color-text-subtle)]/40">
        —
      </div>
    );
  }

  const label = isIconSize ? null : "Save";
  const baseProps: React.ComponentProps<typeof Button> = { variant, size };

  if (state === "loading") {
    baseProps.loading = true;
  } else if (state === "disabled") {
    baseProps.disabled = true;
  } else if (state !== "default") {
    // hover / focus / active map directly to data-force-state values.
    (baseProps as Record<string, string>)["data-force-state"] = state;
  }

  return (
    <div className="flex items-center justify-center">
      <Button {...baseProps} aria-label={isIconSize ? "Save" : undefined}>
        {isIconSize ? <PlusIcon /> : (
          <>
            <PlusIcon />
            {label}
          </>
        )}
      </Button>
    </div>
  );
}

function QuillRow({ variant, size }: { variant: Variant; size: Size }) {
  return (
    <>
      <div className="flex items-center pl-2 font-mono text-xs text-[var(--color-text-subtle)]">
        {variant} / {size}
      </div>
      {STATES.map((state) => (
        <QuillCell
          key={`${variant}-${size}-${state.key}`}
          variant={variant}
          size={size}
          state={state.key}
        />
      ))}
    </>
  );
}

function QuillVariantSection({ variant }: { variant: Variant }) {
  // linktext skips icon sizes per Figma matrix (not just rendered as "—",
  // those rows aren't present at all).
  const sizes =
    variant === "linktext" ? TEXT_SIZES : ALL_SIZES;

  return (
    <section className="mb-12">
      <h3 className="mb-4 border-b border-[var(--color-border-subtle)] pb-1 font-mono text-sm font-semibold uppercase tracking-wide text-[var(--color-text-default)]">
        {variant}
      </h3>
      <div
        className="grid items-center gap-y-4"
        style={{
          gridTemplateColumns: "minmax(160px, 200px) repeat(6, minmax(140px, 1fr))",
          columnGap: "1rem",
        }}
      >
        {/* Header row */}
        <div />
        {STATES.map((state) => (
          <div
            key={state.key}
            className="font-mono text-xs uppercase tracking-wide text-[var(--color-text-subtle)]"
          >
            {state.label}
          </div>
        ))}
        {/* Body rows */}
        {sizes.map((size) => (
          <QuillRow
            key={`${variant}-${size}`}
            variant={variant}
            size={size as Size}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Full 330-cell matrix. Mirrors Figma "Components - Quill" doc-skeleton.
 * Toggle the theme in the Storybook toolbar to verify dark-mode parity.
 */
export const QuillMatrix: Story = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Canonical 330-cell parity matrix. Rows: variant × size. Columns: state. Mirrors Figma node 26465:249160.",
      },
    },
  },
  render: () => (
    <div className="bg-[var(--color-surface-default)] p-8 text-[var(--color-text-default)]">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">Button — Quill matrix</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-subtle)]">
          Every variant × size × state combination in the system. Toggle the
          theme switch in the toolbar to verify dark-mode parity. Hover / focus /
          pressed states are forced via data-force-state and use the same classes
          a real interaction triggers.
        </p>
      </header>
      {VARIANTS.map((variant) => (
        <QuillVariantSection key={variant} variant={variant} />
      ))}
    </div>
  ),
};
