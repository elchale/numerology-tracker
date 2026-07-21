"use client";

import { useMemo } from "react";
import { getDayInfo } from "@/lib/numerology";
import { getAstroEvents } from "@/lib/astro/events";
import type { BirthDate, DayInfo } from "@/lib/types";
import type { AstroEvent } from "@/lib/astro/types";
import { DayCell } from "./DayCell";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface Props {
  birth: BirthDate;
  year: number;
  month: number; // 1-12
  selectedDay: number | null;
  onSelect: (day: number) => void;
  today?: Date;
}

interface CellEntry {
  key: string;
  day: number;
  info: DayInfo | null;
  astro: AstroEvent[];
  isOutside: boolean;
  isToday: boolean;
}

export function MonthView({
  birth,
  year,
  month,
  selectedDay,
  onSelect,
  today = new Date(),
}: Props) {
  const cells = useMemo<CellEntry[]>(() => {
    const firstDow = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevDays = new Date(year, month - 1, 0).getDate();
    const items: CellEntry[] = [];

    for (let i = firstDow - 1; i >= 0; i -= 1) {
      const d = prevDays - i;
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      items.push({
        key: `p-${d}`,
        day: d,
        info: getDayInfo(birth, prevYear, prevMonth, d),
        astro: getAstroEvents(prevYear, prevMonth, d),
        isOutside: true,
        isToday: false,
      });
    }

    for (let d = 1; d <= daysInMonth; d += 1) {
      const info = getDayInfo(birth, year, month, d);
      const isToday =
        today.getFullYear() === year &&
        today.getMonth() + 1 === month &&
        today.getDate() === d;
      items.push({
        key: `m-${d}`,
        day: d,
        info,
        astro: getAstroEvents(year, month, d),
        isOutside: false,
        isToday,
      });
    }

    const trailing = (7 - (items.length % 7)) % 7;
    for (let i = 1; i <= trailing; i += 1) {
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      items.push({
        key: `n-${i}`,
        day: i,
        info: getDayInfo(birth, nextYear, nextMonth, i),
        astro: getAstroEvents(nextYear, nextMonth, i),
        isOutside: true,
        isToday: false,
      });
    }
    return items;
  }, [birth, year, month, today]);

  return (
    <div className="card p-1.5 sm:p-5">
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1.5 sm:mb-3">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-center text-[9px] sm:text-xs uppercase tracking-[0.18em] text-muted-2 pb-0.5"
          >
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {cells.map((c) => (
          <DayCell
            key={c.key}
            day={c.day}
            info={c.info}
            astro={c.astro}
            isToday={c.isToday}
            isSelected={
              !c.isOutside &&
              selectedDay === c.day
            }
            isOutside={c.isOutside}
            onClick={c.isOutside ? undefined : () => onSelect(c.day)}
          />
        ))}
      </div>
    </div>
  );
}
