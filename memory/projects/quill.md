# Quill (the design system)

**Codename:** Quill (renamed from Mantel May 6, 2026)
**Status:** Active development, May 8, 2026 saw Badge React port + Lucide restore + Geist/Tiempos typography work
**Source of truth:** v3 Figma file + `tokens/` + `bridge/`

## What it is
Brightseed's customized fork of shadcn/ui. Quill = shadcn + Brightseed Mode rebind + Brightseed-spec component tweaks (Button hover ladder, Badge inline-slot architecture, soft destructive treatment, etc.). Lives in the v3 Figma file as a parallel layer over the Pro Pack scaffolding.

## Architecture
Three-layer token system (read `CLAUDE.md` + Storybook → Design.mdx before generating any Hummingbird UI):

```
Layer 1, Primitives    --p-color-forest-700
          ↓ var()
Layer 2, Intents       --success-700
          ↓ var()
Layer 3, Semantics     --color-surface-success   ← component code references THIS layer
```

Component code references **semantic** tokens only. Never reach past semantics to intents or primitives. Light theme is default; dark = `data-theme="dark"` on ancestor.

## Key Figma IDs (v3 file)
| Component | id |
|---|---|
| Button master (canonical) | `37:931` |
| Components - Quill SECTION (the doc skeleton) | `26465:249160` |
| Badge Primary master | `26480:627833` |
| Badge Secondary master | `26480:628051` |
| Badge Number master (default shadcn, color-rebound) | `17100:10130` |
| Local Brightseed Ring component_set | `26482:628558` |
| IconPlaceholder | `21003:91178` |
| Brightseed Blocks (curated home) | `26465:212221` |

## Component porting status (web/ React)
| Component | Status |
|---|---|
| Button | ✅ Full Quill parity (Apr 30, 2026) |
| Badge (Primary + Secondary + Number) | ✅ Full Quill parity (May 8, 2026) |
| 14 other shadcn components | 🟡 Stock, paint correctly through bridge but no Brightseed-spec tweaks |

## Reference files
- `CLAUDE.md`, canonical rules; Storybook → Design.mdx, design language + composition
- `brightseed-shadcn-mapping.md`, Figma variable wiring guide
- `tokens/`, primitives / intents / semantics / shape / charts / typography
- `bridge/globals.css`, shadcn → Brightseed token bridge (intentionally thin)
- `web/components/ui/`, React component implementations
- `web/stories/`, Storybook stories incl. full Quill matrices for Button + Badge

## Known follow-ups (open as of May 8)
- Tiempos Headline license + WOFF2 files placed at `web/public/fonts/tiempos/` + uncomment localFont in `web/app/layout.tsx`
- Old broken Lucide scaffolding cleanup (Pro Pack frame on Lucide Icons page with 6 leftover icons that survived deletion)
- 14 stock shadcn components awaiting Brightseed-spec port
- DoseResponseChart, StatCard implementation
