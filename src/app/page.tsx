"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AlertTriangle, ArrowRight, Crown } from "lucide-react";
import { useConfig } from "@/store/useConfig";
import { RequireConfig } from "@/components/RequireConfig";
import { NumberCard } from "@/components/NumberCard";
import { DayBadge } from "@/components/DayBadge";
import { AstroChip } from "@/components/astro/AstroChip";
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
import { getAstroDay, getUpcomingAstroEvents } from "@/lib/astro/events";
import { sunSignForDate } from "@/lib/astro/ephemeris";
import type { AstroEvent } from "@/lib/astro/types";

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

  const y = today.getFullYear();
  const m = today.getMonth() + 1;
  const d = today.getDate();

  const sky = useMemo(() => getAstroDay(y, m, d), [y, m, d]);
  const upcoming = useMemo(() => getUpcomingAstroEvents(today, 5), [today]);

  if (!birth) return null;

  const info = getDayInfo(birth, y, m, d);
  const lp = lifePath(birth);
  const lpMeaning = LIFE_PATH_MEANINGS[lp];
  const pyMeaning = PERSONAL_YEAR_MEANINGS[info.personalYear];
  const dayMeaning = LIFE_PATH_MEANINGS[info.personalDay];
  const universal = universalDay(y, m, d);
  const meta = DAY_TYPE_META[info.type];
  const hour = birthHourNumber(birth);
  const sunSign = sunSignForDate(today);

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
      {/* ---------------------------------------------------------- *
       * Hero — today, at a glance
       * ---------------------------------------------------------- */}
      <section
        className="card card-glow relative overflow-hidden p-6 sm:p-10"
        style={{ ["--glow-color" as never]: meta.color } as React.CSSProperties}
      >
        <div
          aria-hidden
          className="absolute -top-32 -right-24 w-[26rem] h-[26rem] rounded-full blur-3xl opacity-25 pointer-events-none"
          style={{ background: meta.color }}
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-32 w-[22rem] h-[22rem] rounded-full blur-3xl opacity-[0.12] pointer-events-none"
          style={{ background: lpMeaning?.color ?? "var(--color-gold)" }}
        />

        <div className="relative">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
              {weekday} · {longDate}
            </p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
              {sunSign} season
            </p>
          </div>

          <p className="display text-xl sm:text-2xl text-muted mt-4">{greeting}</p>

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
            <div className="shrink-0">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-2 mb-1">
                Personal day
              </p>
              <span
                className="num-display block text-[6rem] sm:text-[9rem] leading-[0.8]"
                style={{ color: meta.color }}
              >
                {info.personalDay}
              </span>
            </div>

            <div className="min-w-0 sm:pb-3">
              {dayMeaning && (
                <h1 className="display text-4xl sm:text-6xl text-text-strong leading-[1.02]">
                  {dayMeaning.title}
                </h1>
              )}
              <p className="display italic text-gold-soft text-lg sm:text-xl mt-1">
                {meta.label}
              </p>
              <p className="text-text/90 mt-3 max-w-2xl text-[15px] sm:text-base leading-relaxed">
                {dayMeaning?.essence ?? meta.tone}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <DayBadge type={info.type} />
            {info.lifePathAlignment && !info.isMaster && (
              <span
                className="chip"
                style={{ color: "var(--color-cyan)", borderColor: "#22d3ee55" }}
              >
                <Crown size={12} strokeWidth={2.25} aria-hidden />
                Life Path activates today
              </span>
            )}
            {info.frictionDay && (
              <span
                className="chip"
                style={{
                  color: "var(--color-amber)",
                  borderColor: "hsl(35 92% 62% / 0.45)",
                }}
              >
                <AlertTriangle size={12} strokeWidth={2.25} aria-hidden />
                Friction with your Life Path
              </span>
            )}
            {sky.events.map((event) => (
              <AstroChip key={event.id} entry={event} />
            ))}
            {sky.windows
              .filter((w) => w.category !== "season")
              .map((window) => (
                <AstroChip key={window.id} entry={window} muted />
              ))}
          </div>

          {(info.isMaster || info.lifePathAlignment || info.frictionDay) && (
            <p className="mt-5 text-text/85 text-[14.5px] leading-relaxed max-w-2xl">
              {info.isMaster
                ? "You are inside a high-voltage day. Protect your nervous system and trust the signals."
                : info.lifePathAlignment
                  ? "The frequency of your Life Path is dominant today — what you start now carries unusual weight."
                  : "Today runs a number that pulls against your Life Path. Workable, but move gently — don't force big outcomes."}
            </p>
          )}

          {dayMeaning && (
            <div className="mt-7 pt-6 border-t border-line-soft grid sm:grid-cols-2 gap-5 sm:gap-8">
              <DoAvoid label="Do today" items={dayMeaning.doToday} tone="positive" />
              <DoAvoid
                label="Avoid today"
                items={dayMeaning.avoidToday}
                tone="negative"
              />
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------------- *
       * Supporting cycles
       * ---------------------------------------------------------- */}
      <section
        className={[
          "grid gap-3 sm:gap-5 grid-cols-2",
          hour != null ? "lg:grid-cols-4" : "sm:grid-cols-3",
        ].join(" ")}
      >
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
          label="Universal Day"
          value={universal}
          caption={UNIVERSAL_MEANING[universal]}
        />
        {hour != null && (
          <NumberCard label="Birth Hour" value={hour} caption="Expression layer" />
        )}
      </section>

      {/* ---------------------------------------------------------- *
       * Life Path + what's coming in the sky
       * ---------------------------------------------------------- */}
      <section className="grid lg:grid-cols-2 gap-5 sm:gap-6">
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
              <p className="text-[12px] text-muted-2">{lpMeaning?.archetype}</p>
            </div>
          </div>
          {lpMeaning && (
            <p className="text-text/90 mt-4 leading-relaxed text-[15px] relative">
              {lpMeaning.essence}
            </p>
          )}
          {lpMeaning && (
            <div className="relative mt-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-2 mb-2">
                Your strengths
              </p>
              <div className="flex flex-wrap gap-1.5">
                {lpMeaning.strengths.map((strength) => (
                  <span
                    key={strength}
                    className="chip text-[11px] py-1"
                    style={{
                      borderColor: `${lpMeaning.color}44`,
                      color: "var(--color-text)",
                    }}
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Link
            href="/cheatsheet"
            className="mt-5 inline-flex items-center gap-2 text-gold hover:gap-3 transition-all text-sm relative"
          >
            Read all paths <ArrowRight size={14} strokeWidth={2} aria-hidden />
          </Link>
        </article>

        <SkyAhead events={upcoming} />
      </section>

      {/* ---------------------------------------------------------- *
       * Lucky days
       * ---------------------------------------------------------- */}
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
            View calendar <ArrowRight size={14} strokeWidth={2} aria-hidden />
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
                style={{ borderColor: `${lm.color}44` }}
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
    </div>
  );
}

/** Upcoming sky events, linking through to their calendar day. */
function SkyAhead({ events }: { events: AstroEvent[] }) {
  return (
    <article className="card p-6 sm:p-8">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
        What&apos;s coming
      </p>
      <h2 className="display text-2xl sm:text-3xl text-text-strong mt-1">
        Ahead in the sky
      </h2>

      {events.length === 0 ? (
        <p className="text-muted text-sm mt-4">Nothing notable on the horizon.</p>
      ) : (
        <ul className="mt-5 space-y-3.5">
          {events.map((event) => {
            const { Icon, color, date } = event;
            return (
              <li key={event.id}>
                <Link
                  href={`/calendar?y=${date.getFullYear()}&m=${date.getMonth() + 1}&d=${date.getDate()}`}
                  className="flex items-start gap-3 group"
                >
                  <span
                    aria-hidden
                    className="shrink-0 mt-0.5 w-8 h-8 rounded-full border flex items-center justify-center transition-colors"
                    style={{ borderColor: `${color}44`, background: `${color}12` }}
                  >
                    <Icon size={14} strokeWidth={2} style={{ color }} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2">
                      <span className="text-text-strong text-[15px] group-hover:text-gold transition-colors">
                        {event.title}
                      </span>
                      <span className="text-[11px] uppercase tracking-[0.16em] text-muted-2">
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </span>
                    <span className="block text-muted text-[13px] leading-snug mt-0.5">
                      {event.summary}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </article>
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
