interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  /** Overrides the default "{value} / {max}" readout, e.g. for LOW/MEDIUM/HIGH-style scales. */
  formatValue?: (value: number, max: number) => string;
}

export default function Slider({ label, min, max, value, onChange, formatValue }: SliderProps) {
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="shrink-0 text-sm text-foreground">
          {formatValue ? formatValue(value, max) : `${value} / ${max}`}
        </p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--range-progress": `${percent}%` } as React.CSSProperties}
        className="range-slider h-1 w-full cursor-pointer rounded-full"
      />
    </div>
  );
}
