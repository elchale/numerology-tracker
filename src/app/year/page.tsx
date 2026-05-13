"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useConfig } from "@/store/useConfig";
import { RequireConfig } from "@/components/RequireConfig";
import { MonthMini } from "@/components/year/MonthMini";
import {
  getYearSummary,
  lifePath,
  personalYear,
} from "@/lib/numerology";
import { PERSONAL_YEAR_MEANINGS } from "@/lib/meanings";

export default function YearPage() {
  return (
    <RequireConfig>
      <Suspense fallback={null}>
        <YearInner />
      </Suspense>
    </RequireConfig>
  );
}

function YearInner() {
  const birth = useConfig((s) => s.birth);
  const router = useRouter();
  const params = useSearchParams();
  const today = useMemo(() => new Date(), []);
  const initialYear = parseInt(params.get("y") ?? "", 10);
  const [year, setYear] = useState<number>(
    !Number.isNaN(initialYear) ? initialYear : today.getFullYear(),
  );

  useEffect(() => {
    router.replace(`/year?y=${year}`, { scroll: false });
  }, [year, router]);

  if (!birth) return null;

  const summary = getYearSummary(birth, year);
  const lp = lifePath(birth);
  const py = personalYear(birth, year);
  const meaning = PERSONAL_YEAR_MEANINGS[py];

  return (
    <div className="anim-fade-up">
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
              Year overview
            </p>
            <h1 className="display text-3xl sm:text-5xl text-text-strong mt-1">
              {year}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setYear(year - 1)} className="btn btn-ghost" aria-label="Previous year">
              ←
            </button>
            <button
              onClick={() => setYear(today.getFullYear())}
              className="btn btn-ghost"
            >
              This year
            </button>
            <button onClick={() => setYear(year + 1)} className="btn btn-ghost" aria-label="Next year">
              →
            </button>
          </div>
        </div>

        <div className="card mt-5 p-5 sm:p-7 grid sm:grid-cols-[auto_1fr_auto] gap-5 items-center relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-3xl opacity-20"
            style={{
              background: summary.isMasterYear
                ? "var(--color-gold)"
                : summary.isLifePathYear
                  ? "var(--color-cyan)"
                  : "var(--color-violet)",
            }}
          />
          <div className="flex items-end gap-3 relative">
            <span
              className="num-display text-7xl sm:text-8xl leading-none"
              style={{
                color: summary.isMasterYear
                  ? "var(--color-gold)"
                  : summary.isLifePathYear
                    ? "var(--color-cyan)"
                    : "var(--color-text-strong)",
              }}
            >
              {py}
            </span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-2 pb-2">
              Personal year
            </span>
          </div>
          <div className="relative">
            {meaning && (
              <>
                <p className="display text-2xl text-text-strong">
                  {meaning.title}
                </p>
                <p className="text-text/85 mt-1 text-[15px]">{meaning.theme}</p>
                <p className="text-muted text-[12px] mt-1">
                  <span className="uppercase tracking-[0.18em] text-[10px] text-muted-2 mr-2">
                    Focus
                  </span>
                  {meaning.focus}
                </p>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 relative">
            {summary.isMasterYear && (
              <span className="chip" style={{ color: "var(--color-gold)" }}>
                ★ Master year
              </span>
            )}
            {summary.isLifePathYear && (
              <span className="chip" style={{ color: "var(--color-cyan)", borderColor: "#22d3ee55" }}>
                ▲ Life Path year
              </span>
            )}
            <span className="chip">{summary.peakCount} peak days</span>
            <span className="chip">{summary.masterCount} master days</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
        {summary.monthly.map((m) => (
          <MonthMini
            key={m.month}
            birth={birth}
            year={year}
            month={m.month}
            onClick={() =>
              router.push(`/calendar?y=${year}&m=${m.month}`)
            }
          />
        ))}
      </div>

      <p className="text-xs text-muted-2 mt-6">
        Life Path {lp} reference · Click any month to drill into the calendar.
      </p>
    </div>
  );
}
