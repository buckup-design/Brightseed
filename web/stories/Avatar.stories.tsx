import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import {
  AVATAR_COLORS,
  AVATAR_ICONS,
  Avatar,
  AvatarGroup,
  AvatarIdentity,
  randomAvatarIdentity,
  type AvatarColor,
  type AvatarIcon,
} from "@/components/ui/avatar";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const ICON_NAMES = Object.keys(AVATAR_ICONS) as AvatarIcon[];

/* ─────────────────────────────────────────────────────────────────────────
 * Identity avatars, the color + icon pair assigned at account creation.
 * ───────────────────────────────────────────────────────────────────────── */

export const Identity: Story = {
  render: () => (
    <Avatar>
      <AvatarIdentity color="orchid" icon="flower" />
    </Avatar>
  ),
};

/** No stored pair, so AvatarIdentity falls back to orange + wheat. Identical to
 * an account genuinely assigned that pair, by design. */
export const IdentityFallback: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarIdentity />
    </Avatar>
  ),
};

/** The full assignable set. Every avatar a new account can be given is on this
 * page, which makes it the one to review the white-on-color call against. */
export const IdentityMatrix: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      <p className="max-w-prose text-sm text-[var(--ds-color-text-subtle)]">
        All 20 assignable pairs, 5 colors &times; 4 icons. Icons are white on
        every color, and every pair clears the 3:1 non-text contrast bar
        (3.84&ndash;4.30). <strong>Orange</strong> and <strong>cyan</strong> sit
        at step-600 rather than 500 to get there, they are the two light steps.
        Toggle the theme to confirm the colors hold, they are theme-invariant by
        design.
      </p>
      <table className="border-separate border-spacing-3">
        <thead>
          <tr>
            <th />
            {ICON_NAMES.map((icon) => (
              <th
                key={icon}
                className="font-mono text-xs font-normal text-[var(--ds-color-text-subtle)]"
              >
                {icon}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {AVATAR_COLORS.map((color) => (
            <tr key={color}>
              <th className="pr-2 text-right font-mono text-xs font-normal text-[var(--ds-color-text-subtle)]">
                {color}
              </th>
              {ICON_NAMES.map((icon) => (
                <td key={icon}>
                  {/* mx-auto, not text-center: Avatar is display:flex */}
                  <Avatar size="lg" className="mx-auto">
                    <AvatarIdentity color={color} icon={icon} />
                  </Avatar>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const IdentitySizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size}>
            <AvatarIdentity color="lavender" icon="leafy-green" />
          </Avatar>
          <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
            {size}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const IdentityGroup: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarIdentity color="orchid" icon="flower" />
      </Avatar>
      <Avatar>
        <AvatarIdentity color="cyan" icon="wheat" />
      </Avatar>
      <Avatar>
        <AvatarIdentity color="lavender" icon="flower-2" />
      </Avatar>
      <Avatar>
        <AvatarIdentity color="orange" icon="leafy-green" />
      </Avatar>
    </AvatarGroup>
  ),
};

/** Stands in for account creation: roll once, keep the result. The button is
 * what makes it a real assignment rather than a render-time reshuffle. */
export const RandomAssignment: Story = {
  render: function RandomAssignmentStory() {
    const [identity, setIdentity] = React.useState<{
      color: AvatarColor;
      icon: AvatarIcon;
    } | null>(null);

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-10 items-center">
          {identity ? (
            <Avatar size="lg">
              <AvatarIdentity color={identity.color} icon={identity.icon} />
            </Avatar>
          ) : (
            <span className="text-sm text-[var(--ds-color-text-subtle)]">
              No account yet
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIdentity(randomAvatarIdentity())}
          className="rounded-md bg-[var(--ds-color-action-primary)] px-3 py-2 text-sm text-[var(--ds-color-text-on-action-primary)]"
        >
          Create account
        </button>
        <span className="h-4 font-mono text-xs text-[var(--ds-color-text-subtle)]">
          {identity ? `${identity.color} / ${identity.icon}` : ""}
        </span>
      </div>
    );
  },
};
