/**
 * Astronomical ephemeris — self-contained implementations of the algorithms in
 * Jean Meeus, *Astronomical Algorithms* (2nd ed.).
 *
 * Everything here is deterministic maths: no network, no data tables that go
 * stale. Moon phases, solar/lunar longitude and the solstice/equinox instants
 * are therefore correct for any year the app can display.
 *
 * Accuracy: moon phases ~2 minutes, seasons ~1 minute, solar longitude ~0.01°,
 * lunar longitude ~0.01°. All are far tighter than "which calendar day is this",
 * which is the only thing the UI needs.
 */

const RAD = Math.PI / 180;
const J2000 = 2451545.0;

const sin = (deg: number) => Math.sin(deg * RAD);
const cos = (deg: number) => Math.cos(deg * RAD);

/** Julian centuries from J2000.0 */
function centuries(jd: number): number {
  return (jd - J2000) / 36525;
}

/**
 * ΔT — the gap between Terrestrial Time (which the algorithms return) and the
 * Universal Time our clocks run on. Espenak & Meeus polynomial for 2005–2050,
 * which is the range that matters here; outside it the error stays well under
 * the resolution we care about.
 */
function deltaTSeconds(year: number): number {
  const t = year - 2000;
  return 62.92 + 0.32217 * t + 0.005589 * t * t;
}

/** Julian Day (UT) for a JavaScript Date. */
export function toJulianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

/** JavaScript Date for a Julian Day expressed in UT. */
export function fromJulianDay(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

/** Converts a Terrestrial-Time Julian Day to a UT Date. */
function fromJulianDayTT(jde: number, year: number): Date {
  return fromJulianDay(jde - deltaTSeconds(year) / 86400);
}

/* ------------------------------------------------------------------ *
 * Zodiac
 * ------------------------------------------------------------------ */

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

/** Tropical sign occupied by an ecliptic longitude in degrees. */
export function signForLongitude(longitude: number): ZodiacSign {
  const norm = ((longitude % 360) + 360) % 360;
  return ZODIAC_SIGNS[Math.floor(norm / 30)];
}

/* ------------------------------------------------------------------ *
 * Sun — Meeus ch. 25 (low accuracy solar position)
 * ------------------------------------------------------------------ */

/** Apparent geocentric ecliptic longitude of the Sun, in degrees. */
export function solarLongitude(jd: number): number {
  const t = centuries(jd);
  const l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  const m = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;

  const c =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * sin(m) +
    (0.019993 - 0.000101 * t) * sin(2 * m) +
    0.000289 * sin(3 * m);

  const trueLongitude = l0 + c;
  const omega = 125.04 - 1934.136 * t;
  const apparent = trueLongitude - 0.00569 - 0.00478 * sin(omega);

  return ((apparent % 360) + 360) % 360;
}

/* ------------------------------------------------------------------ *
 * Moon — Meeus ch. 47 (truncated to the terms that matter at our resolution)
 * ------------------------------------------------------------------ */

/** [D, M, M', F, coefficient in 1e-6 degrees] */
const MOON_LONGITUDE_TERMS: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [0, 0, 1, 0, 6288774],
  [2, 0, -1, 0, 1274027],
  [2, 0, 0, 0, 658314],
  [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116],
  [0, 0, 0, 2, -114332],
  [2, 0, -2, 0, 58793],
  [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322],
  [2, -1, 0, 0, 45758],
  [0, 1, -1, 0, -40923],
  [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383],
  [2, 0, 0, -2, 15327],
  [0, 0, 1, 2, -12528],
  [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675],
  [0, 0, 3, 0, 10034],
  [4, 0, -2, 0, 8548],
  [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766],
  [1, 0, -1, 0, -5163],
  [1, 1, 0, 0, 4987],
  [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994],
  [4, 0, 0, 0, 3861],
  [2, 0, -3, 0, 3665],
  [0, 1, -2, 0, -2689],
];

/** Apparent geocentric ecliptic longitude of the Moon, in degrees. */
export function lunarLongitude(jd: number): number {
  const t = centuries(jd);
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t3 * t;

  const lPrime =
    218.3164477 + 481267.88123421 * t - 0.0015786 * t2 + t3 / 538841 - t4 / 65194000;
  const d =
    297.8501921 + 445267.1114034 * t - 0.0018819 * t2 + t3 / 545868 - t4 / 113065000;
  const m = 357.5291092 + 35999.0502909 * t - 0.0001536 * t2 + t3 / 24490000;
  const mPrime =
    134.9633964 + 477198.8675055 * t + 0.0087414 * t2 + t3 / 69699 - t4 / 14712000;
  const f =
    93.272095 + 483202.0175233 * t - 0.0036539 * t2 - t3 / 3526000 + t4 / 863310000;

  // Eccentricity correction for terms involving the Sun's anomaly.
  const e = 1 - 0.002516 * t - 0.0000074 * t2;

  let sum = 0;
  for (const [cd, cm, cmp, cf, coefficient] of MOON_LONGITUDE_TERMS) {
    const argument = cd * d + cm * m + cmp * mPrime + cf * f;
    const eccentricity = cm === 0 ? 1 : Math.abs(cm) === 1 ? e : e * e;
    sum += coefficient * eccentricity * sin(argument);
  }

  const longitude = lPrime + sum / 1e6;
  return ((longitude % 360) + 360) % 360;
}

/**
 * Illuminated fraction of the Moon's disc, 0–1. Derived from the elongation
 * between the two longitudes, which is accurate enough for a phase readout.
 */
export function lunarIllumination(jd: number): number {
  const elongation = lunarLongitude(jd) - solarLongitude(jd);
  return (1 - cos(elongation)) / 2;
}

/* ------------------------------------------------------------------ *
 * Moon phases — Meeus ch. 49
 * ------------------------------------------------------------------ */

export type MoonPhaseKind = "new" | "firstQuarter" | "full" | "lastQuarter";

export interface MoonPhase {
  kind: MoonPhaseKind;
  date: Date;
  /** Tropical sign the Moon occupies at the exact instant of the phase. */
  sign: ZodiacSign;
  /** True when this is the second full moon inside one calendar month. */
  blueMoon?: boolean;
  /** True when the phase falls unusually close to lunar perigee. */
  superMoon?: boolean;
}

const PHASE_OFFSETS: Record<MoonPhaseKind, number> = {
  new: 0,
  firstQuarter: 0.25,
  full: 0.5,
  lastQuarter: 0.75,
};

/** Meeus 49.1 — mean phase, then the periodic corrections for the exact one. */
function phaseJde(k: number, kind: MoonPhaseKind): number {
  const t = k / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;
  const t4 = t3 * t;

  let jde =
    2451550.09766 +
    29.530588861 * k +
    0.00015437 * t2 -
    0.00000015 * t3 +
    0.00000000073 * t4;

  const e = 1 - 0.002516 * t - 0.0000074 * t2;
  const m = 2.5534 + 29.1053567 * k - 0.0000014 * t2 - 0.00000011 * t3;
  const mPrime =
    201.5643 + 385.81693528 * k + 0.0107582 * t2 + 0.00001238 * t3 - 0.000000058 * t4;
  const f =
    160.7108 + 390.67050284 * k - 0.0016118 * t2 - 0.00000227 * t3 + 0.000000011 * t4;
  const omega = 124.7746 - 1.56375588 * k + 0.0020672 * t2 + 0.00000215 * t3;

  if (kind === "new" || kind === "full") {
    // The two series differ only in their leading coefficients.
    const a = kind === "new" ? -0.4072 : -0.40614;
    const b = kind === "new" ? 0.17241 : 0.17302;
    const c = kind === "new" ? 0.01608 : 0.01614;
    const d = kind === "new" ? 0.01039 : 0.01043;
    const g = kind === "new" ? 0.00739 : 0.00734;
    const h = kind === "new" ? -0.00514 : -0.00515;
    const i = kind === "new" ? 0.00208 : 0.00209;

    jde +=
      a * sin(mPrime) +
      b * e * sin(m) +
      c * sin(2 * mPrime) +
      d * sin(2 * f) +
      g * e * sin(mPrime - m) +
      h * e * sin(mPrime + m) +
      i * e * e * sin(2 * m) -
      0.00111 * sin(mPrime - 2 * f) -
      0.00057 * sin(mPrime + 2 * f) +
      0.00056 * e * sin(2 * mPrime + m) -
      0.00042 * sin(3 * mPrime) +
      0.00042 * e * sin(m + 2 * f) +
      0.00038 * e * sin(m - 2 * f) -
      0.00024 * e * sin(2 * mPrime - m) -
      0.00017 * sin(omega) -
      0.00007 * sin(mPrime + 2 * m) +
      0.00004 * sin(2 * mPrime - 2 * f) +
      0.00004 * sin(3 * m) +
      0.00003 * sin(mPrime + m - 2 * f) +
      0.00003 * sin(2 * mPrime + 2 * f) -
      0.00003 * sin(mPrime + m + 2 * f) +
      0.00003 * sin(mPrime - m + 2 * f) -
      0.00002 * sin(mPrime - m - 2 * f) -
      0.00002 * sin(3 * mPrime + m) +
      0.00002 * sin(4 * mPrime);
  } else {
    jde +=
      -0.62801 * sin(mPrime) +
      0.17172 * e * sin(m) -
      0.01183 * e * sin(mPrime + m) +
      0.00862 * sin(2 * mPrime) +
      0.00804 * sin(2 * f) +
      0.00454 * e * sin(mPrime - m) +
      0.00204 * e * e * sin(2 * m) -
      0.0018 * sin(mPrime - 2 * f) -
      0.0007 * sin(mPrime + 2 * f) -
      0.0004 * sin(3 * mPrime) -
      0.00034 * e * sin(2 * mPrime - m) +
      0.00032 * e * sin(m + 2 * f) +
      0.00032 * e * sin(m - 2 * f) -
      0.00028 * e * e * sin(mPrime + 2 * m) +
      0.00027 * e * sin(2 * mPrime + m) -
      0.00017 * sin(omega) -
      0.00005 * sin(mPrime - m - 2 * f) +
      0.00004 * sin(2 * mPrime + 2 * f) -
      0.00004 * sin(mPrime + m + 2 * f) +
      0.00004 * sin(mPrime - 2 * m) +
      0.00003 * sin(mPrime + m - 2 * f) +
      0.00003 * sin(3 * m) +
      0.00002 * sin(2 * mPrime - 2 * f) +
      0.00002 * sin(mPrime - m + 2 * f) -
      0.00002 * sin(3 * mPrime + m);

    const w =
      0.00306 -
      0.00038 * e * cos(m) +
      0.00026 * cos(mPrime) -
      0.00002 * cos(mPrime - m) +
      0.00002 * cos(mPrime + m) +
      0.00002 * cos(2 * f);

    jde += kind === "firstQuarter" ? w : -w;
  }

  // Planetary perturbations, common to all four phases.
  const a1 = 299.77 + 0.107408 * k - 0.009173 * t2;
  const a2 = 251.88 + 0.016321 * k;
  const a3 = 251.83 + 26.651886 * k;
  const a4 = 349.42 + 36.412478 * k;
  const a5 = 84.66 + 18.206239 * k;
  const a6 = 141.74 + 53.303771 * k;
  const a7 = 207.14 + 2.453732 * k;
  const a8 = 154.84 + 7.30686 * k;
  const a9 = 34.52 + 27.261239 * k;
  const a10 = 207.19 + 0.121824 * k;
  const a11 = 291.34 + 1.844379 * k;
  const a12 = 161.72 + 24.198154 * k;
  const a13 = 239.56 + 25.513099 * k;
  const a14 = 331.55 + 3.592518 * k;

  jde +=
    0.000325 * sin(a1) +
    0.000165 * sin(a2) +
    0.000164 * sin(a3) +
    0.000126 * sin(a4) +
    0.00011 * sin(a5) +
    0.000062 * sin(a6) +
    0.00006 * sin(a7) +
    0.000056 * sin(a8) +
    0.000047 * sin(a9) +
    0.000042 * sin(a10) +
    0.00004 * sin(a11) +
    0.000037 * sin(a12) +
    0.000035 * sin(a13) +
    0.000023 * sin(a14);

  return jde;
}

/**
 * Distance from the Moon to the Earth in km at a given instant — used only to
 * decide whether a full/new moon is close enough to perigee to call a
 * "supermoon". Meeus ch. 47, radius series truncated to its dominant terms.
 */
function lunarDistanceKm(jd: number): number {
  const t = centuries(jd);
  const t2 = t * t;
  const t3 = t2 * t;

  const d = 297.8501921 + 445267.1114034 * t - 0.0018819 * t2 + t3 / 545868;
  const m = 357.5291092 + 35999.0502909 * t - 0.0001536 * t2;
  const mPrime = 134.9633964 + 477198.8675055 * t + 0.0087414 * t2 + t3 / 69699;
  const f = 93.272095 + 483202.0175233 * t - 0.0036539 * t2;
  const e = 1 - 0.002516 * t - 0.0000074 * t2;

  const sum =
    -20905355 * cos(mPrime) +
    -3699111 * cos(2 * d - mPrime) +
    -2955968 * cos(2 * d) +
    -569925 * cos(2 * mPrime) +
    48888 * e * cos(m) +
    -3149 * cos(2 * f) +
    246158 * cos(2 * d - 2 * mPrime) +
    -152138 * e * cos(2 * d - m - mPrime) +
    -170733 * cos(2 * d + mPrime) +
    -204586 * e * cos(2 * d - m) +
    -129620 * e * cos(m - mPrime) +
    108743 * cos(d) +
    104755 * e * cos(m + mPrime) +
    10321 * cos(2 * d - 2 * f) +
    79661 * cos(mPrime - 2 * f);

  return 385000.56 + sum / 1000;
}

/** Perigee is ~356 500 km; the common threshold for "supermoon" is ~360 000 km. */
const SUPERMOON_KM = 360000;

const phaseCache = new Map<number, MoonPhase[]>();

/** Every new/quarter/full moon whose UT instant falls inside `year`. */
export function moonPhasesForYear(year: number): MoonPhase[] {
  const cached = phaseCache.get(year);
  if (cached) return cached;

  const out: MoonPhase[] = [];
  // k ≈ 0 at the new moon of 2000 Jan 6; 12.3685 lunations per year.
  const kStart = Math.floor((year - 2000) * 12.3685) - 2;
  const kEnd = kStart + 18;

  for (let k = kStart; k <= kEnd; k += 1) {
    for (const kind of Object.keys(PHASE_OFFSETS) as MoonPhaseKind[]) {
      const jde = phaseJde(k + PHASE_OFFSETS[kind], kind);
      const date = fromJulianDayTT(jde, year);
      if (date.getFullYear() !== year) continue;

      const jdUt = toJulianDay(date);
      const phase: MoonPhase = {
        kind,
        date,
        sign: signForLongitude(lunarLongitude(jdUt)),
      };
      if (
        (kind === "full" || kind === "new") &&
        lunarDistanceKm(jdUt) < SUPERMOON_KM
      ) {
        phase.superMoon = true;
      }
      out.push(phase);
    }
  }

  out.sort((a, b) => a.date.getTime() - b.date.getTime());

  // A blue moon is the second full moon landing in the same calendar month.
  const fullMoonsByMonth = new Map<number, number>();
  for (const phase of out) {
    if (phase.kind !== "full") continue;
    const month = phase.date.getMonth();
    const count = (fullMoonsByMonth.get(month) ?? 0) + 1;
    fullMoonsByMonth.set(month, count);
    if (count === 2) phase.blueMoon = true;
  }

  phaseCache.set(year, out);
  return out;
}

/* ------------------------------------------------------------------ *
 * Equinoxes and solstices — Meeus ch. 27
 * ------------------------------------------------------------------ */

export type SeasonKind =
  | "marchEquinox"
  | "juneSolstice"
  | "septemberEquinox"
  | "decemberSolstice";

export interface SeasonPoint {
  kind: SeasonKind;
  date: Date;
}

/** Table 27.C — periodic terms [A, B, C]. */
const SEASON_TERMS: ReadonlyArray<readonly [number, number, number]> = [
  [485, 324.96, 1934.136],
  [203, 337.23, 32964.467],
  [199, 342.08, 20.186],
  [182, 27.85, 445267.112],
  [156, 73.14, 45036.886],
  [136, 171.52, 22518.443],
  [77, 222.54, 65928.934],
  [74, 296.72, 3034.906],
  [70, 243.58, 9037.513],
  [58, 119.81, 33718.147],
  [52, 297.17, 150.678],
  [50, 21.02, 2281.226],
  [45, 247.54, 29929.562],
  [44, 325.15, 31555.956],
  [29, 60.93, 4443.417],
  [18, 155.12, 67555.328],
  [17, 288.79, 4562.452],
  [16, 198.04, 62894.029],
  [14, 199.76, 31436.921],
  [12, 95.39, 14577.848],
  [12, 287.11, 31931.756],
  [12, 320.81, 34777.259],
  [9, 227.73, 1222.114],
  [8, 15.45, 16859.074],
];

const SEASON_MEAN: Record<SeasonKind, readonly [number, number, number, number, number]> = {
  marchEquinox: [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
  juneSolstice: [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.0003],
  septemberEquinox: [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
  decemberSolstice: [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032],
};

const seasonCache = new Map<number, SeasonPoint[]>();

/** The four seasonal turning points of a year, as UT instants. */
export function seasonsForYear(year: number): SeasonPoint[] {
  const cached = seasonCache.get(year);
  if (cached) return cached;

  const y = (year - 2000) / 1000;
  const out: SeasonPoint[] = [];

  for (const kind of Object.keys(SEASON_MEAN) as SeasonKind[]) {
    const [c0, c1, c2, c3, c4] = SEASON_MEAN[kind];
    const jde0 = c0 + c1 * y + c2 * y * y + c3 * y ** 3 + c4 * y ** 4;

    const t = centuries(jde0);
    const w = 35999.373 * t - 2.47;
    const lambda = 1 + 0.0334 * cos(w) + 0.0007 * cos(2 * w);

    let s = 0;
    for (const [a, b, c] of SEASON_TERMS) s += a * cos(b + c * t);

    const jde = jde0 + (0.00001 * s) / lambda;
    out.push({ kind, date: fromJulianDayTT(jde, year) });
  }

  out.sort((a, b) => a.date.getTime() - b.date.getTime());
  seasonCache.set(year, out);
  return out;
}

/* ------------------------------------------------------------------ *
 * Zodiac ingresses — solved from the solar longitude
 * ------------------------------------------------------------------ */

export interface Ingress {
  sign: ZodiacSign;
  date: Date;
  /** Aries/Cancer/Libra/Capricorn ingresses *are* the equinoxes and solstices. */
  cardinal: boolean;
}

/**
 * Instant the Sun's apparent longitude crosses `targetDegrees`, found by
 * bisection between two Julian Days that bracket the crossing.
 */
function solveSolarCrossing(target: number, lowJd: number, highJd: number): number {
  const offset = (jd: number) => {
    const diff = solarLongitude(jd) - target;
    return ((diff + 540) % 360) - 180;
  };

  let lo = lowJd;
  let hi = highJd;
  for (let i = 0; i < 60; i += 1) {
    const mid = (lo + hi) / 2;
    if (offset(mid) < 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const ingressCache = new Map<number, Ingress[]>();

/** Cardinal signs are entered at the equinoxes and solstices. */
const CARDINAL_SEASON: Partial<Record<ZodiacSign, SeasonKind>> = {
  Aries: "marchEquinox",
  Cancer: "juneSolstice",
  Libra: "septemberEquinox",
  Capricorn: "decemberSolstice",
};

/** The 12 dates the Sun changes zodiac sign during `year`. */
export function ingressesForYear(year: number): Ingress[] {
  const cached = ingressCache.get(year);
  if (cached) return cached;

  const out: Ingress[] = [];
  const seasons = seasonsForYear(year);
  const yearStart = toJulianDay(new Date(Date.UTC(year, 0, 1)));

  for (let index = 0; index < 12; index += 1) {
    const sign = ZODIAC_SIGNS[index];

    // The four cardinal ingresses *are* the seasonal turning points, and the
    // ch. 27 series pins those instants far more tightly than bisecting the
    // low-accuracy solar longitude does. Reuse them rather than recompute.
    const seasonKind = CARDINAL_SEASON[sign];
    if (seasonKind) {
      const season = seasons.find((s) => s.kind === seasonKind);
      if (season) out.push({ sign, date: season.date, cardinal: true });
      continue;
    }

    const target = index * 30;
    // Each sign is entered exactly once per calendar year. Scan the whole year
    // in short windows and keep the crossing — there is only ever one.
    for (let offsetDays = 0; offsetDays < 366; offsetDays += 2) {
      const lo = yearStart + offsetDays;
      const hi = lo + 2;
      const loDiff = ((solarLongitude(lo) - target + 540) % 360) - 180;
      const hiDiff = ((solarLongitude(hi) - target + 540) % 360) - 180;
      if (loDiff < 0 && hiDiff >= 0) {
        out.push({
          sign,
          date: fromJulianDay(solveSolarCrossing(target, lo, hi)),
          cardinal: false,
        });
        break;
      }
    }
  }

  out.sort((a, b) => a.date.getTime() - b.date.getTime());
  ingressCache.set(year, out);
  return out;
}

/** Tropical sun sign for a calendar date — i.e. "the current zodiac season". */
export function sunSignForDate(date: Date): ZodiacSign {
  return signForLongitude(solarLongitude(toJulianDay(date)));
}
