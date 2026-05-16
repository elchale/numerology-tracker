"use client";

import { Sparkles } from "lucide-react";
import { DAY_TYPE_META } from "@/lib/meanings";
import type { DayInfo } from "@/lib/types";

interface Props {
  day: number;
  info: DayInfo | null;
  isToday?: boolean;
  isSelected?: boolean;
  isOutside?: boolean;
  onClick?: () => void;
}

export function DayCell({
  day,
  info,
  isToday,
  isSelected,
  isOutside,
  onClick,
}: Props) {
  if (info == null) {
    return (
      <div className="aspect-square rounded-lg border border-transparent" />
    );
  }
  const meta = DAY_TYPE_META[info.type];
  const isSpecial = info.isMaster || info.lifePathAlignment;

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative aspect-square w-full rounded-lg overflow-hidden transition-all duration-200",
        "border focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60",
        isSelected
          ? "scale-[1.02] shadow-lg"
          : "hover:-translate-y-0.5 hover:shadow-md",
        isOutside ? "opacity-30" : "",
      ].join(" ")}
      style={{
        borderColor: isSelected
          ? meta.color
          : isSpecial
            ? `${meta.color}66`
            : "var(--color-line-soft)",
        background: isSpecial
          ? `linear-gradient(160deg, ${meta.color}22, ${meta.color}06 60%, transparent), var(--color-ink-1)`
          : "var(--color-ink-1)",
      }}
      aria-label={`${day}, ${meta.label}, personal day ${info.personalDay}${
        info.frictionDay ? ", friction day" : ""
      }`}
    >
      <span
        className={[
          "absolute top-0.5 left-1 sm:top-1.5 sm:left-2 text-[9px] sm:text-xs leading-none",
          isToday ? "text-gold font-semibold" : "text-muted",
        ].join(" ")}
      >
        {day}
      </span>

      {info.lifePathAlignment && !info.isMaster && (
        <span
          aria-hidden
          className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-cyan"
        />
      )}
      {info.isMaster && (
        <Sparkles
          aria-hidden
          className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1"
          style={{ color: meta.color }}
          size={10}
          strokeWidth={2.25}
        />
      )}
      {info.frictionDay && (
        <span
          aria-hidden
          className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-amber"
        />
      )}
      <span
        className="absolute inset-0 flex items-center justify-center num-display text-lg sm:text-3xl"
        style={{
          color: isSpecial ? meta.color : "var(--color-text-strong)",
          opacity: isOutside ? 0.6 : 1,
        }}
      >
        {info.personalDay}
      </span>

      {isToday && (
        <span
          aria-hidden
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold anim-pulse-glow"
        />
      )}
    </button>
  );
}
