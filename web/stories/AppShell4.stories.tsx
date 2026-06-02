import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { AppShell4 } from "@/components/pro-blocks/application/app-shells/app-shell-4"

/* ─────────────────────────────────────────────────────────────────────────
 * App Shell 4 — second Pro Block landed via the @shadcndesign registry
 * (May 8, 2026). Sidebar + breadcrumbs + header layout.
 *
 * What this story exercises:
 *   - Sidebar (stock shadcn) — collapsible icon-rail with team switcher,
 *     nav items, project list, user dropdown
 *   - Breadcrumb (stock shadcn) — page-context navigation in header
 *   - Input (stock shadcn) — search field in header
 *   - Lucide icons throughout
 *   - SidebarProvider context wraps everything (built into AppShell4)
 *
 * Bridge dependencies introduced this install:
 *   The shadcn CLI auto-injected --sidebar, --sidebar-foreground,
 *   --sidebar-primary, --sidebar-accent, --sidebar-border, --sidebar-ring
 *   into globals.css with stock hsl() values + a `.dark` selector. Both
 *   wrong for our setup — they bypass the bridge AND we use [data-theme="dark"]
 *   not `.dark`. Removed them and added the correct mappings to bridge/globals.css
 *   per the v3 May 6 decision: base/sidebar = base/background = white/sand-950.
 *
 * What to look for:
 *   - Sidebar surface is white (light) / sand-950 (dark) — same as page bg.
 *     Distinguishable from main content by the divider, not by hue.
 *   - Active nav item background is sand-100 (light) / sand-900 (dark).
 *   - Sidebar focus ring is lime (--ds-color-border-focus).
 *   - Breadcrumbs and search input paint correctly through the bridge.
 *
 * Known cosmetics — deferred:
 *   - Stock shadcn user avatar default (broken github.com/shadcn.png reference).
 *   - Team switcher logos use Lucide icons rather than custom Brightseed marks.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Blocks/App Shell 4",
  component: AppShell4,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppShell4>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
