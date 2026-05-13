import { DAY_TYPE_META } from "@/lib/meanings";
import type { DayType } from "@/lib/types";

interface Props {
  label: string;
  value: number;
  caption?: string;
  type?: DayType;
  size?: "sm" | "md" | "lg";
  highlight?: boolean;
}

const sizeMap = {
  sm: { num: "text-4xl", label: "text-[10px]", padding: "p-4" },
  md: { num: "text-6xl", label: "text-xs", padding: "p-5" },
  lg: { num: "text-7xl sm:text-8xl", label: "text-xs", padding: "p-6 sm:p-8" },
};

export function NumberCard({
  label,
  value,
  caption,
  type,
  size = "md",
  highlight,
}: Props) {
  const s = sizeMap[size];
  const meta = type ? DAY_TYPE_META[type] : undefined;
  const accent = meta?.color ?? "var(--color-gold)";

  return (
    <div
      className={[
        "card relative overflow-hidden",
        s.padding,
        highlight ? "card-glow" : "",
      ].join(" ")}
      style={
        highlight
          ? ({ ["--glow-color" as never]: accent } as React.CSSProperties)
          : undefined
      }
    >
      <div
        aria-hidden
        className="absolute -top-12 -right-12 w-44 h-44 rounded-full opacity-20 blur-3xl"
        style={{ background: accent }}
      />
      <div className="relative flex items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span
            className={[
              "uppercase tracking-[0.22em] text-muted",
              s.label,
            ].join(" ")}
          >
            {label}
          </span>
          {caption && (
            <span className="text-sm text-text-strong/90 max-w-[14ch]">
              {caption}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span
            className={["num-display text-text-strong", s.num].join(" ")}
            style={highlight ? { color: accent } : undefined}
          >
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}
