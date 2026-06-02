import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CompoundCard } from "@/components/hummingbird/cards/compound-card";

/* ─────────────────────────────────────────────────────────────────────────
 * CompoundCard, Hummingbird Compounds view.
 * Source mock: anna's mocks 4-29-26/filtered to compounds.png
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Card - Compound",
  component: CompoundCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof CompoundCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: "Carvacrol",
    mechanism:
      "Selectively inhibits methanogens & gram-positive bacteria; enriches Prevotella spp.",
    linkedPlants: ["Origanum vulgare", "Thymus vulgaris"],
    bioactives: ["IGF-1R", "PI3K", "Akt", "Ras", "Raf"],
    bioactiveOverflow: 5,
    confidence: 85,
    category: "Animal, cow",
    ipLandscape: "watch",
  },
};

export const Cinnamaldehyde: Story = {
  args: {
    name: "Cinnamaldehyde",
    mechanism:
      "Inhibits hyper-ammonia producing bacteria; shifts toward propionate production.",
    linkedPlants: ["Cinnamomum spp."],
    bioactives: ["MUC2", "TFF3", "ZO-1", "Claudin-1"],
    bioactiveOverflow: 5,
    confidence: 85,
    category: "Animal, ruminants",
    ipLandscape: "watch",
  },
};

export const TransAnethole: Story = {
  args: {
    name: "Trans-anethole",
    mechanism: "Modulates Firmicutes:Bacteroidetes ratio.",
    linkedPlants: ["Foeniculum vulgare", "Illicium verum"],
    bioactives: ["NF-kB", "HIF-1α", "Akt", "ZO-1", "MUC2"],
    bioactiveOverflow: 6,
    confidence: 85,
    category: "Animal, cow",
    ipLandscape: "clear",
  },
};

export const Berberine: Story = {
  args: {
    name: "Berberine",
    mechanism:
      "Reduces rumen methanogenesis & shifts VFA profile towards propionate.",
    linkedPlants: ["Berberis spp.", "Hydrastis canadensis"],
    bioactives: ["MLCK", "HIF-1α", "Akt", "ZO-1"],
    bioactiveOverflow: 6,
    confidence: 85,
    category: "Animal, cow",
    ipLandscape: "watch",
  },
};

export const Grid: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl bg-[var(--ds-color-surface-alt)] p-6 rounded-lg">
      <CompoundCard
        name="Carvacrol"
        mechanism="Selectively inhibits methanogens & gram-positive bacteria; enriches Prevotella spp."
        linkedPlants={["Origanum vulgare", "Thymus vulgaris"]}
        bioactives={["IGF-1R", "PI3K", "Akt", "Ras", "Raf"]}
        bioactiveOverflow={5}
        confidence={85}
        category="Animal, cow"
      />
      <CompoundCard
        name="Cinnamaldehyde"
        mechanism="Inhibits hyper-ammonia producing bacteria; shifts toward propionate production."
        linkedPlants={["Cinnamomum spp."]}
        bioactives={["MUC2", "TFF3", "ZO-1", "Claudin-1"]}
        bioactiveOverflow={5}
        confidence={85}
        category="Animal, ruminants"
      />
      <CompoundCard
        name="Trans-anethole"
        mechanism="Modulates Firmicutes:Bacteroidetes ratio."
        linkedPlants={["Foeniculum vulgare", "Illicium verum"]}
        bioactives={["NF-kB", "HIF-1α", "Akt", "ZO-1", "MUC2"]}
        bioactiveOverflow={6}
        confidence={85}
        category="Animal, cow"
        ipLandscape="clear"
      />
      <CompoundCard
        name="Berberine"
        mechanism="Reduces rumen methanogenesis & shifts VFA profile towards propionate."
        linkedPlants={["Berberis spp.", "Hydrastis canadensis"]}
        bioactives={["MLCK", "HIF-1α", "Akt", "ZO-1"]}
        bioactiveOverflow={6}
        confidence={85}
        category="Animal, cow"
      />
    </div>
  ),
};

export const NoConfidence: Story = {
  args: {
    name: "Thymol",
    mechanism:
      "Rumen microbiome modulation, typically co-occurs with carvacrol.",
    linkedPlants: ["Thyme", "Oregano"],
    bioactives: ["NF-kB", "HIF-1α"],
    bioactiveOverflow: 4,
    category: "Animal, cow",
  },
};
