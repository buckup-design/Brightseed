import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";

import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────────────────────────────────
 * Sonner is a toast system, not a single component. Each story mounts the
 * <Toaster /> provider once and renders trigger buttons that call toast()
 * with different intents (success, info, warning, error, loading, promise).
 * The Toaster reads `data-theme` on <html> directly, so it flips with the
 * Storybook theme toolbar (and the rest of the design system) automatically.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Sonner",
  component: Toaster,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <Toaster />
      <Button onClick={() => toast("Compound added to batch.")}>
        Show toast
      </Button>
    </>
  ),
};

export const Intents: Story = {
  render: () => (
    <>
      <Toaster />
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() => toast.success("Compound verified.")}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.info("New batch available.")}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.warning("Yield below threshold.")}
        >
          Warning
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.error("Sample failed quality check.", {
              description: "Re-run analysis or discard.",
            })
          }
        >
          Error
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.loading("Analyzing compound…")}
        >
          Loading
        </Button>
      </div>
    </>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast("Batch QFR-204 saved.", {
            description: "12 compounds verified, 3 pending review.",
          })
        }
      >
        Toast with description
      </Button>
    </>
  ),
};

export const WithAction: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() =>
          toast("Compound moved to archive.", {
            action: {
              label: "Undo",
              onClick: () => toast.success("Move undone."),
            },
          })
        }
      >
        Toast with action
      </Button>
    </>
  ),
};

// PromiseToast, not Promise — a `Promise` export shadows the JS global inside
// this module, so `new Promise(...)` below would resolve to the story object.
// Same rule as NumberBadge vs Number (CLAUDE.md).
export const PromiseToast: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        onClick={() => {
          const fakeRequest = new Promise<{ name: string }>((resolve) =>
            setTimeout(() => resolve({ name: "Quercetin" }), 1500),
          );
          toast.promise(fakeRequest, {
            loading: "Analyzing compound…",
            success: (data) => `${data.name} verified.`,
            error: "Analysis failed.",
          });
        }}
      >
        Promise toast
      </Button>
    </>
  ),
};
