# Brightseed → shadcn/ui Color Mapping

**Purpose:** Reference for how Brightseed's 10 color primitives wire into the shadcn variable system. Use this when adding new shadcn theme tokens or auditing the chain from primitive → theme → mode → component.

**Status:** Primitives wired as Figma variables in the `Brightseed Primitives` collection (10 scales: sand, forest, lime, cyan, blue, yellow, orange, red, lavender, orchid, 11 steps each, 110 variables total). Stock tailwind hue scales were retired Apr 2026, see "What changed" below. Theme/Mode wiring complete; Hummingbird-specific component overrides pending.

---

## Variable collection layout (Apr 2026)

| Collection | Role | Contents |
|---|---|---|
| `1. Brightseed Foundations` | Universal primitives | `brightseed colors/base/{transparent, black, white}`, fundamental constants used across the whole system |
| `Brightseed Primitives` | Hue scales | All 10 scales × 11 steps. Naming: `brightseed/{scale}/{step}`, e.g., `brightseed/forest/700`. Single mode. |
| `2. Theme` | Light/dark color values | One variable per shadcn role with a "Default" mode value, aliasing into Brightseed Primitives. Pattern: `colors/{role}-light` and `colors/{role}-dark`. |
| `3. Mode` | Mode-aware semantic layer | Light + Dark mode variables. Each `base/{role}` aliases the matching `colors/{role}-light` (in Light mode) and `colors/{role}-dark` (in Dark mode). Plus `base/tag-{color}-*` for the badge/tag system. |

---

## What changed (Apr 2026)

The original `1. TailwindCSS` collection (289 variables) is gone. It contained the full stock tailwind palette (amber, emerald, fuchsia, gray, indigo, mauve, neutral, olive, pink, purple, rose, sky, slate, stone, taupe, teal, violet, zinc, etc.) which never aligned with the Brightseed brand. Three things were preserved and migrated:

1. **`tailwind colors/base/*` (transparent, black, white)** were renamed `brightseed colors/base/*` and the collection itself renamed `1. Brightseed Foundations`.
2. **Theme tokens that aliased tailwind/neutral** (dark-mode shadcn surfaces like `colors/background-dark`, `card-dark`, `foreground-dark`, etc.) were repointed to `brightseed/sand/*`, this gives the dark theme a warm tonal undertone matching the light theme, instead of cool stock grays.
3. **Theme tokens that aliased tailwind/red, orange, blue, cyan, etc.** (destructive states, chart colors, sidebar primary) were repointed to the matching Brightseed scale.

If you encounter older docs or AI prompts that reference `tailwind colors/{scale}/{step}` as a primitive source, treat that as obsolete. The single source of truth is `brightseed/{scale}/{step}` from the Brightseed Primitives collection.

---

## Semantic mapping (Theme → Mode)

The `2. Theme` collection's `colors/{role}-light` / `colors/{role}-dark` pair tokens need to alias the right Brightseed primitive steps. The named anchors in the artboards are the north star here, they tell you exactly which steps were designed for which roles.

The named anchors in your artboards are the north star here, they tell you exactly which steps were designed for which roles.

**Naming convention:** all primitive references use the form `brightseed/{scale}/{step}` from the Brightseed Primitives collection (e.g., `brightseed/forest/700`). Older docs may reference `brightseed-forest/700` or bare `sand/200` from the retired TailwindCSS collection, both naming styles refer to the same colors.

**Dark theme anchor:** `brightseed/sand/*` (warm neutral). Forest is reserved for brand chrome (`--surface-brand`, etc.) but is not the dark page-background anchor. See "Decisions" below for rationale.

### Core UI Surfaces

| shadcn slot | Light mode value | Dark mode value | Rationale |
|---|---|---|---|
| `--background` | `brightseed/sand/50` #F9F8F3 | `brightseed/sand/950` #1F1F1E | Sand light / sand dark, warm tonal undertone in both themes |
| `--foreground` | `brightseed/forest/900` #305536 | `brightseed/sand/50` #F9F8F3 | Deep Forest on sand / sand on dark sand |
| `--card` | `#FFFFFF` | `brightseed/sand/900` #2A2925 | Cards lifted off background |
| `--card-foreground` | `brightseed/forest/900` #305536 | `brightseed/sand/50` #F9F8F3 | Matches foreground |
| `--popover` | `#FFFFFF` | `brightseed/sand/800` #46453F | One step up from card for floating UI |
| `--popover-foreground` | `brightseed/forest/900` #305536 | `brightseed/sand/50` #F9F8F3 | Matches foreground |

### Brand Actions (Buttons, Links, Highlights)

| shadcn slot | Light mode value | Dark mode value | Rationale |
|---|---|---|---|
| `--primary` | `brightseed/lime/300` #CDE67B | `brightseed/lime/300` #CDE67B | Brand action anchor (default state). Hover = lime-400, pressed = lime-500. Theme-invariant. lime-300 retuned Apr 2026 from #CAE279 to pass AA with forest-800 text. |
| `--primary-foreground` | `brightseed/forest/800` #3F6947 | `brightseed/forest/800` #3F6947 | Forest text on lime, theme-invariant. Hover = forest-900, pressed = forest-950. |
| `--secondary` | `brightseed/sand/100` #F3F2EC | `brightseed/sand/800` #46453F | Subdued action surface |
| `--secondary-foreground` | `brightseed/forest/800` #3F6947 | `brightseed/sand/50` #F9F8F3 | Inverted pair |

### Subdued & Background Elements

| shadcn slot | Light mode value | Dark mode value | Rationale |
|---|---|---|---|
| `--muted` | `brightseed/sand/100` #F3F2EC | `brightseed/sand/800` #46453F | Low-emphasis background |
| `--muted-foreground` | `brightseed/sand/600` #8C897F | `brightseed/sand/400` #CAC8BB | De-emphasized text (captions, labels) |
| `--accent` | `brightseed/lime/50` #F2FDE0 | `brightseed/sand/700` #68665E | Hover highlights, lime tint in light, neutral in dark |
| `--accent-foreground` | `brightseed/forest/800` #3F6947 | `brightseed/sand/50` #F9F8F3 | Text on accent |

### Borders, Inputs & Focus

| shadcn slot | Light mode value | Dark mode value | Rationale |
|---|---|---|---|
| `--border` | `brightseed/sand/200` #EAE8DF | `brightseed/sand/700` at 15% opacity | Subtle structural lines |
| `--input` | `brightseed/sand/200` #EAE8DF | `brightseed/sand/700` at 20% opacity | Form field borders |
| `--ring` | `brightseed/lime/400` #B8D258 | `brightseed/sand/500` #AEAB9E | Focus indicator |
| `--ring-offset` | `brightseed/sand/50` #F9F8F3 | `brightseed/sand/950` #1F1F1E | Matches background |

### Destructive States

Destructive uses a soft tint, not a solid red fill (Apr 2026). Surface = light red tint, text = deep red. See "Locked-in decisions" in `CLAUDE.md`.

| shadcn slot | Light mode value | Dark mode value | Rationale |
|---|---|---|---|
| `--destructive` | `brightseed/red/100` | `brightseed/red/900` | Soft surface tint, matches Tag recipe pattern |
| `--destructive-foreground` | `brightseed/red/600` | `brightseed/red/300` | Deep red text on soft surface, passes WCAG AA |

### Sidebar

| shadcn slot | Light mode value | Dark mode value | Rationale |
|---|---|---|---|
| `--sidebar` | `brightseed/sand/50` #F9F8F3 | `brightseed/sand/900` #2A2925 | Same as background / card |
| `--sidebar-foreground` | `brightseed/forest/900` #305536 | `brightseed/sand/50` #F9F8F3 | Matches foreground |
| `--sidebar-primary` | `brightseed/lime/400` #B8D258 | `brightseed/lime/300` #CAE279 | Lime, still asymmetric, see note below |
| `--sidebar-primary-foreground` | `brightseed/sand/900` #2A2925 | `brightseed/sand/50` #F9F8F3 | Warm near-black light / warm white dark, diverges from main `--primary-foreground` (forest-800) |
| `--sidebar-accent` | `brightseed/lime/50` #F2FDE0 | `brightseed/sand/800` #46453F | Matches accent |
| `--sidebar-accent-foreground` | `brightseed/forest/800` #3F6947 | `brightseed/sand/50` #F9F8F3 | Matches accent-foreground |
| `--sidebar-border` | `brightseed/sand/200` #EAE8DF | `brightseed/sand/700` at 15% opacity | Matches border |
| `--sidebar-ring` | `brightseed/lime/400` #B8D258 | `brightseed/sand/500` #AEAB9E | Matches ring |

### Data Visualization (Chart Colors)

Hummingbird is a data-heavy product. These 5 chart colors map the legacy `--chart-1` through `--chart-5` shadcn slots to the brand palette. Updated Apr 2026, same value in both modes (chart series are theme-invariant by design).

| slot | Value | Name |
|---|---|---|
| `--chart-1` | `brightseed/forest/500` #669F71 | Forest mid |
| `--chart-2` | `brightseed/orange/500` #E88F3E | Eschscholzia |
| `--chart-3` | `brightseed/cyan/500` #00B4B6 | Cyan fill |
| `--chart-4` | `brightseed/red/500` #EE3A49 | Error fill, repurposed for chart |
| `--chart-5` | `brightseed/lavender/500` #8261FF | Lavender |

> Chart colors don't flip in dark mode, they stay the same hex but the background changes underneath them. Verify contrast on `brightseed/sand/950` background when implementing in dark theme.
>
> The richer 8-slot brand chart system lives in `tokens/charts.css` as `--chart-cat-1` through `--chart-cat-8` with colorblind-safe pairings. Prefer that system for new chart work; the `--chart-N` slots above are kept for shadcn Chart-component compatibility.

---

## Decisions

| # | Decision | Status | Answer |
|---|---|---|---|
| 1 | `--background` light: sand/50 or white? | ✅ Locked | **sand/50** (#F9F8F3) |
| 2 | `--destructive`: red or orange? | ✅ Locked | **Red:** red scale is "Error & Critical" |
| 3 | Visual check: lime/300 on forest/950 | ⏳ Pending | Becky reviewing |
| 4 | Dense data tables: sand or white? | ✅ Locked | **White:** component-level override |
| 5 | Dark theme anchor: sand or forest? | ✅ Locked (Apr 2026) | **Sand:** see note below |

### Note on Decision 4, Data Table Backgrounds

`--background` stays sand/50 globally, but data-dense tables need white. This is handled at the **component token level**, not by changing `--background`. In the `4. Custom` collection, add:

```
component/table/background = #FFFFFF (both modes)
component/table/foreground = brightseed/forest/900 (light) / brightseed/sand/50 (dark)
component/table/border = brightseed/sand/200 (light) / brightseed/sand/700 @15% (dark)
component/table/row-hover = brightseed/sand/50 (light) / brightseed/sand/800 (dark)
component/table/row-selected = brightseed/lime/50 (light) / brightseed/sand/800 (dark)
```

This keeps the global theme intact while giving Hummingbird's data tables the crisp white surface they need.

### Note on Decision 5, Dark Theme Anchor

When the stock tailwind palette was retired Apr 2026, dark-mode shadcn surfaces (`--background`, `--card`, `--popover`, `--secondary`, `--muted`, `--accent`, `--sidebar`, etc.) were migrated from `tailwind/neutral/*` (cool stock grays) to `brightseed/sand/*` (warm sand-tinted neutrals). They were *not* migrated to `brightseed/forest/*`, even though earlier versions of this doc named "Floor" (#133019 = forest/950) as the dark page-bg anchor.

**Why sand, not forest:**
- `brightseed/forest/*` is reserved for **brand chrome:** `--surface-brand`, branded headers, status surfaces. Using it for the page background dilutes the brand signal.
- Sand-tinted dark mode keeps tonal coherence with the light theme, both have warm undertones.
- Forest exits surface vocabulary in dark mode entirely. It stays only as text on the lime button (`forest-800` default, `forest-900` hover, `forest-950` active). Brand-context link colors moved to lime in May 2026, `--color-text-link-brand` is now `lime-700` light / `lime-300` dark. `--surface-brand` in dark mode resolves to `sand-900`, not forest.

**What this means for the brand palette:**
- "Floor" (#133019) and "Deep Forest" (#305536) remain named anchors in the brand palette, but they no longer back `--background`, `--card`, or `--surface-brand` in dark mode. They back `--foreground` (light mode text), `--primary-foreground` (text on lime), and other forest-specific roles. (Brand-link text moved to lime in May 2026, see CLAUDE.md "Brand-link uses lime, not forest" decision.)

**What this means for the CSS layer:**
- `tokens/semantics.css` was realigned Apr 2026 to use `brightseed/sand/*` as the dark-theme anchor, matching the shadcn Theme variables in Figma. The previous forest-based dark theme is retired.

**Outstanding divergence:** Figma's `colors/ring-dark` aliases to `sand/500`, while `tokens/semantics.css` keeps `--color-border-focus` as lime in both light and dark themes. Pending a design call on whether the focus ring should switch palettes in dark mode.

---

## Color Scale Reference

### Named Anchors (key values)
| Name | Hex | Role |
|---|---|---|
| Sand | #F9F8F3 | Light background |
| Deep Forest | #305536 | Dark text / surface |
| Floor | #133019 | Dark mode background |
| Eschscholzia | #E88F3E | Accent / chart |
| Cyan fill | #00B4B6 | Chart / data |
| Ocean | #113458 | Deep blue |
| Garlic Bloom | #782E5A | Chart / orchid |
| Error fill | #EE3A49 | Error state |
| Warning fill | #CAB900 | Warning state |

### Full Scales (for reference during variable entry)

**Sand:** #F9F8F3 / #F3F2EC / #EAE8DF / #DDDBCF / #CAC8BB / #AEAB9E / #8C897F / #68665E / #46453F / #2A2925 / #1F1F1E

**Forest:** #EEFBF1 / #E2F4E5 / #C9E7CF / #AAD4B2 / #86B990 / #669F71 / #51865C / #46764F / #3F6947 / #305536 / #133019

**Lime:** #F2FDE0 / #E9FACA / #E0F6AB / #CDE67B / #B8D258 / #A1B833 / #8B9D15 / #6F7E01 / #525C08 / #363C07 / #212404

**Cyan:** #E9FCFC / #D4F9F9 / #AEF3F3 / #6CE7E8 / #00D1D2 / #00B4B6 / #009193 / #006D6D / #004948 / #002B29 / #001312

**Blue:** #EEF8FF / #E0F1FF / #C4E1FF / #99C8FD / #5EA2ED / #237CD2 / #005AAE / #00448C / #00326A / #113458 / #00112B

**Yellow:** #FAF9E4 / #F6F4CA / #F2ECA1 / #ECDF6E / #DECE39 / #CAB900 / #A69400 / #7D6C00 / #514500 / #2E2600 / #151000

**Orange:** #FFF4E8 / #FFE9CF / #FFD7A8 / #FFBF79 / #FFA547 / #E88F3E / #CA6300 / #A34900 / #743200 / #4B2000 / #2A1100

**Red:** #FFF3F0 / #FFE6E2 / #FFD0CA / #FFAEA7 / #FF7D7B / #EE3A49 / #C9092E / #A00020 / #710013 / #46000C / #250104

**Lavender:** #F7F4FF / #EEEAFF / #DFD9FF / #C8BCFF / #A793FF / #8261FF / #6440DC / #4929AE / #2F197A / #190E4B / #090526

**Orchid:** #FFF2F9 / #FFE5F4 / #FFCCE7 / #F9A7D3 / #E57BB7 / #C75197 / #9F3275 / #782E5A / #50173A / #310E23 / #190511
