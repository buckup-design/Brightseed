import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PlantCard } from "@/components/forager/cards/plant-card";

/* ─────────────────────────────────────────────────────────────────────────
 * PlantCard — Forager Plants view.
 *
 * Source mock: anna's mocks 4-29-26/filtered to plants.png
 * Content shapes pulled from Anna's mocs; typography and hierarchy rebuilt
 * on Brightseed Quill tokens.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Forager/Cards/Plant Card",
  component: PlantCard,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof PlantCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    scientificName: "Foeniculum vulgare",
    commonName: "Fennel",
    strategyOneLiner: "Shifts rumen microbiome towards propionate producers.",
    evidence:
      "Transanethole modulates Firmicutes:Bacteroidetes ratio, while Fenchone, Limonene and Estragole reduce production of methane.",
    compounds: ["Transanethole", "Fenchone"],
    compoundOverflow: 2,
    bioactives: ["NF-kB", "HIF-1α", "Akt", "ZO-1", "MUC2"],
    bioactiveOverflow: 12,
    bioactivePotential: true,
    gras: true,
    ipLandscape: "watch",
  },
};

export const StarAnise: Story = {
  args: {
    scientificName: "Illicium verum",
    commonName: "Star Anise",
    strategyOneLiner: "Shifts rumen microbiome towards propionate producers.",
    evidence:
      "Transanethole modulates Firmicutes:Bacteroidetes ratio, while Estragole and alpha-pinene together reduce gram-positive bacteria.",
    compounds: ["Transanethole", "Estragole", "Alpha-pinene"],
    bioactives: ["MLCK", "HIF-1α", "Akt", "ZO-1"],
    bioactiveOverflow: 5,
    bioactivePotential: true,
    gras: true,
    ipLandscape: "watch",
  },
};

export const Grid: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl bg-[var(--color-surface-alt)] p-6 rounded-lg">
      <PlantCard
        scientificName="Foeniculum vulgare"
        commonName="Fennel"
        strategyOneLiner="Shifts rumen microbiome towards propionate producers."
        evidence="Transanethole modulates Firmicutes:Bacteroidetes ratio, while Fenchone, Limonene and Estragole reduce production of methane."
        compounds={["Transanethole", "Fenchone"]}
        compoundOverflow={2}
        bioactives={["NF-kB", "HIF-1α", "Akt", "ZO-1", "MUC2"]}
        bioactiveOverflow={12}
      />
      <PlantCard
        scientificName="Illicium verum"
        commonName="Star Anise"
        strategyOneLiner="Shifts rumen microbiome towards propionate producers."
        evidence="Transanethole modulates Firmicutes:Bacteroidetes ratio, while Estragole and alpha-pinene together reduce gram-positive bacteria."
        compounds={["Transanethole", "Estragole", "Alpha-pinene"]}
        bioactives={["MLCK", "HIF-1α", "Akt", "ZO-1"]}
        bioactiveOverflow={5}
      />
      <PlantCard
        scientificName="Pimpinella anisum"
        commonName="Anise"
        strategyOneLiner="Shifts rumen microbiome towards propionate producers."
        evidence="Transanethole modulates Firmicutes:Bacteroidetes ratio, while Pseudoisoeugenol is predicted to support shift in pH."
        compounds={["Transanethole", "Pseudoisoeugenol", "Anisaldehyde"]}
        bioactives={["MLCK", "HIF-1α", "Akt", "ZO-1", "MUC2"]}
        bioactiveOverflow={12}
      />
    </div>
  ),
};

export const NoBioactivePotential: Story = {
  args: {
    scientificName: "Allium sativum",
    commonName: "Garlic",
    strategyOneLiner:
      "Mild antimicrobial activity in vitro — insufficient evidence in rumen models.",
    evidence:
      "Allicin and diallyl disulfide show in vitro activity against gram-positive bacteria, but rumen-specific evidence is limited.",
    compounds: ["Allicin", "Diallyl disulfide"],
    bioactives: ["NF-kB", "Akt"],
    bioactiveOverflow: 3,
    bioactivePotential: false,
    gras: true,
    ipLandscape: "clear",
  },
};

export const IpClear: Story = {
  args: {
    ...((Default.args as object) ?? {}),
    scientificName: "Coriandrum sativum",
    commonName: "Coriander",
    ipLandscape: "clear",
  },
};
