import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { expect, screen, userEvent, waitFor, within } from "storybook/test";
import { toast } from "sonner";

import { WorkspaceCanvas } from "@/components/hummingbird/workspace/workspace-canvas";
import {
  SAMPLE_WORKSPACE_RESULTS,
  SAMPLE_WORKSPACE_THREAD,
  resolveWorkspaceDetail,
} from "@/components/hummingbird/data";
import { Toaster } from "@/components/ui/sonner";

/* ─────────────────────────────────────────────────────────────────────────
 * WorkspaceCanvas — Hummingbird's signature surface. The split view a search
 * opens into: a streaming chat panel on the left, a results panel on the right
 * (Evidence Filter Bar + a grid of ResultCards), and the detail slide-over a
 * card opens into. One Block owns all cross-panel state, so a card favorited in
 * the grid, the same card inline in chat, and the detail's Pin stay in sync.
 *
 * Try it: drag the handle to resize; filter by evidence (the pill counts hold);
 * toggle grid/list; click a single/combo card to open its detail (predicted
 * cards don't open one); star a card and watch it sync into the detail.
 *
 * Below md the split becomes two tabs (Chat / Results) — see Mobile.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "WORK IN PROGRESS/Workspace Canvas",
  component: WorkspaceCanvas,
  parameters: { layout: "fullscreen", previewPadding: false },
  // The canvas fills its parent; the parent must be height-definite for the
  // ResizablePanelGroup's height:100% to resolve. h-svh gives it a viewport box.
  decorators: [
    (Story) => (
      <div className="h-svh w-full">
        <Story />
        <Toaster />
      </div>
    ),
  ],
  args: {
    messages: SAMPLE_WORKSPACE_THREAD,
    results: SAMPLE_WORKSPACE_RESULTS,
    resolveDetail: resolveWorkspaceDetail,
    searchesCompleted: 1,
    updateCount: SAMPLE_WORKSPACE_RESULTS.length,
    onGenerateReport: (detail) => toast(`Generating report for “${detail.name}”…`),
    onSend: (value) => toast(`Sent: ${value}`),
    onAddFilter: () => toast("Add filter"),
  },
} satisfies Meta<typeof WorkspaceCanvas>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The full Workspace: a thread with inline results, the update banner, the
 *  Evidence Filter Bar, and a grid of single / combo / predicted cards. */
export const Default: Story = {};

/** Before a search resolves — the results panel shows "Preparing workspace…"
 *  while the chat panel stays live. */
export const Preparing: Story = {
  args: {
    preparing: true,
    updateCount: null,
    messages: SAMPLE_WORKSPACE_THREAD.slice(0, 1),
  },
};

/** No search yet — an empty results panel invites a question. */
export const Empty: Story = {
  args: { results: [], updateCount: null, searchesCompleted: undefined, messages: [] },
};

/** Selecting an evidence class with no matches keeps the filter bar and offers
 *  a way back. Here the set is clinical-only, so Predicted has zero. */
export const NoResultsForFilter: Story = {
  args: {
    results: SAMPLE_WORKSPACE_RESULTS.filter(
      (r) => r.type !== "predicted" && r.evidence === "clinical",
    ),
    updateCount: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Click the "Predicted 0" pill (role-agnostic: the label's clickable host).
    const predicted = (await canvas.findByText("Predicted", { exact: false })).closest(
      "button",
    );
    await userEvent.click(predicted!);
    await canvas.findByText(/No Predicted results yet/i);
    // The way back.
    await userEvent.click(await canvas.findByRole("button", { name: "Clear filter" }));
    await waitFor(() =>
      expect(canvas.queryByText(/No Predicted results yet/i)).toBeNull(),
    );
  },
};

/* A single custom phone viewport, locked on the Mobile story. Storybook 10 ships
 * viewport in core; locking it via `globals` narrows the preview iframe, which is
 * what trips useIsMobile() (it reads window.innerWidth, not a container). */
const MOBILE_VIEWPORT = {
  mobile: {
    name: "Mobile (390×844)",
    styles: { width: "390px", height: "844px" },
    type: "mobile" as const,
  },
};

/**
 * Below md the split can't sit side by side, so the whole ResizablePanelGroup is
 * swapped for two tabs (Chat / Results). This story locks a phone viewport so
 * useIsMobile() trips and that path mounts, then drives it: the composer lives in
 * the Chat tab, and opening a card raises the detail Sheet — which Radix portals
 * to document.body, so the play function queries it via `screen`, not the canvas.
 */
export const Mobile: Story = {
  parameters: { viewport: { options: MOBILE_VIEWPORT } },
  globals: { viewport: { value: "mobile" } },
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(window.innerWidth).toBeLessThan(768));
    const canvas = within(canvasElement);

    // Both tabs mount (not the desktop rail).
    await canvas.findByRole("tab", { name: "Chat" });
    await canvas.findByRole("tab", { name: /Results/ });

    // The Chat tab carries the composer.
    await userEvent.click(canvas.getByRole("tab", { name: "Chat" }));
    await canvas.findByPlaceholderText("Message Hummingbird");

    // Back to Results; opening a card raises the portaled Sheet (screen, not canvas).
    await userEvent.click(canvas.getByRole("tab", { name: /Results/ }));
    await userEvent.click(
      await canvas.findByRole("button", { name: "Epigallocatechin gallate" }),
    );
    await screen.findByRole("button", { name: "Generate report" });
  },
};
