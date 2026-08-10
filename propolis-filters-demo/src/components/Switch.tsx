interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function Switch({ label, checked, onChange }: SwitchProps) {
  return (
    <label className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? "bg-orange-500" : "bg-border"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 size-4 rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </label>
  );
}
