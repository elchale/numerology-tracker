import type { LucideIcon } from "lucide-react";
import type { ZodiacSign } from "./ephemeris";

export type AstroCategory = "moon" | "eclipse" | "retrograde" | "season" | "portal";

/**
 * A point-in-time sky event that lands on one calendar day and earns a marker
 * on that day's cell.
 */
export interface AstroEvent {
  id: string;
  category: AstroCategory;
  /** The local calendar day this event falls on. */
  date: Date;
  title: string;
  /** One line, shown in compact contexts and under the marker. */
  summary: string;
  /** Full explanation for the day detail panel. */
  detail: string;
  sign?: ZodiacSign;
  /** Secondary factual context — eclipse visibility, sign traversal, etc. */
  note?: string;
  color: string;
  Icon: LucideIcon;
  /**
   * Ranking used to pick a single marker when several events share a day, and
   * to order the detail list. Higher wins.
   */
  weight: number;
}

/**
 * An ongoing stretch of sky weather — a retrograde, a zodiac season, a portal
 * window. These are listed in the detail panel for every day they cover rather
 * than marked on individual cells.
 */
export interface AstroWindow {
  id: string;
  category: AstroCategory;
  title: string;
  /** Inclusive local start day. */
  start: Date;
  /** Inclusive local end day. */
  end: Date;
  summary: string;
  detail: string;
  sign?: ZodiacSign;
  color: string;
  Icon: LucideIcon;
  weight: number;
}

export interface AstroDay {
  events: AstroEvent[];
  windows: AstroWindow[];
}
