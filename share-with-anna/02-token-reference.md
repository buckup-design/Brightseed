# Token Reference

The working vocabulary for prototyping Forager screens. Keep this open (or paste it into a prompt) while you build. Every name below is a live `--ds-*` semantic token from the current CSS — reference these, never raw values or `--p-*` primitives.

How to read a token name: `--ds-color-{category}-{role}-{state}`. State suffixes (`-hover`, `-active`, `-disabled`) are separate tokens; reach for the matching one rather than faking the state with opacity.

In Tailwind, reference any token with arbitrary syntax: `bg-[var(--ds-color-surface-success)]`, `text-[var(--ds-color-text-default)]`, `border-[var(--ds-color-border-default)]`.

---

## Composition rules (the load-bearing ones)

- **Semantics only.** Component styles reference `--ds-*`. Never a hex, never a `--p-*` primitive, never a `--{role}-{step}` intent directly.
- **Light-first.** Author for light. Dark theme is handled by the token override under `data-theme="dark"` — you don't write dark styles.
- **State tokens, not opacity.** Use `-hover` / `-active` / `-disabled` tokens. The disabled pattern is a surface overlay plus `--ds-disabled-text-opacity` (0.55) on text/icon only — not opacity on the whole element.
- **Tag color ≠ status.** The tag scales are for visual differentiation (compound sources, categories). A cyan tag does not mean "info." For status, compose icon + text using the semantic intent tokens (success / info / warning / critical).
- **Data series** use the `--chart-*` namespace, never brand lime or forest.
- **Numeric columns:** `tabular-nums` + `font-mono`.
- **Radius/border** reference `--ds-shape-*`, never raw pixels.

---

## Surfaces — backgrounds and fills

Page and panel backgrounds, alert tints, selected rows, and the eight decorative tag fills.

```
--ds-color-surface-default            page background (white light / sand-950 dark)
--ds-color-surface-default-hover
--ds-color-surface-default-active
--ds-color-surface-alt                sidebars, table alt rows, inset panels
--ds-color-surface-alt-hover
--ds-color-surface-brand              nav/header/branded panels (deep forest)
--ds-color-surface-brand-hover
--ds-color-surface-brand-active
--ds-color-surface-brand-subtle       light brand tint
--ds-color-surface-scrim              modal/dialog veil
--ds-color-surface-selected           selected/focused row
--ds-color-surface-selected-hover
--ds-color-surface-selected-active
--ds-color-surface-data               default data panel tint

  intent surfaces (alert/callout backgrounds):
--ds-color-surface-success   / -hover / -active
--ds-color-surface-info      / -hover / -active
--ds-color-surface-warning   / -hover / -active
--ds-color-surface-critical  / -hover / -active

  decorative tag surfaces (each has a -hover):
--ds-color-surface-tag-forest    --ds-color-surface-tag-lime
--ds-color-surface-tag-cyan      --ds-color-surface-tag-blue
--ds-color-surface-tag-yellow    --ds-color-surface-tag-orange
--ds-color-surface-tag-lavender  --ds-color-surface-tag-orchid
--ds-color-surface-tag-red       --ds-color-surface-tag-sand
```

## Actions — buttons

Three action families, each with the full state ladder.

```
--ds-color-action-primary           lime CTA  (#CDE67B)
--ds-color-action-primary-hover     lime 400
--ds-color-action-primary-active    lime 500
--ds-color-action-primary-disabled

--ds-color-action-secondary         faint sand, no border
--ds-color-action-secondary-hover
--ds-color-action-secondary-active
--ds-color-action-secondary-disabled

--ds-color-action-critical          soft red (tinted, not solid)
--ds-color-action-critical-hover
--ds-color-action-critical-active
--ds-color-action-critical-disabled
```

## Text

```
--ds-color-text-default          / -hover
--ds-color-text-subtle
--ds-color-text-disabled
--ds-color-text-inverse          / -inverse-subtle   (on dark/forest surfaces)

  on action surfaces:
--ds-color-text-on-action-primary   / -hover / -active   (forest text on lime)
--ds-color-text-on-action-critical  / -hover

  intent text:
--ds-color-text-success   --ds-color-text-info
--ds-color-text-warning   --ds-color-text-critical

  links — two distinct systems:
--ds-color-text-link-default / -default-hover / -link-active / -link-visited   (blue, underlined, inline anchors)
--ds-color-text-link-brand   / -brand-hover                                    (lime, button-shaped link affordance)

  data + tag text mirror the surface families:
--ds-color-text-data (+ -lavender/-orange/-orchid)
--ds-color-text-tag-{forest,lime,cyan,blue,yellow,orange,lavender,orchid,red,sand}
```

## Borders

```
--ds-color-border-subtle         hairlines, table grid
--ds-color-border-default        inputs
--ds-color-border-bold           emphatic dividers

  focus rings (variant-aware):
--ds-color-border-focus              lime — Default / Outline / Ghost
--ds-color-border-focus-secondary    sand — Secondary
--ds-color-border-focus-destructive  red  — Destructive
--ds-color-border-focus-link-brand   lime — Linktext

  intent borders:  --ds-color-border-{success,info,warning,critical}-{default,bold}
  tag focus rings: --ds-color-border-tag-{hue}-focus
```

## Icons

```
--ds-color-icon-default    --ds-color-icon-subtle    --ds-color-icon-disabled
--ds-color-icon-brand      --ds-color-icon-inverse   --ds-color-icon-inverse-subtle
--ds-color-icon-success    --ds-color-icon-info      --ds-color-icon-warning
--ds-color-icon-critical   --ds-color-icon-destructive
--ds-color-icon-favorite-active   --ds-color-icon-favorite-inactive   (star)
--ds-color-icon-data (+ -lavender/-orange/-orchid)
```

## Shape — radius, border width, shadow

```
--ds-shape-radius-{none, xs, sm, md, lg, xl, 2xl, 3xl, 4xl, round}
--ds-shape-border-{none, default, bold, heavy}
--ds-shadow-{sm, md, lg, xl}
```

## Typography — display scale

Display headings (Tiempos Fine, italic). Body/UI type comes from Tailwind's scale on Geist.

```
--ds-text-display-h1-{size, line-height, weight, tracking}   56/60
--ds-text-display-h2-{size, line-height, weight, tracking}   40/44
--ds-text-display-h3-{size, line-height, weight, tracking}   28/34
```

## Charts — the `--chart-*` namespace

Separate from `--ds-*`. Categorical series assign 1→8 in order.

```
--chart-cat-1 … --chart-cat-8         categorical series
--chart-axis-line   --chart-axis-text
--chart-grid-major  --chart-grid-minor
--chart-datapoint-default / -highlight / -outlier
--chart-confidence-band  --chart-curve-fit
--chart-div-pos-{100..500}  --chart-div-neutral  --chart-div-neg-{100..500}   (diverging)
```

---

*This reference is generated from the live token CSS. If it ever disagrees with `tokens/*.css` or Storybook, those win — flag the drift so this gets corrected.*
