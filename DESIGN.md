---
version: alpha
name: Hummingbird
description: Brightseed Bio's design system for Hummingbird, a calm, credible, efficient UI for biotech discovery. Three-tier tokens (primitive, semantic, component), light and dark, WCAG 2.1 AA floor.

# Values below are the LIGHT theme and are generated from tokens/*.css, which
# remains the source of truth. Dark theme swaps the same semantic names under
# [data-theme="dark"]; see the Colors section. Token names mirror the --ds-*
# semantic tier with the prefix dropped.
#
# WARNING for coding agents: border-focus below is the LIGHT value (sand-700).
# Dark is sand-500 and is NOT derivable from it — applying sand-700 to a dark
# surface gives 2.87:1 and fails SC 1.4.11. Same for border-field-hover
# (sand-700 light / sand-500 dark). Read Borders > Focus rings before using
# either, and never assume a focus token is theme-invariant.
colors:
  # The spec's recommended vocabulary, mapped onto Brightseed's roles, so an
  # agent that reaches for a conventional name lands on the right value.
  primary: "#CDE67B"        # lime-300, the primary action surface
  secondary: "#eae8df"      # sand-200, secondary action surface
  tertiary: "#305536"       # forest-900, the brand surface
  neutral: "#f3f2ec"        # sand-100, alt/neutral surface
  surface: "#ffffff"
  on-surface: "#46453f"     # sand-800, default body text
  error: "#a00020"          # red-700

  # Brightseed's own semantic names, mirroring the --ds-* tier.
  surface-default: "#ffffff"
  surface-alt: "#f3f2ec"
  surface-field: "#fdfcf8"
  surface-brand: "#305536"
  surface-brand-subtle: "#eefbf1"
  action-primary: "#CDE67B"
  action-primary-hover: "#b8d258"
  action-primary-active: "#a1b833"
  action-secondary: "#eae8df"
  action-critical: "#ffe6e2"
  text-default: "#46453f"
  text-subtle: "#68665e"
  text-inverse: "#F9F8F3"
  text-on-action-primary: "#3f6947"
  text-link: "#0059b8"
  text-link-brand: "#3f6947"
  border-default: "#dddbcf"
  border-subtle: "#eae8df"
  border-bold: "#aeab9e"
  border-field: "#dddbcf"
  border-field-hover: "#aeab9e"
  border-field-focus: "#8c897f"
  surface-field-focus: "#ffffff"
  border-focus: "#68665e"
  ring-focus: "color-mix(in srgb, #a1b833 12%, transparent)"
  surface-success: "#eefbf1"
  surface-info: "#eef8ff"
  surface-warning: "#faf9e4"
  surface-critical: "#fff3f0"
  text-success: "#46764f"
  text-info: "#00448c"
  text-warning: "#7d6c00"
  text-critical: "#a00020"

typography:
  display-h1:
    fontFamily: Tiempos Fine
    fontSize: 56px
    fontWeight: 400
    lineHeight: 1.07
    letterSpacing: -0.02em
  display-h2:
    fontFamily: Tiempos Fine
    fontSize: 40px
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: -0.015em
  display-h3:
    fontFamily: Tiempos Fine
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.21
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.43
  data-md:
    fontFamily: Geist Mono
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43

rounded:
  none: 0px
  2xs: 2px
  xs: 4px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  2xl: 18px
  3xl: 22px
  4xl: 26px
  full: 9999px

spacing:
  base: 4px
  "0": 0px
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "8": 32px
  "10": 40px
  "12": 48px
  "16": 64px
  "20": 80px
  "24": 96px

components:
  button-primary:
    backgroundColor: "{colors.action-primary}"
    textColor: "{colors.text-on-action-primary}"
    rounded: "{rounded.md}"
  button-primary-hover:
    backgroundColor: "{colors.action-primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.action-primary-active}"
  button-secondary:
    backgroundColor: "{colors.action-secondary}"
    textColor: "{colors.text-default}"
    rounded: "{rounded.md}"
  button-destructive:
    backgroundColor: "{colors.action-critical}"
    textColor: "{colors.text-critical}"
    rounded: "{rounded.md}"
  tag:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.text-default}"
    rounded: "{rounded.2xs}"
  chip:
    backgroundColor: "{colors.surface-alt}"
    textColor: "{colors.text-default}"
    rounded: "{rounded.full}"
  input:
    backgroundColor: "{colors.surface-field}"
    textColor: "{colors.text-default}"
    rounded: "{rounded.md}"
  card:
    backgroundColor: "{colors.surface-default}"
    textColor: "{colors.text-default}"
    rounded: "{rounded.lg}"
  dialog:
    backgroundColor: "{colors.surface-default}"
    rounded: "{rounded.xl}"
  link:
    textColor: "{colors.text-link}"
  linktext:
    textColor: "{colors.text-link-brand}"
  sidebar:
    backgroundColor: "{colors.surface-default}"
    textColor: "{colors.text-subtle}"
  sidebar-item-selected:
    backgroundColor: "{colors.surface-brand-subtle}"
    textColor: "{colors.text-link-brand}"
  topbar-brand:
    backgroundColor: "{colors.surface-brand}"
    textColor: "{colors.text-inverse}"
  alert-success:
    backgroundColor: "{colors.surface-success}"
    textColor: "{colors.text-success}"
    rounded: "{rounded.md}"
  alert-info:
    backgroundColor: "{colors.surface-info}"
    textColor: "{colors.text-info}"
    rounded: "{rounded.md}"
  alert-warning:
    backgroundColor: "{colors.surface-warning}"
    textColor: "{colors.text-warning}"
    rounded: "{rounded.md}"
  alert-critical:
    backgroundColor: "{colors.surface-critical}"
    textColor: "{colors.text-critical}"
    rounded: "{rounded.md}"
  table:
    backgroundColor: "{colors.surface-default}"
    textColor: "{colors.text-default}"
    rounded: "{rounded.none}"
  tooltip:
    backgroundColor: "{colors.surface-brand}"
    textColor: "{colors.text-inverse}"
    rounded: "{rounded.sm}"
---

# Design Guidelines

## Overview

Hummingbird is a tool for scientists and R&D professionals in biotech discovery. The interface should be calm, credible, and efficient, not expressive for its own sake. Design earns attention; it doesn't demand it.

**Restrained, with a committed accent on action surfaces.** Most pixels are neutral: sand, white, near-black. Lime carries the primary action weight. It appears on hero CTAs, primary chips, and the brand mark on the rail, surfaces where the user needs to act. Everywhere else, we get out of the way.

Charts and tag colors (forest, cyan, lavender, orchid, orange, blue, yellow, red) are available for data differentiation, but they are never mixed with brand lime or forest as data series. Color in charts serves data clarity, not brand expression.

---

## Colors

### Three layers

Component code references **its own component-scoped tokens only** (`--c-{component}-*`), never a global `--ds-*`, a primitive, or a raw value directly. Each `--c-{component}-*` token aliases exactly one global semantic. Name it `--c-{component}-{role}[-{variant-or-state}]`: a kebab-case component name matching the file (`alert-dialog`, `input-group`), a role word from the semantic vocabulary (`surface`, `border`, `text`, `icon`, `shape-radius`), then the variant or state last (`-hover`, `-focus`, `-critical`). No abbreviations, and no separate `-color-` segment — the role word carries it. The tail normally mirrors the aliased `--ds-*` name with its prefix dropped, except where the component's local intent differs, in which case local intent wins (`--c-card-surface-default: var(--ds-color-surface-raised)`). The prefix encodes the tier, so any reference is auditable at a glance: `--p-` is a raw value, `--ds-` is a global semantic, `--c-` is component scope. The layers exist so that a single design decision (e.g., "primary action should be lime") flows everywhere automatically.

| Layer      | Prefix              | Example                          | What it does                                              |
| ---------- | ------------------- | -------------------------------- | --------------------------------------------------------- |
| Primitives | `--p-{type}-*`      | `--p-color-lime-300`             | Raw values, organized by type, the palette. Never used in components. |
| Semantics (global) | `--ds-*`    | `--ds-color-action-primary`, `--ds-shape-radius-md`, `--ds-shape-border-default` | Intent-based aliases. Map design intent to primitives. The only tier that touches primitives. |
| Component (scoped) | `--c-{component}-*` | `--c-button-action-primary` | Each component owns its own token block; every token aliases exactly one global `--ds-*`. **The only tier component code reads.** Defined in `tokens/components.css`. |

> **Note:** Primitives are organized by `$type` and all use the `--p-{type}-*` convention (`--p-color-forest-700`, `--p-color-lime-300`, etc.). Component tokens live in `tokens/components.css`, one block per component, generated 1:1 from what each component needs. The tier discipline reduces to two greppable rules: **component code may reference only `--c-*`**, and **a `--c-*` definition may reference only a global `--ds-*`**. Anything else (a `--ds-*` or `--p-*` in a component file, a `--p-*` or raw value in `components.css`) is a regression. Dark theme needs no overrides, a `--c-*` token resolves `var(--ds-*)` at point of use, so the `data-theme="dark"` swap flows straight through.

---

### Surfaces

All surfaces that change between light and dark theme list both values. State suffixes (`-hover`, `-active`) follow the "one step more pronounced" rule, each step tightens toward the interaction direction.

#### Base surfaces

| Token                              | Light      | Dark       | Use                                              |
| ---------------------------------- | ---------- | ---------- | ------------------------------------------------ |
| `--ds-color-surface-default`       | white      | sand-950   | Page background                                  |
| `--ds-color-surface-default-hover` | sand-100   | sand-900   | Hovered page-level elements                      |
| `--ds-color-surface-default-active`| sand-200   | sand-800   | Pressed page-level elements                      |
| `--ds-color-surface-alt`           | sand-100   | sand-850   | Fills sitting directly on the page or canvas     |
| `--ds-color-surface-alt-hover`     | sand-200   | sand-800   | Hovered alt surfaces                             |
| `--ds-color-surface-canvas`        | sand-25    | sand-900   | The content ground the app shell paints          |
| `--ds-color-surface-raised`        | white      | sand-850   | A card lifted off the ground                     |
| `--ds-color-surface-raised-alt`    | sand-100   | sand-900   | A fill nested *inside* a card — recesses         |
| `--ds-color-surface-field`         | sand-25    | sand-800   | Input / textarea fill at rest                    |
| `--ds-color-surface-chip-neutral`  | black @ 5% | black @ 25%| Neutral chip; overlay, so it works on any host   |
| `--ds-color-data-track`            | black @ 5% | black @ 35%| Unfilled remainder of a magnitude meter          |
| `--ds-color-surface-scrim`         | sand-950 @ 50% | black @ 60% | Modal / dialog backdrop veil              |

In dark the ladder runs **chrome sand-950 → content sand-900 → card sand-850 → nested sand-900**, so the chrome reads darker than the content it frames and a fill inside a card recesses rather than rising. In light all four `-raised*` roles collapse onto their `-default`/`-alt` counterparts, so the distinction only costs anything in dark.

#### Semantic intent surfaces

Light mode uses a soft step-50 tint. Dark mode blends the intent color at low opacity into the **content ground** for a subtle hue without glow. The base tints mix against sand-900; the `-raised` companions mix against sand-850, for a chip sitting inside a card. Because these are mixed against a ground, they must be re-mixed whenever that ground moves.

| Token                                | Light        | Dark                           | Use                              |
| ------------------------------------ | ------------ | ------------------------------ | -------------------------------- |
| `--ds-color-surface-success`         | forest-50    | forest-800 @ 15% on sand-900   | Success alert, callout           |
| `--ds-color-surface-success-hover`   | forest-100   | forest-800 @ 22% on sand-900   |                                  |
| `--ds-color-surface-success-active`  | forest-200   | forest-800 @ 30% on sand-900   |                                  |
| `--ds-color-surface-info`            | blue-50      | blue-400 @ 10% on sand-900     | Info alert, callout              |
| `--ds-color-surface-info-hover`      | blue-100     | blue-400 @ 16% on sand-900     |                                  |
| `--ds-color-surface-info-active`     | blue-200     | blue-400 @ 22% on sand-900     |                                  |
| `--ds-color-surface-warning`         | yellow-50    | yellow-300 @ 10% on sand-900   | Warning alert, callout           |
| `--ds-color-surface-warning-hover`   | yellow-100   | yellow-300 @ 16% on sand-900   |                                  |
| `--ds-color-surface-warning-active`  | yellow-200   | yellow-300 @ 22% on sand-900   |                                  |
| `--ds-color-surface-critical`        | red-50       | red-400 @ 10% on sand-900      | Error / destructive alert        |
| `--ds-color-surface-critical-hover`  | red-100      | red-400 @ 16% on sand-900      |                                  |
| `--ds-color-surface-critical-active` | red-200      | red-400 @ 22% on sand-900      |                                  |
| `--ds-color-surface-data`            | cyan-50      | cyan-950                       | Data panel tint (default)        |
| `--ds-color-surface-selected`        | blue-50      | blue-950                       | Selected row, focused item       |
| `--ds-color-surface-selected-hover`  | blue-100     | blue-900                       |                                  |
| `--ds-color-surface-selected-active` | blue-200     | blue-800                       |                                  |

---

### Actions

#### Action surface ladders

Each variant has three surface states (default → hover → active) and one disabled surface. The disabled surface is computed: `color-mix(in srgb, <default-state surface>, --ds-color-disabled-surface-overlay 50%)`.

| Token                                   | Light                 | Dark                  | Notes                                      |
| --------------------------------------- | --------------------- | --------------------- | ------------------------------------------ |
| `--ds-color-action-primary`             | lime-300              | lime-300              | Default, theme-invariant                  |
| `--ds-color-action-primary-hover`       | lime-400              | lime-400              | One step more pronounced                   |
| `--ds-color-action-primary-active`      | lime-500              | lime-500              | Pressed                                    |
| `--ds-color-action-primary-disabled`    | lime-300 + sand-100 overlay | lime-300 + sand-700 overlay | Desaturated surface overlay       |
| `--ds-color-action-secondary`           | sand-200              | sand-800              | Faint sand bg, distinct from page and from `surface-alt` |
| `--ds-color-action-secondary-hover`     | sand-300              | sand-800              |                                            |
| `--ds-color-action-secondary-active`    | sand-400              | sand-700              |                                            |
| `--ds-color-action-secondary-disabled`  | sand-100              | sand-900              | Fades toward page bg                       |

This must never equal `--ds-color-surface-alt`: a secondary button on an alt-toned panel would be 1.00:1 and simply disappear. Both themes now clear it.
| `--ds-color-action-critical`            | red-100               | red-900               | Soft destructive, tinted, not alarming    |
| `--ds-color-action-critical-hover`      | red-200               | red-800               |                                            |
| `--ds-color-action-critical-active`     | red-300               | red-700               |                                            |
| `--ds-color-action-critical-disabled`   | red-100 + sand overlay | red-900 + sand overlay |                                           |

#### Disabled system

| Token                             | Value                                 | Notes                                                         |
| --------------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| `--ds-color-disabled-surface-overlay` | sand-100 (light) / sand-700 (dark) | Mixed at 50% over the default surface to produce the disabled surface |
| `--ds-disabled-text-opacity`      | `0.55`                                | Applied to text + icon on the variant's normal foreground. Not a hex, an opacity multiplier. |

#### Text on action surfaces

| Token                                      | Light       | Dark        | Notes                                                    |
| ------------------------------------------ | ----------- | ----------- | -------------------------------------------------------- |
| `--ds-color-text-on-action-primary`        | forest-800  | forest-800  | Theme-invariant, lime button text at default            |
| `--ds-color-text-on-action-primary-hover`  | forest-900  | forest-900  | One step more pronounced                                 |
| `--ds-color-text-on-action-primary-active` | forest-950  | forest-950  | Required for AA on lime-500 active surface               |
| `--ds-color-text-on-action-critical`       | red-600     | red-300     | Soft destructive text, red on red-tinted surface        |
| `--ds-color-text-on-action-critical-hover` | red-700     | red-200     |                                                          |

---

### Borders

#### Structural borders

| Token                       | Light      | Dark       | Use                                     |
| --------------------------- | ---------- | ---------- | --------------------------------------- |
| `--ds-color-border-subtle`  | sand-200   | sand-800   | Hairlines, table grid lines             |
| `--ds-color-border-default` | sand-300   | sand-700   | Card outlines, structural edges         |
| `--ds-color-border-bold`    | sand-500   | sand-600   | Emphatic dividers, selected indicators  |
| `--ds-color-border-field`   | sand-300   | sand-600   | Text-entry + select boundary, at rest    |
| `--ds-color-border-field-hover` | sand-500 | sand-500  | Field hover                             |
| `--ds-color-border-field-focus` | sand-600 | sand-500  | Field engaged                           |
| `--ds-color-border-control` | sand-600   | sand-600   | Unchecked checkbox — see below           |

#### Fields lift; they do not recede

A field is **flush** with its canvas at rest and **lifts** when engaged:

| State | Fill (light) | Border (light) |
| ----- | ------------ | -------------- |
| rest  | sand-25 — the canvas value, so the border *is* the field | sand-300 |
| hover | white | sand-500 |
| focus | white | sand-600 |

This has a structural consequence worth knowing: in a light theme "lighter than its surface" has a **ceiling**. White is the lightest value, so the largest fill step available is white-on-sand-300 = 1.39:1. **The fill can never identify a field — it delivers depth; the border delivers identification.** That is why the border carries the whole 3:1 obligation in the engaged state, and why surfaces that host fields must step down (sand-25 canvas, not white) for the lift to read at all.

`--ds-color-border-control` exists because the resting sand-300 edge is only defensible on a control that has *other* evidence it exists — a label, a placeholder. An unchecked checkbox has none, so it holds sand-600 in both themes. **Never point a label-less control at `border-field`.** The two themes are symmetric at sand-600.

#### Focus rings

**Opaque**, no offset. Variant-aware color, visible without dominating. Ring *width* is **2px on controls** (Button, Tabs, Switch, Checkbox, Accordion, Resizable, Dialog and the list-row overlays) and **1px on nav rows** (Sidebar, Nav User, Team Switcher, App Shell, via `ring-1`). Button was the lone 3px holdout and was brought in line Aug 6 2026. `--ds-color-border-focus-link-brand` is a separate token from `--ds-color-border-focus` for namespace clarity, even though they currently resolve to the same value.

| Variant                | Token                                  | Light    | Dark     |
| ---------------------- | -------------------------------------- | -------- | -------- |
| Default / Outline / Ghost | `--ds-color-border-focus`           | sand-700 | sand-500 |
| Secondary              | `--ds-color-border-focus-secondary`    | sand-700 | sand-500 |
| Destructive            | `--ds-color-border-focus-destructive`  | red-500  | red-500  |
| Linktext               | `--ds-color-border-focus-link-brand`   | sand-700 | sand-500 |

**Focus rings are not theme-invariant.** Light uses sand-700 and dark uses sand-500 because each is the step that clears 3:1 on its own surfaces — sand-700 measures 5.75:1 on white and 4.16:1 even against the lime-300 primary fill, while on the dark page it would be only 2.87:1. Adding a focus token means adding both halves.

Rings are opaque by design. An alpha modifier costs roughly a third of the contrast ratio, which is what previously put light-mode focus below the threshold.

There is no ring offset. What carries the indicator is the ring's **outer** edge against the page — 5.75:1 light, 7.16:1 dark. The inner edge against a component's own fill clears only in light (sand-700 on lime-300 is 4.16:1; in dark, sand-500 on that same lime-300 is 1.67:1), which is acceptable — 1.4.11 asks that the indicator be perceivable, not perceivable on both sides. Do not add `ring-offset` to "fix" the inner edge: it does not help, and Tailwind's `--tw-ring-offset-color` defaults to `#fff`, which paints a white gap around every focused control in dark mode. Eight sites in `components/hummingbird/cards/` currently do exactly that and are a known bug, not a pattern to copy.

`--ds-color-ring-focus` (lime-500 @ 12%) is a **decorative** brand whisper layered on text-entry fields. At ~1.09:1 it is not a focus indicator and never counts toward conformance. Never ship a focus state that has the whisper and no sand ring.

#### Semantic intent borders

Light mode uses a quiet step-200 tint. Dark mode uses a semi-transparent intent color at 46% opacity, same base step as the icon, expressed as a translucent overlay.

| Token                               | Light      | Dark                    |
| ----------------------------------- | ---------- | ----------------------- |
| `--ds-color-border-success-default` | forest-200 | forest-600 @ 46%        |
| `--ds-color-border-success-bold`    | forest-600 | forest-500              |
| `--ds-color-border-info-default`    | blue-200   | blue-300 @ 46%          |
| `--ds-color-border-info-bold`       | blue-600   | blue-500                |
| `--ds-color-border-warning-default` | yellow-200 | yellow-300 @ 46%        |
| `--ds-color-border-warning-bold`    | yellow-600 | yellow-500              |
| `--ds-color-border-critical-default`| red-200    | red-400 @ 46%           |
| `--ds-color-border-critical-bold`   | red-600    | red-500                 |

---

### Text

#### Base text

| Token                          | Light      | Dark       | Use                                                        |
| ------------------------------ | ---------- | ---------- | ---------------------------------------------------------- |
| `--ds-color-text-default`      | sand-800   | sand-50    | Body copy, primary labels. Warm dark (softened from sand-900, June 2026) / warm white |
| `--ds-color-text-default-hover`| sand-950   | sand-50    | Default text deepens to the strong near-black on hover (dark mode hits ceiling at sand-50) |
| `--ds-color-text-subtle`       | sand-700   | sand-300   | Secondary / helper text, captions                          |
| `--ds-color-text-disabled`     | sand-500   | sand-600   | Static disabled text (non-button). Buttons use opacity rule instead. |

#### Inverse text

Used on Deep Forest (`--ds-color-surface-brand`) and other dark panels.

| Token                            | Light    | Dark     | Use                              |
| -------------------------------- | -------- | -------- | -------------------------------- |
| `--ds-color-text-inverse`        | sand-50  | sand-900 | Primary text on dark surfaces    |
| `--ds-color-text-inverse-subtle` | sand-300 | sand-700 | Secondary text on dark surfaces  |

#### Link text

Two distinct components with separate state machines. `link-*` is the inline `<a>` in body copy (always underlined, blue scale). `link-brand` is the `Linktext` button variant (never underlined). In light mode it rests on a dark forest green and brightens to a more saturated green on hover (dark default -> bright, branded); in dark mode it uses the lime scale.

| Token                             | Light      | Dark       | State           |
| --------------------------------- | ---------- | ---------- | --------------- |
| `--ds-color-text-link-default`    | blue-600   | blue-500   | `:link`         |
| `--ds-color-text-link-default-hover` | blue-700 | blue-400  | `:hover`        |
| `--ds-color-text-link-visited`    | sand-700   | sand-300   | `:visited`, warm, settled |
| `--ds-color-text-link-active`     | blue-900   | blue-200   | `:active`       |
| `--ds-color-text-link-brand`      | forest-800 | lime-300   | Linktext default; forest-800 passes AA on white, lime-300 passes AA on sand-950 |
| `--ds-color-text-link-brand-hover`| forest-550 | lime-200   | Brighter, more saturated green on hover (light); one step lighter (dark) |

#### Semantic text

Light mode uses intent-tinted text. Dark mode uses neutral foreground (`sand-50`), tinted text on dark tinted surfaces reads garish and reduces contrast. The semantic signal in dark mode lives in the surface tint and border only.

| Token                          | Light      | Dark (neutral) | Use                        |
| ------------------------------ | ---------- | -------------- | -------------------------- |
| `--ds-color-text-success`      | forest-700 | sand-50        | Success label, alert body  |
| `--ds-color-text-info`         | blue-700   | sand-50        | Info label, alert body     |
| `--ds-color-text-warning`      | yellow-700 | sand-50        | Warning label, alert body  |
| `--ds-color-text-critical`     | red-700    | sand-50        | Error label, alert body    |
| `--ds-color-text-data`         | cyan-700   | cyan-300       | Data panel label           |
| `--ds-color-text-data-lavender`| lavender-700 | lavender-300 | Data panel (lavender hue)  |
| `--ds-color-text-data-orange`  | orange-700 | orange-300     | Data panel (orange hue)    |
| `--ds-color-text-data-orchid`  | orchid-700 | orchid-300     | Data panel (orchid hue)    |

---

### Icons

Icons mirror the text taxonomy exactly. `--ds-color-icon-*` and `--ds-color-text-*` share the same token structure and values, pick the one that semantically matches whether you're coloring a text node or an icon node.

#### Base icons

| Token                            | Light    | Dark     | Use                                        |
| -------------------------------- | -------- | -------- | ------------------------------------------ |
| `--ds-color-icon-default`        | sand-900 | sand-50  | Primary icons alongside body text          |
| `--ds-color-icon-subtle`         | sand-700 | sand-300 | Secondary / decorative icons               |
| `--ds-color-icon-disabled`       | sand-500 | sand-600 | Static disabled icon (non-button contexts) |
| `--ds-color-icon-inverse`        | sand-50  | sand-900 | Icons on Deep Forest or other dark surfaces|
| `--ds-color-icon-inverse-subtle` | sand-300 | sand-700 | Secondary icons on dark surfaces           |
| `--ds-color-icon-brand`          | lime-400 | lime-400 | Brand icons on light or dark bg, theme-invariant |

#### Semantic icons

In dark mode, icon color uses the same base step as the semantic border (solid, not semi-transparent).

| Token                          | Light      | Dark             | Use                      |
| ------------------------------ | ---------- | ---------------- | ------------------------ |
| `--ds-color-icon-success`      | forest-700 | forest-600       | Success alert icon       |
| `--ds-color-icon-info`         | blue-700   | blue-300         | Info alert icon          |
| `--ds-color-icon-warning`      | yellow-700 | yellow-200 @ 80% | Warning alert icon       |
| `--ds-color-icon-critical`     | red-700    | red-400 @ 80%    | Critical alert icon      |
| `--ds-color-icon-destructive`  | red-700    | red-400 @ 80%    | Destructive action icon  |

#### Data & misc icons

| Token                            | Light        | Dark         | Use                              |
| -------------------------------- | ------------ | ------------ | -------------------------------- |
| `--ds-color-icon-data`           | cyan-700     | cyan-300     | Data panel icons                 |
| `--ds-color-icon-data-lavender`  | lavender-700 | lavender-300 | Data panel (lavender hue)        |
| `--ds-color-icon-data-orange`    | orange-700   | orange-300   | Data panel (orange hue)          |
| `--ds-color-icon-data-orchid`    | orchid-700   | orchid-300   | Data panel (orchid hue)          |
| `--ds-color-icon-favorite-inactive` | sand-400  | sand-700     | Unselected favorite/star, resting, muted |
| `--ds-color-icon-favorite-active`   | yellow-500 | yellow-500   | Favorited / pinned, theme-invariant |

---

### Tag colors

The 8 tag colors, forest, lime, cyan, blue, yellow, orange, lavender, orchid, are **decorative, not semantic**. A `cyan` badge does not mean "info." An `orange` badge does not mean "warning." Tag color exists for visual differentiation in tag-dense Hummingbird tables, not to imply system state.

For status meaning, always use icon + text composition, never rely on color alone.

---

### Charts

Use `--ds-chart-cat-1` through `--ds-chart-cat-8` in order for categorical data series. Never use brand lime or brand forest as a data series color, those are reserved for UI, not data.

---

## Typography

**Geist** is the primary typeface for all UI, labels, body, tables, inputs. It's a variable font; we use the weight axis for state signaling (button hover, etc.). Loaded via the `geist` npm package.

**Tiempos Fine RegularItalic** is the display face, marketing headlines, section titles, the doc pages you're reading now. The italic is intrinsic to the cut, not a modifier. Use it for `display/h1`, `display/h2`, `display/h3` only; don't reach for it inside the product UI.

**Tiempos Text** (Medium, Semibold, Bold) is licensed and available for inline body emphasis. Not currently in active use but available.

Body line length is capped at **65–75ch** to maintain readable measure at typical screen sizes.

---

## Layout & Spacing

Spacing is a **4px base ramp**: every step is a multiple of 4px, mirroring the Figma `spacing/*` scale (`spacing/1` = 4px). Primitives live in `tokens/shape.css` as `--p-space-*`. There is no separate semantic spacing tier, components apply spacing through Tailwind utilities (`p-4`, `gap-3`, `space-y-6`), which resolve to the same 4px ramp. Never hardcode arbitrary pixel gaps; snap to the ramp.

| Token          | Value | Typical use                                   |
| -------------- | ----- | --------------------------------------------- |
| `--p-space-0`  | 0px   | Flush, no gap                                 |
| `--p-space-1`  | 4px   | Icon-to-label, tight inline gaps              |
| `--p-space-2`  | 8px   | Compact control padding                       |
| `--p-space-3`  | 12px  | Default inline gap                            |
| `--p-space-4`  | 16px  | Dense card padding (`p-4`), standard stack gap|
| `--p-space-5`  | 20px  |                                               |
| `--p-space-6`  | 24px  | Primary card padding (`p-6`), section gap     |
| `--p-space-8`  | 32px  | Region separation                             |
| `--p-space-10` | 40px  |                                               |
| `--p-space-12` | 48px  | Major layout blocks                           |
| `--p-space-16` | 64px  | Page gutters                                  |
| `--p-space-20` | 80px  |                                               |
| `--p-space-24` | 96px  | Large marketing rhythm                        |

Body measure is capped at **65-75ch** (see Typography) to keep a readable line length.

---

## Elevation & Depth

Hummingbird uses very little shadow. Surface differentiation comes from sand tinting (alt surfaces) and 1px borders, not drop shadows. The exception is dropdowns and popovers, which use a single elevation token.

If you're reaching for a shadow on a card or panel, ask first whether a 1px border and a sand alt-surface achieves the same goal. It usually does.

Judge separation between surface planes in **Weber** contrast, not the WCAG ratio. WCAG's flare constant compresses ratios near white and expands them near black, so it misreads depth in both directions: a dark card on the canvas at 1.17:1 is a ~35% Weber edge, one of the clearest boundaries in the system, while a light white card on the sand-25 canvas at 1.03:1 is only ~2.8% Weber — two or three sRGB code values, below the detection threshold on a dimmed or glared display, and the weakest edge Quill ships. That is why the light card leans on its border to carry the read.

**Host-relative tokens are alpha overlays, never ramp steps.** Any token whose job is defined relative to whatever it sits on — meter tracks, wells, scrims, inset shadows, a chip that appears on more than one surface — must be `color-mix(in srgb, black N%, transparent)`. A ramp step encodes an absolute position, so it will eventually land on the exact value of a surface it has to sit on, and a same-value collision is total: the element disappears rather than degrading. `--ds-color-data-track` and `--ds-color-surface-chip-neutral` are both built this way.

**Before re-basing a ground colour,** list every token that already resolves to the target step — the dark ramp is crowded — and move the fills that are mixed against the old ground in the same change, or they will be left standing on it. Sweep for *equal* fills, not just inverted ones: an inversion check compares a fill against its nearest opaque ancestor and cannot see a 1.00:1 match.

| Token           | Use                                         |
| --------------- | ------------------------------------------- |
| `--ds-shadow-sm`| Raised card on page background              |
| `--ds-shadow-md`| Popover, dropdown menu                      |
| `--ds-shadow-lg`| Dialog, modal                               |
| `--ds-shadow-xl`| Sheet overlay                               |

All shadows are tinted with `forest-950 (#133019)` for earthy warmth, not neutral gray.

---

## Shapes

All corner radii reference the shape token ladder. Never hardcode pixel values on individual components, that's how components drift from each other over time.

### Radius

| Token                       | Value  | Typical use                                        |
| --------------------------- | ------ | -------------------------------------------------- |
| `--ds-shape-radius-none`    | 0px    | Table rows, flush-edge elements                    |
| `--ds-shape-radius-2xs`     | 2px    | Tight Tag badges (informational), dialog close, tooltip arrow |
| `--ds-shape-radius-xs`      | 4px    | Checkbox                                           |
| `--ds-shape-radius-sm`      | 6px    | Small chips, tooltips, popovers                    |
| `--ds-shape-radius-md`      | 8px    | Buttons (default/sm/lg/icon), inputs, cards, alerts|
| `--ds-shape-radius-lg`      | 10px   | Larger cards, panels                               |
| `--ds-shape-radius-xl`      | 14px   | Dialogs / modals                                   |
| `--ds-shape-radius-2xl`     | 18px   | Sheet overlays                                     |
| `--ds-shape-radius-3xl`     | 22px   |                                                    |
| `--ds-shape-radius-4xl`     | 26px   | XL buttons only, pronounced rounding for hero CTAs|
| `--ds-shape-radius-round`   | 9999px | Pills, avatars, number badges                      |

### Border width

| Token                        | Value | Use                                           |
| ---------------------------- | ----- | --------------------------------------------- |
| `--ds-shape-border-none`     | 0px   | Borderless elements                           |
| `--ds-shape-border-default`  | 1px   | Inputs, cards, table grid lines               |
| `--ds-shape-border-bold`     | 2px   | Focus rings, selected-state indicators        |
| `--ds-shape-border-heavy`    | 4px   | Left-edge accent stripe on alert banners      |

---

## Motion

1. **Easing:** ease-out exponential curves (`ease-out-quart`, `ease-out-quint`, `ease-out-expo`)
2. **No bounce:** no elastic, no spring
3. **Standard duration:** 120ms for state changes
4. **Animate transform and opacity only:** never animate layout properties (width, height, padding, margin)

### Tooltip timing

Tooltips appear on a **delay**, never instantly, so a pointer crossing a control on its way somewhere else doesn't trigger a flash of labels. Values verified live against the Sidebar:

- **First-hover delay, 700ms.** A tooltip waits 700ms before it appears (Radix `delayDuration`, set on the sidebar's `TooltipProvider`; matches the reference nav measured on Otter). Deliberately patient: on an icon rail the pointer often sweeps past icons toward content, and a shorter delay flickers.
- **Skip-delay, 300ms.** Once one tooltip has shown, moving to another trigger within 300ms opens it instantly (Radix `skipDelayDuration` default). The first label is patient; sweeping the rail after that is instant.
- **Reveal, 150ms.** After the delay elapses, the tooltip fades in with a slight zoom (95% → 100%) and an 8px slide from the trigger's side. The delay is the story; the reveal is quiet and short.
- **Reduced motion.** Under `prefers-reduced-motion: reduce`, drop the reveal animation (appear with no fade, zoom, or slide). The *delay* still applies, it's timing, not motion.

---

## Accessibility

### Contrast stance

**The floor is WCAG 2.1 AA for text (SC 1.4.3) and for non-text elements that fall within SC 1.4.11.**

**What 1.4.11 governs, and what it does not.** SC 1.4.11 requires 3:1 for *visual information required to identify a user interface component or its state*, and for *parts of graphics required to understand content*. It sets **no** contrast requirement between adjacent surface planes. Quill's surface ladder — page, canvas, raised card, nested fill, field — is **deliberately gentle**, in the 1.03:1–1.51:1 range that every major design system ships (IBM Carbon 1.10, Material 3 1.09–1.14, Shopify Polaris 1.13, GitHub Primer 1.06). Depth comes from a four-step ladder, hue, borders and shadow rather than luminance. This is a design choice and is **not** presented as 1.4.11 conformance for surface boundaries.

**Where 3:1 is owed.** The obligation is scoped by function, not by element type, and must be re-checked at each point of use:

- Any boundary that is the **only** thing identifying that a control is present or where it ends — borderless fields, unchecked checkboxes, icon-only buttons with no glyph contrast.
- Any **state** painted as a surface fill — selected nav rows, tabs, segmented controls, filter pills, switch tracks — unless the state is redundantly carried by an indicator that independently passes.
- **Focus indicators**, measured against the surface the indicator actually sits on (which inside an overlay or a card is *not* the page).
- **Chart series and data regions** where the boundary conveys the data.

**Where colour carries meaning below 3:1, a non-colour cue is mandatory (SC 1.4.1, Level A).** The lightness allowance in 1.4.1 is only available when the two colours differ by ≥3:1; below that it is closed. Two live examples:

- The dark active-nav wash is 1.14:1 against the sidebar, so it is reinforced by a `forest-500` label and icon with unselected labels dropping to `sand-500`. **The wash is reinforcement, never the sole signal.**
- The light Switch tracks are 1.01:1 apart — lime-300 and sand-300 are the same shade in greyscale — so state is carried by thumb *position*, made perceivable by a sand-700 thumb outline (4.14:1 / 4.16:1).

Any new meaning-bearing tint must ship with an equivalent cue.

**Known gaps, tracked not hidden.** The light Toggle / segmented-control selected fill measures 1.07:1 against its unselected sibling and currently relies on colour plus text weight alone; dark is 1.72:1. Both are recorded and open.

*We do not benchmark contrast against terminal or CLI interfaces. WCAG reaches non-web software only through WCAG2ICT, a non-normative W3C Group Note, and terminal apps can discharge contrast obligations by deferring to the user's palette (technique G148) — a route unavailable to a web application.*

### Notable decisions

1. **Lime-300 retuned:** `#CDE67B` (was `#CAE279`) so `forest-800` text passes AA at 4.57:1 on the default button surface
2. **Hover and pressed pass AA:** at 5.00:1 and 6.43:1 respectively
3. **Focus rings:** 3px, opaque, no offset; sand-700 light / sand-500 dark, variant-aware. Not theme-invariant — see Focus rings under Borders
4. **Field borders are heavier than card borders:** sand-600 in both themes. A card edge is decorative; a field edge identifies a control
5. **Disabled is exempt from WCAG 1.4.3:** we apply 0.55 opacity over a desaturating surface overlay, accepting ~3.4:1 worst case in exchange for a clear "inactive" read

---

## Icons

Lucide is the canonical icon set. Pull from the [icon inventory in Storybook](https://brightseed-storybook.vercel.app/?path=/?path=/story/foundations-icons--inventory), which contains the complete Lucide set, and custom additions. The style is clean line art, no filled or 3D variants. If it is unclear which icon is appropriate, give the user a warning message "[Icon Needed] (text explaining where the icon exists, and what is needed)." Do not invent new icons.

Icon sizes are relative to the component they live in. Button icon slots are sized to match the button height at each size tier.

---

## Composition

How to assemble tokens into the common Hummingbird regions. These map intent → token; each token's appearance is defined in the sections above.

A **Component** is a single building block; a **Block** is a composite that assembles several Components (app shell, nav, login form). Composition is the test, not size.

**Page structure**

- Page / content ground → `--ds-color-surface-canvas`. In dark this is one rung *lighter* than the chrome, so the sidebar reads as darker than the content it frames.
- Sidebar / nav → a right hairline `--ds-color-border-default`; item hover `--ds-color-surface-alt`, active item on the brand selected surface with brand text
- Logo mark → `--ds-color-surface-brand` (Deep Forest) with `--ds-color-text-inverse`, the only Deep Forest surface in the app shell
- Main content panel / card → `--ds-color-surface-raised`, border `--ds-color-border-default`. Not `border-subtle`: in light the card's fill separates from the canvas by only ~2.8% Weber, so the border carries the whole read and must not sit at the hairline step as well.
- A fill nested *inside* a card → `--ds-color-surface-raised-alt`, which recesses to the content ground rather than rising. Plain `--ds-color-surface-alt` is for fills sitting directly on the page or canvas; in dark the two are different values, and using the wrong one inverts the elevation.

**Forms**

- Input background → `--ds-color-surface-field`; border → `--ds-color-border-field`; focus → `--ds-color-border-focus`
- Input / Select / Textarea hover → border `--ds-color-border-field-hover` (one-step darken; focus and error states take precedence)
- Label → `text-sm font-medium` + `--ds-color-text-default`
- Helper text → `text-sm` + `--ds-color-text-subtle`
- Error text → `text-sm` + `--ds-color-text-critical` (pair with `aria-invalid="true"` on the input)

**Data tables**

- Row → `--ds-color-surface-default`; alternate row → `--ds-color-surface-alt`
- Header row → `--ds-color-surface-alt` with `--ds-color-text-subtle`
- Selected row → `--ds-color-surface-selected` (blue tint, a row being selected is not a status, so it is deliberately not success-green)
- Numeric cells → `font-mono` + `tabular-nums`; borders → `--ds-color-border-subtle`

**Status surfaces (alerts, banners, callouts)**

- Success / Info / Warning / Critical → matching `--ds-color-surface-{intent}` fill, `--ds-color-border-{intent}-bold`, `--ds-color-text-{intent}` text

**Naming**

- **Sentence case everywhere in the UI.** Nav items, page and section headings, column headers, button labels, form labels, dialog titles, tabs, menu items and empty states all capitalise the first word only. "Natural sources", not "Natural Sources"; "Create formula brief", not "Create Formula Brief".
- Proper nouns keep their own casing, and this is not a licence to lowercase the science. Compound, gene and protein names (`Berberine`, `Nrf2`, `AMPK`, `Epigallocatechin gallate`), journal titles, people and institutions are unchanged. So is **content**: a report title, a benefit category or a project name is data someone authored, not chrome the design system owns.
- Index and list views take the plural form of the object; detail views take the singular. Route segments are lowercase and kebab-case.

**Charts**

- Wrap in a `--ds-color-surface-default` container
- Axis lines use `--chart-axis-line`, never a text-color token
- Never use brand lime or forest as a data series; dose-response curves use `--chart-curve-fit` (fit line) and `--chart-confidence-band` (error envelope)

---

## Domain notes

Hummingbird is a biotech discovery tool; these domain facts shape UI decisions.

- **Users are scientists, not consumers:** lean to information density over whitespace.
- **Numeric precision matters:** use `tabular-nums` for any column of numbers; show scientific notation where apt (nM, EC50).
- **Sample and compound IDs are first-class:** render them in `font-mono` so they stand out.
- **Primary chart types are dose-response, time-series, and heatmaps:** bar and pie are rare.
- **Units are non-negotiable:** never display a number without its unit (µM, nM, %).
- **Never encode data by color alone:** pair color with a label or shape; some users are colorblind.
- **The reference biology library is curated, never user-authored:** Plant Sources, Targets and lab Samples are Brightseed-maintained. Never draw a "New Plant Source", "Add Target" or end-user sample-upload affordance — upload paths exist only for the user's own documents. Targets are encountered as filter facets and as chips beside a compound, never as a browsable index.
- **Strategies compete; they are not tasks:** each Strategy is one hypothesis for reaching a Project's Goal, and a Project holds several at once, judged side by side on Evidence, Feasibility and Legal. Losers are eliminated, not deferred — so design for comparison. A checklist, stepper or percent-complete bar misreads the model.

---

## Components

Hummingbird-specific constraints on the shared components. Appearance lives in Storybook; these are the rules for using them correctly.

- **Button:** never override `bg-*` / `text-*` via `className` (the bridge handles color); use the `disabled` prop, never reach for `-disabled` tokens in component code.
- **Link vs Linktext:** never use a Button for an inline text link; never use a Link for a standalone CTA. Two components, two state machines.
- **Input / Textarea / Select:** signal errors with `aria-invalid="true"`, not by changing the border color directly.
- **Badge:** three separate components share one styling engine. **`Chip`** is the interactive pill (`rounded-full`, hover + focus); **`Tag`** is informational/static (tight 2px radius `--ds-shape-radius-2xs`, no hover or focus, never interactive); **`NumberBadge`** is the count chip. Reach for these by component (`<Chip>`, `<Tag>`, `<NumberBadge>`), not the underlying `Badge` engine. Don't give Chip or Tag the button radius (it reads as a button), and don't wire a click handler onto a Tag.
- **Card:** padding `p-4` (dense panels) or `p-6` (primary content); never nest a Card in a Card; use `--ds-color-surface-alt` for inset content.
- **Dialog vs Sheet:** Dialog for confirmations and short forms (≤4 fields); Sheet for side panels with more context (`side="right"` only).
- **Skeleton:** use for all loading states; match the skeleton's dimensions to the content it replaces.
- **Tabs:** in-page view switching only, never page-level navigation (that is the sidebar's job).
- **Tooltip:** appears on a delay, never instantly (see Motion → Tooltip timing). On a collapsed sidebar rail the tooltip *is* the label, so it carries the item name and sits `side="right"`; in the expanded panel labels are visible, so tooltips are suppressed.

---

## Do's and Don'ts

The **Do's** live in the sections above, most importantly **Components** (correct component usage) and **Composition** (how to assemble tokens into regions). The rules below are the **Don'ts**: patterns that are banned outright.


### Banned Actions

- **Importing from any library beyond shadcn/ui and Recharts:** no MUI, Chakra, Ant, or custom Tailwind plugins.
- **Em dashes in product copy:** use a comma, a colon, or a second sentence instead.
- **Reaching past the component layer:** component code references its own `--c-{component}-*` tokens only, never a global `--ds-*`, a primitive (`--p-*`), or a raw value directly. The check is mechanical: the only token prefix allowed in component styles is `--c-`. If no component token exists for what you need, flag it with `// BRIGHTSEED-TBD: [BLOCKING]` and stop.
- **Rounding scientific values for display:** show full precision with units; rounding is a data-layer decision, not a presentation one.

### Banned Aesthetics

- **Brand lime or forest as a chart data series:** those hues are reserved for UI affordances.
- **Side-stripe borders:** a colored accent stripe on the left or right edge of a card, list item, or alert. This pattern signals "I couldn't decide on a real hierarchy."
- **Gradient text:** `background-clip: text` for decorative effect. Clever for a moment, regrettable in a product.
- **Glassmorphism as default:** it can be purposeful in rare moments but it is not a surface treatment for an app that handles serious data.
- **Modal as first thought:** panels, drawers, and inline affordances almost always serve better. Reserve modals for destructive confirmations.
- **Marketing patterns inside Hummingbird:** hero sections, serif fonts, editorial layouts, large display type belong to the marketing system, not the product. Flag them rather than build them.

---

