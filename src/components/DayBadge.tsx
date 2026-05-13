import { DAY_TYPE_META } from "@/lib/meanings";
import type { DayType } from "@/lib/types";

interface Props {
  type: DayType;
  size?: "sm" | "md";
}

export function DayBadge({ type, size = "md" }: Props) {
  const meta = DAY_TYPE_META[type];
  const Icon = meta.icon;
  const padding = size === "sm" ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs";
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border font-medium uppercase tracking-wider whitespace-nowrap",
        padding,
      ].join(" ")}
      style={{
        borderColor: `${meta.color}55`,
        background: `${meta.color}14`,
        color: meta.color,
      }}
    >
      <Icon size={iconSize} strokeWidth={2} aria-hidden />
      {meta.label}
    </span>
  );
}
