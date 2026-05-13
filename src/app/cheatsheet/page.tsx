"use client";

import { useMemo, useState } from "react";
import { useConfig } from "@/store/useConfig";
import {
  DAY_TYPE_META,
  KARMIC_MEANINGS,
  LIFE_PATH_MEANINGS,
  PERSONAL_YEAR_MEANINGS,
} from "@/lib/meanings";
import { lifePath } from "@/lib/numerology";
import type { NumberMeaning } from "@/lib/meanings";
import type { DayType } from "@/lib/types";

const NUMBERS: Array<keyof typeof LIFE_PATH_MEANINGS> = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33,
];

const DAY_TYPES: DayType[] = [
  "master11",
  "master22",
  "master33",
  "peak",
  "newStart",
  "harmony",
  "creative",
  "neutral",
  "flow",
  "rest",
  "abundance",
  "release",
  "karmic",
];

export default function CheatsheetPage() {
  const birth = useConfig((s) => s.birth);
  const userLP = useMemo(() => (birth ? lifePath(birth) : null), [birth]);
  const [selected, setSelected] = useState<number>(userLP ?? 1);
  const meaning = LIFE_PATH_MEANINGS[selected];

  return (
    <div className="anim-fade-up">
      <header className="mb-8 sm:mb-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
          Reference
        </p>
        <h1 className="display text-3xl sm:text-5xl text-text-strong mt-1">
          The cheat sheet
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-[15px] leading-relaxed">
          Everything you need to read a numerology day. Click any number to read
          its full archetype. Master numbers and karmic numbers carry special
          meanings — both are noted below.
        </p>
      </header>

      <section className="mb-12 sm:mb-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2 mb-3">
          Life path numbers
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-6">
          {NUMBERS.map((n) => {
            const m = LIFE_PATH_MEANINGS[n];
            const active = selected === n;
            const isMaster = [11, 22, 33].includes(n);
            return (
              <button
                key={n}
                onClick={() => setSelected(n)}
                className={[
                  "aspect-square rounded-xl border transition-all group relative overflow-hidden",
                  active
                    ? "border-gold scale-[1.04]"
                    : "border-line-soft hover:border-line",
                ].join(" ")}
                style={{
                  background: active
                    ? `linear-gradient(160deg, ${m.color}33, ${m.color}05 60%, transparent), var(--color-ink-1)`
                    : "var(--color-ink-1)",
                }}
              >
                <span
                  className="num-display text-3xl sm:text-4xl"
                  style={{
                    color: active
                      ? m.color
                      : isMaster
                        ? "var(--color-gold-soft)"
                        : "var(--color-text-strong)",
                  }}
                >
                  {n}
                </span>
                {isMaster && (
                  <span
                    aria-hidden
                    className="absolute top-1 right-1.5 text-[10px]"
                    style={{ color: "var(--color-gold)" }}
                  >
                    ★
                  </span>
                )}
                {userLP === n && (
                  <span
                    aria-hidden
                    className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan"
                  />
                )}
              </button>
            );
          })}
        </div>

        <NumberDetail meaning={meaning} isYours={userLP === selected} />
      </section>

      <section className="mb-12 sm:mb-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2 mb-3">
          Day types
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DAY_TYPES.map((t) => {
            const meta = DAY_TYPE_META[t];
            return (
              <div
                key={t}
                className="card p-4 relative overflow-hidden"
                style={{
                  borderColor: `${meta.color}33`,
                }}
              >
                <div
                  aria-hidden
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-25"
                  style={{ background: meta.color }}
                />
                <div className="flex items-start justify-between relative">
                  <span
                    className="display text-lg"
                    style={{ color: meta.color }}
                  >
                    {meta.label}
                  </span>
                  <span
                    className="num-display text-3xl leading-none"
                    style={{ color: meta.color }}
                    aria-hidden
                  >
                    {meta.emoji}
                  </span>
                </div>
                <p className="text-text/85 text-[14px] mt-2 leading-relaxed relative">
                  {meta.tone}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-12 sm:mb-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2 mb-3">
          Karmic numbers
        </p>
        <p className="text-text/85 max-w-2xl text-[15px] mb-4">
          Karmic numbers (13, 14, 16, 19) reduce to a single digit but carry a
          lesson — usually about a corner you tried to cut in the past. They
          aren&apos;t cursed days, but they ask you to walk the long way around.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {([13, 14, 16, 19] as const).map((k) => {
            const m = KARMIC_MEANINGS[k];
            return (
              <div key={k} className="card p-5 border-danger/30">
                <div className="flex items-baseline gap-3">
                  <span className="num-display text-3xl text-danger">{k}</span>
                  <p className="display text-base text-text-strong">{m.title}</p>
                </div>
                <p className="text-text/85 text-[14.5px] mt-2 leading-relaxed">
                  {m.lesson}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2 mb-3">
          The 9-year cycle
        </p>
        <p className="text-text/85 max-w-2xl text-[15px] mb-5">
          Your Personal Year moves through a 1 → 9 cycle and then resets. Master
          years (11, 22, 33) inject high-voltage themes. Knowing where you are in
          the arc helps you spend energy in season.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(PERSONAL_YEAR_MEANINGS).map(([num, m]) => {
            const isMaster = ["11", "22", "33"].includes(num);
            return (
              <div
                key={num}
                className="card p-4"
                style={
                  isMaster
                    ? { borderColor: "rgba(251, 191, 36, 0.4)" }
                    : undefined
                }
              >
                <div className="flex items-baseline gap-2">
                  <span
                    className="num-display text-3xl"
                    style={{
                      color: isMaster
                        ? "var(--color-gold)"
                        : "var(--color-text-strong)",
                    }}
                  >
                    {num}
                  </span>
                  <span className="display text-text-strong">{m.title}</span>
                </div>
                <p className="text-text/80 text-[13.5px] mt-1.5 leading-relaxed">
                  {m.theme}
                </p>
                <p className="text-muted text-[11.5px] mt-1">
                  <span className="uppercase tracking-[0.18em] text-[9.5px] text-muted-2 mr-1.5">
                    Focus
                  </span>
                  {m.focus}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function NumberDetail({
  meaning,
  isYours,
}: {
  meaning: NumberMeaning;
  isYours: boolean;
}) {
  return (
    <article className="card p-6 sm:p-8 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-25"
        style={{ background: meaning.color }}
      />
      <div className="relative flex flex-wrap items-end gap-4 sm:gap-6">
        <span
          className="num-display text-7xl sm:text-9xl leading-none"
          style={{ color: meaning.color }}
        >
          {meaning.number}
        </span>
        <div className="pb-2">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
            {meaning.archetype}
          </p>
          <h2 className="display text-3xl sm:text-4xl text-text-strong leading-tight">
            {meaning.title}
          </h2>
          {isYours && (
            <span className="chip mt-2" style={{ color: "var(--color-cyan)", borderColor: "#22d3ee55" }}>
              ▲ This is your Life Path
            </span>
          )}
        </div>
      </div>

      <p className="relative text-[15.5px] text-text leading-relaxed mt-5 max-w-3xl">
        {meaning.essence}
      </p>

      <div className="relative grid sm:grid-cols-2 gap-5 mt-7">
        <Bucket label="Strengths" items={meaning.strengths} color="var(--color-emerald)" />
        <Bucket label="Shadows" items={meaning.shadows} color="var(--color-danger)" />
        <Bucket label="Do on a #-day" items={meaning.doToday} color={meaning.color} />
        <Bucket label="Avoid on a #-day" items={meaning.avoidToday} color="var(--color-muted)" />
      </div>
    </article>
  );
}

function Bucket({
  label,
  items,
  color,
}: {
  label: string;
  items: string[];
  color: string;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-2 mb-2">
        {label}
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {items.map((s) => (
          <li
            key={s}
            className="chip"
            style={{ color, borderColor: `${color}44` }}
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
