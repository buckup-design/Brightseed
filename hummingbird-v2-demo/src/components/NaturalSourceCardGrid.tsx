import NaturalSourceCard from "./NaturalSourceCard";
import EmptyState from "./EmptyState";
import type { NaturalSource } from "../types";

interface NaturalSourceCardGridProps {
  sources: NaturalSource[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

export default function NaturalSourceCardGrid({
  sources,
  favorites,
  onToggleFavorite,
}: NaturalSourceCardGridProps) {
  if (sources.length === 0) {
    return <EmptyState message="No matching sources found." />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 overflow-y-auto p-4">
      {sources.map((source) => (
        <NaturalSourceCard
          key={source.id}
          source={source}
          favorited={favorites.has(source.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
