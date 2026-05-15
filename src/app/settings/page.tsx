"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useConfig, useHydrated } from "@/store/useConfig";
import { isValidBirthDate, lifePath, lifePathRaw } from "@/lib/numerology";
import { LIFE_PATH_MEANINGS, KARMIC_MEANINGS } from "@/lib/meanings";
import type { BirthDate } from "@/lib/types";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function SettingsPage() {
  const hydrated = useHydrated();
  const birth = useConfig((s) => s.birth);
  const name = useConfig((s) => s.name);
  const fullName = useConfig((s) => s.fullName);

  if (!hydrated) return null;

  return (
    <SettingsForm
      key={birth ? `${birth.day}-${birth.month}-${birth.year}` : "empty"}
      initialBirth={birth}
      initialName={name}
      initialFullName={fullName}
    />
  );
}

function SettingsForm({
  initialBirth,
  initialName,
  initialFullName,
}: {
  initialBirth: BirthDate | null;
  initialName: string;
  initialFullName: string;
}) {
  const router = useRouter();
  const setBirth = useConfig((s) => s.setBirth);
  const setName = useConfig((s) => s.setName);
  const setFullName = useConfig((s) => s.setFullName);
  const reset = useConfig((s) => s.reset);

  const [formName, setFormName] = useState(initialName);
  const [formFullName, setFormFullName] = useState(initialFullName);
  const [day, setDay] = useState(initialBirth ? String(initialBirth.day) : "");
  const [month, setMonth] = useState(initialBirth ? String(initialBirth.month) : "");
  const [year, setYear] = useState(initialBirth ? String(initialBirth.year) : "");
  const [hour, setHour] = useState(
    initialBirth?.hour != null ? String(initialBirth.hour) : "",
  );
  const [minute, setMinute] = useState(
    initialBirth?.minute != null ? String(initialBirth.minute) : "",
  );
  const [touched, setTouched] = useState(false);

  const candidate = useMemo(() => {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    const h = hour === "" ? undefined : parseInt(hour, 10);
    const mi = minute === "" ? undefined : parseInt(minute, 10);
    if (Number.isNaN(d) || Number.isNaN(m) || Number.isNaN(y)) return null;
    const obj = { day: d, month: m, year: y, hour: h, minute: mi };
    return isValidBirthDate(obj) ? obj : null;
  }, [day, month, year, hour, minute]);

  const preview = useMemo(() => {
    if (!candidate) return null;
    const lp = lifePath(candidate);
    const raw = lifePathRaw(candidate);
    const meaning = LIFE_PATH_MEANINGS[lp];
    const karmic = raw.karmicHit ? KARMIC_MEANINGS[raw.karmicHit] : null;
    return { lp, meaning, karmic };
  }, [candidate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!candidate) return;
    setName(formName.trim());
    setFullName(formFullName.trim());
    setBirth(candidate);
    router.push("/");
  };

  const handleReset = () => {
    if (confirm("Clear birth date and name from this device?")) {
      reset();
      setFormName("");
      setFormFullName("");
      setDay("");
      setMonth("");
      setYear("");
      setHour("");
      setMinute("");
    }
  };

  return (
    <div className="anim-fade-up">
      <header className="mb-8 sm:mb-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
          Setup
        </p>
        <h1 className="display text-3xl sm:text-5xl text-text-strong mt-1">
          {initialBirth ? "Your details" : "Begin with your birth"}
        </h1>
        <p className="text-muted mt-3 max-w-xl text-[15px] leading-relaxed">
          Numerology starts from the moment you arrived. Your date is required;
          birth time is optional and unlocks the hour layer.
          All data stays on this device — nothing is sent to a server.
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6 lg:gap-10 items-start">
        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-[11px] uppercase tracking-[0.22em] text-muted-2 mb-2"
            >
              Name
            </label>
            <input
              id="name"
              className="field"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="What should we call you?"
              autoComplete="off"
              maxLength={40}
            />
          </div>

          <div>
            <label
              htmlFor="fullName"
              className="block text-[11px] uppercase tracking-[0.22em] text-muted-2 mb-2"
            >
              Full birth name{" "}
              <span className="text-muted-2 normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <input
              id="fullName"
              className="field"
              value={formFullName}
              onChange={(e) => setFormFullName(e.target.value)}
              placeholder="First Middle Last — as on your birth certificate"
              autoComplete="off"
              maxLength={120}
            />
            <p className="text-xs text-muted-2 mt-2">
              Used for Expression, Soul Urge, Personality, and Maturity numbers.
              Use the name on your birth certificate for accuracy.
            </p>
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2 mb-2">
              Birth date
            </p>
            <div className="grid grid-cols-[1fr_1fr_1.4fr] gap-2 sm:gap-3">
              <div>
                <label htmlFor="day" className="sr-only">
                  Day
                </label>
                <input
                  id="day"
                  className="field text-center"
                  inputMode="numeric"
                  placeholder="DD"
                  value={day}
                  onChange={(e) =>
                    setDay(e.target.value.replace(/\D/g, "").slice(0, 2))
                  }
                  maxLength={2}
                />
              </div>
              <div>
                <label htmlFor="month" className="sr-only">
                  Month
                </label>
                <select
                  id="month"
                  className="field text-center"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="">MM</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {String(i + 1).padStart(2, "0")} — {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="year" className="sr-only">
                  Year
                </label>
                <input
                  id="year"
                  className="field text-center"
                  inputMode="numeric"
                  placeholder="YYYY"
                  value={year}
                  onChange={(e) =>
                    setYear(e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  maxLength={4}
                />
              </div>
            </div>
            {touched && !candidate && (day || month || year) && (
              <p className="text-[12px] text-danger mt-2">
                That date isn&apos;t valid. Check the day for the chosen month.
              </p>
            )}
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2 mb-2">
              Birth time{" "}
              <span className="text-muted-2 normal-case tracking-normal">
                (optional)
              </span>
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-xs">
              <input
                aria-label="Hour"
                className="field text-center"
                inputMode="numeric"
                placeholder="HH"
                value={hour}
                onChange={(e) =>
                  setHour(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
                maxLength={2}
              />
              <input
                aria-label="Minute"
                className="field text-center"
                inputMode="numeric"
                placeholder="MM"
                value={minute}
                onChange={(e) =>
                  setMinute(e.target.value.replace(/\D/g, "").slice(0, 2))
                }
                maxLength={2}
              />
            </div>
            <p className="text-xs text-muted-2 mt-2">
              24-hour format. Leave blank if you don&apos;t know it.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-line-soft">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!candidate}
              style={
                !candidate ? { opacity: 0.5, cursor: "not-allowed" } : undefined
              }
            >
              {initialBirth ? "Save changes" : "Begin"}
              <ArrowRight size={16} strokeWidth={2} aria-hidden />
            </button>
            {initialBirth && (
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-ghost"
              >
                Clear all
              </button>
            )}
          </div>
        </form>

        <aside className="card p-6 sm:p-7">
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
            Preview
          </p>
          {preview ? (
            <div className="mt-3 anim-fade-up">
              <div className="flex items-end gap-4 mb-4">
                <span
                  className="num-display text-7xl sm:text-8xl leading-none"
                  style={{
                    color: [11, 22, 33].includes(preview.lp)
                      ? "var(--color-gold)"
                      : "var(--color-text-strong)",
                  }}
                >
                  {preview.lp}
                </span>
                <div className="pb-2">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-2">
                    Life path
                  </p>
                  {preview.meaning && (
                    <p className="display text-2xl text-text-strong leading-tight mt-1">
                      {preview.meaning.title}
                    </p>
                  )}
                </div>
              </div>
              {preview.meaning && (
                <p className="text-[14.5px] text-text leading-relaxed">
                  {preview.meaning.essence}
                </p>
              )}
              {preview.karmic && (
                <div className="mt-4 rounded-xl border border-danger/40 bg-danger/5 p-4">
                  <p className="display text-danger text-base">
                    {preview.karmic.title}
                  </p>
                  <p className="text-[13px] text-text/80 mt-1">
                    {preview.karmic.lesson}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-3 text-muted text-sm">
              <p>Fill in your date to see your Life Path appear here.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
