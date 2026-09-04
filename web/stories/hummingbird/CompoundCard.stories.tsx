import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CompoundCard } from "@/components/hummingbird/cards/compound-card";
import { CardGrid } from "@/components/hummingbird/card-grid";

/* ─────────────────────────────────────────────────────────────────────────
 * CompoundCard, Hummingbird Compounds view.
 *
 * SUPERSEDED for the discovery flow (Sept 2026): compounds are now triaged in
 * the formulation stage's table (WORK IN PROGRESS/Project Flow). Kept for
 * reference until Becky rules on retiring the card surfaces.
 *
 * Rebuilt June 2026 on the StrategyCard shell from the Figma "Card/compound"
 * set (Collab Playground, node 42:1328). Lives under WORK IN PROGRESS until
 * Becky promotes it to Components/Cards (root CLAUDE.md rule 10).
 *
 * Three types (predicted / single / combo) drive the header glyph and the
 * footer score. Samples and Targets are clickable, overflow into "+N more".
 * Evidence shows at most one tag (clinical beats animal).
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "WORK IN PROGRESS/Compound Card",
  component: CompoundCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "inline-radio",
      options: ["predicted", "single", "combo"],
    },
    evidence: {
      control: "inline-radio",
      options: ["none", "animal", "clinical"],
    },
    score: { control: { type: "range", min: 0, max: 1, step: 0.01 } },
    onSelect: { action: "select" },
    onFavorite: { action: "favorite" },
  },
  decorators: [
    // Single-card stories sit in a 360px column so they read at real width.
    // Grid stories opt out by setting parameters.layout = "fullscreen", otherwise
    // the 360px cap would collapse the grid to a single column.
    (Story, context) =>
      context.parameters.layout === "fullscreen" ? (
        <Story />
      ) : (
        <div style={{ maxWidth: 360 }}>
          <Story />
        </div>
      ),
  ],
} satisfies Meta<typeof CompoundCard>;

export default meta;
type Story = StoryObj<typeof meta>;
// Gallery stories build their own set of cards, so there is no single instance
// for args to describe. They opt out of the args contract.
type GalleryStory = StoryObj;

// ─── The three types ─────────────────────────────────────────────────────────

export const Predicted: Story = {
  args: {
    type: "predicted",
    name: "Carvacrol",
    mechanism:
      "Selectively inhibits methanogens & gram-positive bacteria; enriches Prevotella spp.",
    samples: ["ERD250174", "ERD250175"],
    targets: ["IGF-1R", "PI3K", "Akt", "Ras", "Raf"],
    evidence: "clinical",
    score: 0.85,
  },
};

export const Single: Story = {
  args: {
    type: "single",
    name: "Cinnamaldehyde",
    mechanism:
      "Inhibits hyper-ammonia producing bacteria; shifts toward propionate production.",
    samples: ["ERD250174", "ERD250175", "ERD250176"],
    targets: ["MUC2", "TFF3", "ZO-1", "Claudin-1"],
    evidence: "animal",
    score: 0.85,
    sparkline: [0.9, 0.45, 0.3],
  },
};

export const Combo: Story = {
  args: {
    type: "combo",
    name: "Trans-anethole",
    mechanism: "Modulates Firmicutes:Bacteroidetes ratio.",
    samples: ["ERD250174", "ERD250175", "ERD250176", "ERD250177", "ERD250178"],
    targets: ["NF-kB", "HIF-1α", "Akt", "ZO-1", "MUC2"],
    evidence: "clinical",
    score: 0.85,
    sparkline: [0.9, 0.45, 0.3, 1, 1],
  },
};

// ─── Empty states (height must NOT collapse) ─────────────────────────────────

export const NoSamples: Story = {
  args: {
    ...Single.args,
    samples: [],
  },
};

export const NoTargets: Story = {
  args: {
    ...Single.args,
    targets: [],
  },
};

export const NoEvidence: Story = {
  args: {
    ...Single.args,
    evidence: "none",
  },
};

export const NoScore: Story = {
  args: {
    ...Single.args,
    score: undefined,
  },
};

// ─── Overflow ────────────────────────────────────────────────────────────────

export const ManySamples: Story = {
  name: "Samples overflow (4+ shows two)",
  args: {
    ...Single.args,
    samples: [
      "ERD250174",
      "ERD250175",
      "ERD250176",
      "ERD250177",
      "ERD250178",
      "ERD250179",
      "ERD250180",
    ],
  },
};

export const ManyTargets: Story = {
  name: "Targets overflow (width-based)",
  args: {
    ...Single.args,
    targets: [
      "IGF-1R",
      "PI3K",
      "Akt",
      "Ras",
      "Raf",
      "NF-kB",
      "HIF-1α",
      "ZO-1",
      "MUC2",
      "TFF3",
    ],
  },
};

export const Favorited: Story = {
  args: {
    ...Combo.args,
    isFavorited: true,
  },
};

// ─── Responsive grid: how cards grow and shrink ──────────────────────────────
// Column width is the grid's responsibility (cards are w-full min-w-0). This
// grid uses auto-fill with a min AND max track:
//   repeat(auto-fill, minmax(300px, 420px))
// so cards never shrink below 300px (footer "BIOACTIVITY PREDICTION" stays on
// one line) and never stretch past 420px (Figma's native card width). Resize the
// Storybook canvas / browser to watch columns reflow.

const GRID_CARDS = [
  {
    type: "predicted" as const,
    name: "Carvacrol",
    mechanism:
      "Selectively inhibits methanogens & gram-positive bacteria; enriches Prevotella spp.",
    samples: ["ERD250174", "ERD250175"],
    targets: ["IGF-1R", "PI3K", "Akt", "Ras", "Raf"],
    evidence: "clinical" as const,
    score: 0.85,
  },
  {
    type: "single" as const,
    name: "Cinnamaldehyde",
    mechanism:
      "Inhibits hyper-ammonia producing bacteria; shifts toward propionate production.",
    samples: ["ERD250174", "ERD250175", "ERD250176"],
    targets: ["MUC2", "TFF3", "ZO-1", "Claudin-1"],
    evidence: "animal" as const,
    score: 0.72,
    sparkline: [0.9, 0.45, 0.3],
  },
  {
    type: "combo" as const,
    name: "Trans-anethole",
    mechanism: "Modulates Firmicutes:Bacteroidetes ratio.",
    samples: ["ERD250174", "ERD250175", "ERD250176", "ERD250177", "ERD250178"],
    targets: ["NF-kB", "HIF-1α", "Akt", "ZO-1", "MUC2", "TFF3", "PI3K"],
    evidence: "clinical" as const,
    score: 0.91,
    sparkline: [1, 0.5, 0.35, 0.9, 0.8],
  },
  {
    type: "single" as const,
    name: "Eugenol",
    mechanism: "Broad antimicrobial; dampens NF-kB driven inflammation.",
    samples: ["ERD250181"],
    targets: ["TLR4", "NF-kB", "iNOS"],
    evidence: "none" as const,
    score: 0.64,
    sparkline: [0.7, 0.4, 0.25],
  },
  {
    type: "predicted" as const,
    name: "Thymol",
    mechanism: "Predicted modulator of gut barrier integrity.",
    samples: [],
    targets: ["Nrf2", "HO-1", "Keap1"],
    evidence: "none" as const,
    score: 0.58,
  },
  {
    type: "combo" as const,
    name: "Berberine",
    mechanism:
      "AMPK activation; reshapes bile acid pool and short-chain fatty acid output.",
    samples: ["ERD250190", "ERD250191", "ERD250192", "ERD250193"],
    targets: ["AMPK", "PCSK9", "FXR", "SREBP-1c", "GLUT4", "PPARγ"],
    evidence: "clinical" as const,
    score: 0.88,
    sparkline: [0.95, 0.6, 0.4, 1, 0.7],
  },
];

export const ResponsiveGrid: GalleryStory = {
  name: "Responsive grid (CardGrid, 300 / 420)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ padding: 24 }}>
      <CardGrid>
        {GRID_CARDS.map((c) => (
          <CompoundCard key={c.name} {...c} />
        ))}
      </CardGrid>
    </div>
  ),
};

// ─── Fixed-height check: mixed content, same height ──────────────────────────

export const HeightConsistency: GalleryStory = {
  name: "Height consistency (grid)",
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ padding: 24 }}>
      <CardGrid>
      <CompoundCard
        type="predicted"
        name="Carvacrol"
        mechanism="Selectively inhibits methanogens & gram-positive bacteria."
        samples={["ERD250174"]}
        targets={["IGF-1R", "PI3K"]}
        evidence="clinical"
        score={0.85}
      />
      <CompoundCard
        type="single"
        name="Compound with no samples and no targets at all"
        mechanism="Short mechanism."
        samples={[]}
        targets={[]}
        evidence="none"
        score={0.72}
      />
      <CompoundCard
        type="combo"
        name="Trans-anethole"
        mechanism="Modulates Firmicutes:Bacteroidetes ratio across a long multi-line mechanism description that clamps."
        samples={["ERD250174", "ERD250175", "ERD250176", "ERD250177"]}
        targets={["NF-kB", "HIF-1α", "Akt", "ZO-1", "MUC2", "TFF3", "PI3K"]}
        evidence="animal"
        score={0.91}
        sparkline={[1, 0.5, 0.35, 0.9, 0.8]}
      />
      </CardGrid>
    </div>
  ),
};
