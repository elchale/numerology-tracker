import type { BirthDate } from "./types";
import { lifePath, reduce } from "./numerology";

const KARMIC = new Set([13, 14, 16, 19]);
const MASTER = new Set([11, 22, 33]);

/**
 * Reduce all the way to a single digit — master numbers NOT preserved.
 * Used in Challenge math, where master numbers are reduced before subtraction.
 */
function reduceToSingle(n: number): number {
  let v = Math.abs(n);
  while (v > 9) {
    let s = 0;
    let x = v;
    while (x > 0) {
      s += x % 10;
      x = Math.floor(x / 10);
    }
    v = s;
  }
  return v;
}

/* ----------------------------- Birthday Number ----------------------------- */

export function birthdayNumber(birth: BirthDate): {
  raw: number;
  reduced: number;
  isKarmic: boolean;
  karmicSource?: 13 | 14 | 16 | 19;
} {
  const raw = birth.day;
  const reduced = reduce(raw);
  const isKarmic = KARMIC.has(raw);
  return {
    raw,
    reduced,
    isKarmic,
    karmicSource: isKarmic ? (raw as 13 | 14 | 16 | 19) : undefined,
  };
}

/* ----------------------------- Attitude Number ----------------------------- */
/** reduce(month) + reduce(day), reduced — same shape as the First Pinnacle. */
export function attitudeNumber(birth: BirthDate): number {
  return reduce(reduce(birth.month) + reduce(birth.day));
}

/* --------------------------------- Pinnacles -------------------------------- */
/**
 * Four Pinnacle cycles. Master numbers are preserved. Age windows follow the
 * Hans Decoz convention: First runs to `36 - lifePath`, Second and Third each
 * last nine years, Fourth runs from then until the end of life.
 */
export interface Pinnacle {
  index: 1 | 2 | 3 | 4;
  number: number;
  fromAge: number;
  toAge: number | null;
}

export function pinnacles(birth: BirthDate): [Pinnacle, Pinnacle, Pinnacle, Pinnacle] {
  const m = reduce(birth.month);
  const d = reduce(birth.day);
  const y = reduce(birth.year);

  const p1 = reduce(m + d);
  const p2 = reduce(d + y);
  const p3 = reduce(p1 + p2);
  const p4 = reduce(m + y);

  const lp = lifePath(birth);
  const lpForAges = MASTER.has(lp) ? reduceToSingle(lp) : lp;
  const firstEnd = 36 - lpForAges;

  return [
    { index: 1, number: p1, fromAge: 0, toAge: firstEnd },
    { index: 2, number: p2, fromAge: firstEnd, toAge: firstEnd + 9 },
    { index: 3, number: p3, fromAge: firstEnd + 9, toAge: firstEnd + 18 },
    { index: 4, number: p4, fromAge: firstEnd + 18, toAge: null },
  ];
}

/* -------------------------------- Challenges ------------------------------- */
/**
 * Four Challenge numbers — opposite of Pinnacles. Master numbers are reduced
 * before subtraction (challenges are always 0-9, including 0). The Main
 * Challenge runs throughout life; the other three follow Pinnacle windows.
 */
export interface Challenge {
  kind: "first" | "second" | "main" | "fourth";
  number: number;
  fromAge: number;
  toAge: number | null;
  lifelong: boolean;
}

export function challenges(birth: BirthDate): [Challenge, Challenge, Challenge, Challenge] {
  const m = reduceToSingle(birth.month);
  const d = reduceToSingle(birth.day);
  const y = reduceToSingle(birth.year);

  const c1 = Math.abs(m - d);
  const c2 = Math.abs(d - y);
  const cMain = Math.abs(c1 - c2);
  const c4 = Math.abs(m - y);

  const lp = lifePath(birth);
  const lpForAges = MASTER.has(lp) ? reduceToSingle(lp) : lp;
  const firstEnd = 36 - lpForAges;

  return [
    { kind: "first", number: c1, fromAge: 0, toAge: firstEnd, lifelong: false },
    { kind: "second", number: c2, fromAge: firstEnd, toAge: firstEnd + 9, lifelong: false },
    { kind: "main", number: cMain, fromAge: 0, toAge: null, lifelong: true },
    { kind: "fourth", number: c4, fromAge: firstEnd + 18, toAge: null, lifelong: false },
  ];
}

/* --------------------------- Name-based numerology -------------------------- */
/**
 * Pythagorean letter → digit map. A=1 … I=9 wraps to J=1 … R=9, S=1 … Z=8.
 * Non-letters are ignored. Diacritics are stripped before mapping.
 */
const PYTHAGOREAN: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
};

const VOWELS = new Set(["A", "E", "I", "O", "U"]);

function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

export interface NameNumbers {
  expression: number;
  soulUrge: number;
  personality: number;
  letterCount: number;
}

/**
 * Compute Expression, Soul Urge, and Personality from a full birth name.
 * Returns null if the name contains no usable letters.
 *
 * - Expression: sum of every letter's value (preserves master).
 * - Soul Urge: sum of vowels only.
 * - Personality: sum of consonants only.
 *
 * Pythagorean convention: Y is treated as a consonant by default. Diacritics
 * are stripped, non-letters ignored. Master numbers are preserved.
 */
export function nameNumbers(fullName: string): NameNumbers | null {
  const cleaned = normalizeName(fullName);
  if (cleaned.length === 0) return null;

  let exprSum = 0;
  let vowelSum = 0;
  let consonantSum = 0;
  for (const ch of cleaned) {
    const v = PYTHAGOREAN[ch];
    if (v === undefined) continue;
    exprSum += v;
    if (VOWELS.has(ch)) vowelSum += v;
    else consonantSum += v;
  }

  return {
    expression: reduce(exprSum),
    soulUrge: reduce(vowelSum),
    personality: reduce(consonantSum),
    letterCount: cleaned.length,
  };
}

/* -------------------------------- Maturity --------------------------------- */
/** Active from roughly age 35 onward; combines who you are with where you're going. */
export function maturityNumber(lifePathValue: number, expression: number): number {
  return reduce(lifePathValue + expression);
}

/* ----------------------- Generic Life Path for any date --------------------- */
/** Same calculation as `lifePath(birth)` but for a free-standing date. */
export function lifePathFromDate(year: number, month: number, day: number): number {
  return reduce(reduce(day) + reduce(month) + reduce(year));
}
