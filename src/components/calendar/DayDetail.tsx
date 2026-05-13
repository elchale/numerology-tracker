"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { getDayInfo, universalDay } from "@/lib/numerology";
import {
  DAY_TYPE_META,
  KARMIC_MEANINGS,
  LIFE_PATH_MEANINGS,
  PERSONAL_YEAR_MEANINGS,
  UNIVERSAL_MEANING,
} from "@/lib/meanings";
import type { BirthDate } from "@/lib/types";
import { DayBadge } from "@/components/DayBadge";

interface Props {
  birth: BirthDate;
  year: number;
  month: number;
  day: number | null;
  onClose: () => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function DayDetail({ birth, year, month, day, onClose }: Props) {
  useEffect(() => {
    if (day == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [day, onClose]);

  if (day == null || typeof document === "undefined") return null;
  const info = getDayInfo(birth, year, month, day);
  const meta = DAY_TYPE_META[info.type];
  const pyMeaning = PERSONAL_YEAR_MEANINGS[info.personalYear];
  const dayMeaning = LIFE_PATH_MEANINGS[info.personalDay];
  const universal = universalDay(year, month, day);
  const date = new Date(year, month - 1, day);
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Numerology for ${weekday} ${MONTHS[month - 1]} ${day}, ${year}`}
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-ink-0/80 backdrop-blur-sm flex items-end sm:items-stretch sm:justify-end anim-fade-up"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card flex flex-col w-full sm:w-[480px] max-h-[92vh] sm:max-h-none sm:h-screen rounded-t-2xl sm:rounded-none sm:rounded-l-2xl overflow-hidden"
      >
        <div
          className="relative shrink-0 px-5 sm:px-7 pt-5 pb-5 border-b border-line-soft"
          style={{
            background: `linear-gradient(150deg, ${meta.color}22, transparent 60%), var(--color-ink-1)`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
                {weekday}
              </p>
              <h2 className="display text-2xl sm:text-3xl text-text-strong mt-1 leading-tight">
                {MONTHS[month - 1]} {day}, {year}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="shrink-0 w-11 h-11 rounded-full border border-line bg-ink-2 hover:bg-ink-3 hover:border-gold/60 transition flex items-center justify-center text-2xl leading-none text-text-strong shadow-lg"
            >
              ×
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <DayBadge type={info.type} />
            {info.lifePathAlignment && !info.isMaster && (
              <span
                className="chip"
                style={{ borderColor: "#22d3ee66", color: "#22d3ee" }}
              >
                ▲ Life Path alignment
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-5 sm:px-7 py-5 grid grid-cols-3 gap-2 sm:gap-3">
            <Stat label="Year" value={info.personalYear} />
            <Stat label="Month" value={info.personalMonth} />
            <Stat label="Day" value={info.personalDay} color={meta.color} big />
          </div>

          <div className="px-5 sm:px-7 pb-5">
            <p className="text-[15px] leading-relaxed text-text">
              <span className="display italic text-gold-soft">
                {meta.label}.
              </span>{" "}
              {meta.tone}
            </p>
          </div>

          {info.isKarmic && info.karmicSource && (
            <Block title={KARMIC_MEANINGS[info.karmicSource].title} tone="danger">
              <p className="text-text/85 leading-relaxed text-[14.5px]">
                {KARMIC_MEANINGS[info.karmicSource].lesson}
              </p>
            </Block>
          )}

          {dayMeaning && (
            <Block title={`Day Number ${info.personalDay} — ${dayMeaning.title}`}>
              <p className="text-text/90 leading-relaxed text-[14.5px]">
                {dayMeaning.essence}
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                <List label="Do today" items={dayMeaning.doToday} tone="positive" />
                <List label="Avoid today" items={dayMeaning.avoidToday} tone="negative" />
              </div>
            </Block>
          )}

          {pyMeaning && (
            <Block title={`Personal Year — ${pyMeaning.title}`}>
              <p className="text-text/90 leading-relaxed text-[14.5px]">
                {pyMeaning.theme}
              </p>
              <p className="text-muted text-[13px] mt-1">
                <span className="uppercase tracking-[0.18em] text-[10px] mr-2 text-muted-2">
                  Focus
                </span>
                {pyMeaning.focus}
              </p>
            </Block>
          )}

          <Block title="Universal Day" subtle>
            <p className="text-text/90 leading-relaxed text-[14.5px]">
              <span className="num-display text-2xl text-text-strong mr-2">
                {universal}
              </span>
              {UNIVERSAL_MEANING[universal] ?? "A shared global vibration today."}
            </p>
          </Block>
        </div>

        <div className="shrink-0 p-4 sm:p-5 border-t border-line-soft bg-ink-1">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function Stat({
  label,
  value,
  color,
  big,
}: {
  label: string;
  value: number;
  color?: string;
  big?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line-soft bg-ink-1/50 p-3 flex flex-col items-center">
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-2 mb-1">
        {label}
      </span>
      <span
        className={[
          "num-display",
          big ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl",
        ].join(" ")}
        style={{ color: color ?? "var(--color-text-strong)" }}
      >
        {value}
      </span>
    </div>
  );
}

function Block({
  title,
  children,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  tone?: "danger";
  subtle?: boolean;
}) {
  return (
    <div className="px-5 sm:px-7 py-5 border-t border-line-soft">
      <h3
        className={[
          "display text-xl mb-2",
          tone === "danger" ? "text-danger" : "text-text-strong",
        ].join(" ")}
      >
        {title}
      </h3>
      {children}
    </div>
  );
}

function List({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "positive" | "negative";
}) {
  const color = tone === "positive" ? "#10b981" : "#f87171";
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-2 mb-2">
        {label}
      </p>
      <ul className="space-y-1.5">
        {items.map((i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-[14px] text-text"
          >
            <span
              aria-hidden
              className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: color }}
            />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
