import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { CircleCheck, Star } from "lucide-react";
import Badge from "./Badge";
import leafIcon from "../assets/leaf-icon.svg";
import mushroomIcon from "../assets/mushroom-icon.svg";
import type { NaturalSource } from "../types";

const MAX_COMPOUND_LABEL_LENGTH = 24;

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
function useSingleRowOverflow(itemCount: number) {
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

/** One single-row-capped tag group — see useSingleRowOverflow above. */
function TagRow<T>({ items, renderTag, renderMore }: TagRowProps<T>) {
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

interface NaturalSourceCardProps {
  source: NaturalSource;
  favorited: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function NaturalSourceCard({
  source,
  favorited,
  onToggleFavorite,
}: NaturalSourceCardProps) {
  const regulatoryFlags = [
    source.grasSource === "yes" ? "GRAS" : null,
    source.nonNovelSource === "yes" ? "Non-Novel Food" : null,
  ].filter((flag): flag is string => flag !== null);

  const moreBadge = (hiddenCount: number) => (
    <Badge key="more" variant="ghost" shape="chip">
      + {hiddenCount} more
    </Badge>
  );

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          {/* No fixed width here — Tailwind's Preflight caps <img> at
              max-width: 100% of its container, so a wrapper narrower than
              the icon's own w-[...] would squish it. Height-only sizing lets
              each icon's own width utility actually take effect. */}
          <div className="flex h-6 shrink-0 items-center">
            {source.sourceType === "plant" ? (
              <img src={leafIcon} alt="" className="h-6 w-[34px]" />
            ) : (
              <img src={mushroomIcon} alt="" className="h-6 w-[21px]" />
            )}
          </div>
          <button
            type="button"
            aria-label={
              favorited ? "Remove from favorites" : "Add to favorites"
            }
            onClick={() => onToggleFavorite(source.id)}
            className="flex size-7 items-center justify-center rounded-md hover:bg-accent"
          >
            <Star
              size={16}
              className={favorited ? "fill-foreground text-foreground" : "text-muted-foreground"}
            />
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-card-foreground">
            {source.name}
          </p>
          <p className="h-[60px] overflow-hidden text-sm leading-5 text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {source.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-4">
        <TagRow
          items={source.knownCompounds}
          renderTag={(compound) => (
            <Badge key={compound} variant="outline" shape="chip">
              {truncate(compound, MAX_COMPOUND_LABEL_LENGTH)}
            </Badge>
          )}
          renderMore={moreBadge}
        />

        {source.predictedCompoundCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-border bg-white px-1 text-xs font-medium text-foreground">
              {source.predictedCompoundCount}
            </span>
            <span className="text-xs text-muted-foreground">
              Forager predicted bioactives
            </span>
          </div>
        )}

        <TagRow
          items={source.targets}
          renderTag={(target) => (
            <Badge key={target} variant="neutral" shape="chip">
              {formatTarget(target)}
            </Badge>
          )}
          renderMore={moreBadge}
        />

        <TagRow
          items={regulatoryFlags}
          renderTag={(flag) => (
            <Badge
              key={flag}
              variant="regulatory"
              shape="pill"
              icon={<CircleCheck size={13} className="text-lime-500" />}
            >
              {flag}
            </Badge>
          )}
          renderMore={moreBadge}
        />
      </div>
    </div>
  );
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

// Real scraped biological targets are prefixed "increases "/"decreases "
// (e.g. "increases nadh", "decreases il-12") — matches the ↑/↓ convention
// the app's own descriptions already use elsewhere. Targets with neither
// prefix (e.g. "gaba-a receptor agonist") are left as-is.
function formatTarget(target: string) {
  if (/^increases\s+/i.test(target)) return `↑ ${target.replace(/^increases\s+/i, "")}`;
  if (/^decreases\s+/i.test(target)) return `↓ ${target.replace(/^decreases\s+/i, "")}`;
  return target;
}
