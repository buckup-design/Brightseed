import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";

import { FavoriteButton } from "@/components/ui/favorite-button";

/* ─────────────────────────────────────────────────────────────────────────
 * FavoriteButton — a star toggle. Filled gold when favorited, a faint outline
 * when not. Controlled: pass `favorited` and flip it in `onToggle`. `label`
 * names the thing for the accessible label ("report" → "Favorite report").
 * Click it to toggle.
 * ───────────────────────────────────────────────────────────────────────── */

const meta = {
  title: "Components/Favorite Button",
  component: FavoriteButton,
  parameters: { layout: "centered" },
  args: { favorited: false, label: "report" },
} satisfies Meta<typeof FavoriteButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [favorited, setFavorited] = React.useState(args.favorited);
    return (
      <FavoriteButton
        {...args}
        favorited={favorited}
        onToggle={() => setFavorited((prev) => !prev)}
      />
    );
  },
};
