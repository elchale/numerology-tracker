/**
 * Curated sky data — the events that cannot be derived from a compact
 * algorithm and so have to be tabulated.
 *
 * Eclipse dates and circumstances are from the NASA GSFC eclipse catalogues
 * (Five Millennium Canon / decade tables) and astropixels; retrograde stations
 * are from JPL DE440 apparent geocentric longitudes, cross-checked against
 * published ephemeris tables.
 *
 * All dates are the UTC calendar date — the date of greatest eclipse, and of
 * the stationary-retrograde / stationary-direct instants. A handful therefore
 * sit one day later than US-published values, which quote local time.
 *
 * Unlike `ephemeris.ts`, this file has an expiry date. See `DATA_COVERAGE`.
 */

import type { EclipseKind, RetrogradePlanet } from "./meanings";
import type { ZodiacSign } from "./ephemeris";

export interface EclipseRecord {
  /** UTC date of greatest eclipse, `YYYY-MM-DD`. */
  date: string;
  kind: EclipseKind;
  title: string;
  /** Main regions the eclipse is visible from. */
  visibility: string;
  /** Tropical sign of the Sun (solar) or Moon (lunar) at greatest eclipse. */
  zodiac?: ZodiacSign;
}

export interface RetrogradeRecord {
  planet: RetrogradePlanet;
  /** UTC date the planet stations retrograde. */
  start: string;
  /** UTC date the planet stations direct. */
  end: string;
  signs?: string;
}

/** Years for which the tabulated data above is complete. */
export const DATA_COVERAGE = { from: 2024, to: 2030 } as const;

export const ECLIPSES: readonly EclipseRecord[] = [
  { date: "2024-03-25", kind: "penumbral-lunar", title: "Penumbral Lunar Eclipse", visibility: "the Americas", zodiac: "Libra" },
  { date: "2024-04-08", kind: "total-solar", title: "Total Solar Eclipse", visibility: "Mexico, the central US and eastern Canada", zodiac: "Aries" },
  { date: "2024-09-18", kind: "partial-lunar", title: "Partial Lunar Eclipse", visibility: "the Americas, Europe and Africa", zodiac: "Pisces" },
  { date: "2024-10-02", kind: "annular-solar", title: "Annular Solar Eclipse", visibility: "southern Chile and Argentina, and the South Pacific", zodiac: "Libra" },

  { date: "2025-03-14", kind: "total-lunar", title: "Total Lunar Eclipse", visibility: "the Pacific, the Americas, western Europe and western Africa", zodiac: "Virgo" },
  { date: "2025-03-29", kind: "partial-solar", title: "Partial Solar Eclipse", visibility: "northwest Africa, Europe and northern Russia", zodiac: "Aries" },
  { date: "2025-09-07", kind: "total-lunar", title: "Total Lunar Eclipse", visibility: "Europe, Africa, Asia and Australia", zodiac: "Pisces" },
  { date: "2025-09-21", kind: "partial-solar", title: "Partial Solar Eclipse", visibility: "the South Pacific, New Zealand and Antarctica", zodiac: "Virgo" },

  { date: "2026-02-17", kind: "annular-solar", title: "Annular Solar Eclipse", visibility: "Antarctica, with a partial phase across southern South America and southern Africa", zodiac: "Aquarius" },
  { date: "2026-03-03", kind: "total-lunar", title: "Total Lunar Eclipse", visibility: "east Asia, Australia, the Pacific and the Americas", zodiac: "Virgo" },
  { date: "2026-08-12", kind: "total-solar", title: "Total Solar Eclipse", visibility: "the Arctic, Greenland, Iceland and northern Spain", zodiac: "Leo" },
  { date: "2026-08-28", kind: "partial-lunar", title: "Partial Lunar Eclipse", visibility: "the eastern Pacific, the Americas, Europe and Africa", zodiac: "Pisces" },

  { date: "2027-02-06", kind: "annular-solar", title: "Annular Solar Eclipse", visibility: "Chile, Argentina and the South Atlantic", zodiac: "Aquarius" },
  { date: "2027-02-20", kind: "penumbral-lunar", title: "Penumbral Lunar Eclipse", visibility: "the Americas, Europe, Africa and Asia", zodiac: "Virgo" },
  { date: "2027-07-18", kind: "penumbral-lunar", title: "Penumbral Lunar Eclipse", visibility: "east Africa, Asia, Australia and the Pacific", zodiac: "Capricorn" },
  { date: "2027-08-02", kind: "total-solar", title: "Total Solar Eclipse", visibility: "Morocco, Spain, Algeria, Libya, Egypt, Saudi Arabia, Yemen and Somalia", zodiac: "Leo" },
  { date: "2027-08-17", kind: "penumbral-lunar", title: "Penumbral Lunar Eclipse", visibility: "the Pacific and the Americas", zodiac: "Aquarius" },

  { date: "2028-01-12", kind: "partial-lunar", title: "Partial Lunar Eclipse", visibility: "the Americas, Europe and Africa", zodiac: "Cancer" },
  { date: "2028-01-26", kind: "annular-solar", title: "Annular Solar Eclipse", visibility: "Ecuador, Peru, Brazil, Suriname, Spain and Portugal", zodiac: "Aquarius" },
  { date: "2028-07-06", kind: "partial-lunar", title: "Partial Lunar Eclipse", visibility: "Europe, Africa, Asia and Australia", zodiac: "Capricorn" },
  { date: "2028-07-22", kind: "total-solar", title: "Total Solar Eclipse", visibility: "Australia and New Zealand", zodiac: "Cancer" },
  { date: "2028-12-31", kind: "total-lunar", title: "Total Lunar Eclipse", visibility: "Europe, Africa, Asia, Australia and the Pacific", zodiac: "Cancer" },

  { date: "2029-01-14", kind: "partial-solar", title: "Partial Solar Eclipse", visibility: "North and Central America", zodiac: "Capricorn" },
  { date: "2029-06-12", kind: "partial-solar", title: "Partial Solar Eclipse", visibility: "the Arctic, Scandinavia, Alaska, northern Asia and northern Canada", zodiac: "Gemini" },
  { date: "2029-06-26", kind: "total-lunar", title: "Total Lunar Eclipse", visibility: "the Americas, Europe, Africa and the Middle East", zodiac: "Capricorn" },
  { date: "2029-07-11", kind: "partial-solar", title: "Partial Solar Eclipse", visibility: "southern Chile and Argentina", zodiac: "Cancer" },
  { date: "2029-12-05", kind: "partial-solar", title: "Partial Solar Eclipse", visibility: "southern Argentina, southern Chile and Antarctica", zodiac: "Sagittarius" },
  { date: "2029-12-20", kind: "total-lunar", title: "Total Lunar Eclipse", visibility: "the Americas, Europe, Africa and Asia", zodiac: "Gemini" },

  { date: "2030-06-01", kind: "annular-solar", title: "Annular Solar Eclipse", visibility: "Algeria, Tunisia, Greece, Turkey, Russia, northern China and Japan", zodiac: "Gemini" },
  { date: "2030-06-15", kind: "partial-lunar", title: "Partial Lunar Eclipse", visibility: "Europe, Africa, Asia and Australia", zodiac: "Sagittarius" },
  { date: "2030-11-25", kind: "total-solar", title: "Total Solar Eclipse", visibility: "Botswana, South Africa and Australia", zodiac: "Sagittarius" },
  { date: "2030-12-09", kind: "penumbral-lunar", title: "Penumbral Lunar Eclipse", visibility: "the Americas, Europe, Africa and Asia", zodiac: "Gemini" },
];

export const RETROGRADES: readonly RetrogradeRecord[] = [
  // Starts before the coverage window but is still retrograde on 1 Jan 2024,
  // so it is kept for correct "is it retrograde right now" behaviour.
  { planet: "mercury", start: "2023-12-13", end: "2024-01-02", signs: "Capricorn back into Sagittarius" },
  { planet: "mercury", start: "2024-04-01", end: "2024-04-25", signs: "Aries" },
  { planet: "mercury", start: "2024-08-05", end: "2024-08-28", signs: "Virgo back into Leo" },
  { planet: "mercury", start: "2024-11-26", end: "2024-12-15", signs: "Sagittarius" },
  { planet: "mars", start: "2024-12-06", end: "2025-02-24", signs: "Leo back into Cancer" },

  { planet: "venus", start: "2025-03-02", end: "2025-04-13", signs: "Aries back into Pisces" },
  { planet: "mercury", start: "2025-03-15", end: "2025-04-07", signs: "Aries back into Pisces" },
  { planet: "mercury", start: "2025-07-18", end: "2025-08-11", signs: "Leo" },
  { planet: "mercury", start: "2025-11-09", end: "2025-11-29", signs: "Sagittarius back into Scorpio" },

  { planet: "mercury", start: "2026-02-26", end: "2026-03-20", signs: "Pisces" },
  { planet: "mercury", start: "2026-06-29", end: "2026-07-23", signs: "Cancer" },
  { planet: "venus", start: "2026-10-03", end: "2026-11-14", signs: "Scorpio back into Libra" },
  { planet: "mercury", start: "2026-10-24", end: "2026-11-13", signs: "Scorpio" },

  { planet: "mars", start: "2027-01-10", end: "2027-04-01", signs: "Virgo back into Leo" },
  { planet: "mercury", start: "2027-02-09", end: "2027-03-03", signs: "Pisces back into Aquarius" },
  { planet: "mercury", start: "2027-06-10", end: "2027-07-04", signs: "Cancer back into Gemini" },
  { planet: "mercury", start: "2027-10-07", end: "2027-10-28", signs: "Scorpio back into Libra" },

  { planet: "mercury", start: "2028-01-24", end: "2028-02-14", signs: "Aquarius" },
  { planet: "venus", start: "2028-05-10", end: "2028-06-22", signs: "Gemini" },
  { planet: "mercury", start: "2028-05-21", end: "2028-06-14", signs: "Gemini" },
  { planet: "mercury", start: "2028-09-19", end: "2028-10-11", signs: "Libra" },

  { planet: "mercury", start: "2029-01-07", end: "2029-01-27", signs: "Aquarius back into Capricorn" },
  { planet: "mars", start: "2029-02-14", end: "2029-05-05", signs: "Libra back into Virgo" },
  { planet: "mercury", start: "2029-05-01", end: "2029-05-25", signs: "Taurus" },
  { planet: "mercury", start: "2029-09-02", end: "2029-09-25", signs: "Libra back into Virgo" },
  { planet: "venus", start: "2029-12-16", end: "2030-01-26", signs: "Capricorn" },
  { planet: "mercury", start: "2029-12-22", end: "2030-01-11", signs: "Capricorn" },

  { planet: "mercury", start: "2030-04-13", end: "2030-05-06", signs: "Taurus back into Aries" },
  { planet: "mercury", start: "2030-08-16", end: "2030-09-08", signs: "Virgo" },
  { planet: "mercury", start: "2030-12-06", end: "2030-12-25", signs: "Capricorn back into Sagittarius" },
];

/** True when eclipse and retrograde data is tabulated for a given year. */
export function hasCuratedData(year: number): boolean {
  return year >= DATA_COVERAGE.from && year <= DATA_COVERAGE.to;
}
