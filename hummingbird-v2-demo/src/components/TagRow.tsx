import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

// Tailwind's gap-1.5 (0.375rem) at the default 16px root font size — used to
// add up real widths the same way the browser's own flex gap does.
const TAG_GAP = 6;

/**
 * Caps a tag row to a single visible line, with the "+N more" indicator
 * appearing inline at the end of that same line (not a separate line below)
 * — real chip widths vary a lot (short target names vs. long compound
 * names), so this measures actual pixel widths rather than assuming a fixed
 * item count fits. A hidden `flex-nowrap` clone of every item plus one
 * "more" placeholder is measured once per relevant change (never wraps, so
 * each child's natural width is readable via getBoundingClientRect), then
 * checked against the real row's available width to find how many items —
 * plus the more-indicator itself — actually fit together.
 */
export function useSingleRowOverflow(itemCount: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(itemCount);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure || itemCount === 0) {
      setVisibleCount(itemCount);
      return;
    }

    function recompute() {
      if (!container || !measure) return;
      const availableWidth = container.clientWidth;
      // The measurement row renders `itemCount` real items followed by one
      // trailing "more" placeholder, in that fixed order.
      const children = Array.from(measure.children) as HTMLElement[];
      const itemEls = children.slice(0, itemCount);
      const moreEl = children[itemCount] as HTMLElement | undefined;
      if (itemEls.length === 0) {
        setVisibleCount(itemCount);
        return;
      }

      const widthWithGaps = (count: number) =>
        itemEls.slice(0, count).reduce((sum, el, i) => sum + el.getBoundingClientRect().width + (i > 0 ? TAG_GAP : 0), 0);

      // Do all real items fit on their own, no "more" indicator needed at all?
      if (widthWithGaps(itemEls.length) <= availableWidth) {
        setVisibleCount(itemCount);
        return;
      }

      // Otherwise find the most items that fit alongside the more-indicator
      // (which itself needs a leading gap once there's at least one item
      // before it).
      const moreWidth = moreEl ? moreEl.getBoundingClientRect().width : 0;
      let count = 0;
      while (count < itemEls.length) {
        const withMore = widthWithGaps(count + 1) + TAG_GAP + moreWidth;
        if (withMore > availableWidth) break;
        count++;
      }
      setVisibleCount(count);
    }

    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [itemCount]);

  return { containerRef, measureRef, visibleCount };
}

interface TagRowProps<T> {
  items: T[];
  renderTag: (item: T) => ReactNode;
  renderMore: (hiddenCount: number) => ReactNode;
}

/**
 * One single-row-capped tag group — see useSingleRowOverflow above. Shared
 * by every card type (Natural Source, Compound/Predicted/Combo) so a
 * targets/tags row always truncates to "however many fit on one line" rather
 * than a fixed per-card-type count.
 */
export function TagRow<T>({ items, renderTag, renderMore }: TagRowProps<T>) {
  const { containerRef, measureRef, visibleCount } = useSingleRowOverflow(items.length);
  if (items.length === 0) return null;
  const hiddenCount = items.length - visibleCount;

  return (
    <div className="relative">
      {/* Hidden nowrap clone used only to measure natural widths — h-0
          overflow-hidden clips it to zero visible height without stopping
          its children from laying out (and being measurable) at full size. */}
      <div className="h-0 overflow-hidden" aria-hidden="true">
        <div ref={measureRef} className="flex w-max flex-nowrap items-center gap-1.5">
          {items.map(renderTag)}
          {renderMore(items.length)}
        </div>
      </div>
      <div ref={containerRef} className="flex flex-wrap items-center gap-1.5">
        {items.slice(0, visibleCount).map(renderTag)}
        {hiddenCount > 0 && renderMore(hiddenCount)}
      </div>
    </div>
  );
}
