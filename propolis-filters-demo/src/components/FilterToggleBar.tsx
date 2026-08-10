import { ChevronsUpDown } from "lucide-react";

interface FilterToggleBarProps {
  visible: boolean;
  onToggle: () => void;
}

export default function FilterToggleBar({ visible, onToggle }: FilterToggleBarProps) {
  return (
    <div className="flex items-center justify-end bg-muted px-6 py-0.5 shadow-md">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-foreground hover:bg-accent"
      >
        {visible ? "Hide filters" : "Show filters"}
        <ChevronsUpDown size={16} />
      </button>
    </div>
  );
}
