import type {
  BirthDate,
  DayInfo,
  DayType,
  LuckyDay,
  MonthSummary,
  YearSummary,
} from "./types";
import { COMPATIBILITY } from "./meanings";

const MASTER_NUMBERS = new Set([11, 22, 33]);
const KARMIC_NUMBERS = new Set([13, 14, 16, 19]);

function digitSum(n: number): number {
  let total = 0;
  let x = Math.abs(n);
  while (x > 0) {
    total += x % 10;
    x = Math.floor(x / 10);
  }
  return total;
}

/**
 * Reduces a number to a single digit, preserving master numbers (11, 22, 33).
 */
export function reduce(n: number): number {
  let value = Math.abs(n);
  while (value > 9 && !MASTER_NUMBERS.has(value)) {
    value = digitSum(value);
  }
  return value;
}

/**
 * Reduces fully to a single digit — master numbers are NOT preserved.
 * Used for universal/global cycle numbers, which are not a personal-chart
 * concept and so do not carry master vibrations.
 */
function reduceToSingle(n: number): number {
  let value = Math.abs(n);
  while (value > 9) {
    value = digitSum(value);
  }
  return value;
}

/**
 * Reduces to a single digit (or master number) while scanning every
 * intermediate value for a karmic-debt hit. Karmic debt applies whenever
 * 13, 14, 16, or 19 appears ANYWHERE in the reduction chain — not just
 * the last two-digit step. Example: 19 → 10 → 1 still carries karmic 19.
 */
type KarmicNumber = 13 | 14 | 16 | 19;

function reduceTrack(n: number): { final: number; karmicHit?: KarmicNumber } {
  let value = Math.abs(n);
  let karmicHit: KarmicNumber | undefined;
  if (KARMIC_NUMBERS.has(value)) karmicHit = value as KarmicNumber;
  while (value > 9 && !MASTER_NUMBERS.has(value)) {
    value = digitSum(value);
    if (!karmicHit && KARMIC_NUMBERS.has(value)) {
      karmicHit = value as KarmicNumber;
    }
  }
  return { final: value, karmicHit };
}

export function lifePath(birth: BirthDate): number {
  const d = reduce(birth.day);
  const m = reduce(birth.month);
  const y = reduce(birth.year);
  return reduce(d + m + y);
}

/**
 * Life Path with karmic-debt tracking. Karmic debt belongs to the Life Path
 * only when its OWN calculation total (the summed reduced components) is
 * 13/14/16/19. A karmic birth day (born on the 13th, etc.) produces a karmic
 * Birthday Number — a separate core number — and is surfaced there, not here.
 */
export function lifePathRaw(
  birth: BirthDate,
): { final: number; karmicHit?: KarmicNumber } {
  const d = reduce(birth.day);
  const m = reduce(birth.month);
  const y = reduce(birth.year);
  return reduceTrack(d + m + y);
}

export function personalYear(birth: BirthDate, year: number): number {
  return reduce(reduce(birth.day) + reduce(birth.month) + reduce(year));
}

export function personalMonth(
  birth: BirthDate,
  year: number,
  month: number,
): number {
  return reduce(personalYear(birth, year) + reduce(month));
}

export function personalDay(
  birth: BirthDate,
  year: number,
  month: number,
  day: number,
): number {
  return reduce(personalMonth(birth, year, month) + reduce(day));
}

/**
 * Classifies a Personal Day by its number. Karmic debt is deliberately NOT a
 * day type: karmic-debt numbers are a property of the natal core numbers
 * (Life Path, Expression, Soul Urge, Personality, Birthday), not of transient
 * cycles like the Personal Day.
 */
export function classifyDay(
  personalDayValue: number,
  lifePathValue: number,
): DayType {
  if (personalDayValue === 11) return "master11";
  if (personalDayValue === 22) return "master22";
  if (personalDayValue === 33) return "master33";

  if (personalDayValue === lifePathValue) return "peak";

  switch (personalDayValue) {
    case 1:
      return "newStart";
    case 2:
      return "harmony";
    case 3:
      return "creative";
    case 4:
      return "neutral";
    case 5:
      return "flow";
    case 6:
      return "harmony";
    case 7:
      return "rest";
    case 8:
      return "abundance";
    case 9:
      return "release";
    default:
      return "neutral";
  }
}

/**
 * A "friction day" runs a Personal Day number that sits in the friction set
 * of the person's Life Path (per the number-compatibility table). The day is
 * still workable — its energy simply pulls against the grain of who they are.
 * Master days and Life Path peak days are never friction days.
 */
export function isFrictionDay(
  personalDayValue: number,
  lifePathValue: number,
): boolean {
  if (MASTER_NUMBERS.has(personalDayValue)) return false;
  if (personalDayValue === lifePathValue) return false;
  const lpRoot = MASTER_NUMBERS.has(lifePathValue)
    ? digitSum(lifePathValue)
    : lifePathValue;
  return COMPATIBILITY[lpRoot]?.friction.includes(personalDayValue) ?? false;
}

export function getDayInfo(
  birth: BirthDate,
  year: number,
  month: number,
  day: number,
): DayInfo {
  const py = personalYear(birth, year);
  const pm = personalMonth(birth, year, month);
  const pd = personalDay(birth, year, month, day);
  const lp = lifePath(birth);

  return {
    date: new Date(year, month - 1, day),
    personalYear: py,
    personalMonth: pm,
    personalDay: pd,
    type: classifyDay(pd, lp),
    isMaster: MASTER_NUMBERS.has(pd),
    lifePathAlignment: pd === lp,
    frictionDay: isFrictionDay(pd, lp),
  };
}

export function getNextLuckyDays(
  birth: BirthDate,
  from: Date,
  count = 6,
): LuckyDay[] {
  const out: LuckyDay[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);

  let safety = 0;
  while (out.length < count && safety < 400) {
    safety += 1;
    const y = cursor.getFullYear();
    const m = cursor.getMonth() + 1;
    const d = cursor.getDate();
    const info = getDayInfo(birth, y, m, d);

    const isLucky =
      info.isMaster ||
      info.lifePathAlignment ||
      info.personalDay === 1 ||
      info.personalDay === 3 ||
      info.personalDay === 8;

    if (isLucky && !info.frictionDay) {
      const reason =
        info.isMaster
          ? `Master ${info.personalDay} energy`
          : info.lifePathAlignment
            ? `Life Path alignment (${info.personalDay})`
            : info.personalDay === 1
              ? "Fresh start"
              : info.personalDay === 3
                ? "Creative expansion"
                : "Abundance flow";
      out.push({
        date: new Date(cursor),
        personalDay: info.personalDay,
        type: info.type,
        reason,
      });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return out;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getMonthSummary(
  birth: BirthDate,
  year: number,
  month: number,
): MonthSummary {
  const pm = personalMonth(birth, year, month);
  const total = daysInMonth(year, month);
  const peakDays: number[] = [];
  const masterDays: number[] = [];
  const frictionDays: number[] = [];

  for (let d = 1; d <= total; d += 1) {
    const info = getDayInfo(birth, year, month, d);
    if (info.lifePathAlignment && !info.isMaster) peakDays.push(d);
    if (info.isMaster) masterDays.push(d);
    if (info.frictionDay) frictionDays.push(d);
  }

  return { year, month, personalMonth: pm, peakDays, masterDays, frictionDays };
}

export function getYearSummary(birth: BirthDate, year: number): YearSummary {
  const py = personalYear(birth, year);
  const lp = lifePath(birth);
  const monthly: MonthSummary[] = [];
  let peakCount = 0;
  let masterCount = 0;

  for (let m = 1; m <= 12; m += 1) {
    const sum = getMonthSummary(birth, year, m);
    monthly.push(sum);
    peakCount += sum.peakDays.length;
    masterCount += sum.masterDays.length;
  }

  return {
    year,
    personalYear: py,
    monthly,
    peakCount,
    masterCount,
    isMasterYear: MASTER_NUMBERS.has(py),
    isLifePathYear: py === lp,
  };
}

/**
 * Universal day number — independent of birth, for shared/global energy.
 * Universal cycles reduce fully to a single digit; master numbers are a
 * personal-chart concept and are not preserved here.
 */
export function universalDay(year: number, month: number, day: number): number {
  return reduceToSingle(
    reduceToSingle(year) + reduceToSingle(month) + reduceToSingle(day),
  );
}

/**
 * Hour numerology — optional layer using birth time.
 */
export function birthHourNumber(birth: BirthDate): number | null {
  if (birth.hour == null || birth.minute == null) return null;
  return reduce(birth.hour + birth.minute);
}

export function isValidBirthDate(b: Partial<BirthDate>): b is BirthDate {
  if (!b.day || !b.month || !b.year) return false;
  if (b.month < 1 || b.month > 12) return false;
  if (b.year < 1900 || b.year > 2200) return false;
  const dim = daysInMonth(b.year, b.month);
  if (b.day < 1 || b.day > dim) return false;
  if (b.hour != null && (b.hour < 0 || b.hour > 23)) return false;
  if (b.minute != null && (b.minute < 0 || b.minute > 59)) return false;
  return true;
}
