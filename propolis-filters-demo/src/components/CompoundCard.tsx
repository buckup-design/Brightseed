import { Circle, Sparkles, Star } from "lucide-react";
import Badge from "./Badge";
import type { Compound } from "../types";

const MAX_VISIBLE_TARGETS = 5;

interface CompoundCardProps {
  compound: Compound;
  favorited: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function CompoundCard({
  compound,
  favorited,
  onToggleFavorite,
}: CompoundCardProps) {
  const visibleTargets = compound.targets.slice(0, MAX_VISIBLE_TARGETS);
  const extraTargets = compound.targets.length - visibleTargets.length;
  const isPredicted = compound.cardType === "predicted";
  const hasEvidence = !isPredicted && compound.confidenceScore != null;

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card shadow-xs">
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          {isPredicted ? (
            <Sparkles size={24} className="text-chart-2" />
          ) : (
            <Circle size={24} className="text-orange-400" />
          )}
          <button
            type="button"
            aria-label={
              favorited ? "Remove from favorites" : "Add to favorites"
            }
            onClick={() => onToggleFavorite(compound.id)}
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
            {compound.name}
          </p>
          <p className="h-[60px] overflow-hidden text-sm leading-5 text-muted-foreground [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
            {compound.description}
          </p>
        </div>
      </div>

      {visibleTargets.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 px-4 pb-4">
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

      {isPredicted ? (
        <div className="flex items-center gap-2 rounded-b-xl border-t border-border bg-muted px-4 py-3">
          <span className="text-xs font-medium tracking-wide text-chart-2">
            BIOACTIVITY PREDICTION
          </span>
        </div>
      ) : (
        hasEvidence && (
          <div className="flex items-center justify-between gap-2 rounded-b-xl border-t border-border bg-muted px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex items-end gap-0.5">
                <span className="h-[13px] w-[5px] bg-chart-1" />
                <span className="h-[6px] w-[5px] bg-chart-4" />
                <span className="h-[4px] w-[5px] bg-chart-3" />
              </div>
              <span className="text-xs text-muted-foreground">CONFIDENCE</span>
              <span className="text-xs font-medium text-foreground">
                {compound.confidenceScore}%
              </span>
            </div>
            {compound.evidenceType && (
              <Badge variant="ghost" shape="chip" className="border border-border">
                {capitalize(compound.evidenceType)}
              </Badge>
            )}
          </div>
        )
      )}
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
