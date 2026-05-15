"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { useConfig } from "@/store/useConfig";
import { RequireConfig } from "@/components/RequireConfig";
import { lifePath } from "@/lib/numerology";
import {
  attitudeNumber,
  birthdayNumber,
  challenges,
  maturityNumber,
  nameNumbers,
  pinnacles,
} from "@/lib/secondary";
import {
  ATTITUDE_MEANINGS,
  BIRTHDAY_NUMBER_MEANINGS,
  CHALLENGE_MEANINGS,
  KARMIC_MEANINGS,
  LIFE_PATH_MEANINGS,
  MATURITY_NOTE,
  NAME_NUMBER_MEANINGS,
  PINNACLE_MEANINGS,
} from "@/lib/meanings";

const MASTER_SET = new Set([11, 22, 33]);

export default function ChartPage() {
  return (
    <RequireConfig>
      <Chart />
    </RequireConfig>
  );
}

function Chart() {
  const birth = useConfig((s) => s.birth);
  const fullName = useConfig((s) => s.fullName);

  const data = useMemo(() => {
    if (!birth) return null;
    const lp = lifePath(birth);
    const bday = birthdayNumber(birth);
    const att = attitudeNumber(birth);
    const pins = pinnacles(birth);
    const chs = challenges(birth);
    const nm = nameNumbers(fullName);
    const maturity = nm ? maturityNumber(lp, nm.expression) : null;

    const today = new Date();
    const age = ageFromBirth(birth, today);
    return { lp, bday, att, pins, chs, nm, maturity, age };
  }, [birth, fullName]);

  if (!birth || !data) return null;
  const { lp, bday, att, pins, chs, nm, maturity, age } = data;

  const lpMeaning = LIFE_PATH_MEANINGS[lp];
  const currentPinnacle = pins.find(
    (p) => age >= p.fromAge && (p.toAge === null || age < p.toAge),
  );
  const currentTimedChallenge = chs.find(
    (c) => age >= c.fromAge && (c.toAge === null || age < c.toAge),
  );

  return (
    <div className="anim-fade-up space-y-10 sm:space-y-14">
      <header>
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
          Your numerology chart
        </p>
        <h1 className="display text-3xl sm:text-5xl text-text-strong mt-1 leading-[1.05]">
          The map you arrived with
        </h1>
        <p className="text-muted mt-3 max-w-2xl text-[15px] leading-relaxed">
          Your Life Path is the headline. These are the supporting numbers —
          they shade how the headline plays out across your life.
        </p>
      </header>

      <section>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <CoreCard
            label="Life Path"
            value={lp}
            caption={lpMeaning?.title}
            isMaster={MASTER_SET.has(lp)}
            primary
          />
          <CoreCard
            label="Birthday"
            value={bday.raw}
            reducedValue={bday.reduced !== bday.raw ? bday.reduced : undefined}
            caption={BIRTHDAY_NUMBER_MEANINGS[bday.raw]?.title}
            isKarmic={bday.isKarmic}
            isMaster={[11, 22].includes(bday.raw)}
          />
          <CoreCard
            label="Attitude"
            value={att}
            caption="First impression you give"
            isMaster={MASTER_SET.has(att)}
          />
          <CoreCard
            label="Maturity"
            value={maturity ?? 0}
            caption={maturity !== null ? "Active around age 35+" : "Add your birth name"}
            isMaster={maturity !== null && MASTER_SET.has(maturity)}
            disabled={maturity === null}
          />
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Day-of-month vibration"
          title={`Birthday — ${bday.raw}`}
        />
        <div className="card p-6 sm:p-7">
          <div className="flex items-end gap-4 mb-3 flex-wrap">
            <span
              className="num-display text-6xl sm:text-7xl leading-none"
              style={{
                color: bday.isKarmic
                  ? "var(--color-danger)"
                  : [11, 22].includes(bday.raw)
                    ? "var(--color-gold)"
                    : "var(--color-text-strong)",
              }}
            >
              {bday.raw}
            </span>
            <div className="pb-2">
              <p className="display text-xl text-text-strong leading-tight">
                {BIRTHDAY_NUMBER_MEANINGS[bday.raw]?.title}
              </p>
              {bday.raw !== bday.reduced && (
                <p className="text-[12px] text-muted-2">
                  reduces to {bday.reduced}
                </p>
              )}
            </div>
          </div>
          <p className="text-text/90 text-[15px] leading-relaxed">
            {BIRTHDAY_NUMBER_MEANINGS[bday.raw]?.blurb}
          </p>
          {bday.isKarmic && bday.karmicSource && (
            <div className="mt-4 rounded-xl border border-danger/40 bg-danger/5 p-4">
              <p className="display text-danger text-base">
                {KARMIC_MEANINGS[bday.karmicSource].title}
              </p>
              <p className="text-[13.5px] text-text/85 mt-1 leading-relaxed">
                {KARMIC_MEANINGS[bday.karmicSource].lesson}
              </p>
            </div>
          )}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="How people first read you"
          title={`Attitude — ${att}`}
        />
        <div className="card p-6 sm:p-7">
          <div className="flex items-baseline gap-4 mb-3">
            <span
              className="num-display text-6xl sm:text-7xl leading-none"
              style={{
                color: MASTER_SET.has(att)
                  ? "var(--color-gold)"
                  : "var(--color-text-strong)",
              }}
            >
              {att}
            </span>
            <p className="text-[12px] text-muted-2">
              reduce(month) + reduce(day), reduced
            </p>
          </div>
          <p className="text-text/90 text-[15px] leading-relaxed">
            {ATTITUDE_MEANINGS[att]}
          </p>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Four life cycles"
          title="Pinnacles"
          hint={
            currentPinnacle
              ? `You're inside Pinnacle ${currentPinnacle.index} (age ${age}).`
              : undefined
          }
        />
        <div className="space-y-2">
          {pins.map((p) => {
            const active =
              age >= p.fromAge && (p.toAge === null || age < p.toAge);
            return (
              <CycleRow
                key={p.index}
                label={`Pinnacle ${p.index}`}
                number={p.number}
                fromAge={p.fromAge}
                toAge={p.toAge}
                active={active}
                description={PINNACLE_MEANINGS[p.number] ?? ""}
              />
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="The flip side of each Pinnacle"
          title="Challenges"
          hint={
            currentTimedChallenge
              ? `Your timed challenge right now: ${currentTimedChallenge.number}.`
              : undefined
          }
        />
        <div className="space-y-2">
          {chs.map((c) => {
            const active =
              age >= c.fromAge && (c.toAge === null || age < c.toAge);
            return (
              <CycleRow
                key={c.kind}
                label={
                  c.kind === "main"
                    ? "Main Challenge"
                    : c.kind === "first"
                      ? "First Challenge"
                      : c.kind === "second"
                        ? "Second Challenge"
                        : "Fourth Challenge"
                }
                number={c.number}
                fromAge={c.fromAge}
                toAge={c.toAge}
                active={active}
                description={CHALLENGE_MEANINGS[c.number] ?? ""}
                tone="danger"
              />
            );
          })}
          <p className="text-[12px] text-muted-2 mt-2">
            Note: Challenge math reduces master numbers to single digits,
            so all four can fall in 0-9.
          </p>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="From your name"
          title="Expression · Soul Urge · Personality"
          hint={
            nm
              ? `Calculated from ${nm.letterCount} letters.`
              : "Add your birth name in settings to unlock."
          }
        />
        {nm ? (
          <div className="grid sm:grid-cols-3 gap-3 sm:gap-4">
            <NameCard
              kind="Expression"
              value={nm.expression}
              text={NAME_NUMBER_MEANINGS[nm.expression]?.expression}
            />
            <NameCard
              kind="Soul Urge"
              value={nm.soulUrge}
              text={NAME_NUMBER_MEANINGS[nm.soulUrge]?.soulUrge}
            />
            <NameCard
              kind="Personality"
              value={nm.personality}
              text={NAME_NUMBER_MEANINGS[nm.personality]?.personality}
            />
          </div>
        ) : (
          <div className="card p-6 flex items-start gap-3">
            <Lock size={18} strokeWidth={2} className="text-muted-2 mt-0.5" aria-hidden />
            <div className="flex-1">
              <p className="text-text/90 text-[14.5px] leading-relaxed">
                Three name-based numbers — Expression (talent), Soul Urge
                (motivation), and Personality (first read) — calculated from
                your full birth name. Adds Maturity (Life Path + Expression)
                automatically.
              </p>
              <Link
                href="/settings"
                className="inline-flex items-center gap-2 text-gold hover:gap-3 transition-all text-sm mt-3"
              >
                Add my birth name <ArrowRight size={14} strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </div>
        )}
        {nm && maturity !== null && (
          <div className="card mt-3 p-5">
            <div className="flex items-baseline gap-3">
              <span
                className="num-display text-4xl leading-none"
                style={{
                  color: MASTER_SET.has(maturity)
                    ? "var(--color-gold)"
                    : "var(--color-text-strong)",
                }}
              >
                {maturity}
              </span>
              <p className="display text-text-strong text-lg">Maturity</p>
            </div>
            <p className="text-text/85 text-[14px] mt-2 leading-relaxed">
              {MATURITY_NOTE}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function CoreCard({
  label,
  value,
  reducedValue,
  caption,
  isMaster,
  isKarmic,
  primary,
  disabled,
}: {
  label: string;
  value: number;
  reducedValue?: number;
  caption?: string;
  isMaster?: boolean;
  isKarmic?: boolean;
  primary?: boolean;
  disabled?: boolean;
}) {
  const color = disabled
    ? "var(--color-muted-2)"
    : isKarmic
      ? "var(--color-danger)"
      : isMaster
        ? "var(--color-gold)"
        : "var(--color-text-strong)";
  return (
    <div
      className={[
        "card flex flex-col p-4 sm:p-5 relative overflow-hidden",
        primary ? "card-glow" : "",
        disabled ? "opacity-60" : "",
      ].join(" ")}
    >
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-2">
        {label}
      </p>
      <div className="flex items-baseline gap-2 mt-1">
        <span
          className="num-display text-5xl sm:text-6xl leading-none"
          style={{ color }}
        >
          {value}
        </span>
        {reducedValue !== undefined && (
          <span className="text-[11px] text-muted-2">→ {reducedValue}</span>
        )}
      </div>
      {caption && (
        <p className="text-[12px] text-muted mt-2 leading-snug">{caption}</p>
      )}
    </div>
  );
}

function NameCard({
  kind,
  value,
  text,
}: {
  kind: string;
  value: number;
  text?: string;
}) {
  const isMaster = MASTER_SET.has(value);
  return (
    <div className="card p-5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-2">
        {kind}
      </p>
      <span
        className="num-display text-5xl leading-none mt-1 block"
        style={{
          color: isMaster ? "var(--color-gold)" : "var(--color-text-strong)",
        }}
      >
        {value}
      </span>
      {text && (
        <p className="text-text/85 text-[14px] mt-3 leading-relaxed">{text}</p>
      )}
    </div>
  );
}

function CycleRow({
  label,
  number,
  fromAge,
  toAge,
  active,
  description,
  tone,
}: {
  label: string;
  number: number;
  fromAge: number | null;
  toAge: number | null;
  active: boolean;
  description: string;
  tone?: "danger";
}) {
  const isMaster = MASTER_SET.has(number);
  const accent = tone === "danger" ? "var(--color-danger)" : "var(--color-gold)";
  const range = formatAgeRange(fromAge, toAge);
  return (
    <div
      className={[
        "grid grid-cols-[80px_1fr] sm:grid-cols-[120px_1fr] items-center gap-3 sm:gap-5 px-4 sm:px-5 py-4 rounded-xl border transition",
        active
          ? "bg-ink-2/80"
          : "bg-ink-1/40 hover:bg-ink-1",
      ].join(" ")}
      style={{
        borderColor: active ? `${accent}66` : "var(--color-line-soft)",
      }}
    >
      <div className="flex flex-col items-center">
        <span
          className="num-display text-4xl sm:text-5xl leading-none"
          style={{
            color: isMaster
              ? "var(--color-gold)"
              : active
                ? "var(--color-text-strong)"
                : "var(--color-text)",
          }}
        >
          {number}
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-2 mt-1.5 text-center">
          {range}
        </span>
      </div>
      <div className="min-w-0">
        <p
          className="display text-base sm:text-lg text-text-strong"
          style={{ color: active ? accent : undefined }}
        >
          {label}
        </p>
        <p className="text-text/85 text-[14px] mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  hint,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
}) {
  return (
    <div className="mb-4 sm:mb-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
        {eyebrow}
      </p>
      <h2 className="display text-2xl sm:text-3xl text-text-strong mt-1">
        {title}
      </h2>
      {hint && <p className="text-[13px] text-muted mt-1">{hint}</p>}
    </div>
  );
}

function ageFromBirth(birth: { day: number; month: number; year: number }, today: Date): number {
  let age = today.getFullYear() - birth.year;
  const m = today.getMonth() + 1 - birth.month;
  if (m < 0 || (m === 0 && today.getDate() < birth.day)) age -= 1;
  return Math.max(0, age);
}

function formatAgeRange(from: number | null, to: number | null): string {
  if (from === null && to === null) return "lifelong";
  if (to === null) return `${from}+`;
  return `${from} – ${to}`;
}
