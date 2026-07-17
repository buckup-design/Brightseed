# Sidebar: the mobile nav has an invisible tap target and no visible close

**Component:** `web/components/ui/sidebar.tsx`
**Severity:** Major — affects every mobile user of the nav
**Status:** Open
**Found:** July 16, 2026, during the adversarial review of the app-shell → sidebar port. Not introduced by that work; it predates the branch and shipped the moment the sidebar became the only one.

## What's wrong

Below `md`, the sidebar renders inside a Sheet. Its collapse toggle mounts in that Sheet, renders at `opacity: 0` **forever**, and still accepts taps. So the mobile nav header has a button you cannot see but can press — and pressing it closes the nav, which reads as the app randomly dismissing itself.

Separately, the Sheet's own X is hidden, so once that toggle is invisible there is **no visible way to close the nav at all**.

## Why it happens

Three things compound, each reasonable alone:

1. **`group/sidebar` is on the desktop branch only.** `sidebar.tsx:242` — `"group/sidebar relative hidden h-svh shrink-0 flex-col md:flex"`. The mobile branch (`:213-231`) renders `SheetContent > div` and never declares the group.

2. **The toggle still mounts on mobile.** `usePanelComposition()` (`:113-116`) returns `true` when `isMobile`, so `SidebarHeader` takes its *expanded* branch, which includes `<SidebarToggle />`.

3. **Its reveal can never fire.** `sidebar.tsx:304-305`:
   ```
   opacity-0 transition-opacity duration-300 motion-reduce:transition-none
   group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100
   ```
   With no `group/sidebar` ancestor those variants never match. Opacity stays 0. `opacity: 0` does not remove an element from hit-testing — so it is invisible *and* tappable.

And the fallback is gone: `sheet.tsx` defaults `showCloseButton = true`, but `sidebar.tsx:219` puts `[&>button]:hidden` on `SheetContent`, which matches the Sheet's own `Close` and `display: none`s it. That was correct when the toggle was visible. It isn't now.

## Repro

1. Storybook → **Blocks/App Shell Quill**, viewport under 768px (or just narrow the browser).
2. Open the nav with the header button.
3. Look at the nav's top-left header cell — it appears empty.
4. Tap the empty cell. The nav closes.

## Impact

- A phantom tap target in the nav header. Users hit it by accident reaching for the logo.
- No visible close affordance on the primary navigation.
- **Not** unreachable, to be precise: `sheet.tsx` overrides neither `onEscapeKeyDown` nor `onInteractOutside`, so Radix's defaults stand and Escape / tapping the overlay still dismiss. That's standard drawer behaviour and it's why this reads as "weird" rather than "broken". Worth stating so nobody over-scopes the fix.

## Fix

Gate the reveal on `!isMobile`. Touch has no hover for it to key off, so on mobile the toggle should simply be visible. `isMobile` is already destructured in `SidebarToggle` (`:275`).

Replace `sidebar.tsx:304-305` with:

```tsx
!isMobile && cn(
  "opacity-0 transition-opacity duration-300 motion-reduce:transition-none",
  "group-hover/sidebar:opacity-100 group-focus-within/sidebar:opacity-100"
),
```

Desktop hover-reveal is untouched.

### What won't work, and why

**Adding `group/sidebar` to the Sheet wrapper.** It makes the selector resolvable but not the behaviour: the reveal still requires a hover that touch cannot produce. The button stays invisible. This is the obvious fix and it is wrong.

**Un-hiding the Sheet's X** (dropping `[&>button]:hidden`). Gives you a visible close, but leaves the phantom toggle sitting next to it — two close controls, one of them invisible.

## Also worth doing

**Add a mobile-viewport story.** There is none, which is exactly why this survived: `Components/Sidebar` and `Blocks/App Shell Quill` are both reviewed at desktop width, and the mobile composition has never been looked at. `.storybook/main.ts` has no viewport addon (`addon-docs` + `addon-a11y` only), so this needs either the addon or a story that forces a narrow container.

## Provenance

Surfaced by the `mobile-and-a11y` lens of the adversarial review of the sidebar port (July 16, 2026). That lens initially blamed the port; triage corrected it — `git diff main...HEAD -- web/components/ui/sidebar-alt1.tsx` was empty, proving the file was byte-identical to `main` and the bug was inherited. The port only made it ship, by making this the only sidebar.
