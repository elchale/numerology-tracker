"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useConfig } from "@/store/useConfig";
import { RequireConfig } from "@/components/RequireConfig";
import { NumberCard } from "@/components/NumberCard";
import { DayBadge } from "@/components/DayBadge";
import {
  birthHourNumber,
  getDayInfo,
  getNextLuckyDays,
  lifePath,
  universalDay,
} from "@/lib/numerology";
import {
  DAY_TYPE_META,
  LIFE_PATH_MEANINGS,
  PERSONAL_YEAR_MEANINGS,
  UNIVERSAL_MEANING,
} from "@/lib/meanings";

export default function HomePage() {
  return (
    <RequireConfig>
      <Dashboard />
    </RequireConfig>
  );
}

function Dashboard() {
  const birth = useConfig((s) => s.birth);
  const name = useConfig((s) => s.name);
  const today = useMemo(() => new Date(), []);
  const lucky = useMemo(
    () => (birth ? getNextLuckyDays(birth, today, 6) : []),
    [birth, today],
  );
  if (!birth) return null;

  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();

  const info = getDayInfo(birth, y, m, d);
  const lp = lifePath(birth);
  const lpMeaning = LIFE_PATH_MEANINGS[lp];
  const pyMeaning = PERSONAL_YEAR_MEANINGS[info.personalYear];
  const dayMeaning = LIFE_PATH_MEANINGS[info.personalDay];
  const universal = universalDay(y, m, d);
  const meta = DAY_TYPE_META[info.type];
  const hour = birthHourNumber(birth);

  const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
  const longDate = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const greeting = name?.trim()
    ? `Good ${greetingByHour(today.getHours())}, ${name.trim()}.`
    : `Good ${greetingByHour(today.getHours())}.`;

  return (
    <div className="anim-fade-up space-y-8 sm:space-y-12">
      <section>
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
          {weekday} · {longDate}
        </p>
        <h1 className="display text-3xl sm:text-5xl text-text-strong mt-1 leading-[1.05]">
          {greeting}
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-[15px] sm:text-base leading-relaxed">
          <span className="display italic text-gold-soft">{meta.label}.</span>{" "}
          {meta.tone}
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
        <NumberCard
          label="Personal Year"
          value={info.personalYear}
          caption={pyMeaning?.title}
        />
        <NumberCard
          label="Personal Month"
          value={info.personalMonth}
          caption={cycleHint(info.personalMonth)}
        />
        <NumberCard
          label="Personal Day"
          value={info.personalDay}
          caption={meta.label}
          type={info.type}
          highlight={info.isMaster || info.lifePathAlignment}
          size="lg"
        />
      </section>

      {(info.isKarmic || info.lifePathAlignment || info.isMaster) && (
        <section className="card p-5 sm:p-7 flex flex-wrap items-start gap-4">
          <DayBadge type={info.type} />
          {info.lifePathAlignment && !info.isMaster && (
            <span
              className="chip"
              style={{ color: "var(--color-cyan)", borderColor: "#22d3ee55" }}
            >
              ▲ Your Life Path activates today
            </span>
          )}
          {info.isKarmic && (
            <span
              className="chip"
              style={{ color: "var(--color-danger)", borderColor: "#dc262655" }}
            >
              ! Karmic lesson on offer
            </span>
          )}
          <p className="text-text/90 flex-1 min-w-[260px] text-[14.5px] leading-relaxed">
            {info.isMaster
              ? "You are inside a high-voltage day. Protect your nervous system and trust the signals."
              : info.lifePathAlignment
                ? "The frequency of your Life Path is dominant today — what you start now carries unusual weight."
                : "An older lesson is asking for attention. Move slowly and respond honestly."}
          </p>
        </section>
      )}

      <section className="grid lg:grid-cols-2 gap-5 sm:gap-6">
        {dayMeaning && (
          <article className="card p-6 sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
              Day {info.personalDay}
            </p>
            <h2 className="display text-2xl sm:text-3xl text-text-strong mt-1">
              {dayMeaning.title}
            </h2>
            <p className="text-text/90 mt-3 leading-relaxed text-[15px]">
              {dayMeaning.essence}
            </p>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <DoAvoid label="Do today" items={dayMeaning.doToday} tone="positive" />
              <DoAvoid label="Avoid today" items={dayMeaning.avoidToday} tone="negative" />
            </div>
          </article>
        )}

        <article className="card p-6 sm:p-8 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-16 -right-16 w-60 h-60 rounded-full blur-3xl opacity-25"
            style={{ background: lpMeaning?.color ?? "var(--color-gold)" }}
          />
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2 relative">
            Your Life Path
          </p>
          <div className="flex items-end gap-4 mt-1 relative">
            <span
              className="num-display text-7xl sm:text-8xl leading-none"
              style={{
                color: [11, 22, 33].includes(lp)
                  ? "var(--color-gold)"
                  : "var(--color-text-strong)",
              }}
            >
              {lp}
            </span>
            <div className="pb-2">
              {lpMeaning && (
                <p className="display text-2xl text-text-strong leading-tight">
                  {lpMeaning.title}
                </p>
              )}
              <p className="text-[12px] text-muted-2">
                {lpMeaning?.archetype}
              </p>
            </div>
          </div>
          {lpMeaning && (
            <p className="text-text/90 mt-4 leading-relaxed text-[15px] relative">
              {lpMeaning.essence}
            </p>
          )}
          <Link
            href="/cheatsheet"
            className="mt-5 inline-flex items-center gap-2 text-gold hover:gap-3 transition-all text-sm relative"
          >
            Read all paths <span aria-hidden>→</span>
          </Link>
        </article>
      </section>

      <section>
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
              The next 6
            </p>
            <h2 className="display text-2xl sm:text-3xl text-text-strong">
              Lucky days ahead
            </h2>
          </div>
          <Link
            href="/calendar"
            className="text-sm text-muted hover:text-text-strong transition flex items-center gap-1"
          >
            View calendar <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {lucky.map((l) => {
            const lm = DAY_TYPE_META[l.type];
            const dt = l.date;
            return (
              <Link
                key={dt.toISOString()}
                href={`/calendar?y=${dt.getFullYear()}&m=${dt.getMonth() + 1}&d=${dt.getDate()}`}
                className="card p-3 hover:-translate-y-0.5 transition flex flex-col gap-2"
                style={{
                  borderColor: `${lm.color}44`,
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-muted-2">
                      {dt.toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <p className="display text-lg sm:text-xl text-text-strong leading-tight">
                      {dt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className="num-display text-3xl sm:text-4xl leading-none"
                    style={{ color: lm.color }}
                  >
                    {l.personalDay}
                  </span>
                </div>
                <span className="text-[10.5px] text-muted leading-snug">
                  {l.reason}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
            Universal day
          </p>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="num-display text-5xl text-text-strong">
              {universal}
            </span>
            <p className="text-text/80 text-sm">
              {UNIVERSAL_MEANING[universal] ?? "—"}
            </p>
          </div>
        </div>
        {hour != null && (
          <div className="card p-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
              Your birth hour
            </p>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="num-display text-5xl text-gold">{hour}</span>
              <p className="text-text/80 text-sm">
                A secondary layer that colours how you express your day energy.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function greetingByHour(h: number): string {
  if (h < 5) return "night";
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

function cycleHint(pm: number): string {
  const map: Record<number, string> = {
    1: "Initiate",
    2: "Partner",
    3: "Express",
    4: "Build",
    5: "Change",
    6: "Nurture",
    7: "Reflect",
    8: "Empower",
    9: "Complete",
    11: "Inspire",
    22: "Construct",
    33: "Heal",
  };
  return map[pm] ?? "—";
}

function DoAvoid({
  label,
  items,
  tone,
}: {
  label: string;
  items: string[];
  tone: "positive" | "negative";
}) {
  const color = tone === "positive" ? "var(--color-emerald)" : "var(--color-danger)";
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-2 mb-2">
        {label}
      </p>
      <ul className="space-y-1.5">
        {items.map((i) => (
          <li key={i} className="flex items-start gap-2 text-[14px] text-text">
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
