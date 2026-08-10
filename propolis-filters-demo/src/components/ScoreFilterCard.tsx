import { Info } from "lucide-react";
import type { ReactNode } from "react";

interface ScoreFilterCardProps {
  title: string;
  children: ReactNode;
}

export default function ScoreFilterCard({ title, children }: ScoreFilterCardProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <Info size={14} className="text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
