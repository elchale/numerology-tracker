"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useConfig } from "@/store/useConfig";
import { RequireConfig } from "@/components/RequireConfig";
import { MonthView } from "@/components/calendar/MonthView";
import { DayDetail } from "@/components/calendar/DayDetail";
import { getMonthSummary, personalMonth } from "@/lib/numerology";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function CalendarPage() {
  return (
    <RequireConfig>
      <Suspense fallback={null}>
        <CalendarInner />
      </Suspense>
    </RequireConfig>
  );
}

function CalendarInner() {
  const birth = useConfig((s) => s.birth);
  const router = useRouter();
  const params = useSearchParams();
  const today = useMemo(() => new Date(), []);

  const initialYear = parseInt(params.get("y") ?? "", 10);
  const initialMonth = parseInt(params.get("m") ?? "", 10);
  const initialDay = parseInt(params.get("d") ?? "", 10);

  const [year, setYear] = useState<number>(
    !Number.isNaN(initialYear) ? initialYear : today.getFullYear(),
  );
  const [month, setMonth] = useState<number>(
    !Number.isNaN(initialMonth) && initialMonth >= 1 && initialMonth <= 12
      ? initialMonth
      : today.getMonth() + 1,
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(
    !Number.isNaN(initialDay) ? initialDay : null,
  );

  const shiftMonth = useCallback(
    (delta: number) => {
      setMonth((prevMonth) => {
        let nm = prevMonth + delta;
        if (nm < 1) {
          nm = 12;
          setYear((y) => y - 1);
        } else if (nm > 12) {
          nm = 1;
          setYear((y) => y + 1);
        }
        return nm;
      });
      setSelectedDay(null);
    },
    [],
  );

  const goToday = useCallback(() => {
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
    setSelectedDay(today.getDate());
  }, [today]);

  useEffect(() => {
    const sp = new URLSearchParams();
    sp.set("y", String(year));
    sp.set("m", String(month));
    if (selectedDay) sp.set("d", String(selectedDay));
    router.replace(`/calendar?${sp.toString()}`, { scroll: false });
  }, [year, month, selectedDay, router]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement
      )
        return;
      if (e.key === "ArrowLeft") shiftMonth(-1);
      if (e.key === "ArrowRight") shiftMonth(1);
      if (e.key === "t" || e.key === "T") goToday();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shiftMonth, goToday]);

  if (!birth) return null;

  const summary = getMonthSummary(birth, year, month);
  const pm = personalMonth(birth, year, month);

  return (
    <div className="anim-fade-up">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
            Calendar
          </p>
          <h1 className="display text-3xl sm:text-5xl text-text-strong mt-1">
            {MONTHS[month - 1]} {year}
          </h1>
          <p className="text-muted mt-2 text-sm flex items-center flex-wrap gap-x-3 gap-y-1">
            <span>
              Personal month{" "}
              <span className="num-display text-gold text-lg ml-1">{pm}</span>
            </span>
            <span className="text-muted-2">·</span>
            <span>{summary.masterDays.length} master · {summary.peakDays.length} peak · {summary.karmicDays.length} karmic</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => shiftMonth(-1)}
            className="btn btn-ghost"
            aria-label="Previous month"
          >
            ←
          </button>
          <button onClick={goToday} className="btn btn-ghost">
            Today
          </button>
          <button
            onClick={() => shiftMonth(1)}
            className="btn btn-ghost"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </header>

      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-2">
        <Legend color="var(--color-gold)" label="Master" glyph="★" />
        <Legend color="var(--color-cyan)" label="Life Path peak" glyph="●" />
        <Legend color="var(--color-danger)" label="Karmic" glyph="!" />
        <span className="text-muted-2 hidden sm:inline ml-auto">
          ← / →: change month · T: today · Esc: close
        </span>
      </div>

      <div className="-mx-2 sm:mx-0">
        <MonthView
          birth={birth}
          year={year}
          month={month}
          selectedDay={selectedDay}
          onSelect={(d) => setSelectedDay(d)}
          today={today}
        />
      </div>

      <DayDetail
        birth={birth}
        year={year}
        month={month}
        day={selectedDay}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  );
}

function Legend({
  color,
  label,
  glyph,
}: {
  color: string;
  label: string;
  glyph: string;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span style={{ color }} aria-hidden>
        {glyph}
      </span>
      <span>{label}</span>
    </span>
  );
}
