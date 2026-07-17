import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import {
  AVATAR_COLORS,
  AVATAR_ICONS,
  Avatar,
  AvatarFallback,
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

/* ─────────────────────────────────────────────────────────────────────────
 * Fallback avatar, for accounts with no stored pair. AvatarIdentity used to
 * self-default to orange + wheat; it no longer defaults, so a caller has to say
 * "no identity" out loud. What it renders is unchanged — orange + wheat — the
 * saying-so is the only new part.
 * ───────────────────────────────────────────────────────────────────────── */

/** The fallback avatar: orange + wheat, per AVATAR_IDENTITY_FALLBACK. */
export const Fallback: Story = {
  render: () => (
    <Avatar size="lg">
      <AvatarFallback />
    </Avatar>
  ),
};

/** The decision, made visible — and the one most likely to be "fixed" back into a
 * bug by a well-meaning reader. The fallback is one of the 25 assignable pairs,
 * NOT a reserved 26th, so these two are identical on purpose: an account
 * genuinely assigned orange + wheat, and an account with nothing stored at all.
 * If identity loading ever breaks, it must not LOOK broken. */
export const FallbackIsIndistinguishable: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-end gap-8">
        {[
          { label: "assigned orange + wheat", node: <AvatarIdentity color="orange" icon="wheat" /> },
          { label: "no stored pair", node: <AvatarFallback /> },
        ].map(({ label, node }) => (
          <div key={label} className="flex flex-col items-center gap-2">
            <Avatar size="lg">{node}</Avatar>
            <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="max-w-prose text-center text-sm text-[var(--ds-color-text-subtle)]">
        The same avatar, deliberately. Only the code tells them apart, via{" "}
        <code>data-slot</code>.
      </p>
    </div>
  ),
};

export const FallbackSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size}>
            <AvatarFallback />
          </Avatar>
          <span className="font-mono text-xs text-[var(--ds-color-text-subtle)]">
            {size}
          </span>
        </div>
      ))}
    </div>
  ),
};

/** The full assignable set. Every avatar a new account can be given is on this
 * page, which makes it the one to review the white-on-color call against. */
export const IdentityMatrix: Story = {
  parameters: { layout: "fullscreen" },
  render: () => (
    <div className="flex flex-col gap-4 p-6">
      <p className="max-w-prose text-sm text-[var(--ds-color-text-subtle)]">
        All 25 assignable pairs, 5 colors &times; 5 icons. These are decorative
        identity avatars, so the whole set sits at step-500 and white-on-color
        contrast is intentionally not a constraint. <strong>Orange</strong> and{" "}
        <strong>cyan</strong>, the two light steps, land just under the 3:1
        non-text bar (2.49&nbsp;/&nbsp;2.56) &mdash; an accepted trade for a
        decorative component. Toggle the theme to confirm the colors hold, they
        are theme-invariant by design.
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
 * what makes it a real assignment rather than a render-time reshuffle.
 *
 * Before the roll there is no stored pair, which is precisely the fallback case
 * — so this story also shows the branch every consumer now has to make, and why
 * the two components are worth keeping apart. */
export const RandomAssignment: Story = {
  render: function RandomAssignmentStory() {
    const [identity, setIdentity] = React.useState<{
      color: AvatarColor;
      icon: AvatarIcon;
    } | null>(null);

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-10 items-center">
          <Avatar size="lg">
            {identity ? (
              <AvatarIdentity color={identity.color} icon={identity.icon} />
            ) : (
              <AvatarFallback />
            )}
          </Avatar>
        </div>
        <button
          type="button"
          onClick={() => setIdentity(randomAvatarIdentity())}
          className="rounded-md bg-[var(--ds-color-action-primary)] px-3 py-2 text-sm text-[var(--ds-color-text-on-action-primary)]"
        >
          Create account
        </button>
        <span className="h-4 font-mono text-xs text-[var(--ds-color-text-subtle)]">
          {identity ? `${identity.color} / ${identity.icon}` : "no stored pair"}
        </span>
      </div>
    );
  },
};
