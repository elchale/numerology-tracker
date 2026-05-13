"use client";

import { getDayInfo, personalMonth } from "@/lib/numerology";
import type { BirthDate } from "@/lib/types";
import { DAY_TYPE_META } from "@/lib/meanings";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface Props {
  birth: BirthDate;
  year: number;
  month: number; // 1-12
  onClick?: () => void;
}

export function MonthMini({ birth, year, month, onClick }: Props) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDow = new Date(year, month - 1, 1).getDay();
  const pm = personalMonth(birth, year, month);
  const today = new Date();

  let masters = 0;
  let peaks = 0;
  let karmic = 0;

  const cells: Array<{
    day: number;
    color: string;
    intensity: number;
    isToday: boolean;
  } | null> = [];
  for (let i = 0; i < firstDow; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) {
    const info = getDayInfo(birth, year, month, d);
    const meta = DAY_TYPE_META[info.type];
    const special = info.isMaster || info.lifePathAlignment || info.isKarmic;
    if (info.isMaster) masters += 1;
    if (info.lifePathAlignment && !info.isMaster) peaks += 1;
    if (info.isKarmic) karmic += 1;
    cells.push({
      day: d,
      color: meta.color,
      intensity: special ? 1 : 0.35,
      isToday:
        today.getFullYear() === year &&
        today.getMonth() + 1 === month &&
        today.getDate() === d,
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="card relative p-3 sm:p-4 text-left hover:-translate-y-0.5 transition group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
    >
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className="display text-text-strong text-lg leading-none">
            {MONTH_LABELS[month - 1]}
          </span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-2">
            PM
          </span>
          <span className="num-display text-gold text-base leading-none">
            {pm}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-[3px]">
        {cells.map((c, i) => (
          <div
            key={i}
            className="aspect-square rounded-[3px] relative"
            style={{
              background: c
                ? `${c.color}${Math.round(c.intensity * 70)
                    .toString(16)
                    .padStart(2, "0")}`
                : "transparent",
              outline: c?.isToday ? "1px solid var(--color-gold)" : "none",
            }}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 flex-wrap text-[10px]">
        {masters > 0 && (
          <span className="chip" style={{ color: "var(--color-gold)" }}>
            ★ {masters}
          </span>
        )}
        {peaks > 0 && (
          <span className="chip" style={{ color: "var(--color-cyan)" }}>
            ▲ {peaks}
          </span>
        )}
        {karmic > 0 && (
          <span className="chip" style={{ color: "var(--color-danger)" }}>
            ! {karmic}
          </span>
        )}
        {masters === 0 && peaks === 0 && karmic === 0 && (
          <span className="text-muted-2">Steady month</span>
        )}
      </div>
    </button>
  );
}
