import {
  ingressesForYear,
  moonPhasesForYear,
  seasonsForYear,
  type ZodiacSign,
} from "./ephemeris";
import { ECLIPSES, RETROGRADES } from "./data";
import {
  ASTRO_COLORS,
  ECLIPSE_COPY,
  ECLIPSE_ICONS,
  MOON_PHASE_COPY,
  MOON_PHASE_ICONS,
  PORTAL_COPY,
  PORTAL_ICON,
  RETROGRADE_COPY,
  RETROGRADE_ICON,
  SEASON_COPY,
  SIGN_FLAVOUR,
  SOLAR_ECLIPSE_KINDS,
  ZODIAC_SEASON_COPY,
} from "./meanings";
import { Sun } from "lucide-react";
import type { AstroDay, AstroEvent, AstroWindow } from "./types";

/* ------------------------------------------------------------------ *
 * Date helpers
 * ------------------------------------------------------------------ */

function startOfDay(date: Date): Date {
  const out = new Date(date);
  out.setHours(0, 0, 0, 0);
  return out;
}

/**
 * Parses a `YYYY-MM-DD` string into local midnight.
 *
 * Curated entries carry a calendar date rather than an instant, so they are
 * pinned to that date rather than shifted by the viewer's time zone — `new
 * Date("2026-08-12")` would land on 11 August across the Americas.
 */
function parseDateOnly(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/**
 * The app is written in English and pins `en-US` for every other date it
 * renders, so these match rather than following the browser locale. The
 * *instant* is still local — only the wording is fixed.
 */
function timeLabel(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/* ------------------------------------------------------------------ *
 * Builders
 * ------------------------------------------------------------------ */

function moonEvents(year: number): AstroEvent[] {
  return moonPhasesForYear(year).map((phase) => {
    const copy = MOON_PHASE_COPY[phase.kind];

    const prefix = phase.blueMoon ? "Blue " : phase.superMoon ? "Super " : "";
    const title = `${prefix}${copy.title} in ${phase.sign}`;

    const extras: string[] = [];
    if (phase.superMoon) {
      extras.push(
        "This one is a supermoon — the Moon is near the closest point of its orbit, so it appears slightly larger and brighter than usual.",
      );
    }
    if (phase.blueMoon) {
      extras.push(
        "It is also a blue moon: the second full moon to land in the same calendar month, which happens roughly every two and a half years.",
      );
    }

    return {
      id: `moon-${phase.kind}-${dayKey(phase.date)}`,
      category: "moon",
      date: startOfDay(phase.date),
      title,
      summary: copy.summary,
      detail: [copy.detail, SIGN_FLAVOUR[phase.sign], ...extras].join(" "),
      sign: phase.sign,
      note: `Exact at ${timeLabel(phase.date)} your time`,
      color: ASTRO_COLORS.moon,
      Icon: MOON_PHASE_ICONS[phase.kind],
      weight: copy.weight + (phase.superMoon || phase.blueMoon ? 5 : 0),
    } satisfies AstroEvent;
  });
}

function seasonEvents(year: number): AstroEvent[] {
  return seasonsForYear(year).map((season) => {
    const copy = SEASON_COPY[season.kind];
    return {
      id: `season-${season.kind}-${year}`,
      category: "season",
      date: startOfDay(season.date),
      title: copy.title,
      summary: copy.summary,
      detail: copy.detail,
      note: `Exact at ${timeLabel(season.date)} your time`,
      color: ASTRO_COLORS.season,
      Icon: copy.Icon,
      weight: 65,
    } satisfies AstroEvent;
  });
}

function ingressEvents(year: number): AstroEvent[] {
  // Cardinal ingresses are already surfaced as the equinox/solstice events.
  return ingressesForYear(year)
    .filter((ingress) => !ingress.cardinal)
    .map((ingress) => {
      const copy = ZODIAC_SEASON_COPY[ingress.sign];
      return {
        id: `ingress-${ingress.sign}-${year}`,
        category: "season",
        date: startOfDay(ingress.date),
        title: `${ingress.sign} season begins`,
        summary: `The Sun enters ${ingress.sign} — ${copy.theme.toLowerCase()}`,
        detail: `The Sun crosses into ${ingress.sign}, opening roughly a month under that sign's tone. ${copy.detail}`,
        sign: ingress.sign,
        color: ASTRO_COLORS.season,
        Icon: Sun,
        weight: 35,
      } satisfies AstroEvent;
    });
}

const DAY_MS = 86400000;

/**
 * Resolves an eclipse's tabulated UTC date onto the viewer's calendar.
 *
 * Every solar eclipse happens at a new moon and every lunar eclipse at a full
 * moon, and those instants are computed exactly. Snapping the eclipse onto its
 * own phase keeps the pair on the same local day — otherwise a viewer east or
 * west of UTC can see "Partial Lunar Eclipse" on one date and the full moon it
 * *is* on the day before.
 */
function resolveEclipseDate(iso: string, isSolar: boolean): Date {
  const nominal = parseDateOnly(iso);
  const wanted = isSolar ? "new" : "full";

  // The phase may be catalogued under either adjacent year once shifted local.
  for (const year of [nominal.getFullYear() - 1, nominal.getFullYear(), nominal.getFullYear() + 1]) {
    for (const phase of moonPhasesForYear(year)) {
      if (phase.kind !== wanted) continue;
      // Same-kind phases are 29.5 days apart, so this can only ever match one.
      if (Math.abs(phase.date.getTime() - nominal.getTime()) < 1.5 * DAY_MS) {
        return startOfDay(phase.date);
      }
    }
  }
  return nominal;
}

function eclipseEvents(year: number): AstroEvent[] {
  // Scan neighbouring years too: an eclipse tabulated on 31 December can land
  // on 1 January locally, and vice versa.
  return ECLIPSES.filter((e) => {
    const tabulated = Number(e.date.slice(0, 4));
    return Math.abs(tabulated - year) <= 1;
  })
    .map((eclipse) => {
      const copy = ECLIPSE_COPY[eclipse.kind];
      const isSolar = SOLAR_ECLIPSE_KINDS.has(eclipse.kind);
      const sign = eclipse.zodiac as ZodiacSign | undefined;

      const detail = [
        copy.detail,
        sign
          ? `This one falls in ${sign}, so that is the area it acts on. ${SIGN_FLAVOUR[sign]}`
          : "",
      ]
        .filter(Boolean)
        .join(" ");

      return {
        id: `eclipse-${eclipse.date}`,
        category: "eclipse",
        date: resolveEclipseDate(eclipse.date, isSolar),
        title: sign ? `${eclipse.title} in ${sign}` : eclipse.title,
        summary: copy.summary,
        detail,
        sign,
        note: `Visible from ${eclipse.visibility}`,
        color: ASTRO_COLORS.eclipse,
        Icon: ECLIPSE_ICONS[isSolar ? "solar" : "lunar"],
        weight: isSolar ? 100 : 95,
      } satisfies AstroEvent;
    })
    .filter((event) => event.date.getFullYear() === year);
}

function retrogradeEntries(year: number): { events: AstroEvent[]; windows: AstroWindow[] } {
  const events: AstroEvent[] = [];
  const windows: AstroWindow[] = [];

  for (const retro of RETROGRADES) {
    const start = parseDateOnly(retro.start);
    const end = parseDateOnly(retro.end);
    if (start.getFullYear() !== year && end.getFullYear() !== year) continue;

    const copy = RETROGRADE_COPY[retro.planet];
    const signNote = retro.signs ? ` Through ${retro.signs}.` : "";

    if (start.getFullYear() === year) {
      events.push({
        id: `retro-start-${retro.planet}-${retro.start}`,
        category: "retrograde",
        date: start,
        title: `${copy.label} goes retrograde`,
        summary: copy.startSummary,
        detail: copy.detail + signNote,
        note: `Until ${end.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`,
        color: ASTRO_COLORS.retrograde,
        Icon: RETROGRADE_ICON,
        weight: 55,
      });
    }

    if (end.getFullYear() === year) {
      events.push({
        id: `retro-end-${retro.planet}-${retro.end}`,
        category: "retrograde",
        date: end,
        title: `${copy.label} goes direct`,
        summary: copy.endSummary,
        detail: `${copy.label} resumes apparent forward motion. The review period closes — traditionally the point at which decisions parked during the retrograde can be acted on, though the effect is usually described as easing over the following days rather than switching off.`,
        color: ASTRO_COLORS.retrograde,
        Icon: RETROGRADE_ICON,
        weight: 50,
      });
    }

    windows.push({
      id: `retro-window-${retro.planet}-${retro.start}`,
      category: "retrograde",
      title: `${copy.label} retrograde`,
      start,
      end,
      summary: copy.summary,
      detail: copy.detail + signNote,
      color: ASTRO_COLORS.retrograde,
      Icon: RETROGRADE_ICON,
      weight: 60,
    });
  }

  return { events, windows };
}

function zodiacSeasonWindows(year: number): AstroWindow[] {
  const current = ingressesForYear(year);
  const next = ingressesForYear(year + 1);
  const boundaries = [...current, ...next];

  return current.map((ingress, index) => {
    const following = boundaries[index + 1];
    const end = following
      ? new Date(following.date.getTime() - 86400000)
      : new Date(year + 1, 0, 20);
    const copy = ZODIAC_SEASON_COPY[ingress.sign];

    return {
      id: `season-window-${ingress.sign}-${year}`,
      category: "season",
      title: `${ingress.sign} season`,
      start: startOfDay(ingress.date),
      end: startOfDay(end),
      summary: copy.theme,
      detail: copy.detail,
      sign: ingress.sign,
      color: ASTRO_COLORS.season,
      Icon: Sun,
      weight: 20,
    } satisfies AstroWindow;
  });
}

function portalEntries(year: number): { events: AstroEvent[]; windows: AstroWindow[] } {
  const events: AstroEvent[] = [
    {
      id: `portal-lionsgate-${year}`,
      category: "portal",
      date: new Date(year, 7, 8),
      title: PORTAL_COPY.lionsGate.title,
      summary: PORTAL_COPY.lionsGate.summary,
      detail: PORTAL_COPY.lionsGate.detail,
      color: ASTRO_COLORS.portal,
      Icon: PORTAL_ICON,
      weight: 85,
    },
    {
      id: `portal-1111-${year}`,
      category: "portal",
      date: new Date(year, 10, 11),
      title: PORTAL_COPY.elevenEleven.title,
      summary: PORTAL_COPY.elevenEleven.summary,
      detail: PORTAL_COPY.elevenEleven.detail,
      color: ASTRO_COLORS.portal,
      Icon: PORTAL_ICON,
      weight: 80,
    },
  ];

  // Mirror dates — 1/1 through 12/12. August and November already have a
  // richer dedicated portal, so they are skipped here.
  for (let month = 1; month <= 12; month += 1) {
    if (month === 8 || month === 11) continue;
    events.push({
      id: `portal-mirror-${year}-${month}`,
      category: "portal",
      date: new Date(year, month - 1, month),
      title: `${month}/${month} Mirror Date`,
      summary: PORTAL_COPY.mirror.summary,
      detail: PORTAL_COPY.mirror.detail,
      color: ASTRO_COLORS.portal,
      Icon: PORTAL_ICON,
      weight: 30,
    });
  }

  const windows: AstroWindow[] = [
    {
      id: `portal-lionsgate-window-${year}`,
      category: "portal",
      title: PORTAL_COPY.lionsGateWindow.title,
      start: new Date(year, 6, 26),
      end: new Date(year, 7, 12),
      summary: PORTAL_COPY.lionsGateWindow.summary,
      detail: PORTAL_COPY.lionsGateWindow.detail,
      color: ASTRO_COLORS.portal,
      Icon: PORTAL_ICON,
      weight: 40,
    },
  ];

  return { events, windows };
}

/* ------------------------------------------------------------------ *
 * Assembly
 * ------------------------------------------------------------------ */

interface YearBundle {
  byDay: Map<string, AstroEvent[]>;
  events: AstroEvent[];
  windows: AstroWindow[];
}

const yearCache = new Map<number, YearBundle>();

function buildYear(year: number): YearBundle {
  const cached = yearCache.get(year);
  if (cached) return cached;

  const retro = retrogradeEntries(year);
  const portal = portalEntries(year);

  const events = [
    ...moonEvents(year),
    ...seasonEvents(year),
    ...ingressEvents(year),
    ...eclipseEvents(year),
    ...retro.events,
    ...portal.events,
  ].sort((a, b) => a.date.getTime() - b.date.getTime() || b.weight - a.weight);

  const windows = [
    ...retro.windows,
    ...zodiacSeasonWindows(year),
    ...portal.windows,
  ];

  const byDay = new Map<string, AstroEvent[]>();
  for (const event of events) {
    const key = dayKey(event.date);
    const list = byDay.get(key);
    if (list) list.push(event);
    else byDay.set(key, [event]);
  }
  for (const list of byDay.values()) list.sort((a, b) => b.weight - a.weight);

  const bundle: YearBundle = { byDay, events, windows };
  yearCache.set(year, bundle);
  return bundle;
}

/** Point-in-time events landing on a given calendar day, strongest first. */
export function getAstroEvents(year: number, month: number, day: number): AstroEvent[] {
  return buildYear(year).byDay.get(`${year}-${month}-${day}`) ?? [];
}

/**
 * Ongoing windows covering a given day. Windows can begin in the previous
 * year (a December retrograde, the Capricorn season), so both are searched.
 */
export function getAstroWindows(year: number, month: number, day: number): AstroWindow[] {
  const target = new Date(year, month - 1, day).getTime();
  const seen = new Set<string>();

  return [...buildYear(year - 1).windows, ...buildYear(year).windows]
    .filter((w) => {
      if (target < w.start.getTime() || target > w.end.getTime()) return false;
      // A retrograde straddling New Year is built into both years' bundles.
      if (seen.has(w.id)) return false;
      seen.add(w.id);
      return true;
    })
    .sort((a, b) => b.weight - a.weight);
}

export function getAstroDay(year: number, month: number, day: number): AstroDay {
  return {
    events: getAstroEvents(year, month, day),
    windows: getAstroWindows(year, month, day),
  };
}

/** The single most significant event on a day, for the calendar-cell marker. */
export function getPrimaryAstroEvent(
  year: number,
  month: number,
  day: number,
): AstroEvent | null {
  return getAstroEvents(year, month, day)[0] ?? null;
}

/** Every event in a calendar month, keyed by day-of-month. */
export function getMonthAstroEvents(
  year: number,
  month: number,
): Map<number, AstroEvent[]> {
  const out = new Map<number, AstroEvent[]>();
  const daysInMonth = new Date(year, month, 0).getDate();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const events = getAstroEvents(year, month, day);
    if (events.length) out.set(day, events);
  }
  return out;
}

/**
 * The next `count` notable events at or after `from` — at most one per day, so
 * a compact list shows "Total Solar Eclipse" rather than repeating the new moon
 * that the eclipse already implies.
 */
export function getUpcomingAstroEvents(from: Date, count = 4): AstroEvent[] {
  const floor = startOfDay(from).getTime();
  const year = from.getFullYear();
  const seenDays = new Set<string>();

  return [...buildYear(year).events, ...buildYear(year + 1).events]
    .filter((e) => e.date.getTime() >= floor && e.weight >= 40)
    .sort((a, b) => a.date.getTime() - b.date.getTime() || b.weight - a.weight)
    .filter((e) => {
      const key = dayKey(e.date);
      if (seenDays.has(key)) return false;
      seenDays.add(key);
      return true;
    })
    .slice(0, count);
}
