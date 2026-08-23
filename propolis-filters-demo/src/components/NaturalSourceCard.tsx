import { useLayoutEffect, useRef, useState } from "react";
import { CircleCheck, Star } from "lucide-react";
import Badge from "./Badge";
import leafIcon from "../assets/leaf-icon.svg";
import mushroomIcon from "../assets/mushroom-icon.svg";
import type { NaturalSource } from "../types";

const MAX_COMPOUND_LABEL_LENGTH = 24;

// Height (px) of a single Badge chip (text-xs + py-0.5) — every tag row on
// this card is single-line (chips never wrap internally, unlike FilterCard's
// `wrap` pills), so capping a row's container to exactly this height always
// shows exactly one row, whatever the item count or label lengths, instead
// of a fixed item-count cutoff.
const SINGLE_ROW_HEIGHT = 22;

/**
 * Caps a flex-wrap tag row to a single visible line — same overflow-
 * detection technique as FilterCard's two-row cap (a wrapped child's bottom
 * edge spills past the container's own clientHeight), just measured against
 * one row instead of two. Returns a ref for the (height-capped, overflow-
 * hidden) wrap container plus how many trailing items got hidden, so the
 * caller can render its own "+N more" indicator beneath the row.
 */
function useSingleRowOverflow<T>(items: T[]) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hiddenCount, setHiddenCount] = useState(0);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    function measure() {
      if (!el) return;
      const containerTop = el.getBoundingClientRect().top;
      const children = Array.from(el.children) as HTMLElement[];
      // Items render in the same order as `items`, so the first child that
      // spills past the visible height marks where the hidden tail starts.
      const firstHiddenIndex = children.findIndex(
        (child) => child.getBoundingClientRect().bottom - containerTop > el.clientHeight + 1
      );
      setHiddenCount(firstHiddenIndex === -1 ? 0 : items.length - firstHiddenIndex);
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [items]);

  return { wrapRef, hiddenCount };
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
  const knownCompoundsRow = useSingleRowOverflow(source.knownCompounds);
  const targetsRow = useSingleRowOverflow(source.targets);
  const regulatoryFlags = [
    source.grasSource === "yes" ? "GRAS" : null,
    source.nonNovelSource === "yes" ? "Non-Novel Food" : null,
  ].filter((flag): flag is string => flag !== null);
  const regulatoryRow = useSingleRowOverflow(regulatoryFlags);

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
        {source.knownCompounds.length > 0 && (
          <>
            <div
              ref={knownCompoundsRow.wrapRef}
              className="flex flex-wrap items-center gap-1.5 overflow-hidden"
              style={{ maxHeight: SINGLE_ROW_HEIGHT }}
            >
              {source.knownCompounds.map((compound) => (
                <Badge key={compound} variant="outline" shape="chip">
                  {truncate(compound, MAX_COMPOUND_LABEL_LENGTH)}
                </Badge>
              ))}
            </div>
            {knownCompoundsRow.hiddenCount > 0 && (
              <Badge variant="ghost" shape="chip" className="self-start">
                + {knownCompoundsRow.hiddenCount} more
              </Badge>
            )}
          </>
        )}

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

        {source.targets.length > 0 && (
          <>
            <div
              ref={targetsRow.wrapRef}
              className="flex flex-wrap items-center gap-1.5 overflow-hidden"
              style={{ maxHeight: SINGLE_ROW_HEIGHT }}
            >
              {source.targets.map((target) => (
                <Badge key={target} variant="neutral" shape="chip">
                  {formatTarget(target)}
                </Badge>
              ))}
            </div>
            {targetsRow.hiddenCount > 0 && (
              <Badge variant="ghost" shape="chip" className="self-start">
                + {targetsRow.hiddenCount} more
              </Badge>
            )}
          </>
        )}

        {regulatoryFlags.length > 0 && (
          <>
            <div
              ref={regulatoryRow.wrapRef}
              className="flex flex-wrap items-center gap-1.5 overflow-hidden"
              style={{ maxHeight: SINGLE_ROW_HEIGHT }}
            >
              {regulatoryFlags.map((flag) => (
                <Badge
                  key={flag}
                  variant="regulatory"
                  shape="pill"
                  icon={<CircleCheck size={13} className="text-lime-500" />}
                >
                  {flag}
                </Badge>
              ))}
            </div>
            {regulatoryRow.hiddenCount > 0 && (
              <Badge variant="ghost" shape="chip" className="self-start">
                + {regulatoryRow.hiddenCount} more
              </Badge>
            )}
          </>
        )}
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
