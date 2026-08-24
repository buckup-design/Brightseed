import CompoundCard from "./CompoundCard";
import EmptyState from "./EmptyState";
import type { Compound } from "../types";

interface CardGridProps {
  compounds: Compound[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}

export default function CardGrid({
  compounds,
  favorites,
  onToggleFavorite,
}: CardGridProps) {
  if (compounds.length === 0) {
    return <EmptyState message="No matching compounds found." />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 overflow-y-auto p-4">
      {compounds.map((compound) => (
        <CompoundCard
          key={compound.id}
          compound={compound}
          favorited={favorites.has(compound.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
