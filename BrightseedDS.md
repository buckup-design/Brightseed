# BrightseedDS.md — Forager Design System (skeleton)

> **Status:** Token vocabulary complete. Sections 3.1–3.7 are fully populated: 10 color scales (OKLCH, WCAG-verified), intent aliases, semantic layer (light + dark), spacing/typography conventions, shape tokens, and chart/data viz tokens. Section 5 (component API docs) and open questions #5, #6, #9 remain. Section 6 worked examples (StatCard, RunAssayButton, DoseResponseChart) are done.

> **Audience:** This file is written to be pasted into an AI coding agent (Claude, Cursor, v0, Copilot) alongside a prompt. It is the single source of truth the agent consults when generating Forager UI. Humans may read it too, but its primary reader is a model.

---

## How to use this file

You are generating production-grade UI for **Forager**, Brightseed's biotech application. You have access to:

1. The **token vocabulary** in Section 3 — every color, spacing, typography, shape, and chart token available to you.
2. The **composition rules** in Section 4 — when to reach for which token.
3. The **component library** in Section 5 — the shadcn/ui components Forager exposes.
4. The **worked examples** in Section 6 — prompt-to-code transformations that show the expected output style.
5. The **anti-examples** in Section 7 — patterns that are explicitly forbidden.

**Rules of engagement:**

- Only reference tokens that exist in Section 3. Do not invent tokens.
- Only use shadcn/ui components listed in Section 5. Do not import from other libraries.
- Never hardcode hex values, px values, or font names. Always reference tokens.
- Light theme is the default. Dark theme is handled by `data-theme="dark"` on an ancestor element — do not write dark-mode-specific code.
- If you can't find a token or component that fits the prompt, stop and flag it with a comment beginning `// BRIGHTSEED-TBD:`. Do not improvise.

---

## 1. Core principles

Five non-negotiables. These come before any token or component decision.

1. **Tokens over values.** Every color, space, radius, and type style references a token. No hardcoded hex, px, rem, or font strings in component code.
2. **Functional names only.** Colors are named by hue (`forest-700`, `lavender-400`, `cyan-300`), not by brand-poetic names. The brand names live in the brand reference file, nowhere else.
3. **Semantic before primitive.** Prefer semantic tokens (`--color-surface-default`) over primitive tokens (`--color-neutral-50`) in component code. Primitives exist so semantics can reference them, not so you can reach past the semantic layer.
4. **One scale for sizing and spacing.** The same scale tokens handle width, height, padding, margin, gap, icon size, and radius. Do not split them.
5. **Light-first, dark via CSS variable override.** The entire token system is authored for light theme. Dark theme is a single `[data-theme="dark"]` override on the primitives layer. Component code is theme-agnostic.

---

## 2. Architecture

The system has three layers. An LLM reading tokens should understand which layer it's allowed to reference.

```
Layer 1 — Primitives         e.g. --color-forest-700
            ↓ var() reference
Layer 2 — Intents            e.g. --success-700 = var(--color-forest-700)
            ↓ var() reference
Layer 3 — Semantics          e.g. --color-surface-success = var(--success-100)
```

**Rule:** Component code references **semantics** (Layer 3) unless no semantic exists for the need. Intent tokens (Layer 2) are a fallback. Primitives (Layer 1) are a last resort and should almost never appear in component code.

**Never** ship compiled-flat CSS. All `var()` chains stay live so theme switching works by overriding Layer 1 at `:root[data-theme="dark"]`.

---

## 3. Token vocabulary

*Placeholder section — actual token tables land on Day 2-3. Below is the shape, not the values.*

### 3.1 Color primitives (hue scales)

Eleven-step scales at 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950. All built in OKLCH for perceptual uniformity. Brand anchor steps are noted inline.

In addition, two universals: `--color-white` (`#ffffff`) and `--color-black` (`#000000`). White is the page surface anchor (light theme); black is a utility for shadows and full-opacity overlays. Neither participates in scales.

| Hue | Role | Anchor | AA floor on white |
|---|---|---|---|
| `--color-forest-*` | Brand surface (Deep Forest) | 900 = `#305536` | forest-700 |
| `--color-lime-*` | Brand action | 400 = `#B8D258` | lime-800 |
| `--color-sand-*` | Warm neutral (sidebars, alt surfaces, hover states, inverse text on dark) | 50 = `#F9F8F3` | sand-700 |
| `--color-orange-*` | Accent (Eschscholzia) | 500 = `#E88F3E` | orange-700 |
| `--color-blue-*` | Info semantic (Ocean) | 900 = `#113458` | blue-600 |
| `--color-cyan-*` | Light blue / data viz | — generated | cyan-700 |
| `--color-lavender-*` | Violet / data viz (H=287° OKLCH) | 700 = `#4929ae` | lavender-700 |
| `--color-orchid-*` | Pink-mauve / data viz (Garlic Bloom) | 700 = `#782e5a` | orchid-700 |
| `--color-red-*` | Error / critical semantic | — generated | red-600 |
| `--color-neutral-*` | Cool gray UI chrome | — generated | neutral-700 |
| `--color-yellow-*` | Warning / caution semantic | — generated | yellow-700 |

```css
:root {

  /* ── Universals ── */
  --color-white:    #ffffff;
  --color-black:    #000000;

  /* ── Forest (brand surface — Deep Forest at 900) ── */
  --color-forest-50:  #eefbf1;
  --color-forest-100: #e2f4e5;
  --color-forest-200: #c9e7cf;
  --color-forest-300: #aad4b2;
  --color-forest-400: #86b990;
  --color-forest-500: #669f71;
  --color-forest-600: #51865c;
  --color-forest-700: #46764f;
  --color-forest-800: #3f6947;
  --color-forest-900: #305536;  /* Deep Forest — brand surface anchor */
  --color-forest-950: #133019;

  /* ── Lime (brand action — anchor at 400) ── */
  --color-lime-50:  #f2fde0;
  --color-lime-100: #e9faca;
  --color-lime-200: #e0f6ab;
  --color-lime-300: #CDE67B;  /* lime button default surface (retuned Apr 2026 from #CAE279 for AA with forest-800 text) */
  --color-lime-400: #b8d258;  /* lime button hover surface (was the default anchor before Apr 2026) */
  --color-lime-500: #a1b833;
  --color-lime-600: #8b9d15;
  --color-lime-700: #6f7e01;
  --color-lime-800: #525c08;
  --color-lime-900: #363c07;
  --color-lime-950: #212404;

  /* ── Sand (warm neutral surface — Sand at 50) ── */
  --color-sand-50:  #F9F8F3;  /* Sand — warm surface anchor */
  --color-sand-100: #f3f2ec;
  --color-sand-200: #eae8df;
  --color-sand-300: #dddbcf;
  --color-sand-400: #cac8bb;
  --color-sand-500: #aeab9e;
  --color-sand-600: #8c897f;
  --color-sand-700: #68665e;
  --color-sand-800: #46453f;
  --color-sand-900: #2a2925;
  --color-sand-950: #1F1F1E;

  /* ── Orange (accent — Eschscholzia at 500) ── */
  --color-orange-50:  #fff4e8;
  --color-orange-100: #ffe9cf;
  --color-orange-200: #ffd7a8;
  --color-orange-300: #ffbf79;
  --color-orange-400: #ffa547;
  --color-orange-500: #E88F3E;  /* Eschscholzia — accent anchor */
  --color-orange-600: #ca6300;
  --color-orange-700: #a34900;
  --color-orange-800: #743200;
  --color-orange-900: #4b2000;
  --color-orange-950: #2a1100;

  /* ── Blue (info semantic — Ocean at 900) ── */
  --color-blue-50:  #eef8ff;
  --color-blue-100: #e0f1ff;
  --color-blue-200: #c4e1ff;
  --color-blue-300: #99c8fd;
  --color-blue-400: #5ea2ed;
  --color-blue-500: #237cd2;
  --color-blue-600: #005aae;
  --color-blue-700: #00448c;
  --color-blue-800: #00326a;
  --color-blue-900: #113458;  /* Ocean — info anchor */
  --color-blue-950: #00112b;

  /* ── Cyan (light blue — H=195° OKLCH) ── */
  --color-cyan-50:  #e9fcfc;
  --color-cyan-100: #d4f9f9;
  --color-cyan-200: #aef3f3;
  --color-cyan-300: #6ce7e8;
  --color-cyan-400: #00d1d2;
  --color-cyan-500: #00b4b6;
  --color-cyan-600: #009193;
  --color-cyan-700: #006d6d;
  --color-cyan-800: #004948;
  --color-cyan-900: #002b29;
  --color-cyan-950: #001312;

  /* ── Lavender (violet — H=287° OKLCH, updated from Figma DS v1) ── */
  --color-lavender-50:  #f7f4ff;
  --color-lavender-100: #eeeaff;
  --color-lavender-200: #dfd9ff;
  --color-lavender-300: #c8bcff;
  --color-lavender-400: #a793ff;
  --color-lavender-500: #8261ff;
  --color-lavender-600: #6440dc;
  --color-lavender-700: #4929ae;  /* AA on Sand ✓ */
  --color-lavender-800: #2f197a;
  --color-lavender-900: #190e4b;
  --color-lavender-950: #090526;

  /* ── Red (error / critical — H=22° OKLCH) ── */
  --color-red-50:  #fff3f0;
  --color-red-100: #ffe6e2;
  --color-red-200: #ffd0ca;
  --color-red-300: #ffaea7;
  --color-red-400: #ff7d7b;
  --color-red-500: #ee3a49;
  --color-red-600: #c9092e;
  --color-red-700: #a00020;
  --color-red-800: #710013;
  --color-red-900: #46000c;
  --color-red-950: #250104;

  /* ── Neutral (cool gray UI chrome — H=264° OKLCH) ── */
  --color-neutral-50:  #f6f8fb;
  --color-neutral-100: #eef0f4;
  --color-neutral-200: #e1e4e9;
  --color-neutral-300: #ced2d8;
  --color-neutral-400: #b4b7be;
  --color-neutral-500: #95989f;
  --color-neutral-600: #72747a;
  --color-neutral-700: #505357;
  --color-neutral-800: #313336;
  --color-neutral-900: #1a1b1c;
  --color-neutral-950: #08090a;

  /* ── Orchid (pink-mauve / data viz — Garlic Bloom at 700) ── */
  --color-orchid-50:  #fff2f9;
  --color-orchid-100: #ffe5f4;
  --color-orchid-200: #ffcce7;
  --color-orchid-300: #f9a7d3;
  --color-orchid-400: #e57bb7;
  --color-orchid-500: #c75197;
  --color-orchid-600: #9f3275;
  --color-orchid-700: #782e5a;  /* Garlic Bloom — brand anchor */
  --color-orchid-800: #50173a;
  --color-orchid-900: #310e23;
  --color-orchid-950: #190511;

  /* ── Yellow (warning / caution — H=103° OKLCH) ── */
  --color-yellow-50:  #faf9e4;
  --color-yellow-100: #f6f4ca;
  --color-yellow-200: #f2eca1;
  --color-yellow-300: #ecdf6e;
  --color-yellow-400: #dece39;
  --color-yellow-500: #cab900;
  --color-yellow-600: #a69400;
  --color-yellow-700: #7d6c00;
  --color-yellow-800: #514500;
  --color-yellow-900: #2e2600;
  --color-yellow-950: #151000;

}
```

### 3.2 Color intent aliases

Each intent maps a meaningful role name to a primitive scale via `var()`. No values are duplicated — the intent layer is purely an indirection layer. The semantic layer (3.3) references intents, not primitives directly.

```css
:root {

  /* ── Action: lime — CTAs, primary buttons, focus rings ── */
  --action-primary-50:  var(--color-lime-50);
  --action-primary-100: var(--color-lime-100);
  --action-primary-200: var(--color-lime-200);
  --action-primary-300: var(--color-lime-300);
  --action-primary-400: var(--color-lime-400);
  --action-primary-500: var(--color-lime-500);
  --action-primary-600: var(--color-lime-600);
  --action-primary-700: var(--color-lime-700);
  --action-primary-800: var(--color-lime-800);
  --action-primary-900: var(--color-lime-900);
  --action-primary-950: var(--color-lime-950);

  /* ── Surface brand: Deep Forest — nav, headers, branded chrome ── */
  --surface-brand-50:  var(--color-forest-50);
  --surface-brand-100: var(--color-forest-100);
  --surface-brand-200: var(--color-forest-200);
  --surface-brand-300: var(--color-forest-300);
  --surface-brand-400: var(--color-forest-400);
  --surface-brand-500: var(--color-forest-500);
  --surface-brand-600: var(--color-forest-600);
  --surface-brand-700: var(--color-forest-700);
  --surface-brand-800: var(--color-forest-800);
  --surface-brand-900: var(--color-forest-900);
  --surface-brand-950: var(--color-forest-950);

  /* ── Success: forest — shares hue with surface-brand; uses light steps (50–300) ── */
  --success-50:  var(--color-forest-50);
  --success-100: var(--color-forest-100);
  --success-200: var(--color-forest-200);
  --success-300: var(--color-forest-300);
  --success-400: var(--color-forest-400);
  --success-500: var(--color-forest-500);
  --success-600: var(--color-forest-600);
  --success-700: var(--color-forest-700);
  --success-800: var(--color-forest-800);
  --success-900: var(--color-forest-900);
  --success-950: var(--color-forest-950);

  /* ── Info: Ocean/blue ── */
  --info-50:  var(--color-blue-50);
  --info-100: var(--color-blue-100);
  --info-200: var(--color-blue-200);
  --info-300: var(--color-blue-300);
  --info-400: var(--color-blue-400);
  --info-500: var(--color-blue-500);
  --info-600: var(--color-blue-600);
  --info-700: var(--color-blue-700);
  --info-800: var(--color-blue-800);
  --info-900: var(--color-blue-900);
  --info-950: var(--color-blue-950);

  /* ── Warning: yellow ── */
  --warning-50:  var(--color-yellow-50);
  --warning-100: var(--color-yellow-100);
  --warning-200: var(--color-yellow-200);
  --warning-300: var(--color-yellow-300);
  --warning-400: var(--color-yellow-400);
  --warning-500: var(--color-yellow-500);
  --warning-600: var(--color-yellow-600);
  --warning-700: var(--color-yellow-700);
  --warning-800: var(--color-yellow-800);
  --warning-900: var(--color-yellow-900);
  --warning-950: var(--color-yellow-950);

  /* ── Critical: red ── */
  --critical-50:  var(--color-red-50);
  --critical-100: var(--color-red-100);
  --critical-200: var(--color-red-200);
  --critical-300: var(--color-red-300);
  --critical-400: var(--color-red-400);
  --critical-500: var(--color-red-500);
  --critical-600: var(--color-red-600);
  --critical-700: var(--color-red-700);
  --critical-800: var(--color-red-800);
  --critical-900: var(--color-red-900);
  --critical-950: var(--color-red-950);

  /* ── Data: cyan — primary data viz series ── */
  --data-cyan-50:  var(--color-cyan-50);
  --data-cyan-100: var(--color-cyan-100);
  --data-cyan-200: var(--color-cyan-200);
  --data-cyan-300: var(--color-cyan-300);
  --data-cyan-400: var(--color-cyan-400);
  --data-cyan-500: var(--color-cyan-500);
  --data-cyan-600: var(--color-cyan-600);
  --data-cyan-700: var(--color-cyan-700);
  --data-cyan-800: var(--color-cyan-800);
  --data-cyan-900: var(--color-cyan-900);
  --data-cyan-950: var(--color-cyan-950);

  /* ── Data: lavender — secondary data viz series ── */
  --data-lavender-50:  var(--color-lavender-50);
  --data-lavender-100: var(--color-lavender-100);
  --data-lavender-200: var(--color-lavender-200);
  --data-lavender-300: var(--color-lavender-300);
  --data-lavender-400: var(--color-lavender-400);
  --data-lavender-500: var(--color-lavender-500);
  --data-lavender-600: var(--color-lavender-600);
  --data-lavender-700: var(--color-lavender-700);
  --data-lavender-800: var(--color-lavender-800);
  --data-lavender-900: var(--color-lavender-900);
  --data-lavender-950: var(--color-lavender-950);

  /* ── Data: orange — tertiary data viz / Eschscholzia accent ── */
  --data-orange-50:  var(--color-orange-50);
  --data-orange-100: var(--color-orange-100);
  --data-orange-200: var(--color-orange-200);
  --data-orange-300: var(--color-orange-300);
  --data-orange-400: var(--color-orange-400);
  --data-orange-500: var(--color-orange-500);
  --data-orange-600: var(--color-orange-600);
  --data-orange-700: var(--color-orange-700);
  --data-orange-800: var(--color-orange-800);
  --data-orange-900: var(--color-orange-900);
  --data-orange-950: var(--color-orange-950);

  /* ── Data: orchid — quaternary data viz / Garlic Bloom accent ── */
  --data-orchid-50:  var(--color-orchid-50);
  --data-orchid-100: var(--color-orchid-100);
  --data-orchid-200: var(--color-orchid-200);
  --data-orchid-300: var(--color-orchid-300);
  --data-orchid-400: var(--color-orchid-400);
  --data-orchid-500: var(--color-orchid-500);
  --data-orchid-600: var(--color-orchid-600);
  --data-orchid-700: var(--color-orchid-700);
  --data-orchid-800: var(--color-orchid-800);
  --data-orchid-900: var(--color-orchid-900);
  --data-orchid-950: var(--color-orchid-950);

}
```

**Note:** `success-*` and `surface-brand-*` point at the same forest primitive scale. This is intentional — brand chrome uses the dark end (700–950) and success semantics use the light end (50–300). They do not collide in practice.

**Data viz series order:** cyan (primary) → lavender (secondary) → orange (tertiary) → orchid (quaternary). Assign in this order when adding chart series. The lavender scale was tuned to H=287° (more violet) in Figma DS v1 to improve visual separation from blue.

### 3.3 Color semantics

Component code references these tokens. State suffixes (`-hover`, `-active`, `-disabled`) are the complete interactive set — never reach into primitives for state variants.

**Light theme (default `：root`):**

```css
:root {

  /* ── Surface ── */
  --color-surface-default:         var(--color-white);         /* #ffffff — page background */
  --color-surface-default-hover:   var(--color-sand-100);
  --color-surface-default-active:  var(--color-sand-200);
  --color-surface-alt:             var(--color-sand-100);      /* sidebar, table alt rows, inset panels */
  --color-surface-alt-hover:       var(--color-sand-200);

  /* Brand surface — nav bar, header, branded panels */
  --color-surface-brand:           var(--surface-brand-900);   /* Deep Forest */
  --color-surface-brand-hover:     var(--surface-brand-800);
  --color-surface-brand-active:    var(--surface-brand-950);
  --color-surface-brand-subtle:    var(--surface-brand-50);    /* light forest tint — branded but not heavy */

  /* Semantic surfaces — alert backgrounds, callout tints */
  --color-surface-success:         var(--success-50);
  --color-surface-success-hover:   var(--success-100);
  --color-surface-success-active:  var(--success-200);
  --color-surface-info:            var(--info-50);
  --color-surface-info-hover:      var(--info-100);
  --color-surface-info-active:     var(--info-200);
  --color-surface-warning:         var(--warning-50);
  --color-surface-warning-hover:   var(--warning-100);
  --color-surface-warning-active:  var(--warning-200);
  --color-surface-critical:        var(--critical-50);
  --color-surface-critical-hover:  var(--critical-100);
  --color-surface-critical-active: var(--critical-200);
  --color-surface-data:            var(--data-cyan-50);        /* default data panel tint */
  --color-surface-selected:        var(--info-50);             /* selected row / focused item — blue-50 */
  --color-surface-selected-hover:  var(--info-100);
  --color-surface-selected-active: var(--info-200);

  /* ── Action ── */
  /* Disabled rule (uniform across all Button variants):
       surface  = color-mix(<default-state surface>, --color-disabled-surface-overlay 50%);
       text + icon = the variant's normal foreground token, applied at --disabled-text-opacity.
     Light theme pulls surface toward light sand; dark theme pulls toward dark sand.
     The text fade is theme-invariant — same opacity in both themes. */
  --color-disabled-surface-overlay: var(--color-sand-100);
  --disabled-text-opacity:          0.55;

  /* Primary: lime fill. Surface ladder shifted down one step Apr 2026 — lime-300
     default → lime-400 hover → lime-500 pressed. lime-300 retuned (#CAE279 →
     #CDE67B) to pass WCAG AA with forest-800 text. */
  --color-action-primary:          var(--action-primary-300);
  --color-action-primary-hover:    var(--action-primary-400);
  --color-action-primary-active:   var(--action-primary-500);
  --color-action-primary-disabled: color-mix(in srgb, var(--color-action-primary), var(--color-disabled-surface-overlay) 50%);

  /* Secondary: outlined / ghost — surface follows page bg so they visually merge */
  /* Secondary: faint solid sand bg, no border. Anchored at sand-100 so it's
     visibly distinct from page bg at default and steps darker per state. */
  --color-action-secondary:          var(--color-sand-100);
  --color-action-secondary-hover:    var(--color-sand-200);
  --color-action-secondary-active:   var(--color-sand-300);
  --color-action-secondary-disabled: var(--color-sand-50);

  /* Critical: destructive — soft style. red-100 surface, red-600 text.
     Refactored Apr 2026 from solid red-500 fill to discrete-step soft tint. */
  --color-action-critical:          var(--critical-100);
  --color-action-critical-hover:    var(--critical-200);
  --color-action-critical-active:   var(--critical-300);
  --color-action-critical-disabled: color-mix(in srgb, var(--color-action-critical), var(--color-disabled-surface-overlay) 50%);

  /* Text on the destructive (soft red) action. */
  --color-text-on-action-critical:           var(--critical-600);
  --color-text-on-action-critical-hover:     var(--critical-700);
  /* No -disabled token — disabled state uses --color-text-on-action-critical at --disabled-text-opacity. */

  /* ── Border ── */
  --color-border-subtle:           var(--color-sand-200);      /* hairlines, table grid */
  --color-border-default:          var(--color-sand-300);      /* input default */
  --color-border-bold:             var(--color-sand-500);      /* emphatic dividers */
  /* Focus rings — variant-aware. Default uses lime (the system action color);
     destructive uses its own hue scale; secondary uses sand. Linktext is in the
     lime family too, so its focus ring matches Default — kept as a separate
     token name for namespace clarity in case it ever diverges. */
  --color-border-focus:             var(--action-primary-500);  /* lime/500 — Default, Outline, Ghost focus */
  --color-border-focus-secondary:   var(--color-sand-300);      /* sand/300 — Secondary focus (matches Figma base/ring) */
  --color-border-focus-destructive: var(--critical-500);        /* red/500 — Destructive focus */
  --color-border-focus-link-brand:  var(--action-primary-500);  /* lime/500 — Linktext focus (same as Default) */

  --color-border-success-default:  var(--success-200);
  --color-border-success-bold:     var(--success-600);
  --color-border-info-default:     var(--info-200);
  --color-border-info-bold:        var(--info-600);
  --color-border-warning-default:  var(--warning-200);
  --color-border-warning-bold:     var(--warning-600);
  --color-border-critical-default: var(--critical-200);
  --color-border-critical-bold:    var(--critical-600);

  /* ── Text ── */
  --color-text-default:            var(--color-sand-900);      /* #2a2925 — warm near-black */
  --color-text-default-hover:      var(--color-sand-950);      /* one step "more pronounced" — used by
                                                                  Secondary / Outline / Ghost button text on hover */
  --color-text-subtle:             var(--color-sand-700);      /* secondary / helper text */
  --color-text-disabled:           var(--color-sand-500);      /* generic flat disabled — for non-button contexts
                                                                  (form labels, static text). Buttons use the alpha
                                                                  rule on their normal foreground instead. */

  /* Inverse — text on Deep Forest surfaces or any dark panel */
  --color-text-inverse:            var(--color-sand-50);
  --color-text-inverse-subtle:     var(--color-sand-300);

  /* Text on the lime primary action.
     Three steps to match the three-step surface ladder. forest-950 active is
     required for WCAG AA on the deeper lime-500 active surface. Theme-invariant. */
  --color-text-on-action-primary:           var(--color-forest-800);
  --color-text-on-action-primary-hover:     var(--color-forest-900);
  --color-text-on-action-primary-active:    var(--color-forest-950);
  /* No -disabled token — disabled state uses --color-text-on-action-primary at --disabled-text-opacity. */

  /* Link — two distinct components with different state machines.
       link-*  → the inline `<a>` Link component for body copy. Always
                 underlined. Has anchor pseudo-class states: link / visited /
                 hover / focus / active. Blue scale.
       link-brand → the Button component's "Linktext/default" variant —
                 button-shaped, never underlined, button-state machine
                 (default/hover/focus/loading/disabled/pressed). Lime scale —
                 same family as the primary button surface, signaling that
                 Linktext is the brand-link affordance.
     The bare --color-text-link alias is intentionally NOT exposed so callers
     must be explicit about which component they're in. */
  --color-text-link-default:       var(--info-600);            /* blue-600 — :link */
  --color-text-link-default-hover: var(--info-700);            /* blue-700 — :hover */
  --color-text-link-visited:       var(--color-sand-700);      /* sand-700 — :visited (warm, settled) */
  --color-text-link-active:        var(--info-900);            /* blue-900 — :active (pressed) */
  /* Brand-link uses lime — but a deeper step than the lime button surface.
     base/primary surface = lime-300 (#CDE67B); on white that's ~1.7:1, fine
     for a button-shaped surface but unreadable as standalone text. Linktext
     is text-only, so we step down the lime scale to lime-700 (light) /
     lime-300 (dark) for AA contrast on page surfaces. May 2026 — replaced
     earlier forest-scale brand-link. */
  --color-text-link-brand:           var(--color-lime-700);      /* #6f7e01 — AA on white (6.3:1) */
  --color-text-link-brand-hover:     var(--color-lime-800);      /* one step more pronounced on hover */
  /* No -disabled token — disabled state uses --color-text-link-brand at --disabled-text-opacity. */

  /* Semantic text — all verified AA on white surface */
  --color-text-success:            var(--success-700);         /* forest-700 — 4.98:1 ✓ AA */
  --color-text-info:               var(--info-700);            /* blue-700   — 8.95:1 ✓ AA */
  --color-text-warning:            var(--warning-700);         /* yellow-700 — 4.92:1 ✓ AA */
  --color-text-critical:           var(--critical-700);        /* red-700    — 7.85:1 ✓ AA */
  --color-text-data:               var(--data-cyan-700);       /* cyan-700   — 5.79:1 ✓ AA */
  --color-text-data-lavender:        var(--data-lavender-700);     /* lavender-700 — 4.92:1 ✓ AA */
  --color-text-data-orange:        var(--data-orange-700);     /* orange-700 — 4.65:1 ✓ AA */
  --color-text-data-orchid:        var(--data-orchid-700);     /* orchid-700 — 5.12:1 ✓ AA */

  /* ── Icon (mirrors text taxonomy exactly) ── */
  --color-icon-default:            var(--color-sand-900);
  --color-icon-subtle:             var(--color-sand-700);
  --color-icon-disabled:           var(--color-sand-500);
  --color-icon-inverse:            var(--color-sand-50);
  --color-icon-inverse-subtle:     var(--color-sand-300);
  --color-icon-brand:              var(--action-primary-400);  /* lime — brand icons on light bg */
  --color-icon-success:            var(--success-700);
  --color-icon-info:               var(--info-700);
  --color-icon-warning:            var(--warning-700);
  --color-icon-critical:           var(--critical-700);
  --color-icon-data:               var(--data-cyan-700);
  --color-icon-data-lavender:      var(--data-lavender-700);
  --color-icon-data-orange:        var(--data-orange-700);
  --color-icon-data-orchid:        var(--data-orchid-700);

  /* ── Tag — decorative color set for tag-dense surfaces (Forager taxonomies).
     Recipe: tinted surface (step-100) + saturated text (step-700).
     SKIPS the intent layer — tag colors are decorative, not semantic.
     Always pair surface + text from the same hue. */
  --color-surface-tag-sand:        var(--color-sand-100);
  --color-text-tag-sand:           var(--color-sand-800);
  --color-surface-tag-forest:      var(--color-forest-100);
  --color-text-tag-forest:         var(--color-forest-700);
  --color-surface-tag-lime:        var(--color-lime-100);
  --color-text-tag-lime:           var(--color-lime-700);
  --color-surface-tag-cyan:        var(--color-cyan-100);
  --color-text-tag-cyan:           var(--color-cyan-700);
  --color-surface-tag-blue:        var(--color-blue-100);
  --color-text-tag-blue:           var(--color-blue-700);
  --color-surface-tag-yellow:      var(--color-yellow-100);
  --color-text-tag-yellow:         var(--color-yellow-700);
  --color-surface-tag-orange:      var(--color-orange-100);
  --color-text-tag-orange:         var(--color-orange-700);
  --color-surface-tag-red:         var(--color-red-100);
  --color-text-tag-red:            var(--color-red-700);
  --color-surface-tag-lavender:    var(--color-lavender-100);
  --color-text-tag-lavender:       var(--color-lavender-700);
  --color-surface-tag-orchid:      var(--color-orchid-100);
  --color-text-tag-orchid:         var(--color-orchid-700);

}
```

**Dark theme override (`[data-theme="dark"]`):**

Base surface is `sand-950` — a warm dark neutral, NOT a forest-tinted dark mode. The forest scale exits surface vocabulary in dark mode entirely; it only stays as text on the lime button (`forest-800` default, `forest-900` hover, `forest-950` active). Brand-context link colors moved to lime in May 2026 — Linktext now uses `lime-300` light → `lime-200` hover in dark mode. Only tokens that change from light theme are listed — everything else inherits.

```css
[data-theme="dark"] {

  /* Disabled surface overlay flips to dark sand so the surface rule preserves its
     meaning ("pull toward neutral") in dark mode. Surface-disabled tokens cascade
     through this via the color-mix expression in :root.
     Text fade is theme-invariant via --disabled-text-opacity (no override needed). */
  --color-disabled-surface-overlay: var(--color-sand-700);

  /* ── Surfaces — warm dark sand ladder ── */
  --color-surface-default:         var(--color-sand-950);       /* #1F1F1E — page bg */
  --color-surface-default-hover:   var(--color-sand-900);
  --color-surface-default-active:  var(--color-sand-800);
  --color-surface-alt:             var(--color-sand-900);       /* raised panels, sidebars, cards */
  --color-surface-alt-hover:       var(--color-sand-800);

  /* Brand nav/header — sand-anchored in dark mode (forest exits surface vocabulary) */
  --color-surface-brand:           var(--color-sand-900);
  --color-surface-brand-hover:     var(--color-sand-800);
  --color-surface-brand-active:    var(--color-sand-950);
  --color-surface-brand-subtle:    var(--color-sand-950);

  /* Semantic surfaces — darkened to work on deep bg */
  --color-surface-success:         var(--success-950);
  --color-surface-success-hover:   var(--success-900);
  --color-surface-success-active:  var(--success-800);
  --color-surface-info:            var(--info-950);
  --color-surface-info-hover:      var(--info-900);
  --color-surface-info-active:     var(--info-800);
  --color-surface-warning:         var(--warning-950);
  --color-surface-warning-hover:   var(--warning-900);
  --color-surface-warning-active:  var(--warning-800);
  --color-surface-critical:        var(--critical-950);
  --color-surface-critical-hover:  var(--critical-900);
  --color-surface-critical-active: var(--critical-800);
  --color-surface-data:            var(--data-cyan-950);
  --color-surface-selected:        var(--info-950);            /* selected row on dark bg */
  --color-surface-selected-hover:  var(--info-900);
  --color-surface-selected-active: var(--info-800);

  /* ── Borders — mid-sand range for structure on dark bg ── */
  --color-border-subtle:           var(--color-sand-800);
  --color-border-default:          var(--color-sand-700);
  --color-border-bold:             var(--color-sand-600);
  /* Focus rings — only Secondary changes in dark mode (sand step shifts).
     Default/Destructive/Link-Brand are theme-invariant per Figma. */
  --color-border-focus-secondary:  var(--color-sand-500);      /* sand/500 — matches Figma colors/ring-dark */

  --color-border-success-default:  var(--success-800);
  --color-border-success-bold:     var(--success-500);
  --color-border-info-default:     var(--info-800);
  --color-border-info-bold:        var(--info-500);
  --color-border-warning-default:  var(--warning-800);
  --color-border-warning-bold:     var(--warning-500);
  --color-border-critical-default: var(--critical-800);
  --color-border-critical-bold:    var(--critical-500);

  /* ── Text — sand palette inverted ── */
  --color-text-default:            var(--color-sand-50);       /* warm white on dark bg */
  --color-text-subtle:             var(--color-sand-300);
  --color-text-disabled:           var(--color-sand-600);
  --color-text-inverse:            var(--color-sand-900);
  --color-text-inverse-subtle:     var(--color-sand-700);
  --color-text-link-default:       var(--info-500);            /* blue-500 — :link */
  --color-text-link-default-hover: var(--info-400);            /* blue-400 — :hover (lighter on dark bg) */
  --color-text-link-visited:       var(--color-sand-300);      /* sand-300 — :visited */
  --color-text-link-active:        var(--info-200);            /* blue-200 — :active */
  --color-text-link-brand:         var(--color-lime-300);      /* lime-300 — Linktext default in dark, theme-invariant with lime button surface */
  --color-text-link-brand-hover:   var(--color-lime-200);      /* one step lighter — "more pronounced on dark" */

  /* Semantic text — lighter steps for dark bg readability */
  --color-text-success:            var(--success-300);
  --color-text-info:               var(--info-300);
  --color-text-warning:            var(--warning-300);
  --color-text-critical:           var(--critical-300);
  --color-text-data:               var(--data-cyan-300);
  --color-text-data-lavender:        var(--data-lavender-300);
  --color-text-data-orange:        var(--data-orange-300);
  --color-text-data-orchid:        var(--data-orchid-300);

  /* ── Icon — mirrors text ── */
  --color-icon-default:            var(--color-sand-50);
  --color-icon-subtle:             var(--color-sand-300);
  --color-icon-disabled:           var(--color-sand-600);
  --color-icon-inverse:            var(--color-sand-900);
  --color-icon-inverse-subtle:     var(--color-sand-700);
  --color-icon-success:            var(--success-300);
  --color-icon-info:               var(--info-300);
  --color-icon-warning:            var(--warning-300);
  --color-icon-critical:           var(--critical-300);
  --color-icon-data:               var(--data-cyan-300);
  --color-icon-data-lavender:      var(--data-lavender-300);
  --color-icon-data-orange:        var(--data-orange-300);
  --color-icon-data-orchid:        var(--data-orchid-300);
  /* --color-icon-brand unchanged — lime works on dark bg */

  /* ── Action — primary and critical unchanged ── */
  /* lime-400 on sand-950 passes contrast — no override needed */
  /* Secondary adapts to dark surface */
  --color-action-secondary:          var(--color-sand-900);
  --color-action-secondary-hover:    var(--color-sand-800);
  --color-action-secondary-active:   var(--color-sand-700);
  --color-action-secondary-disabled: var(--color-sand-950);

  /* ── Tag — dark theme override.
     Surface jumps to step-900 (deep tint), text to step-300 (light pop).
     Each pair retains AA contrast on the dark surface. */
  --color-surface-tag-sand:        var(--color-sand-800);
  --color-text-tag-sand:           var(--color-sand-200);
  --color-surface-tag-forest:      var(--color-forest-900);
  --color-text-tag-forest:         var(--color-forest-300);
  --color-surface-tag-lime:        var(--color-lime-900);
  --color-text-tag-lime:           var(--color-lime-300);
  --color-surface-tag-cyan:        var(--color-cyan-900);
  --color-text-tag-cyan:           var(--color-cyan-300);
  --color-surface-tag-blue:        var(--color-blue-900);
  --color-text-tag-blue:           var(--color-blue-300);
  --color-surface-tag-yellow:      var(--color-yellow-900);
  --color-text-tag-yellow:         var(--color-yellow-300);
  --color-surface-tag-orange:      var(--color-orange-900);
  --color-text-tag-orange:         var(--color-orange-300);
  --color-surface-tag-red:         var(--color-red-900);
  --color-text-tag-red:            var(--color-red-300);
  --color-surface-tag-lavender:    var(--color-lavender-900);
  --color-text-tag-lavender:       var(--color-lavender-300);
  --color-surface-tag-orchid:      var(--color-orchid-900);
  --color-text-tag-orchid:         var(--color-orchid-300);

}

### 3.4 Spacing & sizing

Use **Tailwind's default spacing scale** directly as utility classes. Do not write custom `--space-*` tokens or hardcode `px` values. The Tailwind scale is the single source of truth for all padding, margin, gap, width, height, and icon sizing.

**Forager spacing conventions** — which Tailwind steps to reach for in common situations:

| Context | Class | Value |
|---|---|---|
| Tight inline gap (icon + label) | `gap-1.5` | 6px |
| Form element internal padding | `px-3 py-2` | 12px / 8px |
| Button padding | `px-4 py-2` | 16px / 8px |
| Card / panel padding | `p-4` or `p-6` | 16px or 24px |
| Between form fields | `gap-4` | 16px |
| Between sections | `gap-6` or `gap-8` | 24px or 32px |
| Page-level gutter | `px-6` or `px-8` | 24px or 32px |
| Small icon size | `w-4 h-4` | 16px |
| Default icon size | `w-5 h-5` | 20px |
| Large icon size | `w-6 h-6` | 24px |

When in doubt, prefer the Tailwind step that matches the 4px base grid (multiples of 1 unit = 4px). Avoid half-steps (0.5, 1.5, 2.5) except for tight inline spacing.

### 3.5 Typography

Use **Tailwind's default typography utilities** directly. Do not write custom `--text-*` tokens or `font-family` CSS variables. Brightseed's brand fonts (Tiempos Text) are scoped to the marketing website only and do not appear in Forager.

**Forager type role mappings** — canonical Tailwind class combinations per UI role:

| Role | Classes | Use for |
|---|---|---|
| Page title | `text-2xl font-semibold` | Top-level `<h1>` on any Forager page |
| Section heading | `text-xl font-semibold` | `<h2>`, card group labels |
| Subsection heading | `text-lg font-medium` | `<h3>`, panel titles |
| Card title | `text-base font-medium` | `<StatCard>`, `<DataTable>` header label |
| Body | `text-sm font-normal` | Paragraphs, descriptions, alert body |
| Label | `text-sm font-medium` | Form labels, button text, table column headers |
| Helper / secondary | `text-sm font-normal` | Helper text, placeholders, captions |
| Caption / annotation | `text-xs font-normal` | Chart axis labels, badge text, timestamps |
| Mono — IDs | `font-mono text-sm` | Sample IDs, compound IDs, assay codes |
| Mono — data | `font-mono text-sm tabular-nums` | Numeric columns, concentration values, percentages |

**Hard rules:**
- **Numeric columns always use `tabular-nums`** — apply `font-variant-numeric: tabular-nums` (Tailwind: `tabular-nums` utility) to any column of numbers so values align on the decimal point.
- **Scientific notation values use `font-mono`** — µM, nM, EC50, IC50 and any scientific value renders in mono for visual distinction.
- **Do not use `text-base` for body copy** — Forager is information-dense; `text-sm` is the body baseline.
- **Do not use `font-bold` in data tables** — `font-medium` for headers, `font-normal` for cells. Bold in a dense table reads as error state, not emphasis.

### 3.6 Shape (radius, border, shadow)

```css
:root {

  /* ── Radius ── */
  --shape-radius-none:    0px;
  --shape-radius-sm:      2px;    /* subtle — tag indicators, inline chips */
  --shape-radius-default: 4px;    /* standard — inputs, buttons, dropdowns */
  --shape-radius-md:      6px;    /* medium — badges, small tooltips */
  --shape-radius-lg:      8px;    /* large — cards, panels, dialogs */
  --shape-radius-xl:      12px;   /* extra-large — sheet overlays, popovers */
  --shape-radius-round:   9999px; /* pill — status badges, toggle chips */

  /* ── Border width ── */
  --shape-border-none:    0px;
  --shape-border-default: 1px;    /* inputs, cards, table grid lines */
  --shape-border-bold:    2px;    /* focus rings, selected-state indicators */
  --shape-border-heavy:   4px;    /* left-edge accent stripe on alert banners */

  /* ── Shadow — umbra tinted with forest-950 (#133019) for earthy warmth ── */
  --shadow-sm: 0 1px 2px 0 rgba(19, 48, 25, 0.08);
  --shadow-md: 0 4px 6px -1px rgba(19, 48, 25, 0.10),
               0 2px 4px -2px  rgba(19, 48, 25, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(19, 48, 25, 0.10),
               0 4px  6px  -4px rgba(19, 48, 25, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(19, 48, 25, 0.10),
               0 8px  10px -6px rgba(19, 48, 25, 0.04);

}
```

**Forager radius conventions:**

| Component | Token | Tailwind equivalent |
|---|---|---|
| Input, Select, Textarea | `--shape-radius-default` | `rounded` |
| Button (all variants) | `--shape-radius-default` | `rounded` |
| Badge — status pill | `--shape-radius-round` | `rounded-full` |
| Badge — category label | `--shape-radius-md` | `rounded-md` |
| Card, Panel | `--shape-radius-lg` | `rounded-lg` |
| Dialog | `--shape-radius-lg` | `rounded-lg` |
| Popover, Tooltip | `--shape-radius-md` | `rounded-md` |
| Alert / banner | `--shape-radius-default` | `rounded` |
| Table row | `--shape-radius-none` | — |

**Shadow conventions:**

| Context | Token |
|---|---|
| Raised card on page background | `--shadow-sm` |
| Popover, dropdown menu | `--shadow-md` |
| Dialog, modal | `--shadow-lg` |
| Sheet overlay | `--shadow-xl` |

**Dark mode:** Shadows remain the same token references. The forest-950 alpha reads as slightly lighter against a dark bg, which is correct — shadows should recede on dark surfaces. No dark override needed.

### 3.7 Chart / data viz tokens

```css
:root {

  /* ── Chart surfaces — reference semantic tokens so they auto-adapt to dark theme ── */
  --chart-background:         var(--color-surface-default);
  --chart-grid-major:         var(--color-border-subtle);    /* primary grid lines */
  --chart-grid-minor:         var(--color-sand-100);         /* secondary grid lines, lighter */
  --chart-axis-line:          var(--color-border-default);
  --chart-axis-text:          var(--color-text-subtle);
  --chart-tooltip-background: var(--color-surface-default);
  --chart-tooltip-text:       var(--color-text-default);
  --chart-tooltip-border:     var(--color-border-default);
  --chart-legend-text:        var(--color-text-subtle);

  /* ── Categorical palette (8 series, colorblind-safe) ──
     Verified distinguishable under Deuteranopia, Protanopia, and Tritanopia simulation.
     Rule: NEVER use brand action (lime) or brand surface (forest)
     here — those are reserved for UI chrome. Charts use data-* and acchromatic scales only. */
  --chart-cat-1: var(--data-cyan-500);     /* #00b4b6 — teal, primary series */
  --chart-cat-2: var(--data-lavender-500);   /* #636cff — lavender */
  --chart-cat-3: var(--data-orange-500);   /* #E88F3E — orange */
  --chart-cat-4: var(--color-red-500);     /* #ee3a49 — red */
  --chart-cat-5: var(--color-yellow-600);  /* #a69400 — olive-yellow (dark step for legibility) */
  --chart-cat-6: var(--data-cyan-800);     /* #004948 — dark teal (series-1 depth variant) */
  --chart-cat-7: var(--data-lavender-300);   /* #b5c2ff — soft lavender (series-2 light variant) */
  --chart-cat-8: var(--data-orange-700);   /* #a34900 — burnt orange (series-3 depth variant) */

  /* ── Sequential palette — forest (brand-tinted, for density / magnitude heatmaps) ── */
  --chart-seq-forest-100: var(--color-forest-50);
  --chart-seq-forest-200: var(--color-forest-100);
  --chart-seq-forest-300: var(--color-forest-200);
  --chart-seq-forest-400: var(--color-forest-300);
  --chart-seq-forest-500: var(--color-forest-500);
  --chart-seq-forest-600: var(--color-forest-600);
  --chart-seq-forest-700: var(--color-forest-700);
  --chart-seq-forest-800: var(--color-forest-800);
  --chart-seq-forest-900: var(--color-forest-900);

  /* ── Sequential palette — blue (alternative; use to distinguish assay types from density) ── */
  --chart-seq-blue-100: var(--color-blue-50);
  --chart-seq-blue-200: var(--color-blue-100);
  --chart-seq-blue-300: var(--color-blue-200);
  --chart-seq-blue-400: var(--color-blue-300);
  --chart-seq-blue-500: var(--color-blue-500);
  --chart-seq-blue-600: var(--color-blue-600);
  --chart-seq-blue-700: var(--color-blue-700);
  --chart-seq-blue-800: var(--color-blue-800);
  --chart-seq-blue-900: var(--color-blue-900);

  /* ── Diverging palette — red ↔ neutral ↔ forest ──
     For deltas, fold-change, and pos/neg inhibition response maps.
     Neutral midpoint uses sand-100 (warm, not optical gray) to match page bg. */
  --chart-div-neg-500: var(--color-red-700);    /* strong negative / maximum inhibition loss */
  --chart-div-neg-400: var(--color-red-500);
  --chart-div-neg-300: var(--color-red-300);
  --chart-div-neg-200: var(--color-red-100);
  --chart-div-neg-100: var(--color-red-50);
  --chart-div-neutral: var(--color-sand-100);   /* zero / baseline / no change */
  --chart-div-pos-100: var(--color-forest-50);
  --chart-div-pos-200: var(--color-forest-100);
  --chart-div-pos-300: var(--color-forest-300);
  --chart-div-pos-400: var(--color-forest-500);
  --chart-div-pos-500: var(--color-forest-700);  /* strong positive / maximum effect */

  /* ── Semantic trend ── */
  --chart-trend-positive: var(--success-600);      /* green-600 — improving, above baseline */
  --chart-trend-negative: var(--critical-600);     /* red-600 — declining, below baseline */
  --chart-trend-neutral:  var(--color-sand-600);   /* no change — muted */
  --chart-trend-unknown:  var(--color-neutral-400); /* data pending / unclassified */

  /* ── Dose-response specific (biotech) ── */
  --chart-curve-fit:           var(--data-cyan-500);      /* 4PL fitted line — teal */
  --chart-confidence-band:     var(--data-cyan-100);      /* error envelope around fit — light teal wash */
  --chart-datapoint-default:   var(--color-sand-700);     /* raw experimental points — muted */
  --chart-datapoint-highlight: var(--action-primary-400); /* selected / hovered point — lime */
  --chart-datapoint-outlier:   var(--critical-500);       /* flagged outlier — red */
  --chart-reference-line:      var(--critical-600);       /* IC50, EC50 vertical marker — dashed red */

}
```

**Dark theme:** `--chart-background`, `--chart-grid-*`, `--chart-axis-*`, `--chart-tooltip-*`, and `--chart-legend-text` all reference semantic surface/text tokens that already override in `[data-theme="dark"]` — no chart-specific dark overrides needed. Categorical series colors (`--chart-cat-1` through `-8`) are **theme-invariant by design** — consistent colors across light/dark are intentional for cross-context chart legibility and colorblindness verification.

**Colorblind verification status:** Categorical palette confirmed visually distinguishable under Deuteranopia and Protanopia simulation (cyan/indigo/orange triplet survives red-green loss; orange/blue axis is CB-safe). Tritanopia (blue-yellow) check: cat-1 (teal) vs cat-5 (olive-yellow) — use shape/pattern redundancy in any two-series chart that uses this pair. Do not rely on color alone.

**Forager chart rules (summary):**
- Categorical palette: reach for `--chart-cat-1` through `--chart-cat-8` in order. Do not skip around.
- Dose-response curves always use `--chart-curve-fit` (not any cat series color).
- IC50/EC50 reference lines always use `--chart-reference-line`.
- Sequential heatmaps default to `--chart-seq-forest-*`; switch to blue if a second independent heatmap appears on the same view (to preserve distinction).
- Always pair color with shape or pattern for any two-variable encoding. Never rely on color alone.

---

## 4. Composition rules

*This section tells the LLM how to reason about which token to reach for, not just what exists.*

**Page structure:**
- Page background → `--color-surface-default`
- Nav bar / header → `--color-surface-brand` (Deep Forest) with `--color-text-inverse` for text
- Main content panel / card → `--color-surface-default`, border `--color-border-subtle`, radius `--shape-radius-300`
- Sidebar → `--color-surface-alt`

**Buttons:**
- Primary action (the one that does the main thing on the page) → `--color-action-primary` background, `--color-text-on-action-primary` text
- Secondary action → `--color-surface-default` with `--color-border-default` and `--color-text-default`
- Destructive action → `--color-action-critical` background (soft style — red-100 in light, red-900 in dark) with `--color-text-on-action-critical` text (red-600 in light, red-300 in dark). Not a solid-red filled button — see "Locked-in decisions" in `CLAUDE.md`.
- Ghost / tertiary → transparent with `--color-text-default`
- Linktext (button-shaped link affordance) → `Button variant="Linktext/default"`, uses `--color-text-link-brand` (lime — same family as the primary button surface, deeper step for AA contrast as text), no underline. For an inline text link in body copy, do NOT use Button — use the Link component (see below).
- Disabled state → `--color-action-*-disabled` (surface) + `--color-text-on-action-*-disabled` (text) tokens, never inline opacity. The disabled tokens are computed as a color-mix overlay against the active default-state tokens — see "Button disabled state" below for the rule.

**Links:** Two distinct components, two state machines — pick by component, never collapse them.
- **Link component** (inline `<a>` in body copy) — clickable text inside paragraphs, table cells, nav, footer. **Always underlined**. Blue scale (`--color-text-link-*`). Anchor pseudo-class state machine: `:link / :visited / :hover / :focus / :active`. No size axis — inherits typography from parent text.
- **Linktext (Button variant)** — `Button variant="Linktext/default"`. A standalone button-shaped link affordance with no chrome. **Never underlined**. Lime scale (`--color-text-link-brand` — `lime-700` light, `lime-300` dark; same family as the primary button surface). Button state machine: `default / hover / focus / loading / disabled / pressed`. Use for standalone CTAs that should de-emphasize chrome.
- The bare `--color-text-link` alias is intentionally unexposed. The component you reach for tells you which token applies.
- These components are not interchangeable. An `<a>` doesn't have a `loading` state. A `<button>` doesn't have a `:visited` state. Forcing them into one component papers over a real semantic difference.

**Button focus rings:** Variant-aware. The ring color matches the button's hue, so a Destructive button gets a red focus ring, etc. Linktext sits in the lime family, so its ring is also lime/500 — same value as Default but kept under a separate token name for namespace clarity. Pattern: 1px stroke OUTSIDE the button, positioned 1px outside the button edge with a small gap, corner radius matched to the button + 1.

| Button variant | Focus ring token |
|---|---|
| Default, Outline, Ghost | `--color-border-focus` (lime/500) |
| Secondary | `--color-border-focus-secondary` (sand/300 light, sand/500 dark) |
| Destructive | `--color-border-focus-destructive` (red/500) |
| Linktext | `--color-border-focus-link-brand` (lime/500 — same as Default) |

The bare `--color-border-focus` is the system default — used for any focusable element that isn't a button (inputs, tabs, links). Buttons override per variant.

**Button hover behavior:** On hover, every button variant does two things at once — the text gets one step more pronounced in color, and the font weight steps from Medium (500) to SemiBold (600). This rule applies to `:hover` only — `:focus-visible` carries its own signal via the ring, and `:active`/`pressed` carries its own via the depressed surface. Layering weight onto those would over-signal.

| Variant | Default text token | Hover text token | Notes |
|---|---|---|---|
| Default (lime) | `--color-text-on-action-primary` (forest-800) | `--color-text-on-action-primary-hover` (forest-900) | Theme-invariant — same in dark mode |
| Secondary | `--color-text-default` (sand-900) | `--color-text-default-hover` (sand-950) | In dark mode, `-hover` aliases to sand-50 (boundary) — weight bump alone carries the signal |
| Destructive | `--color-text-on-action-critical` (red-600) | `--color-text-on-action-critical-hover` (red-700) | |
| Outline | `--color-text-default` | `--color-text-default-hover` | Same as Secondary |
| Ghost | `--color-text-default` | `--color-text-default-hover` | Same as Secondary |
| Linktext | `--color-text-link-brand` (lime-700) | `--color-text-link-brand-hover` (lime-800) | Direction is "more pronounced," not literally "darker" — in dark mode hover steps lighter (lime-300 → lime-200). Updated May 2026 — was forest-scale in original Apr 2026 spec |

**Layout shift on hover (ghost label technique):** SemiBold (600) glyphs are physically wider than Medium (500). Without compensation, the button widens on hover and adjacent UI jiggles. Resolve this by rendering the label twice: once at SemiBold but invisible (reserves width), once at the live weight on top. The button always sizes to the wider SemiBold version, so `:hover` never grows it.

```jsx
// Pattern for the Button component's label
<span className="relative inline-block">
  <span
    aria-hidden
    className="invisible"
    style={{ fontVariationSettings: "'wght' 600" }}
  >
    {label}
  </span>
  <span
    className="absolute inset-0 transition-[font-variation-settings] duration-[120ms]"
    style={{
      fontVariationSettings: "'wght' var(--btn-wght, 500)",
    }}
  >
    {label}
  </span>
</span>
```

```css
.button:hover { --btn-wght: 600; }
```

Notes: (1) Geist is a variable font, so `font-variation-settings` interpolates smoothly over 120ms — no snap. (2) The `transition` is on `font-variation-settings`, not `font-weight` — only the variation axis is animatable. (3) The visible-label color transitions independently via `transition: color 120ms` set on the button. (4) For icon-only buttons there's no label to ghost — they skip this technique entirely. (5) The technique only matters in production HTML/CSS; Figma renders the static states without layout reservation, so the hover variant in the matrix may appear ~1px wider than default. That's a Figma representation artifact, not a production issue.

**Button disabled state — surface overlay + text alpha:** Disabled is uniform across variants. Surface gets a desaturating overlay against the active default-state surface; text and icon use the variant's normal foreground at a single shared opacity.

```
--color-action-X-disabled = color-mix(in srgb, --color-action-X, --color-disabled-surface-overlay 50%);
--disabled-text-opacity   = 0.55;
```

In CSS: keep the variant's normal foreground token on the label and icon, then drop opacity to `var(--disabled-text-opacity)` in the disabled state. No per-variant `*-foreground-disabled` token. In Figma: the same opacity is bound to a number variable `disabled/text-opacity = 55` on every Disabled-state TEXT and IconPlaceholder slot.

**Theme handling.** The surface overlay swaps per theme so it preserves its meaning ("pull toward neutral") in either:

| | Light theme | Dark theme |
|---|---|---|
| `--color-disabled-surface-overlay` | `var(--color-sand-100)` | `var(--color-sand-700)` |

In light theme it pulls toward light sand (desaturate + lift); in dark theme it pulls toward dark sand (desaturate + dim). The text alpha is theme-invariant — same `0.55` in both modes — because the variant's normal foreground token already has a light/dark variant, and opacity composites correctly over either disabled surface.

**Why opacity, not a baked text token.** Earlier the system computed disabled-text via `color-mix(text, sand-700, 60%)` to produce a flat hex. That worked for high-contrast surfaces (lime) but produced too-subtle a fade on already-pale surfaces (destructive's red-100 disabled-state #F9ECE7 against red-600 #C9092E only changed ~6 RGB points per channel). Opacity composites against the actual disabled surface, so the fade scales with the surface, and one rule covers every variant. It also removes 10 tokens from the system (5 variants × 2 themes).

**Why the rule, not per-variant tuning.** Earlier iterations explored per-variant hand-tuned disabled colors. They produced calibrated results but didn't generalize — adding a new button variant required deciding on its disabled appearance from scratch. The current rule generalizes: any new variant gets a sensible disabled state automatically by having a default-state surface and foreground token.

**Tradeoff to know about.** The lime button's active state is theme-invariant (lime-300 surface in both themes), but its disabled state is NOT theme-invariant — the surface overlay swaps per theme. So lime disabled reads as sage-pastel in light mode and muted olive in dark mode. This is a deliberate choice; if a future stakeholder wants lime disabled to also be theme-invariant, override `base/primary-disabled` in dark mode to match the light value.

**WCAG note.** Disabled UI is exempt from WCAG 1.4.3 contrast requirements. At 0.55 opacity, the worst-case composited contrast in the system is destructive disabled (`red-600` on `#F9ECE7` → ~3.4:1). We've accepted that tradeoff in exchange for the "clearly inactive" read. If you ever need AA-level disabled, raise opacity to ~0.70 (text reads stronger but the disabled state reads less obviously inactive).

**Figma implementation.** Surface-disabled tokens resolve to flat hex values per theme in Figma (computed from the color-mix expression). Disabled-state TEXT and IconPlaceholder slots in the Button component bind their `opacity` property to the `disabled/text-opacity` number variable. If the opacity number changes, update the variable in one place and every disabled state across both themes updates with it.

**Forms:**
- Input background → `--color-surface-default`
- Input border default → `--color-border-default`
- Input border focus → `--color-border-focus` (lime ring — system default)
- Label → `--text-label-sm`, `--color-text-default`
- Helper text → `--text-body-sm`, `--color-text-subtle`
- Error text → `--text-body-sm`, `--color-text-critical`

**Status surfaces (alerts, banners, callouts):**
- Success → `--color-surface-success` background, `--color-border-success-bold` left border, `--color-text-success` text
- Info → `--color-surface-info`, `--color-border-info-bold`, `--color-text-info`
- Warning → `--color-surface-warning`, `--color-border-warning-bold`, `--color-text-warning`
- Critical → `--color-surface-critical`, `--color-border-critical-bold`, `--color-text-critical`

**Data tables:**
- Row background → `--color-surface-default`
- Alternate row → `--color-surface-alt`
- Header row → `--color-surface-alt` with `--text-label-sm` and `--color-text-subtle`
- Selected row → `--color-surface-selected` (blue-50 tint — intentionally distinct from success green; a row being selected is not a status)
- Numeric cells → `--text-mono-md` with `font-variant-numeric: tabular-nums`
- Borders → `--color-border-subtle`

**Charts:**
- Always wrap in a container with `--color-surface-default` background and `--shape-radius-300` radius
- Axis lines use `--chart-axis-line`, never a text color token
- Never use primary brand colors (lime, forest) as chart data colors — reserve them for UI chrome so charts read as information, not decoration
- Dose-response curves use `--chart-curve-fit` for the fitted line and `--chart-confidence-band` for the error envelope

---

## 5. Component library (shadcn/ui)

*Only these components are available. Do not import anything else. The section is split into two parts: shadcn/ui primitives (with Forager-specific usage conventions) and Forager composite components (full API docs, since these don't exist in shadcn's own documentation).*

---

### 5.1 shadcn/ui primitives — Forager conventions

The full shadcn API is documented at https://ui.shadcn.com. Below is only what differs or is constrained in Forager.

#### Button

```tsx
import { Button } from "@/components/ui/button"
```

| Forager intent | `variant` | `size` | Notes |
|---|---|---|---|
| Primary action | `"default"` | `"default"` | Resolves to `--primary` (lime) via bridge |
| Secondary / outlined | `"outline"` | `"default"` | Resolves to `--border` + `--background` |
| Ghost / tertiary | `"ghost"` | `"default"` | Transparent, `--color-text-default` (no link color) |
| Linktext | `"linktext/default"` | `"default"` | Button styled as a link. Lime text via `--color-text-link-brand` (deeper step than the lime button surface for AA contrast). **No underline.** Use for standalone CTAs that should de-emphasize chrome. NOT for inline text — use the Link component for that. |
| Destructive | `"destructive"` | `"default"` | Soft style — red-100 surface + red-600 text (light), red-900 + red-300 (dark). NOT a solid-red filled button. |
| Icon-only | `"ghost"` | `"sm"` | Always pair with `<span className="sr-only">` label |

**Rules:** Never set `className` to override `bg-*` or `text-*` on a Button — the bridge handles it. Use `disabled` prop for disabled state; never reach for `--color-action-*-disabled` tokens in component code.

---

#### Link

```tsx
import { Link } from "@/components/ui/link"
```

For inline clickable text inside body copy — paragraphs, table cells, nav, footer. Renders as `<a>`. Always underlined. NOT a Button. If the affordance is standalone and CTA-shaped, reach for `<Button variant="linktext/default">` instead.

| State | Token | Notes |
|---|---|---|
| `:link` (default) | `--color-text-link-default` | Unvisited inline link. Blue-600 light / Blue-500 dark. |
| `:visited` | `--color-text-link-visited` | Previously clicked. Sand-700 light / Sand-300 dark — warm, settled. |
| `:hover` | `--color-text-link-default-hover` | Pointer over the link. Blue-700 light / Blue-400 dark. |
| `:focus` | `--color-text-link-default` + focus ring | Keyboard or assistive focus. Same color as `:link`; `--color-border-focus` ring carries the signal. |
| `:active` | `--color-text-link-active` | Mouse-down state. Blue-900 light / Blue-200 dark. |

**Rules:**
- No size axis on Link — typography (size, leading, weight) inherits from the surrounding parent text. Color, underline, and states are what the component supplies.
- Never use a Button for inline text. The shape is wrong, the state machine is wrong, and screen readers expect different semantics (`<a>` vs `<button>`).
- Never use a Link for a standalone CTA. If it's not embedded in surrounding text, it's a Button (`Linktext/default` if you want the no-chrome look).

---

#### Input / Textarea / Select

```tsx
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
```

All three share the same token wiring: `--input` for border, `--ring` for focus ring (lime), `--background` for fill. No variant prop — Forager has one input style.

**Error state:** Add `aria-invalid="true"` and wrap in a container with `--color-text-critical` helper text. Do not change the input's border color directly — shadcn handles `aria-invalid` styling via `--ring` and `--border`.

**Label pattern (required):**
```tsx
<div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium">{label}</label>
  <Input ... />
  {helperText && (
    <p className="text-sm font-normal text-muted-foreground">{helperText}</p>
  )}
  {error && (
    <p className="text-sm font-normal text-[var(--color-text-critical)]">{error}</p>
  )}
</div>
```

---

#### Badge

```tsx
import { Badge } from "@/components/ui/badge"
```

The Badge component has been re-architected (Apr 2026) for Forager's tag-dense surfaces. All variants now sit at the same visual weight — soft tinted background + saturated same-hue text — so a tag-dense table doesn't visually shout. There is no longer a "loud" Default or Verified variant; if you need a stamp-style call-to-attention, use an icon + text composition instead of a colored pill.

**Variants (12 total):**

| Variant | Use | Backing tokens |
|---|---|---|
| `"default"` | Neutral / fallback | `--color-action-secondary` surface + `secondary-foreground` text (sand-based) |
| `"outline"` | Status with low emphasis | shadcn outline default — no fill, neutral stroke |
| `"ghost"` | No-chrome label | Just text, no surface |
| `"red"` | Decorative red — was `"destructive"` | `--color-surface-tag-red` + `--color-text-tag-red` |
| `"forest"` | Decorative green | `--color-surface-tag-forest` + `--color-text-tag-forest` |
| `"lime"` | Decorative lime | `--color-surface-tag-lime` + `--color-text-tag-lime` |
| `"cyan"` | Decorative cyan | `--color-surface-tag-cyan` + `--color-text-tag-cyan` |
| `"blue"` | Decorative blue | `--color-surface-tag-blue` + `--color-text-tag-blue` |
| `"yellow"` | Decorative yellow | `--color-surface-tag-yellow` + `--color-text-tag-yellow` |
| `"orange"` | Decorative orange | `--color-surface-tag-orange` + `--color-text-tag-orange` |
| `"lavender"` | Decorative lavender | `--color-surface-tag-lavender` + `--color-text-tag-lavender` |
| `"orchid"` | Decorative orchid | `--color-surface-tag-orchid` + `--color-text-tag-orchid` |

**Color is decorative, not semantic.** A `cyan` badge does not mean "info"; an `orange` badge does not mean "caution". Color is for visual differentiation in dense lists (compound source taxonomies, screening categories, etc.). Status meaning lives in the icon and label, not the color.

**Removed variants:** `"secondary"` (folded into `"default"`), `"destructive"` (renamed to `"red"`), `"verified"` (deleted — use icon + text composition for stamp behavior).

Always `rounded-full` for badges. Never use `rounded` (default shadcn) for badges — it reads as a button.

---

#### Card

```tsx
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
```

Forager card padding: `p-4` (compact data panels) or `p-6` (metric cards, primary content). Never nest a `Card` inside a `Card` — use `--color-surface-alt` background for inset content instead.

---

#### Alert

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
```

shadcn's `Alert` has `variant="default"` and `variant="destructive"`. For Forager's four semantic states, override surface and border directly:

```tsx
// Success alert — example pattern; repeat for info / warning / critical
<Alert
  className="border-l-4 rounded"
  style={{
    backgroundColor: "var(--color-surface-success)",
    borderColor: "var(--color-border-success-bold)",
    borderLeftColor: "var(--color-border-success-bold)",
  }}
>
  <AlertTitle className="text-sm font-medium text-[var(--color-text-success)]">
    Run complete
  </AlertTitle>
  <AlertDescription className="text-sm font-normal text-[var(--color-text-success)]">
    Assay BS-4421 finished with 48 valid data points.
  </AlertDescription>
</Alert>
```

The left-border accent (`border-l-4`) is a Forager convention for all semantic alert banners — it's the primary visual signal, not the background fill.

---

#### Dialog / Sheet

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
```

- **Dialog:** For confirmations, destructive actions, and short forms (≤4 fields). Footer always has a primary action left and a ghost/cancel right.
- **Sheet:** For side panels with more context — compound detail, assay configuration. `side="right"` only in Forager.

Both use `--shadow-lg` and `--shape-radius-lg` via the bridge automatically.

---

#### Table

```tsx
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
```

Always wrap in a container div with `rounded-lg border border-[var(--border-subtle)] overflow-hidden`. Header row: `bg-[var(--color-surface-alt)]`. Alternating data rows: even rows `--color-surface-default`, odd rows `--color-surface-alt`. See `CompoundScreeningTable` in §6 for the full reference implementation.

---

#### Skeleton

```tsx
import { Skeleton } from "@/components/ui/skeleton"
```

Use for all loading states — never show empty containers or spinner text in data cells. Match the skeleton's dimensions to the content it's replacing:

```tsx
// Loading state for a numeric cell
<Skeleton className="h-4 w-16" />

// Loading state for a compound ID (mono, wider)
<Skeleton className="h-4 w-24" />
```

---

#### Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
```

Forager uses tabs for view switching within a page section (e.g., Dose-Response / Time-Series / Raw Data). Do not use tabs for page-level navigation — that's the sidebar's job.

---

### 5.2 Forager composite components

These are Forager-specific components built from shadcn primitives. They don't exist in shadcn's library. When a prompt asks for one of these, use the API below — do not reinvent the structure.

---

#### `<StatCard>`

Metric + label + delta indicator. Full implementation in §6 Example 1.

```tsx
type Trend = "up" | "down" | "neutral"

interface StatCardProps {
  label: string       // e.g. "Compounds screened this week"
  value: string       // pre-formatted: "1,247" — caller handles formatting
  delta?: string      // e.g. "+12%" — omit if no comparison period
  trend?: Trend       // controls icon and color; defaults to "neutral"
  footnote?: string   // e.g. "vs. last week" — defaults to "vs. last week"
}
```

---

#### `<DataTable>`

Sortable, optionally filterable, optionally paginated table with row actions. The `columns` definition drives all rendering — do not write per-column JSX outside of it.

```tsx
type ColumnType = "text" | "mono" | "numeric" | "badge" | "action"

interface ColumnDef<T> {
  key: keyof T
  label: string
  type: ColumnType
  sortable?: boolean
  // For type="badge": caller must supply a statusConfig map (see STATUS_CONFIG pattern in §6)
  statusConfig?: Record<string, { label: string; className: string }>
  // For type="numeric": decimal places to display
  decimals?: number
  unit?: string      // appended after value — e.g. "µM", "%" 
}

interface DataTableProps<T extends { id: string }> {
  columns: ColumnDef<T>[]
  data: T[]
  isLoading?: boolean           // renders Skeleton rows when true
  emptyState?: React.ReactNode  // shown when data.length === 0
  rowActions?: {
    label: string
    onClick: (id: string) => void
    variant?: "default" | "critical"  // critical renders in --color-text-critical
  }[]
  pagination?: {
    pageSize: number
    totalCount: number
    currentPage: number
    onPageChange: (page: number) => void
  }
  search?: {
    placeholder?: string    // defaults to "Search…"
    keys: (keyof T)[]       // fields to search across — always include compoundId if present
  }
  filters?: {
    key: keyof T
    label: string           // column label shown in the dropdown trigger
    options: {
      label: string         // display value — human-readable
      value: string         // filter value — matched against row[key]
    }[]
  }[]
}

// Search + filter toolbar renders above the table whenever either prop is present.
// Layout: [Search input — grows] [Filter dropdowns — fixed width, left-to-right in
// filters[] order]. Both filter and search reset pagination to page 1 automatically.
// All filter/search state is internal to DataTable — no controlled-state props in v1.
```

---

#### `<DoseResponseChart>`

4PL dose-response curve. Full implementation in §6 Example 3.

```tsx
type Point = { logConc: number; inhibition: number }

interface DoseResponseChartProps {
  compoundId: string
  targetId: string
  dataPoints: Point[]    // raw experimental observations
  curvePoints: Point[]   // pre-computed 4PL fit (higher density than raw)
  ic50LogValue: number   // log10(IC50 in µM) — e.g. -1.42 = 0.038 µM
  height?: number        // chart height in px, defaults to 320
}
```

---

#### `<AssayTimeSeries>`

Multi-series time-on-x chart. Uses `--chart-cat-*` palette in order; first series is always `--chart-cat-1`.

```tsx
type TimePoint = { time: number; value: number }

interface Series {
  id: string           // used as legend key
  label: string        // displayed in legend and tooltip
  data: TimePoint[]
}

interface AssayTimeSeriesProps {
  series: Series[]     // up to 8 series; beyond 8 is not supported
  xLabel: string       // axis label — always include unit, e.g. "Time (h)"
  yLabel: string       // axis label — always include unit, e.g. "Response (RFU)"
  height?: number      // defaults to 280
  referenceLines?: {   // optional horizontal markers
    value: number
    label: string
  }[]
}
```

---

#### `<CompoundBadge>`

Inline identifier pill for compound IDs with status color. Used in tables, cards, and search results.

```tsx
type CompoundStatus = "active" | "pending" | "failed" | "archived"

interface CompoundBadgeProps {
  compoundId: string       // e.g. "BS-4421" — rendered in font-mono
  status: CompoundStatus
  size?: "sm" | "default"  // sm for dense table contexts; default elsewhere
  onClick?: () => void     // if provided, renders as a button
}
```

Token wiring: uses the same `STATUS_CONFIG` semantic triplet pattern as `CompoundScreeningTable`. The ID string always renders `font-mono text-sm` regardless of `size` — `size` controls padding and overall height only.

---

## 6. Worked examples

> **Format note:** Worked examples are literal TSX blocks optimized for LLM consumption — terse, no narration. Human-friendly walkthroughs live in the Forager DS onboarding deck, not here.

### Setup required — shadcn/ui token bridge

shadcn/ui components consume their own CSS variable names (`--primary`, `--background`, etc.). Add this bridge block to `globals.css` once, before using any examples below. It maps Forager semantic tokens to shadcn's expectations — no shadcn internals need editing.

```css
/* globals.css — shadcn/ui bridge (add once, do not touch thereafter) */
:root {
  --background:             var(--color-surface-default);
  --foreground:             var(--color-text-default);
  --card:                   var(--color-surface-default);
  --card-foreground:        var(--color-text-default);
  --popover:                var(--color-surface-default);
  --popover-foreground:     var(--color-text-default);
  --primary:                var(--color-action-primary);
  --primary-foreground:     var(--color-text-on-action-primary);
  --secondary:              var(--color-surface-alt);
  --secondary-foreground:   var(--color-text-default);
  --muted:                  var(--color-surface-alt);
  --muted-foreground:       var(--color-text-subtle);
  --accent:                 var(--color-surface-brand-subtle);
  --accent-foreground:      var(--color-text-default);
  --destructive:            var(--color-action-critical);
  --destructive-foreground: var(--color-text-on-action-critical);  /* soft destructive: red text on red-100, not white on red-500 */
  --border:                 var(--color-border-default);
  --border-subtle:          var(--color-border-subtle);   /* hairlines, table grid, chart wrappers */
  --border-bold:            var(--color-border-bold);     /* emphatic dividers */
  --input:                  var(--color-border-default);
  --ring:                   var(--color-border-focus);
}
/* Dark theme auto-applies via [data-theme="dark"] — no additional bridge needed */
```

After this bridge, shadcn's standard class names (`bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, etc.) resolve to Forager tokens automatically. The two extended aliases — `--border-subtle` and `--border-bold` — are not native to shadcn but are registered here so component code can use `border-[var(--border-subtle)]` as a class instead of reaching for an inline style.

For semantic status colors not covered by shadcn's variable set (success, warning, info, data), use `text-[var(--color-text-success)]` etc. — CSS variable arbitrary references are allowed; hardcoded hex arbitrary values are not.

---

### Example 1: stat card

**Prompt:** *Build a stat card showing total compounds screened this week: 1,247, up 12% from last week.*

```tsx
import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

type Trend = "up" | "down" | "neutral"

export function StatCard({
  label,
  value,
  delta,
  trend,
}: {
  label: string
  value: string
  delta: string
  trend: Trend
}) {
  return (
    <Card className="p-6">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>

      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-semibold tabular-nums">{value}</span>

        {trend !== "neutral" && (
          <span
            className={[
              "flex items-center gap-0.5 text-sm font-medium",
              trend === "up"
                ? "text-[var(--color-text-success)]"
                : "text-[var(--color-text-critical)]",
            ].join(" ")}
          >
            {trend === "up"
              ? <TrendingUp className="w-4 h-4" />
              : <TrendingDown className="w-4 h-4" />}
            {delta}
          </span>
        )}
      </div>

      <p className="text-xs font-normal mt-1 text-muted-foreground">vs. last week</p>
    </Card>
  )
}

// Usage
<StatCard
  label="Compounds screened this week"
  value="1,247"
  delta="+12%"
  trend="up"
/>
```

---

### Example 2: primary button

**Prompt:** *Build a primary button that runs an assay on the selected sample.*

```tsx
import { Button } from "@/components/ui/button"

export function RunAssayButton({
  sampleId,
  onRun,
  isLoading = false,
}: {
  sampleId: string
  onRun: (id: string) => void
  isLoading?: boolean
}) {
  return (
    <Button
      onClick={() => onRun(sampleId)}
      disabled={isLoading}
      className="px-4 py-2 text-sm font-medium"
    >
      {isLoading ? "Running…" : "Run assay"}
    </Button>
  )
}

// Usage
<RunAssayButton sampleId="BS-4421" onRun={handleRun} />
```

Button variant defaults to `"default"`, which resolves to `--primary` (lime) via the bridge. Do not pass `style` or override `bg-*` manually — the bridge handles it.

---

### Example 3: dose-response chart

**Prompt:** *Build a dose-response chart for compound BS-4421 against enzyme target XYZ. Y-axis is percent inhibition, X-axis is log concentration in µM. Include the 4PL fit and the IC50 reference line.*

```tsx
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts"

type Point = { logConc: number; inhibition: number }

export function DoseResponseChart({
  compoundId,
  targetId,
  dataPoints,
  curvePoints,   // pre-computed 4PL fit, higher density than raw data
  ic50LogValue,  // log10(IC50) — used for reference line position and label
}: {
  compoundId: string
  targetId: string
  dataPoints: Point[]
  curvePoints: Point[]
  ic50LogValue: number
}) {
  const ic50Display = `${Math.pow(10, ic50LogValue).toFixed(3)} µM`

  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        backgroundColor: "var(--color-surface-default)",
        borderColor: "var(--color-border-subtle)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-medium">{compoundId}</h3>
          <p className="text-sm font-normal text-muted-foreground">
            Dose–response · {targetId}
          </p>
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          IC₅₀ {ic50Display}
        </span>
      </div>

      {/* Chart — Recharts SVG props require style values, not className */}
      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 4, right: 16, bottom: 28, left: 8 }}>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke="var(--color-border-subtle)"
          />

          <XAxis
            dataKey="logConc"
            type="number"
            name="log [µM]"
            label={{
              value: "log concentration [µM]",
              position: "insideBottom",
              offset: -16,
              style: { fill: "var(--color-text-subtle)", fontSize: 12 },
            }}
            tick={{
              fill: "var(--color-text-subtle)",
              fontSize: 11,
              fontFamily: "ui-monospace",
            }}
          />

          <YAxis
            dataKey="inhibition"
            type="number"
            name="% inhibition"
            domain={[0, 100]}
            label={{
              value: "% inhibition",
              angle: -90,
              position: "insideLeft",
              offset: 8,
              style: { fill: "var(--color-text-subtle)", fontSize: 12 },
            }}
            tick={{
              fill: "var(--color-text-subtle)",
              fontSize: 11,
              fontFamily: "ui-monospace",
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-surface-default)",
              border: "1px solid var(--color-border-default)",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "ui-monospace",
            }}
            labelStyle={{ color: "var(--color-text-subtle)" }}
            itemStyle={{ color: "var(--color-text-default)" }}
            formatter={(v: number, name: string) =>
              name === "% inhibition"
                ? [`${v.toFixed(2)}%`, name]
                : [`${v.toFixed(3)} log µM`, name]
            }
          />

          {/* 4PL fitted curve — line only, no dots */}
          <Scatter
            data={curvePoints}
            line={{ stroke: "var(--chart-curve-fit)", strokeWidth: 2 }}
            lineType="joint"
            shape={() => null as any}
            name="4PL fit"
          />

          {/* Raw experimental data points */}
          <Scatter
            data={dataPoints}
            fill="var(--chart-datapoint-default)"
            name="observed"
            r={4}
          />

          {/* IC50 reference line */}
          <ReferenceLine
            x={ic50LogValue}
            stroke="var(--chart-reference-line)"
            strokeDasharray="6 3"
            label={{
              value: "IC₅₀",
              position: "top",
              fill: "var(--chart-reference-line)",
              fontSize: 11,
              fontFamily: "ui-monospace",
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

// Usage
<DoseResponseChart
  compoundId="BS-4421"
  targetId="XYZ"
  dataPoints={rawPoints}
  curvePoints={fittedCurve}
  ic50LogValue={-1.42}  // 10^-1.42 ≈ 0.038 µM
/>
```

**Chart token note:** The fitted curve now correctly uses `var(--chart-curve-fit)` (Section 3.7 is live). The raw data scatter uses `var(--chart-datapoint-default)` and the IC50 reference line uses `var(--chart-reference-line)`. Do not substitute text or border semantic tokens for chart roles.

---

## 7. Anti-examples (do not do these things)

A non-exhaustive list of patterns that are forbidden in Forager code.

- **Do not hardcode hex values.** `background: #305536` is wrong. `background: var(--color-surface-brand)` is right.
- **Do not hardcode px values.** `padding: 16px` is wrong. `className="p-4"` is right.
- **Do not use Tailwind arbitrary values for hardcoded values.** `bg-[#305536]` and `p-[13px]` are forbidden. CSS variable arbitrary references — `text-[var(--color-text-success)]` — are allowed when no mapped shadcn class exists for a Forager semantic token.
- **Do not use botanical names.** `Deep Forest`, `Garlic Bloom`, `Eschscholzia Californica`, `Ocean`, `Sand` — none of these appear in code. Anywhere. They are brand copy, not design tokens.
- **Do not reference `--primary-*` tokens.** Brightseed splits primary into `surface-brand` and `action-primary`. If you want the brand chrome color, reach for `--color-surface-brand`. If you want the primary button color, reach for `--color-action-primary`. "Primary" alone is ambiguous and forbidden.
- **Do not hardcode font families.** `font-family: "Tiempos Text"` is wrong. Tailwind's `font-sans`, `font-serif`, `font-mono` utilities are right. Tiempos is marketing-only.
- **Do not write dark-mode CSS.** No `@media (prefers-color-scheme: dark)`, no `.dark` class handling in components. Dark theme is handled by `[data-theme="dark"]` overrides at the primitive layer, not in component code.
- **Do not reach past the semantic layer into primitives.** Using `--color-neutral-100` in a component means no semantic captured your intent — stop and flag with `// BRIGHTSEED-TBD:`.
- **Do not use the lime brand action as a chart data color.** Brand action colors are reserved for UI chrome. Charts use `--chart-cat-*` and `--chart-seq-*`.
- **Do not invent tokens.** If a token doesn't exist in Section 3, you may not use it. Flag and stop.
- **Do not import from component libraries other than shadcn/ui and Recharts.** No MUI, no Chakra, no Ant, no custom Tailwind plugins.
- **Do not build marketing patterns inside Forager.** Hero sections, editorial layouts, Tiempos Text, large display type — these belong to the Brightseed marketing system. If a prompt asks for one, flag it: `// BRIGHTSEED-TBD: this pattern belongs in the marketing system, not Forager.`
- **Do not use inline styles except for dynamic values** (e.g., a chart bar width computed from data). Static styling lives in className or CSS-var references.
- **Do not round scientific values in the UI.** Show full precision with appropriate units. Rounding is a data-layer decision, not a presentation one.

---

## 8. Escape hatches

*What to do when you can't solve the prompt with the tokens you have.*

1. **No matching token:** Pick the closest semantic token, use it, and add a comment: `// BRIGHTSEED-TBD: needs a dedicated token for {role}, using {chosen} as closest match.` Do not invent new tokens inline.

2. **No matching component:** Compose from existing shadcn primitives. If composition is not possible, flag with `// BRIGHTSEED-TBD: missing component {name} — returning stub.` Return a clearly-labeled stub. Do not import from other libraries.

3. **Prompt is ambiguous:** Pick the most conservative interpretation (plain text, default surface, no animation) and add a comment: `// BRIGHTSEED-CLARIFY: prompt was ambiguous about {X}, assumed {Y}.`

4. **Prompt asks for something unsafe or out of scope** (e.g., marketing hero for an internal tool, dark mode toggle in component code, custom font loading): refuse, explain, do not comply.

---

## 9. Forager-specific notes (biotech context)

Things about the Brightseed product domain that affect UI decisions.

- **Forager is a biotech discovery tool.** Users are scientists and data analysts, not general consumers. Lean toward information density over whitespace.
- **Numeric precision matters.** Use tabular numerals (`font-variant-numeric: tabular-nums`) for any column of numbers. Show scientific notation where appropriate (nanomolar, EC50, etc.).
- **Sample IDs and compound IDs are first-class.** They appear everywhere and should be rendered in `--text-mono-md` for visual distinction.
- **Dose-response, time-series, and heatmaps are the primary chart types.** Bar and pie charts are rare.
- **Units are non-negotiable.** Never display a number without its unit (µM, nM, %, etc.).
- **Color should never encode data without a legend.** In charts, always pair color with a label or shape. Brightseed works with users who may be colorblind; never rely on color alone.

---

## 10. Open questions (to resolve during build)

*Things the skeleton leaves explicitly unresolved. Each will be closed by a specific day of the plan.*

1. ~~**Sans-serif pairing for Tiempos.**~~ → **Resolved:** Tailwind system sans throughout Forager. Tiempos is marketing-website only.
2. ~~**Dark mode base: pure black, Deep-Forest-900, or cool neutral?**~~ → **Resolved (Apr 2026):** `sand-950` (`#1F1F1E`) — warm dark neutral. Initially set to forest-950 ("Deep Forest floor") but realigned to sand to match Figma's shadcn Theme dark mappings. Forest exits surface vocabulary in dark mode entirely, staying only as text on the lime button. Brand-context link colors moved to lime in May 2026. See Section 3.3 dark theme override.
3. ~~**Sand as its own scale or rolled into neutral?**~~ → **Resolved:** Sand gets its own scale (`--color-sand-*`). It's a warm off-white with a distinct hue (H=97°) that neutral-50 doesn't replicate. Both scales coexist.
4. ~~**Does `--success-*` share the green-* hue scale with `--surface-brand-*`?**~~ → **Resolved:** Yes, they share. Brand chrome uses dark steps (700–950), success semantics use light steps (50–300). No collision. See Section 3.2.
5. **Selected-row surface: reuse `--color-surface-success` or dedicate `--color-surface-selected`?** → *Still open — will resolve during compound library browser build.*
6. **Dose-response 4PL fitting: Recharts custom layer or Visx fallback?** → *Still open.*
7. ~~**How does a lime button on a Deep Forest nav bar pass WCAG AA?**~~ → **Resolved (Apr 2026):** action-primary anchor is lime-400 (`#B8D258`). forest-900 text (`#305536`) on lime-400 passes WCAG AA — verified by Becky.
8. ~~**Marketing expression layer:** stub in Section 3 or omit entirely?~~ → **Resolved: omit.** BrightseedDS.md is scoped to Forager (the internal product). Marketing tokens — Tiempos Text, hero color expressions, editorial type scales — live in a separate system and must never bleed into Forager component code. An LLM reading this file should have no path to marketing tokens. If a Forager prompt requests something that reads as marketing (hero sections, brand storytelling layouts), flag it with `// BRIGHTSEED-TBD: this pattern belongs in the marketing system, not Forager.`
9. **Does the lime-400 button surface read cleanly on a forest-900 nav bar?** → *Still open — needs more mockups before Becky can call it. The inverse pairing (forest-900 text on lime-400) is verified, but lime-400 (`#B8D258`) sitting on forest-900 (`#305536`) hasn't been assessed against the chrome it lives on. Defer until brand-evolution mockups give the button real context.*

---

*End of skeleton. Everything below the skeleton ships after Day 2. Becky: react to the structure — what's missing, what's in the wrong order, what's load-bearing that I've treated as optional.*
