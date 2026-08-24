import { CircleCheck, Star } from "lucide-react";
import Badge from "./Badge";
import { TagRow } from "./TagRow";
import leafIcon from "../assets/leaf-icon.svg";
import mushroomIcon from "../assets/mushroom-icon.svg";
import type { NaturalSource } from "../types";

const MAX_COMPOUND_LABEL_LENGTH = 24;

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
            {source.commonName && ` (${capitalize(source.commonName)})`}
          </p>
          <p className="h-[60px] overflow-hidden text-sm leading-5 text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {source.description}
          </p>
        </div>
      </div>

      {/* mt-auto pushes this whole block to the card's bottom edge when the
          grid stretches this card taller than its own content (a shorter
          sibling in the same row) — matching CompoundCard's footer-flush-
          bottom look. Any row that renders nothing (e.g. no regulatory
          flags) collapses within this block, which reads as a gap right
          above the first populated row rather than shifting content up. */}
      <div className="mt-auto flex flex-col gap-2 px-4 pb-4">
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
      </div>
    </div>
  );
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength)}...` : value;
}

// commonName is scraped from the middle of a sentence ("cashew may contain
// compounds...") so it's real text but not reliably title-cased — normalize
// display only, leave the stored value as-scraped.
function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
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
