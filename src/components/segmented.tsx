import { cn } from "@/lib/utils";

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  ariaLabel: string;
}) {
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const count = options.length || 1;

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="relative grid h-12 rounded-control border border-rule p-0.5"
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      <div
        aria-hidden="true"
        className="absolute top-0.5 bottom-0.5 rounded-md bg-ink transition-transform duration-toggle ease-out"
        style={{
          width: `calc(${100 / count}% - 4px)`,
          transform: `translateX(${index * 100}%)`,
        }}
      />
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative z-10 text-body transition-colors duration-toggle",
              active ? "text-paper" : "text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
