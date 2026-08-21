import { CircleCheck, Star } from "lucide-react";
import Badge from "./Badge";
import leafIcon from "../assets/leaf-icon.svg";
import mushroomIcon from "../assets/mushroom-icon.svg";
import type { NaturalSource } from "../types";

const MAX_VISIBLE_KNOWN_COMPOUNDS = 3;
const MAX_VISIBLE_TARGETS = 5;

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
  const visibleKnownCompounds = source.knownCompounds.slice(0, MAX_VISIBLE_KNOWN_COMPOUNDS);
  const extraKnownCompounds = source.knownCompounds.length - visibleKnownCompounds.length;
  const visibleTargets = source.targets.slice(0, MAX_VISIBLE_TARGETS);
  const extraTargets = source.targets.length - visibleTargets.length;
  const regulatoryFlags = [
    source.grasSource === "yes" ? "GRAS" : null,
    source.nonNovelSource === "yes" ? "Non-Novel Food" : null,
  ].filter((flag): flag is string => flag !== null);

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <div className="flex size-6 shrink-0 items-center justify-center">
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
        {visibleKnownCompounds.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleKnownCompounds.map((compound) => (
              <Badge key={compound} variant="neutral" shape="chip">
                {compound}
              </Badge>
            ))}
            {extraKnownCompounds > 0 && (
              <Badge variant="ghost" shape="chip">
                + {extraKnownCompounds} more
              </Badge>
            )}
          </div>
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

        {visibleTargets.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleTargets.map((target) => (
              <Badge key={target} variant="neutral" shape="chip">
                {target}
              </Badge>
            ))}
            {extraTargets > 0 && (
              <Badge variant="ghost" shape="chip">
                + {extraTargets} more
              </Badge>
            )}
          </div>
        )}

        {regulatoryFlags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
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
        )}
      </div>
    </div>
  );
}
