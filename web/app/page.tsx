/**
 * Web app root, placeholder during the Pro Blocks rebuild.
 *
 * The Hummingbird demo surfaces (/strategies, /compounds) and the components
 * that backed them (ChatPanel, CompoundCard, PlantCard, StrategyCard,
 * SurfaceHeader) were removed on May 8, 2026 to make room for a clean
 * rebuild on top of shadcndesign.com Pro Blocks.
 *
 * Storybook (`npm run storybook`) remains the canonical view of the
 * design system during this transition. This page exists so the Next.js
 * dev server has a valid `/` route, no design work lives here.
 */

export default function Home() {
  return (
    <main className="min-h-dvh flex items-center justify-center bg-[var(--ds-color-surface-default)]">
      <div className="max-w-md text-center space-y-4 px-6">
        <h1 className="text-2xl font-semibold text-[var(--ds-color-text-default)]">
          Brightseed, rebuilding on Pro Blocks
        </h1>
        <p className="text-sm text-[var(--ds-color-text-subtle)]">
          The canonical view of the design system is Storybook
          (<code className="font-mono text-xs">npm run storybook</code>)
          until the Hummingbird surfaces return.
        </p>
      </div>
    </main>
  )
}
