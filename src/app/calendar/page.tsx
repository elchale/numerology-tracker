"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Crown,
  Sparkles,
} from "lucide-react";
import { useConfig } from "@/store/useConfig";
import { RequireConfig } from "@/components/RequireConfig";
import { MonthView } from "@/components/calendar/MonthView";
import { DayDetailPanel } from "@/components/calendar/DayDetailPanel";
import { getMonthSummary, personalMonth } from "@/lib/numerology";
import type { LucideIcon } from "lucide-react";

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
  const [panelOpen, setPanelOpen] = useState<boolean>(selectedDay !== null);
  const closeTimerRef = useRef<number | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openDay = useCallback(
    (d: number) => {
      clearCloseTimer();
      setSelectedDay(d);
      setPanelOpen(true);
    },
    [clearCloseTimer],
  );

  const closePanel = useCallback(() => {
    clearCloseTimer();
    setPanelOpen(false);
    closeTimerRef.current = window.setTimeout(() => {
      setSelectedDay(null);
      closeTimerRef.current = null;
    }, 320);
  }, [clearCloseTimer]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

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
      closePanel();
    },
    [closePanel],
  );

  const goToday = useCallback(() => {
    setYear(today.getFullYear());
    setMonth(today.getMonth() + 1);
    openDay(today.getDate());
  }, [today, openDay]);

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
            <ChevronLeft size={18} strokeWidth={2} aria-hidden />
          </button>
          <button onClick={goToday} className="btn btn-ghost">
            Today
          </button>
          <button
            onClick={() => shiftMonth(1)}
            className="btn btn-ghost"
            aria-label="Next month"
          >
            <ChevronRight size={18} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </header>

      <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-2">
        <Legend color="var(--color-gold)" label="Master" Icon={Sparkles} />
        <Legend color="var(--color-cyan)" label="Life Path peak" Icon={Crown} />
        <Legend color="var(--color-danger)" label="Karmic" Icon={AlertCircle} />
        <span className="text-muted-2 hidden sm:inline ml-auto">
          Arrow keys to change month · T for today · Esc to close
        </span>
      </div>

      <div className="-mx-2 sm:mx-0">
        <MonthView
          birth={birth}
          year={year}
          month={month}
          selectedDay={panelOpen ? selectedDay : null}
          onSelect={openDay}
          today={today}
        />
      </div>

      <DayDetailPanel
        birth={birth}
        year={year}
        month={month}
        day={selectedDay}
        open={panelOpen}
        onClose={closePanel}
      />
    </div>
  );
}

function Legend({
  color,
  label,
  Icon,
}: {
  color: string;
  label: string;
  Icon: LucideIcon;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon size={13} strokeWidth={2.25} style={{ color }} aria-hidden />
      <span>{label}</span>
    </span>
  );
}
