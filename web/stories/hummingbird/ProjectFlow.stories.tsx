import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { http, HttpResponse, delay } from "msw";
import { Building2, FlaskConical, Sprout } from "lucide-react";

import type { SettingsAccount, SettingsUser } from "@/components/quill/settings-modal";
import type { Team } from "@/components/quill/team-switcher";
import { ProjectStage } from "@/components/hummingbird/project/project-stage";
import { StrategiesStage } from "@/components/hummingbird/project/strategies-stage";
import type { ProjectMember } from "@/components/hummingbird/project/project-header";
import {
  FormulationStage,
  formulationSurvivors,
  type FormulationData,
} from "@/components/hummingbird/project/formulation-stage";
import { ExperimentStage } from "@/components/hummingbird/project/experiment-stage";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import type { TriageState } from "@/lib/triage";
import { useResource } from "@/hooks/use-resource";
import {
  getProjectStrategies,
  getStrategyCombinations,
  getStrategyCompounds,
  getStrategyPredictedCompounds,
  getStrategySources,
} from "@/lib/api";
import {
  COMBINATIONS,
  COMPOUND_CANDIDATES,
  COMPOUND_ELIMINATED,
  PREDICTED_COMPOUNDS,
  PROJECT_VIRAL,
  SOURCE_CANDIDATES,
  SOURCE_ELIMINATED,
  STRATEGIES_VIRAL,
  type ProjectStrategy,
} from "@/components/hummingbird/project-data";

/* ─────────────────────────────────────────────────────────────────────────
 * Project flow — business goal → strategies → formulation plan.
 *
 * The spine, walkable. Start on the strategies table, narrow the five down to
 * one or two, and the stage bar unlocks the way into that strategy's
 * formulation plan. The breadcrumb is the spine made visible, and clicking the
 * project name is the way back up.
 *
 * The thing to look at is the CONVERGENCE, which is the problem this whole
 * direction exists to fix: the counts line says how many strategies there are,
 * how many you have ruled on, and how many are still live — and "reviewed"
 * counts only YOUR decisions, never the model's own starting split.
 *
 * Deliberately counts and not a progress bar: strategies compete rather than
 * queue, so a percent-complete bar would misread the model (DESIGN.md).
 *
 * WORK IN PROGRESS until Becky promotes it (root CLAUDE.md rule 10).
 * ───────────────────────────────────────────────────────────────────────── */

const TEAMS: Team[] = [
  { name: "Instance 1", logo: Sprout, plan: "Enterprise" },
  { name: "Instance 2", logo: FlaskConical, plan: "Enterprise" },
  { name: "Instance 3", logo: Building2, plan: "Trial" },
];

const ACCOUNT: SettingsAccount = {
  organization: "Brightseed",
  healthAreas: "All areas",
  licenseExpires: "Sep 11, 2026",
  teams: ["Instance 1", "Instance 2", "Instance 3"],
};

const USER: SettingsUser = {
  name: "becky",
  email: "becky@buckupconsulting.com",
  emailVerified: true,
  memberSince: "Jul 13, 2026",
  color: "blue",
  icon: "leafy-green",
};

const MEMBERS: ProjectMember[] = [
  { id: "ch", name: "Chris Hall", color: "orange", icon: "wheat" },
  { id: "jm", name: "Jing Meng", color: "cyan", icon: "flower" },
  { id: "am", name: "Anna Marks", color: "orchid", icon: "hop" },
  { id: "bb", name: "Becky Buck", color: "blue", icon: "leafy-green" },
];

const REFERENCES = (
  <a href="#references" className="underline underline-offset-2">
    {PROJECT_VIRAL.referencesLabel}
  </a>
);

const PROJECT = {
  name: PROJECT_VIRAL.name,
  goal: PROJECT_VIRAL.goal,
  constraints: PROJECT_VIRAL.constraints,
  references: REFERENCES,
};

// ── The flow ───────────────────────────────────────────────────────────────

const FIXTURE_FORMULATION: FormulationData = {
  compounds: { candidates: COMPOUND_CANDIDATES, eliminated: COMPOUND_ELIMINATED },
  predicted: PREDICTED_COMPOUNDS.slice(0, 10),
  sources: { candidates: SOURCE_CANDIDATES, eliminated: SOURCE_ELIMINATED },
  combinations: COMBINATIONS,
  referencesLabel: REFERENCES,
};

function ProjectFlowHost({
  strategies,
  formulation,
  status,
}: {
  strategies?: ProjectStrategy[];
  formulation?: FormulationData;
  status?: React.ReactNode;
}) {
  const [openStrategy, setOpenStrategy] = React.useState<ProjectStrategy | null>(null);
  /* Lifted above the stage switch: StrategiesStage unmounts when you drill in,
   * so state held inside it would discard every decision on the way back. */
  const [strategyTriage, setStrategyTriage] = React.useState<TriageState>({});
  /* Both formulation sets are lifted for the same reason as the strategies:
   * switching stages unmounts them, and decisions must survive the round trip. */
  const [compoundTriage, setCompoundTriage] = React.useState<TriageState>({});
  const [sourceTriage, setSourceTriage] = React.useState<TriageState>({});
  const [mixtureTriage, setMixtureTriage] = React.useState<TriageState>({});
  const [onExperiment, setOnExperiment] = React.useState(false);

  const crumbs = openStrategy
    ? onExperiment
      ? [
          { label: openStrategy.name, onNavigate: () => setOnExperiment(false) },
          { label: "Experiment plan" },
        ]
      : [{ label: openStrategy.name }]
    : [];

  return (
    <ProjectStage
      user={USER}
      account={ACCOUNT}
      version="0.1.0"
      teams={TEAMS}
      activeTeam={TEAMS[0]}
      project={PROJECT}
      members={MEMBERS}
      crumbs={crumbs}
      stageKey={
        onExperiment ? "experiment" : openStrategy ? openStrategy.id : "strategies"
      }
      onNavigateProject={() => {
        setOnExperiment(false);
        setOpenStrategy(null);
      }}
      onAddMember={() => {}}
    >
      {status ??
        (openStrategy ? (
          !formulation ? (
            /* Explicitly NOT a fixture fallback — showing seeded data here would
             * be indistinguishable from real data that failed to arrive. */
            <div className="flex flex-1 items-center justify-center">
              <Spinner className="size-5 text-[var(--ds-color-icon-subtle)]" />
              <span className="sr-only">Loading formulation plan</span>
            </div>
          ) : onExperiment ? (
            <ExperimentStage
              strategy={openStrategy}
              {...formulationSurvivors(formulation, {
                compounds: compoundTriage,
                sources: sourceTriage,
                mixture: mixtureTriage,
              })}
              onBack={() => setOnExperiment(false)}
            />
          ) : (
          <FormulationStage
            data={formulation}
            compoundState={compoundTriage}
            onCompoundStateChange={setCompoundTriage}
            sourceState={sourceTriage}
            onSourceStateChange={setSourceTriage}
            mixtureState={mixtureTriage}
            onMixtureStateChange={setMixtureTriage}
            onBuildExperiment={() => setOnExperiment(true)}
          />
          )
        ) : (
          <StrategiesStage
            strategies={strategies!}
            state={strategyTriage}
            onStateChange={setStrategyTriage}
            /* The decision is the hand-off: what survived scopes the next stage. */
            onExplore={(survivors) => setOpenStrategy(survivors[0] ?? null)}
          />
        ))}
    </ProjectStage>
  );
}

const meta = {
  title: "WORK IN PROGRESS/Project Flow",
  component: ProjectFlowHost,
  parameters: { layout: "fullscreen", previewPadding: false },
} satisfies Meta<typeof ProjectFlowHost>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Eliminate strategies until one or two remain, then "Explore formulations"
 * unlocks. The counts open at 0 reviewed — nothing has been ruled on yet.
 */
export const Default: Story = {
  args: { strategies: STRATEGIES_VIRAL, formulation: FIXTURE_FORMULATION },
};

export const Dark: Story = {
  args: { strategies: STRATEGIES_VIRAL, formulation: FIXTURE_FORMULATION },
  globals: { theme: "dark" },
};

// ── Connected ──────────────────────────────────────────────────────────────

function ConnectedHost() {
  const strategies = useResource(() => getProjectStrategies(PROJECT_VIRAL.id), []);
  /* All four formulation reads fire together. They are independent endpoints,
   * so one slow tab should not gate the others once the stage is open. */
  const STRATEGY_ID = "fusion-polymerase";
  const compounds = useResource(() => getStrategyCompounds(STRATEGY_ID), []);
  const predicted = useResource(() => getStrategyPredictedCompounds(STRATEGY_ID), []);
  const sources = useResource(() => getStrategySources(STRATEGY_ID), []);
  const combinations = useResource(() => getStrategyCombinations(STRATEGY_ID), []);

  const formulation: FormulationData | undefined =
    compounds.data && predicted.data && sources.data && combinations.data
      ? {
          compounds: compounds.data,
          predicted: predicted.data,
          sources: sources.data,
          combinations: combinations.data,
          referencesLabel: REFERENCES,
        }
      : undefined;

  if (strategies.error) {
    return (
      <ProjectFlowHost
        status={
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <p className="text-sm text-[var(--ds-color-text-subtle)]">
              Could not load this project&apos;s strategies.
            </p>
            <Button variant="secondary" onClick={strategies.reload}>
              Try again
            </Button>
          </div>
        }
      />
    );
  }

  if (strategies.loading || !strategies.data) {
    return (
      <ProjectFlowHost
        status={
          <div className="flex flex-1 items-center justify-center">
            <Spinner className="size-5 text-[var(--ds-color-icon-subtle)]" />
            <span className="sr-only">Loading strategies</span>
          </div>
        }
      />
    );
  }

  return <ProjectFlowHost strategies={strategies.data} formulation={formulation} />;
}

export const Connected: Story = {
  render: () => <ConnectedHost />,
};

export const ConnectedLoading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/projects/:id/strategies", async () => {
          await delay("infinite");
          return HttpResponse.json([]);
        }),
      ],
    },
  },
  render: () => <ConnectedHost />,
};

export const ConnectedError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get(
          "/api/projects/:id/strategies",
          () => new HttpResponse(null, { status: 500 }),
        ),
      ],
    },
  },
  render: () => <ConnectedHost />,
};

/** No strategies yet — the empty state the table falls back to. */
export const NoStrategies: Story = {
  args: { strategies: [], formulation: FIXTURE_FORMULATION },
};
