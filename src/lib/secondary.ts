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
 * Four Challenge numbers — the flip side of the Pinnacles, occupying the same
 * four age periods one-to-one (First, Second, Main/Third, Fourth). Master
 * numbers are reduced to single digits before subtraction, so every Challenge
 * falls in 0-9 (including 0). The Main Challenge is the most influential.
 */
export interface Challenge {
  kind: "first" | "second" | "main" | "fourth";
  number: number;
  fromAge: number;
  toAge: number | null;
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
    { kind: "first", number: c1, fromAge: 0, toAge: firstEnd },
    { kind: "second", number: c2, fromAge: firstEnd, toAge: firstEnd + 9 },
    { kind: "main", number: cMain, fromAge: firstEnd + 9, toAge: firstEnd + 18 },
    { kind: "fourth", number: c4, fromAge: firstEnd + 18, toAge: null },
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

/** A, E, I, O, U are always vowels. Y is decided contextually (see below). */
const HARD_VOWELS = new Set(["A", "E", "I", "O", "U"]);

/** Strip diacritics, uppercase, keep A-Z only. */
function cleanToken(token: string): string {
  return token
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

/**
 * Whether the letter at `index` of a cleaned name part counts as a vowel for
 * the Soul Urge / Personality split. A, E, I, O, U always do. Y is contextual:
 * it acts as a vowel when it carries the vowel sound of its syllable —
 * practically, when neither neighbouring letter is a hard vowel (Lynn,
 * Yvonne, Bryn, Carolyn, Mary). Beside a hard vowel it is the consonant
 * glide (Yolanda, Maya).
 */
function isVowelAt(part: string, index: number): boolean {
  const ch = part[index];
  if (HARD_VOWELS.has(ch)) return true;
  if (ch !== "Y") return false;
  const prev = part[index - 1];
  const next = part[index + 1];
  const prevIsVowel = prev !== undefined && HARD_VOWELS.has(prev);
  const nextIsVowel = next !== undefined && HARD_VOWELS.has(next);
  return !prevIsVowel && !nextIsVowel;
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
 * - Expression: every letter's value.
 * - Soul Urge: vowels only.
 * - Personality: consonants only.
 *
 * Decoz method: each name part (first, middle, last) is summed and reduced
 * ON ITS OWN — preserving master numbers per part — then the reduced parts
 * are added and reduced. This differs from summing every letter at once
 * whenever a part lands on a master number. Y is classified contextually.
 */
export function nameNumbers(fullName: string): NameNumbers | null {
  const parts = fullName
    .split(/\s+/)
    .map(cleanToken)
    .filter((p) => p.length > 0);
  if (parts.length === 0) return null;

  let exprTotal = 0;
  let vowelTotal = 0;
  let consonantTotal = 0;
  let letterCount = 0;

  for (const part of parts) {
    let expr = 0;
    let vowels = 0;
    let consonants = 0;
    for (let i = 0; i < part.length; i += 1) {
      const value = PYTHAGOREAN[part[i]];
      expr += value;
      if (isVowelAt(part, i)) vowels += value;
      else consonants += value;
    }
    exprTotal += reduce(expr);
    vowelTotal += reduce(vowels);
    consonantTotal += reduce(consonants);
    letterCount += part.length;
  }

  return {
    expression: reduce(exprTotal),
    soulUrge: reduce(vowelTotal),
    personality: reduce(consonantTotal),
    letterCount,
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
