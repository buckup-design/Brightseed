import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Plus, X } from "lucide-react";

import { DataTable, textColumns } from "@/components/ui/data-table";
import { ResultTableCard } from "@/components/hummingbird/tables/result-table-card";
import {
  combinationColumns,
  compoundEvidenceColumns,
  naturalSourceColumns,
  predictedCompoundColumns,
  sourceMeterMax,
} from "@/components/hummingbird/tables/columns";
import { useTriage } from "@/hooks/use-triage";
import {
  COMBINATIONS,
  COMPOUND_CANDIDATES,
  COMPOUND_ELIMINATED,
  COMPOUND_REFERENCES_LABEL,
  PREDICTED_COMPOUNDS,
  SOURCE_CANDIDATES,
  MATRIX_COMPOUNDS,
  SOURCE_ELIMINATED,
  type EvidencedCompound,
} from "@/components/hummingbird/project-data";

/* ─────────────────────────────────────────────────────────────────────────
 * DataTable — the discovery flow's table engine.
 *
 * Hummingbird's new direction moves off result CARDS onto dense, evidence-
 * bearing tables, and no two of them share a shape. These stories are the
 * proof that one engine serves all of them: the same component renders a
 * grouped triage list, a ranked list, a wide presence matrix, a mono-
 * identifier table, and a bare string matrix out of chat.
 *
 * The data is the real viral-infection dataset, transcribed out of Anna's
 * 8-28-26 prototype — including the awkward parts (tri-state GRAS, missing
 * common names, bioavailability as a range string with a footnote marker),
 * because those are what the engine has to survive.
 *
 * WORK IN PROGRESS until Becky promotes it (root CLAUDE.md rule 10).
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "WORK IN PROGRESS/Data Table",
  component: DataTable,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DataTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const REFERENCES = (
  <a href="#references" className="underline underline-offset-2">
    {COMPOUND_REFERENCES_LABEL}
  </a>
);

/**
 * Variant A — the compounds table. Fixed columns, two groups, and a row action
 * that differs per group: eliminate on one, restore on the other.
 */
export const Compounds: Story = {
  render: () => (
    <ResultTableCard title="Compounds with direct evidence" references={REFERENCES}>
      <DataTable
        ariaLabel="Compounds with direct evidence"
        columns={compoundEvidenceColumns()}
        getRowId={(row: EvidencedCompound) => row.id}
        groups={[
          {
            id: "candidates",
            label: "Candidates",
            showCount: true,
            rows: COMPOUND_CANDIDATES,
            action: {
              icon: X,
              label: (row) => `Eliminate ${row.compoundName}`,
              onAction: () => {},
            },
          },
          {
            id: "eliminated",
            label: "Eliminated",
            showCount: true,
            tone: "muted",
            rows: COMPOUND_ELIMINATED,
            emptyLabel: "Nothing eliminated yet.",
            action: {
              icon: Plus,
              label: (row) => `Restore ${row.compoundName}`,
              onAction: () => {},
            },
          },
        ]}
      />
    </ResultTableCard>
  ),
};

/**
 * The human-in-the-loop move, live. Rows move between groups and the counts
 * update — driven by useTriage, with the table holding no state of its own.
 *
 * Note the counts line is words, not a progress bar: strategies and compounds
 * compete rather than queue, so a percent-complete bar would misread the model
 * (DESIGN.md, Domain notes).
 */
export const GroupMove: Story = {
  render: function GroupMoveStory() {
    const all = React.useMemo(
      () => [...COMPOUND_CANDIDATES, ...COMPOUND_ELIMINATED],
      [],
    );
    const eliminatedIds = React.useMemo(
      () => new Set(COMPOUND_ELIMINATED.map((row) => row.id)),
      [],
    );

    const triage = useTriage(all, (row) => row.id, {
      // The model ships its own starting split; a user verdict overrides it.
      initial: (row) => (eliminatedIds.has(row.id) ? "eliminated" : undefined),
    });

    return (
      <ResultTableCard
        title="Compounds with direct evidence"
        description={triage.summary("compound")}
        references={REFERENCES}
      >
        <DataTable
          ariaLabel="Compounds with direct evidence"
          columns={compoundEvidenceColumns()}
          getRowId={(row: EvidencedCompound) => row.id}
          groups={[
            {
              id: "candidates",
              label: "Candidates",
              showCount: true,
              rows: triage.partition.inConsideration,
              emptyLabel: "Every compound has been eliminated.",
              action: {
                icon: X,
                label: (row) => `Eliminate ${row.compoundName}`,
                onAction: triage.eliminate,
                announce: (row) => `${row.compoundName} moved to Eliminated`,
              },
            },
            {
              id: "eliminated",
              label: "Eliminated",
              showCount: true,
              tone: "muted",
              rows: triage.partition.eliminated,
              emptyLabel: "Nothing eliminated yet.",
              action: {
                icon: Plus,
                label: (row) => `Restore ${row.compoundName}`,
                onAction: triage.restore,
                announce: (row) => `${row.compoundName} moved back to Candidates`,
              },
            },
          ]}
        />
      </ResultTableCard>
    );
  },
};

/** Variant B — ranked, with an icon+text status cell. */
export const Combinations: Story = {
  render: () => (
    <ResultTableCard eyebrow="Best combinations — include all 5 selected compounds">
      <DataTable
        ariaLabel="Best combinations"
        columns={combinationColumns()}
        getRowId={(row) => row.id}
        rows={COMBINATIONS}
      />
    </ResultTableCard>
  ),
};

/**
 * Variant C — the wide matrix, and the engine's real test. Its middle columns
 * are generated from the compounds kept in the previous stage, so the column set
 * is data. The first column pins while the rest scroll horizontally.
 */
export const NaturalSources: Story = {
  render: () => (
    <ResultTableCard
      eyebrow="Natural sources"
      footnote="† GRAS status pending review."
    >
      <DataTable
        ariaLabel="Natural sources"
        columns={naturalSourceColumns(
          MATRIX_COMPOUNDS,
          sourceMeterMax(SOURCE_CANDIDATES, SOURCE_ELIMINATED),
        )}
        getRowId={(row) => row.id}
        groups={[
          {
            id: "candidates",
            label: "Candidates",
            showCount: true,
            rows: SOURCE_CANDIDATES,
            action: {
              icon: X,
              label: (row) => `Eliminate ${row.scientificName}`,
              onAction: () => {},
            },
          },
          {
            id: "eliminated",
            label: "Eliminated",
            showCount: true,
            tone: "muted",
            rows: SOURCE_ELIMINATED,
            action: {
              icon: Plus,
              label: (row) => `Restore ${row.scientificName}`,
              onAction: () => {},
            },
          },
        ]}
      />
    </ResultTableCard>
  ),
};

/**
 * A narrow viewport for the same matrix, to prove the table scrolls inside its
 * own container and the page never scrolls sideways.
 */
export const WideMatrixConstrained: Story = {
  render: () => (
    <div className="max-w-xl">
      <ResultTableCard eyebrow="Natural sources" footnote="† GRAS status pending review.">
        <DataTable
          ariaLabel="Natural sources"
          columns={naturalSourceColumns(
            MATRIX_COMPOUNDS,
            sourceMeterMax(SOURCE_CANDIDATES),
          )}
          getRowId={(row) => row.id}
          rows={SOURCE_CANDIDATES.slice(0, 5)}
        />
      </ResultTableCard>
    </div>
  ),
};

/** Variant D — mono identifiers, and bioavailability as a range string. */
export const PredictedCompounds: Story = {
  render: () => (
    <ResultTableCard
      title="Top predicted compounds"
      footnote="* Bioavailability estimated from a single model run."
    >
      <DataTable
        ariaLabel="Top predicted compounds"
        columns={predictedCompoundColumns()}
        getRowId={(row) => row.id}
        rows={PREDICTED_COMPOUNDS.slice(0, 10)}
      />
    </ResultTableCard>
  ),
};

/**
 * Variant E — the bare string matrix the chat transcript embeds. `textColumns`
 * absorbs it, so no second component exists for this shape.
 */
export const ChatMatrix: Story = {
  render: () => {
    const columns = ["Pathway", "Records", "Strength"];
    const rows = [
      ["Block viral entry or membrane fusion", "212", "Moderate"],
      ["Target viral replication enzymes", "184", "Strong"],
      ["Modulate inflammatory signaling", "301", "Moderate"],
      ["Regulate oxidative-stress and apoptosis", "96", "Weak"],
    ];
    return (
      <DataTable
        ariaLabel="Pathways under consideration"
        columns={textColumns(columns)}
        getRowId={(row) => row[0]}
        rows={rows}
      />
    );
  },
};

export const Loading: Story = {
  render: () => (
    <ResultTableCard title="Compounds with direct evidence">
      <DataTable
        ariaLabel="Compounds with direct evidence"
        columns={compoundEvidenceColumns()}
        getRowId={(row: EvidencedCompound) => row.id}
        rows={[]}
        loading
        loadingRows={5}
      />
    </ResultTableCard>
  ),
};

export const Empty: Story = {
  render: () => (
    <ResultTableCard title="Compounds with direct evidence">
      <DataTable
        ariaLabel="Compounds with direct evidence"
        columns={compoundEvidenceColumns()}
        getRowId={(row: EvidencedCompound) => row.id}
        rows={[]}
        empty="No compounds with direct evidence for this strategy yet."
      />
    </ResultTableCard>
  ),
};

/** Same components on the dark ladder — no dark-specific code exists. */
export const Dark: Story = {
  globals: { theme: "dark" },
  render: () => (
    <div className="flex flex-col gap-6">
      <ResultTableCard title="Compounds with direct evidence" references={REFERENCES}>
        <DataTable
          ariaLabel="Compounds with direct evidence"
          columns={compoundEvidenceColumns()}
          getRowId={(row: EvidencedCompound) => row.id}
          groups={[
            { id: "candidates", label: "Candidates", showCount: true, rows: COMPOUND_CANDIDATES },
            {
              id: "eliminated",
              label: "Eliminated",
              showCount: true,
              tone: "muted",
              rows: COMPOUND_ELIMINATED,
            },
          ]}
        />
      </ResultTableCard>
      <ResultTableCard eyebrow="Best combinations — include all 5 selected compounds">
        <DataTable
          ariaLabel="Best combinations"
          columns={combinationColumns()}
          getRowId={(row) => row.id}
          rows={COMBINATIONS}
        />
      </ResultTableCard>
    </div>
  ),
};
