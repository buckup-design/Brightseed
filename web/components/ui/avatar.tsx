"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "radix-ui"
import { Flower, Flower2, LeafyGreen, Wheat } from "lucide-react"

import { cn } from "@/lib/utils"
import { BADGE_ICON_STROKE } from "@/components/ui/badge-icons"

/* ── Identity set ─────────────────────────────────────────────────────────
 * A stored color + icon pair, assigned at account creation. These two lists
 * are the vocabulary those stored values draw from; a persisted avatar is one
 * value from each (5 x 4 = 20 pairs). Settings will later let a user override
 * the assigned pair, so both fields are addressable by name, not by index —
 * reordering these lists must never repaint an existing user's avatar. */

const AVATAR_COLORS = ["orchid", "lavender", "orange", "blue", "cyan"] as const
type AvatarColor = (typeof AVATAR_COLORS)[number]

const AVATAR_ICONS = {
  wheat: Wheat,
  flower: Flower,
  "flower-2": Flower2,
  "leafy-green": LeafyGreen,
} as const
type AvatarIcon = keyof typeof AVATAR_ICONS

/** Shown when an account has no stored pair — a row predating assignment, or a
 * read that came back empty. Note this is one of the 20 assignable pairs, not a
 * reserved 21st, so a fallback avatar is indistinguishable from a user who was
 * genuinely assigned orange + wheat. */
const AVATAR_IDENTITY_FALLBACK = { color: "orange", icon: "wheat" } as const

/* Written out in full so Tailwind's source scan can see each class literal. */
const AVATAR_COLOR_SURFACE: Record<AvatarColor, string> = {
  orchid: "bg-[var(--c-avatar-surface-orchid)]",
  lavender: "bg-[var(--c-avatar-surface-lavender)]",
  orange: "bg-[var(--c-avatar-surface-orange)]",
  blue: "bg-[var(--c-avatar-surface-blue)]",
  cyan: "bg-[var(--c-avatar-surface-cyan)]",
}

/** Pick a random identity. Call once at account creation and persist the
 * result — never derive it at render, which would reshuffle the avatar on
 * every paint and mismatch between server and client on hydration. */
function randomAvatarIdentity(): { color: AvatarColor; icon: AvatarIcon } {
  const icons = Object.keys(AVATAR_ICONS) as AvatarIcon[]
  return {
    color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    icon: icons[Math.floor(Math.random() * icons.length)],
  }
}

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 overflow-hidden rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-[var(--c-avatar-surface-alt)] text-sm text-[var(--c-avatar-text-subtle)] group-data-[size=sm]/avatar:text-xs",
        className
      )}
      {...props}
    />
  )
}

/** The assigned color + icon avatar, and the only avatar the product renders —
 * photo avatars were removed in July 2026. Still built on the Radix fallback
 * slot, which renders while image status is idle; with no Avatar.Image sibling
 * possible any more, that means it always renders. Omitting either prop falls
 * back to AVATAR_IDENTITY_FALLBACK. */
function AvatarIdentity({
  color = AVATAR_IDENTITY_FALLBACK.color,
  icon = AVATAR_IDENTITY_FALLBACK.icon,
  className,
  ...props
}: Omit<React.ComponentProps<typeof AvatarPrimitive.Fallback>, "children"> & {
  color?: AvatarColor
  icon?: AvatarIcon
}) {
  const Icon = AVATAR_ICONS[icon]
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-identity"
      data-color={color}
      data-icon={icon}
      className={cn(
        "flex size-full items-center justify-center rounded-full text-[var(--c-avatar-icon-on-color)]",
        "[&>svg]:size-4 group-data-[size=sm]/avatar:[&>svg]:size-3 group-data-[size=lg]/avatar:[&>svg]:size-5",
        AVATAR_COLOR_SURFACE[color],
        className
      )}
      {...props}
    >
      <Icon strokeWidth={BADGE_ICON_STROKE} aria-hidden="true" />
    </AvatarPrimitive.Fallback>
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-[var(--c-avatar-action-primary)] text-[var(--c-avatar-text-on-action-primary)] ring-2 ring-[var(--c-avatar-surface-default)] select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-[var(--c-avatar-surface-default)]",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--c-avatar-surface-alt)] text-sm text-[var(--c-avatar-text-subtle)] ring-2 ring-[var(--c-avatar-surface-default)] group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarFallback,
  AvatarIdentity,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
  AVATAR_COLORS,
  AVATAR_ICONS,
  AVATAR_IDENTITY_FALLBACK,
  randomAvatarIdentity,
}
export type { AvatarColor, AvatarIcon }
