import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "filter" | "neutral" | "ghost" | "regulatory";
  /** "pill" (default, rounded-full) matches the filter chips; "chip" (rounded-md) matches the compound card's badges. */
  shape?: "pill" | "chip";
  /** Default false (single-line, matches every existing short label). Set true for chips whose text can be long (e.g. spreadsheet-derived filter values) so they wrap instead of overflowing their container. */
  wrap?: boolean;
  icon?: ReactNode;
  className?: string;
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  filter: "bg-orange-500 text-white",
  neutral: "bg-badge-compound text-foreground",
  ghost: "text-foreground",
  // Regulatory flag pills (GRAS, Non-Novel Food) — Tailwind's stock
  // lime-500 (#84CC16) exactly matches the Figma spec's checkmark asset
  // fill color, so no new token is needed.
  regulatory: "border border-lime-500 text-lime-600",
};

const shapeStyles: Record<NonNullable<BadgeProps["shape"]>, string> = {
  pill: "rounded-full",
  chip: "rounded-md",
};

export default function Badge({
  children,
  variant = "neutral",
  shape = "pill",
  wrap = false,
  icon,
  className = "",
}: BadgeProps) {
  const wrapStyles = wrap ? "max-w-full whitespace-normal break-words" : "whitespace-nowrap";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium ${wrapStyles} ${variantStyles[variant]} ${shapeStyles[shape]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}
