export interface BirthDate {
  day: number;
  month: number; // 1-12
  year: number;
  hour?: number; // 0-23, optional
  minute?: number; // 0-59, optional
}

export type DayType =
  | "master11"
  | "master22"
  | "master33"
  | "peak"
  | "abundance"
  | "flow"
  | "newStart"
  | "creative"
  | "harmony"
  | "rest"
  | "release"
  | "neutral";

export interface DayInfo {
  date: Date;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  type: DayType;
  isMaster: boolean;
  lifePathAlignment: boolean;
  /** Personal Day number clashes with the Life Path (number-compatibility friction). */
  frictionDay: boolean;
}

export interface LuckyDay {
  date: Date;
  personalDay: number;
  type: DayType;
  reason: string;
}

export interface MonthSummary {
  year: number;
  month: number; // 1-12
  personalMonth: number;
  peakDays: number[];
  masterDays: number[];
  frictionDays: number[];
}

export interface YearSummary {
  year: number;
  personalYear: number;
  monthly: MonthSummary[];
  peakCount: number;
  masterCount: number;
  isMasterYear: boolean;
  isLifePathYear: boolean;
}
