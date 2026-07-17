import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { NavUserQuill } from "@/components/quill/nav-user-quill";
import {
  SidebarAlt1,
  SidebarAlt1Content,
  SidebarAlt1Footer,
  SidebarAlt1Inset,
  SidebarAlt1Provider,
} from "@/components/ui/sidebar-alt1";

/* ─────────────────────────────────────────────────────────────────────────
 * The sidebar footer account menu, per Anna's proposal (Collab Playground
 * 89:1547 → 89:1596, July 16 2026). Replaces the Pro Block nav-user, which
 * still ships in App Shell 4 until app-shell-quill is signed off.
 *
 * What to look for:
 *   - Trigger: display name + kebab. No email, no ChevronsUpDown.
 *   - Menu: email header, then Settings / (Get help, Give feedback) / Teams /
 *     Version + Log out. The separators are the sketch's grouping.
 *   - The Version row is a readout: it should not highlight on hover, take
 *     focus by keyboard, or close the menu when clicked.
 *
 * Open the menu to review it — the trigger alone is only half the component.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "WORK IN PROGRESS/Nav User Quill",
  component: NavUserQuill,
  parameters: { layout: "fullscreen", previewPadding: false },
  render: (args) => (
    /* Alt1's provider, not stock's — NavUserQuill reads useSidebarAlt1 so it
     * can render the panel and rail forms as two compositions. */
    <SidebarAlt1Provider>
      <SidebarAlt1>
        {/* Empty, but present: it takes the free space so the footer sits at the
         * bottom, which is where the menu has to open upward from. */}
        <SidebarAlt1Content />
        <SidebarAlt1Footer>
          <NavUserQuill {...args} />
        </SidebarAlt1Footer>
      </SidebarAlt1>
      <SidebarAlt1Inset>
        <div className="text-muted-foreground p-6 text-sm">
          Open the menu from the footer, bottom left. Cmd/Ctrl+B collapses the
          nav — the name and kebab are absent from the rail, not hidden in it.
        </div>
      </SidebarAlt1Inset>
    </SidebarAlt1Provider>
  ),
} satisfies Meta<typeof NavUserQuill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      name: "becky",
      email: "becky@buckupconsulting.com",
      color: "blue",
      icon: "leafy-green",
    },
    version: "v1.3.2",
  },
};

/** No stored colour + icon pair. Renders AvatarFallback — which is the assigned
 * orange + wheat pair, by design, not a neutral unknown-person avatar. */
export const NoStoredIdentity: Story = {
  args: {
    user: { name: "becky", email: "becky@buckupconsulting.com" },
    version: "v1.3.2",
  },
};

/** The Full name field allows 20 characters, so the trigger has to survive one
 * that actually uses them. It truncates; the menu header carries the email. */
export const LongDisplayName: Story = {
  args: {
    user: {
      name: "Bartholomew Quillsby",
      email: "bartholomew.quillsby@brightseedbio.com",
      color: "orchid",
      icon: "flower-2",
    },
    version: "v1.3.2",
  },
};
