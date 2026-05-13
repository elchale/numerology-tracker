import type {
  BirthDate,
  DayInfo,
  DayType,
  LuckyDay,
  MonthSummary,
  YearSummary,
} from "./types";

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
 * Returns the pre-reduced number BEFORE the final reduction step.
 * Used to detect karmic numbers (13, 14, 16, 19).
 */
function reduceTrack(n: number): { final: number; preFinal: number } {
  let value = Math.abs(n);
  let prev = value;
  while (value > 9 && !MASTER_NUMBERS.has(value)) {
    prev = value;
    value = digitSum(value);
  }
  return { final: value, preFinal: prev };
}

export function lifePath(birth: BirthDate): number {
  const d = reduce(birth.day);
  const m = reduce(birth.month);
  const y = reduce(birth.year);
  return reduce(d + m + y);
}

export function lifePathRaw(birth: BirthDate): { final: number; preFinal: number } {
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

function personalDayTrack(
  birth: BirthDate,
  year: number,
  month: number,
  day: number,
): { final: number; preFinal: number } {
  const base = personalMonth(birth, year, month) + reduce(day);
  return reduceTrack(base);
}

export function classifyDay(
  personalDayValue: number,
  preFinal: number,
  lifePathValue: number,
): { type: DayType; isKarmic: boolean; karmicSource?: 13 | 14 | 16 | 19 } {
  const isMaster = MASTER_NUMBERS.has(personalDayValue);
  const isKarmic = KARMIC_NUMBERS.has(preFinal);
  const karmicSource = isKarmic ? (preFinal as 13 | 14 | 16 | 19) : undefined;

  if (personalDayValue === 11) return { type: "master11", isKarmic, karmicSource };
  if (personalDayValue === 22) return { type: "master22", isKarmic, karmicSource };
  if (personalDayValue === 33) return { type: "master33", isKarmic, karmicSource };

  if (isKarmic) return { type: "karmic", isKarmic, karmicSource };

  if (!isMaster && personalDayValue === lifePathValue) {
    return { type: "peak", isKarmic, karmicSource };
  }

  switch (personalDayValue) {
    case 1:
      return { type: "newStart", isKarmic, karmicSource };
    case 2:
      return { type: "harmony", isKarmic, karmicSource };
    case 3:
      return { type: "creative", isKarmic, karmicSource };
    case 4:
      return { type: "neutral", isKarmic, karmicSource };
    case 5:
      return { type: "flow", isKarmic, karmicSource };
    case 6:
      return { type: "harmony", isKarmic, karmicSource };
    case 7:
      return { type: "rest", isKarmic, karmicSource };
    case 8:
      return { type: "abundance", isKarmic, karmicSource };
    case 9:
      return { type: "release", isKarmic, karmicSource };
    default:
      return { type: "neutral", isKarmic, karmicSource };
  }
}

export function getDayInfo(
  birth: BirthDate,
  year: number,
  month: number,
  day: number,
): DayInfo {
  const py = personalYear(birth, year);
  const pm = personalMonth(birth, year, month);
  const { final: pd, preFinal } = personalDayTrack(birth, year, month, day);
  const lp = lifePath(birth);
  const cls = classifyDay(pd, preFinal, lp);

  return {
    date: new Date(year, month - 1, day),
    personalYear: py,
    personalMonth: pm,
    personalDay: pd,
    type: cls.type,
    isMaster: MASTER_NUMBERS.has(pd),
    isKarmic: cls.isKarmic,
    karmicSource: cls.karmicSource,
    lifePathAlignment: pd === lp,
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

    if (isLucky && !info.isKarmic) {
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
  const karmicDays: number[] = [];

  for (let d = 1; d <= total; d += 1) {
    const info = getDayInfo(birth, year, month, d);
    if (info.lifePathAlignment && !info.isMaster) peakDays.push(d);
    if (info.isMaster) masterDays.push(d);
    if (info.isKarmic) karmicDays.push(d);
  }

  return { year, month, personalMonth: pm, peakDays, masterDays, karmicDays };
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
 */
export function universalDay(year: number, month: number, day: number): number {
  return reduce(reduce(year) + reduce(month) + reduce(day));
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
