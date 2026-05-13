"use client";

import { useMemo } from "react";
import { lifePath, personalYear } from "@/lib/numerology";
import { PERSONAL_YEAR_MEANINGS } from "@/lib/meanings";
import type { BirthDate } from "@/lib/types";

interface Props {
  birth: BirthDate;
  fromYear: number;
  toYear: number;
  currentYear: number;
  onSelectYear: (year: number) => void;
}

export function YearTimeline({
  birth,
  fromYear,
  toYear,
  currentYear,
  onSelectYear,
}: Props) {
  const lp = lifePath(birth);
  const items = useMemo(() => {
    const arr: Array<{
      year: number;
      py: number;
      isMaster: boolean;
      isLifePath: boolean;
      isCurrent: boolean;
      isBirth: boolean;
      age: number;
    }> = [];
    for (let y = fromYear; y <= toYear; y += 1) {
      const py = personalYear(birth, y);
      arr.push({
        year: y,
        py,
        isMaster: py === 11 || py === 22 || py === 33,
        isLifePath: py === lp,
        isCurrent: y === currentYear,
        isBirth: y === birth.year,
        age: y - birth.year,
      });
    }
    return arr;
  }, [birth, fromYear, toYear, currentYear, lp]);

  return (
    <div className="space-y-2">
      {items.map((it) => {
        const py = it.py;
        const meaning = PERSONAL_YEAR_MEANINGS[py];
        const special = it.isMaster || it.isLifePath;
        return (
          <button
            key={it.year}
            type="button"
            onClick={() => onSelectYear(it.year)}
            className={[
              "w-full grid grid-cols-[auto_auto_1fr_auto] sm:grid-cols-[60px_60px_1fr_auto] gap-3 sm:gap-5 items-center px-3 sm:px-5 py-3 rounded-xl border transition text-left",
              it.isCurrent
                ? "border-gold/60 bg-ink-2/80"
                : special
                  ? "border-line bg-ink-1 hover:border-gold/40"
                  : "border-line-soft bg-ink-1/40 hover:bg-ink-1",
            ].join(" ")}
          >
            <div className="flex flex-col">
              <span
                className={[
                  "num-display text-2xl sm:text-3xl leading-none",
                  it.isCurrent
                    ? "text-gold"
                    : special
                      ? "text-text-strong"
                      : "text-text",
                ].join(" ")}
              >
                {it.year}
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-2 mt-1">
                age {it.age}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span
                className="num-display text-3xl sm:text-4xl leading-none"
                style={{
                  color: it.isMaster
                    ? "var(--color-gold)"
                    : it.isLifePath
                      ? "var(--color-cyan)"
                      : "var(--color-text-strong)",
                }}
              >
                {py}
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-2 mt-1">
                PY
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="display text-base sm:text-lg text-text-strong">
                  {meaning?.title ?? "—"}
                </span>
                {it.isMaster && (
                  <span className="chip" style={{ color: "var(--color-gold)" }}>
                    ★ Master year
                  </span>
                )}
                {it.isLifePath && !it.isMaster && (
                  <span
                    className="chip"
                    style={{ color: "var(--color-cyan)", borderColor: "#22d3ee55" }}
                  >
                    ▲ Life Path year
                  </span>
                )}
                {it.isBirth && (
                  <span className="chip text-muted">birth year</span>
                )}
              </div>
              <p className="text-sm text-muted mt-0.5 line-clamp-1">
                {meaning?.theme}
              </p>
            </div>
            <span className="text-muted-2 text-lg leading-none hidden sm:inline">→</span>
          </button>
        );
      })}
    </div>
  );
}
