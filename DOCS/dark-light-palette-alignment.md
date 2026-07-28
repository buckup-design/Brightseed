# Dark & Light Palette Alignment Plan

> **Status:** Proposal, not yet applied. Drafted 2026-07-23 from the Figma "desired look and feel" board. No token files changed yet; no commits.
> **Source of truth reminder:** `tokens/*.css` + Storybook win. This doc is a plan; when it lands, delete the parts that become stale.
>
> **Decisions:** `lime-75` = `#e8f1da` **applied** (light nav selection). Dark field border → `sand-600` **applied** via a new `--ds-color-border-field` pair, verified in Storybook. Settled, not yet applied: `sand-25` = `#fdfcf8`. Still open: dark cards `sand-850`, AA stance.

## Where this came from

Becky refined the palette in Figma, **especially dark mode**, on the Collab Playground `color studies` page, board **"desired look and feel"** (`139:14057`). It holds four target screens:

| Screen | Node | Theme | What it is |
|---|---|---|---|
| Study 17 | `139:13968` | light | App-shell home ("What can I help you create today?") |
| Study 18 | `139:13879` | dark | App-shell home |
| Quill light | `142:17495` | light | Workspace / results canvas |
| Quill dark | `142:17498` | dark | Workspace / results canvas |

The board's Figma "Color Study" variables still equal the current tokens, so the **raw (unbound) fills are exactly the deliberate changes**. Everything below is extracted from those raw fills, then checked with OKLCH + WCAG math.

## Two reconciliations first

- **`#363C07` is not a new color, it is `lime-900`** (`--p-color-lime-900: #363c07`, already on the scale). The novelty is the *usage*: it is applied at **40% opacity** as the dark active-nav wash (flattens to `#282b15` over `sand-950`). No new primitive needed; this is a semantic-token change.
- **`sand-25` value settled at `#fdfcf8`** (OKLCH `L99.0 C0.005 H96`). The eyeballed `#fdfdfc` was cold: `L99.4 C0.001 H106`, i.e. chroma ≈ 0 and hue drifted off the ramp, so it reads faintly blue against warm sand. `#fdfcf8` extends the ramp one step above `sand-50` (`L97.9 C0.007 H97`), keeping the warm hue and a faint warm chroma. The two are near-identical alone but `#fdfcf8` stays warm in context.

## What the desired screens change

### Dark mode (the priority): a real elevation ladder

Today, dark mode is nearly one plane (sidebar, canvas, and panels all sit at `sand-950`/`sand-900`, measured **1.13:1** apart). The desired screens introduce a **four-step ladder** where the app chrome is darkest and content rises off it:

| Plane | Current token | Current value | **Desired value** | Role |
|---|---|---|---|---|
| App chrome (sidebar, page) | `surface-default` | `sand-950` #1f1f1e | `sand-950` #1f1f1e (unchanged) | Darkest, recedes |
| Content canvas / panels | `surface-canvas` | **`sand-950`** #1f1f1e | **`sand-900`** #2a2925 | Lifts off chrome |
| Cards / raised tiles | `surface-default` | `sand-950` #1f1f1e | **`#353430` (new `sand-850`)** | Rises above canvas |
| Inputs / composer | `surface-field` | `sand-800` #46453f | `sand-800` #46453f (unchanged) | Topmost, interactive |
| Active nav selection | `surface-selected-brand` | `lime-950` #212404 | **`lime-900` @ 40%** | Visible olive wash |

Selection is additionally carried by a **green label + icon** (`forest-500` #669f71) on the selected item, with unselected nav labels dropping to `sand-500` (muted). The wash is reinforcement, not the sole signal.

### Light mode (minor, "especially dark" implies light is mostly there)

| Element | Current | **Desired** | Note |
|---|---|---|---|
| Content canvas / panels | `surface-canvas` = `sand-100` #f3f2ec | `#fdfdfc` (proposed `sand-25`) | Brighter, airier base |
| Cards / composer | white | white (unchanged) | Raised surfaces stay pure white |
| Active nav selection | `lime-50` #f2fde0 | `#e8f1da` | Slightly deeper, greener pill |
| Borders | `sand-300` / `sand-200` | unchanged | Still hairline |

## The honest read (before committing)

Measured separation of the desired **dark** planes:

| Boundary | Current | Desired | 3:1 target |
|---|---|---|---|
| canvas vs sidebar | 1.13:1 | **1.13:1** | ✗ still |
| card vs canvas | — | 1.17:1 | ✗ |
| input/composer vs canvas | — | 1.51:1 | ✗ |
| active pill vs sidebar | 1.09:1 | 1.14:1 | ✗ |
| body text `sand-50` on card `#353430` | — | **11.72:1** | ✓✓ |

Takeaways, stated plainly:

1. **The depth is real but gentle.** No two adjacent planes clear 3:1. It reads as depth because the ladder has *four* steps and because hue does work the luminance does not (the green selected label, the warm card). This is a legitimate, restrained approach. It is **not** WCAG 1.4.11 compliance for surface boundaries, and it should not be sold as such.
2. **The input border is being lifted to `sand-600` (decided).** At 1.51:1 the composer fill does not separate from the canvas on its own, and in the desired dark screen its border is `sand-900` (*darker* than its `sand-800` fill), so it does nothing. A `sand-600` (`#8c897f`) border reads **4.16:1 against the canvas** it sits on (and 2.75:1 against the field interior): clearly findable, clears 3:1. `sand-600` is already the dark value of `--ds-color-border-bold`, so this needs no new primitive.
3. **The light change is a lateral move, not a clear win.** Today's `sand-100` canvas gives white cards genuine separation (white on warm-gray). Lifting the canvas to near-white `#fdfdfc` is airier but drops card separation to **1.02:1**, leaning entirely on borders + shadows. Fine if "open and bright" is the goal; know the tradeoff going in.
4. **`sand-25` may be unnecessary.** Since `#fdfdfc` is perceptually white and cooler than the ramp, consider using the existing **`sand-50`** (`#F9F8F3`, genuinely warm) for the light canvas instead of minting a near-duplicate-of-white primitive. Recommended.

## Proposed token edits

### 1. Primitives (`tokens/primitives.css`, sand block)

```css
  /* ── Sand (warm neutral surface, Sand at 50) ── */
  --p-color-sand-25:  #fdfcf8;  /* NEW: warm near-white light canvas base.
                                   OKLCH L99.0 C0.005 H96 — one step above sand-50
                                   (L97.9 C0.007), keeps the ramp's warm hue. Replaces the
                                   eyeballed #fdfdfc, which was cold (C0.001, H106). */
  --p-color-sand-50:  #F9F8F3;
  /* …unchanged… */
  --p-color-sand-800: #46453f;
  --p-color-sand-850: #353430;  /* NEW: raised card surface (dark). Fills the large
                                   sand-800(L39)→sand-900(L28) gap at L32.5, warm C0.007. */
  --p-color-sand-900: #2a2925;
  --p-color-sand-950: #1F1F1E;
```

Adds two half-steps to the sand ramp only (other scales stay 50–950). Document as intentional.

### 2. New semantics: `surface-raised` + `border-field` (both blocks of `tokens/semantics.css`)

`surface-raised` is a card/raised role that is white on the warm light base and `sand-850` on the dark canvas. Add next to `surface-alt`:

```css
/* light block */
  --ds-color-surface-raised:          var(--p-color-white);       /* cards, composer sit above canvas */
/* [data-theme="dark"] block */
  --ds-color-surface-raised:          var(--p-color-sand-850);    /* #353430, lifts off sand-900 canvas */
```

`border-field` (decided) makes the input boundary findable: `sand-600` in dark (4.16:1 vs the canvas). Light stays at today's `sand-300` until the AA stance (open #3) is settled, so this change is dark-only for now:

```css
/* light block */
  --ds-color-border-field:            var(--p-color-sand-300);    /* unchanged for now; revisit under AA stance */
/* [data-theme="dark"] block */
  --ds-color-border-field:            var(--p-color-sand-600);    /* #8c897f, input findable on the dark canvas */
```

> Simpler alternative: skip `border-field` and point the input tokens at the existing `--ds-color-border-bold` (already `sand-600` dark). That also lifts the **light** field border to `sand-500` (~1.9:1, up from `sand-300`'s 1.39:1), a likely-good side effect, but it couples the decision to open #3. The dedicated `border-field` token keeps light untouched until you decide.

### 3. Semantics — dark (`tokens/semantics.css`, `[data-theme="dark"]`)

```css
/* line ~383 */
- --ds-color-surface-canvas:          var(--p-color-sand-950);
+ --ds-color-surface-canvas:          var(--p-color-sand-900);   /* lift content inset off the sand-950 chrome */

/* line ~448 */
- --ds-color-surface-selected-brand:  var(--p-color-lime-950);   /* dark mirror of lime-50 selection */
+ --ds-color-surface-selected-brand:  color-mix(in srgb, var(--p-color-lime-900) 40%, transparent);
+                                                                  /* lime-900 @40% olive wash; visible over sand-950/900 */
```

### 4. Semantics — light (`tokens/semantics.css`, `:root`)

```css
/* line ~48  — RECOMMENDED: use existing warm sand-50, not a new sand-25 */
- --ds-color-surface-canvas:          var(--p-color-sand-100);
+ --ds-color-surface-canvas:          var(--p-color-sand-50);    /* brighter, warm near-white base */
/*   (alternative, matches Figma literally: var(--p-color-sand-25)) */

/* line ~81 — optional refinement */
- --ds-color-surface-selected-brand:  var(--p-color-lime-50);
+ --ds-color-surface-selected-brand:  var(--p-color-lime-75);    /* #e8f1da, deeper green pill — needs a lime-75 primitive, or keep lime-50 */
```

`#e8f1da` is off-scale (`L94.5 C0.032 H124`). If wanted, mint `--p-color-lime-75: #e8f1da`; otherwise keep `lime-50`. Lowest-priority change.

### 5. Components (`tokens/components.css`)

```css
/* line ~162 — point cards at the new raised role */
- --c-card-surface-default:    var(--ds-color-surface-default);
+ --c-card-surface-default:    var(--ds-color-surface-raised);

/* line ~228 + ~504 — make the input/textarea boundary findable (decided) */
- --c-input-border-default:            var(--ds-color-border-default);
+ --c-input-border-default:            var(--ds-color-border-field);
- --c-textarea-border-default:          var(--ds-color-border-default);
+ --c-textarea-border-default:          var(--ds-color-border-field);
```

Also repoint the Quill composer's field border (in `components/quill/`) at `--ds-color-border-field` if it doesn't already inherit the input token. Composer/input **fill** stays `surface-field` for now (matches desired dark `sand-800`); revisit in phase 2 if the light composer should read as raised-white rather than `sand-50` field.

## Risks / secondary effects to check

- **`surface-alt` == `surface-canvas` in dark** once canvas moves to `sand-900` (both `sand-900`). Panels/regions are fine merging, but `surface-alt` also drives hover states, table alt-rows, and toggle surfaces. Those hovers will now match the canvas and may lose visibility. Audit Toggle, Table, and any `*-hover` that resolves to `surface-alt`.
- **Cards on white light canvas**: with the light canvas at `sand-50`/`sand-25`, white cards (`surface-raised`) separate only ~1.0–1.4:1. Confirm the card border (`sand-300`, 1.39:1) plus shadow still reads.
- ~~**Dark input boundary**~~: done — see Decisions.
- **Contrast floor**: DESIGN.md claims a WCAG 2.1 AA floor. This plan improves perceived depth but does not make surface boundaries clear 3:1. If AA-for-boundaries is a hard requirement, that is a separate, larger change (visible borders on every interactive surface).

## Implementation phases

1. **Primitives**: add `sand-850` (and `sand-25` only if not using `sand-50`). Add `lime-75` only if adopting the `#e8f1da` pill.
2. **Semantics**: add `surface-raised` (both themes); dark `surface-canvas` → `sand-900`; dark `surface-selected-brand` → `lime-900 @40%`; light `surface-canvas` → `sand-50`.
3. **Components**: repoint `--c-card-surface-default` → `surface-raised`.
4. **Verify in Storybook** (`preview_start name=brightseed-storybook`, port 6006) in **both** themes: App Shell Quill, Workspace Canvas, Card, Sidebar. Confirm the dark ladder reads and nothing that used `surface-alt` for hover went invisible.
5. **Compare against the four Figma target screens** side by side.
6. **Decide** the honest-read open items (input border, light tradeoff, AA stance) before promoting.

## Decisions

**Applied to `tokens/` (uncommitted):**
- **`lime-75` = `#e8f1da`** — new primitive (`primitives.css`); light nav selection (`--ds-color-surface-selected-brand`, `semantics.css:81`) now points at it. Verified in Storybook `Components/Sidebar`: active item paints `rgb(232,241,218)`, forest-800 label 5.42:1. It is a *muted mint*, deliberately lower-chroma and slightly darker than lime-100, so it is **not** a pure ramp step (documented in the primitive's comment so nobody "fixes" it). Dark selection unchanged (part of the still-open dark rework).

- **Dark field border** → `sand-600`, **applied** as the `--ds-color-border-field` / `-field-hover` pair (`semantics.css`, both theme blocks). Rolled across the whole field family, not just Input: Input, Textarea, Select **trigger**, Input Group, Checkbox, and both composers (the `new-chat` Block token and the Workspace chat panel's leaf `--ds-*`). Light is byte-identical to before (`border-field` == `border-default` == sand-300 there), so this is a dark-only change by construction.
  - **Hover needed its own token.** Dark `border-default-hover` is *already* `sand-600`, so pointing field-hover at it would have made rest and hover identical and killed the hover signal. `border-field-hover` is `sand-500` (7.16:1) in both themes.
  - **Select needed a token split.** `--c-select-border-default` was serving three jobs — the trigger (a field), the dropdown popover edge, and the in-menu separator. Lifting all three would have brightened a hairline divider in dark. The trigger now reads a new `--c-select-border-field`; popover + separator keep `-border-default`. Verified: trigger sand-600, popover edge sand-700.
  - **Measured, correcting this doc's own number:** sand-600 reads **4.71:1 against today's `sand-950` canvas** (the 4.16:1 above is against the *proposed* `sand-900` canvas). Either way it clears 3:1; the previous `sand-700` was **2.87:1**, under. So this change stands on its own whether or not the canvas lift lands.
  - Swept the Workspace canvas in dark: **exactly one** element paints the new border (the composer). No collateral.

**Settled, not yet applied:**
- **`sand-25`** = `#fdfcf8` (OKLCH `L99.0 C0.005 H96`) for the light canvas.

- **`sand-850` dark cards — APPLIED.** New `--p-color-sand-850` (`#353430`) + a `--ds-color-surface-raised` role. Light is identical to `surface-default` (white), so dark-only by construction. Cards lifted: the `Card` primitive (reports / conversations / projects / report-document / login) and `ResultCard`'s non-predicted body.
  - **It could not be a one-line swap.** `--ds-color-surface-alt` (dark `sand-900`) means "one step up from the PAGE", and it is used for chips, footers and icon tiles *inside* cards. Because `sand-850` is **lighter** than `sand-900`, every one of those nested fills would have rendered **darker than the card containing it** — an elevation inversion, most visibly in ResultCard (pills + the ScoreMeter footer). So this adds a companion **`--ds-color-surface-raised-alt`** (dark `sand-800`, light `sand-100` = unchanged) for fills nested inside a raised card, giving a real dark ladder: page `sand-950` → card `sand-850` → nested `sand-800`.
  - Repointed to `-raised-alt`: ResultCard pills / category chips / footer, the reports + conversations + projects row icon tiles, and `StatusBadge`'s neutral tone. Reports and conversations needed their `--c-*-surface-alt` **split in two** (empty-state icon sits on the canvas, row tile sits in a card) — same shape as the `--c-select-border-*` split.
  - **Measured:** card vs page **1.32:1** — *better* than this doc's projected 1.17:1, because the canvas has not lifted to `sand-900`. ScoreMeter fill on the new `sand-800` footer is **5.85:1**, no regression from the old `sand-900` footer.
  - **Verified by sweep**, not by eye: a script walks every element and flags any fill darker than its nearest opaque ancestor. Workspace canvas **0**; reports list **1** (below).

**Still open (Becky thinking):**
1. **AA stance**: is "gentle perceived depth" the goal, or do surface boundaries need to clear 3:1 (a bigger change)? This also decides whether the light field border lifts with the dark one.
2. **Dark intent surfaces on a raised card.** Per CLAUDE.md the dark intent recipe is `color-mix(intent-step 10–15%, sand-950)` — mixed against the **page**. On a `sand-850` card they now sit slightly darker than their backdrop: the "Completed" `StatusBadge` computes L 0.0216 on an L 0.0343 card. It still reads as a green chip rather than a dent, so it is left alone — but if intent chips should hold elevation on cards, the whole family (success / info / warning / critical) needs raised counterparts. One decision, four token pairs.
3. **The canvas lift to `sand-900` is still unapplied**, so the ladder is currently page → card → nested, not the four-step ladder this doc describes. Cards lift *more* without it; revisit if the canvas moves.
