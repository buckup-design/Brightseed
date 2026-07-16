import { cn } from "@/lib/utils"

/**
 * Skeleton, Brightseed Quill design system.
 *
 * Loading placeholder. Migrated to component-scoped tokens (BSDS-102): the
 * stock `bg-accent` / `rounded-md` bridge classes are replaced with arbitrary
 * refs to --c-skeleton-* tokens, which alias the global --ds-* semantics 1:1.
 *
 * Color tokens (Brightseed semantics):
 *   Surface → --ds-color-surface-brand-subtle  (forest-50 light / sand-950 dark)
 *   Radius  → --ds-shape-radius-md             (8px)
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
        "bg-[var(--c-skeleton-surface-brand-subtle)]",
        "rounded-[var(--c-skeleton-shape-radius-md)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
