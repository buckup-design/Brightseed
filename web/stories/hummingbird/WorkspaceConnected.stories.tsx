import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { http, HttpResponse, delay } from "msw";
import { toast } from "sonner";

import { WorkspaceCanvasConnected } from "@/components/hummingbird/workspace/workspace-canvas-connected";
import { SAMPLE_WORKSPACE_THREAD } from "@/components/hummingbird/data";
import { Toaster } from "@/components/ui/sonner";

/* ─────────────────────────────────────────────────────────────────────────
 * Workspace (Connected) — the same signature surface as Workspace Canvas, but
 * fed by REAL `/api` fetches through Mock Service Worker instead of props.
 *
 * This is the prototyping-data layer in action. Open the browser Network tab:
 * GET /api/results and /api/thread are intercepted by the worker (no server
 * running). Clicking a single/combo card fires GET /api/results/:key and the
 * detail sheet shows a spinner until it resolves.
 *
 * The stories below override the default handlers per-story (via
 * `parameters.msw.handlers`, applied by the loader in .storybook/preview.ts) to
 * drive the loading / empty / error states a real backend would produce.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "WORK IN PROGRESS/Workspace (Connected)",
  component: WorkspaceCanvasConnected,
  parameters: { layout: "fullscreen", previewPadding: false },
  decorators: [
    (Story) => (
      <div className="h-svh w-full">
        <Story />
        <Toaster />
      </div>
    ),
  ],
  args: {
    onGenerateReport: (detail) => toast(`Generating report for “${detail.name}”…`),
    onSend: (value) => toast(`Sent: ${value}`),
    onAddFilter: () => toast("Add filter"),
  },
} satisfies Meta<typeof WorkspaceCanvasConnected>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default MSW handlers (mocks/handlers.ts): a brief latency, then the full
 *  weight-management result set + thread. */
export const Default: Story = {};

/** Loading — the endpoints never resolve, so the "Preparing workspace…" state
 *  holds. (`delay("infinite")` override.) */
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/results", async () => {
          await delay("infinite");
          return HttpResponse.json([]);
        }),
        http.get("/api/thread", async () => {
          await delay("infinite");
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};

/** Empty — the search returns no compounds; the results panel invites a
 *  question while the opening message still renders. */
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/results", () => HttpResponse.json([])),
        http.get("/api/thread", () =>
          HttpResponse.json(SAMPLE_WORKSPACE_THREAD.slice(0, 1)),
        ),
      ],
    },
  },
};

/** Error — the results endpoint 500s; the connected container surfaces the
 *  failure with a "Try again". */
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get("/api/results", () => new HttpResponse(null, { status: 500 })),
      ],
    },
  },
};
