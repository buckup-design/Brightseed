interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}

export default function Slider({ label, min, max, value, onChange }: SliderProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="shrink-0 text-sm text-foreground">
          {value} / {max}
        </p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-muted accent-slider-fill"
      />
    </div>
  );
}
