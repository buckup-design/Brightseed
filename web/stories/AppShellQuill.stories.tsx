import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";

import {
  ArrowUp,
  ArrowUpDown,
  Building2,
  FileText,
  FlaskConical,
  Folder,
  ListFilter,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Sparkles,
  Sprout,
} from "lucide-react";

import { AppShellQuill } from "@/components/quill/app-shell-quill";
import type {
  Appearance,
  SettingsAccount,
  SettingsUser,
} from "@/components/quill/settings-modal";
import type { Team } from "@/components/quill/team-switcher";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";
import { Textarea } from "@/components/ui/textarea";

/* The instances, surfaced through the account menu's Teams row. Same names the
 * Account settings pane lists, so the two agree. */
const TEAMS: Team[] = [
  { name: "Instance 1", logo: Sprout, plan: "Enterprise" },
  { name: "Instance 2", logo: FlaskConical, plan: "Enterprise" },
  { name: "Instance 3", logo: Building2, plan: "Trial" },
];

/* ─────────────────────────────────────────────────────────────────────────
 * The Hummingbird app shell, assembled from Anna's proposal (Collab Playground
 * 88:1547). Successor to Blocks/App Shell 4 — open both side by side; App Shell
 * 4 retires once this one is signed off.
 *
 * Built on sidebar-alt1 (Becky, July 16 2026), so collapsing SWAPS two
 * compositions rather than morphing one. The rail is a designed artifact, not a
 * squeezed panel: labels, the wordmark and the account name are absent from it
 * rather than clipped inside it.
 *
 * What to look for:
 *   - Hover the nav to reveal the toggle. Expanded it sits right of the logo;
 *     collapsed it takes the logo's cell and the mark crossfades out. Cmd/Ctrl+B
 *     also toggles.
 *   - Watch the LABELS as it collapses, not the end state — nothing squeezes.
 *     Compare against Blocks/App Shell 4, which still morphs.
 *   - Footer menu: display name + kebab in the panel, avatar alone in the rail.
 *   - Settings opens the modal on Profile. Change the avatar or the name and it
 *     flows straight back to the footer trigger — one `user`, two surfaces.
 *   - Give feedback opens the feedback dialog.
 *   - Teams opens Settings > Account. See the [CONCERN] in app-shell-quill.tsx:
 *     the sketch never says what Teams should open, so this is a placeholder
 *     routing, not a decision.
 *   - Get help is intentionally inert ("will open jira ticket. ignore flow").
 * ───────────────────────────────────────────────────────────────────────── */

const ACCOUNT: SettingsAccount = {
  organization: "Brightseed",
  healthAreas: "All areas",
  licenseExpires: "Sep 11, 2026",
  teams: ["Instance 1", "Instance 2", "Instance 3"],
};

const INITIAL_USER: SettingsUser = {
  name: "becky",
  email: "becky@buckupconsulting.com",
  emailVerified: true,
  memberSince: "Jul 13, 2026",
  color: "blue",
  icon: "leafy-green",
};

/** The shell takes `user` and `activeItem` and hands changes back; the app owns
 * the store and the router. The story plays both parts so the settings
 * round-trip and the nav are actually exercisable rather than inert. */
function ShellHost() {
  const [user, setUser] = React.useState<SettingsUser>(INITIAL_USER);
  const [active, setActive] = React.useState("New chat");
  const [team, setTeam] = React.useState<Team>(TEAMS[0]);
  const [appearance, setAppearance] = React.useState<Appearance>("system");

  /* Apply the appearance the way the app will (data-theme on <html>), so the
   * settings modal's Appearance toggle repaints the shell live. "system"
   * follows the OS. */
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const resolve = () =>
      appearance === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : appearance;
    const apply = () =>
      document.documentElement.setAttribute("data-theme", resolve());
    apply();
    if (appearance !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [appearance]);

  return (
    <AppShellQuill
      user={user}
      account={ACCOUNT}
      version="v1.3.2"
      activeItem={active}
      onNavigate={setActive}
      teams={TEAMS}
      activeTeam={team}
      onTeamChange={setTeam}
      onUserChange={setUser}
      appearance={appearance}
      onAppearanceChange={setAppearance}
    >
      <TabContent active={active} />
    </AppShellQuill>
  );
}

/* ── Per-tab demo content ───────────────────────────────────────────────────
 * Stand-ins for the live Hummingbird screens, sourced from the product
 * inventory (brightseed.ai v1.3.2), so the new IA reads as real destinations
 * rather than one placeholder. This is DEMO content owned by the story — the
 * shell only frames `children`. The heavier surfaces underneath (Prompt
 * Composer, Report Card, the Draft Status Badge, the List Toolbar's real
 * filter/sort controls) are their own Tier-3 passes; the filter/sort buttons
 * here are visual placeholders, not the settled controls.
 */

const SUGGESTED_PROMPTS = [
  "Find compounds for glucose metabolism",
  "Ingredient combinations for weight management",
  "What synergizes with berberine?",
  "Comprehensive information about rutin",
  "How does resveratrol work?",
  "What dosage for lipoic acid?",
];

function NewChatContent() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold text-[var(--ds-color-text-default)]">
          What can I help you create today?
        </h1>
        <p className="text-[var(--ds-color-text-subtle)]">
          I&rsquo;m Hummingbird, your agent for innovating new product concepts.
        </p>
      </div>

      {/* Context composer — Textarea sits seamless inside a field-surface shell */}
      <div className="space-y-3 rounded-[var(--ds-shape-radius-md)] border border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-field)] p-3">
        <Textarea
          placeholder="Ask about compounds, combinations, mechanisms, or dosing…"
          className="min-h-20 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm">
            <Sparkles />
            Create Formula Brief
          </Button>
          <Button size="icon" aria-label="Send message">
            <ArrowUp />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <Chip key={prompt} variant="outline">
            {prompt}
          </Chip>
        ))}
      </div>
    </div>
  );
}

const PROJECTS = [
  {
    name: "Metabolic Health Line",
    summary:
      "GLP-1 adjacent concepts for glucose control and weight management.",
    chats: 8,
    reports: 3,
    updated: "2 days ago",
  },
  {
    name: "Cognitive Support Formulas",
    summary: "Nootropic stacks and mechanisms for focus, memory, and mood.",
    chats: 5,
    reports: 2,
    updated: "5 days ago",
  },
  {
    name: "Gut & Longevity Concepts",
    summary:
      "Synbiotic and polyphenol combinations across the gut–longevity axis.",
    chats: 12,
    reports: 6,
    updated: "1 week ago",
  },
];

function ProjectsContent() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-[var(--ds-color-text-default)]">
            Projects
          </h1>
          <p className="text-sm text-[var(--ds-color-text-subtle)]">
            Containers for a body of work — the chats and reports that belong
            together.
          </p>
        </div>
        <Button>
          <Plus />
          New Project
        </Button>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--ds-color-text-subtle)]" />
        <Input placeholder="Search projects…" className="pl-9" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <Card key={project.name} className="gap-3 p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--ds-shape-radius-md)] bg-[var(--ds-color-surface-alt)] text-[var(--ds-color-text-subtle)]">
                <Folder className="size-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="font-medium text-[var(--ds-color-text-default)]">
                  {project.name}
                </div>
                <p className="line-clamp-2 text-sm text-[var(--ds-color-text-subtle)]">
                  {project.summary}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-[var(--ds-color-text-subtle)]">
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="size-4" />
                  {project.chats}
                </span>
                <span className="flex items-center gap-1.5">
                  <FileText className="size-4" />
                  {project.reports}
                </span>
              </span>
              <span>Updated {project.updated}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const REPORTS = [
  { title: "Berberine + Biochanin A", updated: "Updated 3 hours ago" },
  { title: "Resveratrol Longevity Concept", updated: "Updated yesterday" },
  { title: "Sulforaphane Gut Health Brief", updated: "Updated 4 days ago" },
];

function ReportsContent() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-[var(--ds-color-text-default)]">
            Reports
          </h1>
          <p className="text-sm text-[var(--ds-color-text-subtle)]">
            Concept briefs generated from your recommendations.
          </p>
        </div>
        <Button>
          <Plus />
          New Report
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[var(--ds-color-text-subtle)]" />
          <Input
            placeholder="Search by title, ingredients, or summary…"
            className="pl-9"
          />
        </div>
        <Button variant="outline">
          <ListFilter />
          All
        </Button>
        <Button variant="outline">
          <ArrowUpDown />
          Recent
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {REPORTS.map((report) => (
          <Card key={report.title} className="flex-row items-center gap-4 p-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-[var(--ds-shape-radius-md)] bg-[var(--ds-color-surface-alt)] text-[var(--ds-color-text-subtle)]">
              <FileText className="size-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="truncate font-medium text-[var(--ds-color-text-default)]">
                  {report.title}
                </span>
                <Tag variant="default">Draft</Tag>
              </div>
              <div className="text-sm text-[var(--ds-color-text-subtle)]">
                {report.updated}
              </div>
            </div>
            <Button variant="outline" size="sm">
              View
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="More options">
              <MoreVertical />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TabContent({ active }: { active: string }) {
  if (active === "Projects") return <ProjectsContent />;
  if (active === "Reports") return <ReportsContent />;
  return <NewChatContent />;
}

const meta = {
  title: "Blocks/App Shell Quill",
  component: ShellHost,
  parameters: { layout: "fullscreen", previewPadding: false },
} satisfies Meta<typeof ShellHost>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/* A single custom phone viewport, locked on the Mobile story below. Storybook 10
 * ships viewport in core, so no addon is needed; locking it via story `globals`
 * narrows the preview iframe, which is what trips useIsMobile() (it reads
 * window.innerWidth, not a container). */
const MOBILE_VIEWPORT = {
  mobile: {
    name: "Mobile (390×844)",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
};

/**
 * Below md the sidebar renders inside a Sheet — the composition neither
 * Components/Sidebar nor the desktop App Shell story ever exercised, which is
 * exactly how the phantom-tap bug shipped (DOCS/tickets/sidebar-mobile-phantom-tap.md).
 *
 * This story locks the preview to a phone width so useIsMobile() trips and that
 * Sheet mounts, then drives the real path: the inset header's opener (the only
 * way IN on mobile) opens the nav, and the toggle in the Sheet header is now the
 * visible way OUT. The play function asserts that toggle is SOLID, not the
 * opacity-0 phantom it used to be — reintroduce the bug and this story fails.
 */
export const Mobile: Story = {
  parameters: { viewport: { options: MOBILE_VIEWPORT } },
  globals: { viewport: { value: "mobile" } },
  play: async ({ canvasElement }) => {
    // Wait for the locked viewport to narrow the iframe so useIsMobile() flips
    // and the Sheet composition (not the desktop rail) is what mounts.
    await waitFor(() => expect(window.innerWidth).toBeLessThan(768));

    // The way IN: the inset header opener is md:hidden, so mobile-only.
    const canvas = within(canvasElement);
    await userEvent.click(
      await canvas.findByRole("button", { name: "Open navigation" })
    );

    // The way OUT: the toggle lives in the Sheet, which Radix portals to
    // document.body — hence screen, not canvas. It must render solid.
    const closeToggle = await screen.findByRole("button", {
      name: "Close navigation",
    });
    await waitFor(() =>
      expect(getComputedStyle(closeToggle).opacity).toBe("1")
    );
  },
};
