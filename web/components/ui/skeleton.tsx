import { cn } from "@/lib/utils"

/**
 * Skeleton, Brightseed Quill design system.
 *
 * Loading placeholder. Migrated to component-scoped tokens (BSDS-102): the
 * stock `bg-accent` / `rounded-md` bridge classes are replaced with arbitrary
 * refs to --c-skeleton-* tokens, which alias the global --ds-* semantics 1:1.
 *
 * Color tokens (Brightseed semantics):
 *   Surface → --ds-color-surface-placeholder   (forest-50 light / sand-900 dark)
 *   Radius  → --ds-shape-radius-md             (8px)
 *
 * Moved off --ds-color-surface-brand-subtle (July 2026). That token had to grow
 * to sand-800 in dark so Toggle's on-state could clear its own hover surface,
 * which would have made skeletons ~6.8x the light theme's step — a ghost in
 * light, a solid block in dark. A skeleton wants a whisper; an on-state wants a
 * signal. One token could not be both, so they split.
 *
 * `animate-pulse` is a motion utility, not a color/shape decision, so it stays
 * as-is. No dark: variants: the surface token swaps under [data-theme="dark"].
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse",
        "bg-[var(--c-skeleton-surface-placeholder)]",
        "rounded-[var(--c-skeleton-shape-radius-md)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
