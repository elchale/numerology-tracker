import {
  Circle,
  CircleDashed,
  CircleDot,
  DoorOpen,
  Eclipse,
  Moon,
  MoonStar,
  Orbit,
  Sparkles,
  Sun,
  Sunrise,
  Sunset,
  type LucideIcon,
} from "lucide-react";
import type { MoonPhaseKind, SeasonKind, ZodiacSign } from "./ephemeris";
import type { AstroCategory } from "./types";

export const ASTRO_COLORS: Record<AstroCategory, string> = {
  moon: "var(--color-violet)",
  eclipse: "var(--color-rose)",
  retrograde: "var(--color-amber)",
  season: "var(--color-emerald)",
  portal: "var(--color-gold)",
};

export const ASTRO_CATEGORY_META: Record<
  AstroCategory,
  { label: string; color: string; Icon: LucideIcon }
> = {
  moon: { label: "Moon", color: ASTRO_COLORS.moon, Icon: Moon },
  eclipse: { label: "Eclipse", color: ASTRO_COLORS.eclipse, Icon: Eclipse },
  retrograde: { label: "Retrograde", color: ASTRO_COLORS.retrograde, Icon: Orbit },
  season: { label: "Season", color: ASTRO_COLORS.season, Icon: Sun },
  portal: { label: "Portal", color: ASTRO_COLORS.portal, Icon: DoorOpen },
};

/* ------------------------------------------------------------------ *
 * Moon
 * ------------------------------------------------------------------ */

export const MOON_PHASE_ICONS: Record<MoonPhaseKind, LucideIcon> = {
  new: CircleDashed,
  firstQuarter: CircleDot,
  full: Circle,
  lastQuarter: CircleDot,
};

export const MOON_PHASE_COPY: Record<
  MoonPhaseKind,
  { title: string; summary: string; detail: string; weight: number }
> = {
  new: {
    title: "New Moon",
    summary: "Seed point — the dark, quiet start of the lunar cycle",
    detail:
      "The Moon sits between Earth and Sun, so its lit face is turned away and the night sky is at its darkest. Traditionally this is the planting point of the month: the moment to set an intention rather than harvest one. Energy is low and inward — useful for deciding, not for launching loudly.",
    weight: 60,
  },
  firstQuarter: {
    title: "First Quarter",
    summary: "Half-lit — the friction point where intentions meet reality",
    detail:
      "One week after the new moon the Moon is a quarter of the way around its orbit and we see half its disc. This is the classic resistance point of the cycle: whatever you started is now meeting its first real obstacle. Push, adjust, but don't abandon.",
    weight: 40,
  },
  full: {
    title: "Full Moon",
    summary: "Peak illumination — culmination, clarity, and release",
    detail:
      "The Moon is opposite the Sun and fully lit. Everything is visible, including what you'd rather not see. Traditionally the harvest and release point of the cycle — things come to a head, feelings run close to the surface, and what has finished asks to be let go.",
    weight: 70,
  },
  lastQuarter: {
    title: "Last Quarter",
    summary: "Waning half — the edit, the clear-out, the honest review",
    detail:
      "The Moon is three-quarters through its orbit and shrinking. This is the composting phase: reviewing what worked, cutting what didn't, and making room before the next new moon. Good for endings and admin, poor for beginnings.",
    weight: 40,
  },
};

/** Short flavour appended when a lunar event happens in a given sign. */
export const SIGN_FLAVOUR: Record<ZodiacSign, string> = {
  Aries: "The tone is fast, direct and self-starting — act first, refine later.",
  Taurus: "The tone is slow, sensory and stubborn — comfort, money, and what actually lasts.",
  Gemini: "The tone is talkative and scattered — information, messages, and two things at once.",
  Cancer: "The tone is protective and tidal — home, family, and what you feel before you can explain it.",
  Leo: "The tone is warm and visible — pride, creativity, and the courage to be seen.",
  Virgo: "The tone is precise and corrective — health, craft, and fixing the small broken thing.",
  Libra: "The tone is relational and balancing — fairness, beauty, and the other person's view.",
  Scorpio: "The tone is deep and unflinching — intimacy, power, and what's been buried.",
  Sagittarius: "The tone is expansive and restless — travel, belief, and the bigger picture.",
  Capricorn: "The tone is structural and ambitious — work, authority, and the long climb.",
  Aquarius: "The tone is detached and inventive — community, systems, and breaking the pattern.",
  Pisces: "The tone is porous and dreamlike — imagination, compassion, and blurred edges.",
};

/* ------------------------------------------------------------------ *
 * Eclipses
 * ------------------------------------------------------------------ */

export type EclipseKind =
  | "total-solar"
  | "annular-solar"
  | "partial-solar"
  | "hybrid-solar"
  | "total-lunar"
  | "partial-lunar"
  | "penumbral-lunar";

export const SOLAR_ECLIPSE_KINDS: ReadonlySet<string> = new Set([
  "total-solar",
  "annular-solar",
  "partial-solar",
  "hybrid-solar",
]);

export const ECLIPSE_COPY: Record<EclipseKind, { summary: string; detail: string }> = {
  "total-solar": {
    summary: "The Moon fully covers the Sun — day briefly becomes night",
    detail:
      "A total solar eclipse happens at a new moon when the Moon passes exactly between Earth and Sun, blocking it completely along a narrow track. Astrologically, solar eclipses are read as accelerated new beginnings: the story a normal new moon would take a month to tell arrives all at once, often through an external event you didn't choose.",
  },
  "annular-solar": {
    summary: "A 'ring of fire' — the Moon is too far to cover the Sun completely",
    detail:
      "The Moon is near the far point of its orbit, so it covers the Sun's centre but leaves a bright ring around the edge. Astrologically it reads like a total eclipse with the volume lowered — a beginning that is real but incomplete, something still unresolved around the edges.",
  },
  "partial-solar": {
    summary: "The Moon clips the Sun — a bite taken out of the disc",
    detail:
      "The Moon covers only part of the Sun's face. The mildest of the solar eclipses, traditionally read as a partial reset: a door opens, but only some of the way.",
  },
  "hybrid-solar": {
    summary: "Rare — the eclipse shifts between total and annular along its path",
    detail:
      "Earth's curvature brings some places close enough for totality while others see a ring. Hybrid eclipses are the rarest type, occurring only a handful of times a century. Read astrologically as a beginning that means different things to different people.",
  },
  "total-lunar": {
    summary: "The Moon passes fully into Earth's shadow and turns red",
    detail:
      "At a full moon the Earth sits directly between Sun and Moon, and the only light reaching the lunar surface is sunlight bent through our atmosphere — which is why it glows copper, the 'blood moon'. Astrologically, lunar eclipses are read as accelerated endings: something that had been running quietly reaches its conclusion faster than expected.",
  },
  "partial-lunar": {
    summary: "Part of the Moon darkens as it clips Earth's shadow",
    detail:
      "Only a portion of the Moon enters the dark umbral shadow, leaving a curved bite visible to the naked eye. A softer version of the total eclipse's ending energy — a chapter closing rather than a book.",
  },
  "penumbral-lunar": {
    summary: "A subtle shading — the faintest kind of lunar eclipse",
    detail:
      "The Moon passes through Earth's outer, diffuse shadow only. The dimming is slight and easy to miss without a photograph. Traditionally the quietest eclipse: a shift in mood rather than an event.",
  },
};

export const ECLIPSE_ICONS: Record<"solar" | "lunar", LucideIcon> = {
  solar: Eclipse,
  lunar: MoonStar,
};

/* ------------------------------------------------------------------ *
 * Retrogrades
 * ------------------------------------------------------------------ */

export type RetrogradePlanet = "mercury" | "venus" | "mars";

export const RETROGRADE_COPY: Record<
  RetrogradePlanet,
  {
    label: string;
    summary: string;
    detail: string;
    startSummary: string;
    endSummary: string;
  }
> = {
  mercury: {
    label: "Mercury",
    summary: "Communication, travel and technology run backwards",
    detail:
      "Retrograde motion is an optical effect: as Earth and Mercury pass each other, Mercury appears to reverse direction against the stars. Nothing physically changes — but astrologically this is the classic review period. Traditional advice is to re-do rather than start: revise, revisit, reconnect, re-read the contract. Expect delays, crossed wires and returning people.",
    startSummary: "Mercury stations retrograde — begin the review period",
    endSummary: "Mercury stations direct — forward motion resumes",
  },
  venus: {
    label: "Venus",
    summary: "Love, money and values turn inward for review",
    detail:
      "Venus retrogrades roughly every 18 months and is the rarest of the personal-planet retrogrades. Astrologically it turns attention to relationships, self-worth and finances — old lovers reappear, aesthetic choices get second-guessed, and it is traditionally considered a poor window for weddings, major purchases or changing your look.",
    startSummary: "Venus stations retrograde — relationships and values in review",
    endSummary: "Venus stations direct — clarity returns to what you value",
  },
  mars: {
    label: "Mars",
    summary: "Drive, anger and momentum stall out",
    detail:
      "Mars retrogrades about every two years and is the longest of the three. Astrologically it drains forward drive: plans stall, frustration builds, and force stops working as a strategy. Traditionally read as a period to sharpen the weapon rather than swing it — train, plan, and hold your fire.",
    startSummary: "Mars stations retrograde — momentum turns inward",
    endSummary: "Mars stations direct — drive and momentum return",
  },
};

export const RETROGRADE_ICON: LucideIcon = Orbit;

/* ------------------------------------------------------------------ *
 * Seasons and zodiac
 * ------------------------------------------------------------------ */

export const SEASON_COPY: Record<
  SeasonKind,
  { title: string; summary: string; detail: string; Icon: LucideIcon }
> = {
  marchEquinox: {
    title: "March Equinox",
    summary: "Day and night balance — the astrological new year begins",
    detail:
      "The Sun crosses the celestial equator heading north and day and night are almost exactly equal worldwide. Spring in the northern hemisphere, autumn in the southern. This is also 0° Aries — the start point of the whole tropical zodiac, and traditionally the astrological new year.",
    Icon: Sunrise,
  },
  juneSolstice: {
    title: "June Solstice",
    summary: "The Sun's highest point — the longest day in the north",
    detail:
      "The Sun reaches its most northern position. Longest day and shortest night in the northern hemisphere, reversed in the south. A peak point: maximum light, maximum exposure, and the turn that begins the slow return toward darkness.",
    Icon: Sun,
  },
  septemberEquinox: {
    title: "September Equinox",
    summary: "Balance again — the tipping point into the dark half of the year",
    detail:
      "The Sun crosses back over the celestial equator heading south, and day and night are equal again. Autumn in the north, spring in the south. Traditionally the harvest and reckoning point — taking stock of what the year actually produced.",
    Icon: Sunset,
  },
  decemberSolstice: {
    title: "December Solstice",
    summary: "The longest night in the north — the turn back toward the light",
    detail:
      "The Sun reaches its most southern position. Shortest day and longest night in the northern hemisphere. Nearly every northern culture built a festival of returning light here, because from this point the days start growing again.",
    Icon: Sunrise,
  },
};

export const ZODIAC_SEASON_COPY: Record<ZodiacSign, { theme: string; detail: string }> = {
  Aries: {
    theme: "Ignition",
    detail: "The zodiac restarts. Initiative, courage and impatience run high; it favours starting over finishing.",
  },
  Taurus: {
    theme: "Rooting",
    detail: "Everything slows and thickens. Focus lands on security, the body, money and physical pleasure.",
  },
  Gemini: {
    theme: "Circulation",
    detail: "Information moves fast and attention splits. A season for talking, learning, and collecting rather than committing.",
  },
  Cancer: {
    theme: "Retreat",
    detail: "Attention turns homeward — family, roots, and emotional safety take priority over public ambition.",
  },
  Leo: {
    theme: "Radiance",
    detail: "The most extroverted stretch of the year. Creativity, play, performance and the appetite to be seen.",
  },
  Virgo: {
    theme: "Refinement",
    detail: "The season of the edit. Health, routine, craft and the unglamorous work of making things actually function.",
  },
  Libra: {
    theme: "Weighing",
    detail: "Focus shifts to other people. Fairness, partnership, negotiation and beauty; decisions come slower.",
  },
  Scorpio: {
    theme: "Descent",
    detail: "The year's most intense stretch. Intimacy, power, money you share with others, and whatever you've avoided looking at.",
  },
  Sagittarius: {
    theme: "Expansion",
    detail: "Horizons widen. Travel, study, belief and optimism — the appetite for more, sometimes past what's realistic.",
  },
  Capricorn: {
    theme: "Construction",
    detail: "The most goal-driven season. Structure, discipline, authority and the long patient climb toward something real.",
  },
  Aquarius: {
    theme: "Disruption",
    detail: "The pattern gets broken. Community, technology, ideals and a deliberate step back from the personal.",
  },
  Pisces: {
    theme: "Dissolution",
    detail: "The year winds down and edges blur. Imagination, compassion, rest and the release before Aries restarts everything.",
  },
};

/* ------------------------------------------------------------------ *
 * Portals — symbolic dates from the numerology and New Age traditions
 * ------------------------------------------------------------------ */

export const PORTAL_ICON: LucideIcon = Sparkles;

/**
 * These are traditions, not astronomy. The copy says so plainly — Numen can
 * hold a symbolic calendar without dressing it up as a physical event.
 */
export const PORTAL_COPY = {
  lionsGate: {
    title: "Lion's Gate Portal",
    summary: "8/8 — the year's most-cited manifestation date",
    detail:
      "In the New Age tradition the Lion's Gate is the peak of a window running from late July to 12 August, tied to the Sun in Leo and the heliacal rising of Sirius — the star's first pre-dawn reappearance after weeks lost in solar glare. Worth knowing: the Sirius rising is a real observational event that ancient Egypt used to predict the Nile flood, but its date drifts with precession and depends on your latitude. It has not actually fallen on 8 August for millennia. The date is fixed by the 8/8 numerology, not by the star. Taken on its own terms it's a marker for setting intentions around visibility, courage and abundance.",
  },
  lionsGateWindow: {
    title: "Lion's Gate window",
    summary: "The two-week stretch around 8/8",
    detail:
      "The commonly cited Lion's Gate window runs roughly 26 July to 12 August, with the peak on 8 August. A symbolic period rather than an astronomical one — traditionally used for intention-setting rather than completion.",
  },
  elevenEleven: {
    title: "11:11 Portal",
    summary: "11/11 — the master-number gateway",
    detail:
      "11 is the first master number in numerology: the intuitive, high-voltage channel. On 11 November the doubling is read as an amplified moment of alignment and synchronicity. Purely a numerological construct tied to the Gregorian calendar — but one that sits naturally alongside your own master days.",
  },
  mirror: {
    summary: "A mirror date — month and day match",
    detail:
      "Repeating month/day dates are treated in numerology as amplification points: the same number stated twice, doubling whatever that number governs. A light marker rather than a major event.",
  },
} as const;
