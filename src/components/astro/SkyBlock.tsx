"use client";

import { getAstroDay } from "@/lib/astro/events";
import { DATA_COVERAGE, hasCuratedData } from "@/lib/astro/data";
import type { AstroEvent, AstroWindow } from "@/lib/astro/types";

interface Props {
  year: number;
  month: number;
  day: number;
}

/**
 * The "In the sky" section of the day detail panel: point-in-time events for
 * this date, then the ongoing conditions it sits inside.
 */
export function SkyBlock({ year, month, day }: Props) {
  const { events, windows } = getAstroDay(year, month, day);
  if (!events.length && !windows.length) return null;

  return (
    <div className="px-5 sm:px-7 py-5 border-t border-line-soft">
      <h3 className="display text-xl mb-1 text-text-strong">In the sky</h3>
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-2 mb-4">
        Astronomy &amp; astrology for this date
      </p>

      <div className="space-y-4">
        {events.map((event) => (
          <EventRow key={event.id} event={event} />
        ))}
      </div>

      {windows.length > 0 && (
        <div className="mt-5 pt-4 border-t border-line-soft/60">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-2 mb-3">
            Ongoing
          </p>
          <div className="space-y-3">
            {windows.map((window) => (
              <WindowRow key={window.id} window={window} />
            ))}
          </div>
        </div>
      )}

      {!hasCuratedData(year) && (
        <p className="mt-5 text-[12px] text-muted-2 leading-relaxed">
          Moon phases, seasons and portal dates are calculated and accurate for
          any year. Eclipse and retrograde listings are tabulated for{" "}
          {DATA_COVERAGE.from}–{DATA_COVERAGE.to} only, so none are shown here.
        </p>
      )}
    </div>
  );
}

function EventRow({ event }: { event: AstroEvent }) {
  const { Icon, color } = event;
  return (
    <article
      className="rounded-xl border p-4"
      style={{
        borderColor: `${color}33`,
        background: `linear-gradient(150deg, ${color}14, transparent 70%)`,
      }}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="shrink-0 mt-0.5 w-8 h-8 rounded-full border flex items-center justify-center"
          style={{ borderColor: `${color}55`, background: `${color}1a` }}
        >
          <Icon size={15} strokeWidth={2} style={{ color }} />
        </span>
        <div className="min-w-0">
          <h4 className="display text-lg leading-tight" style={{ color }}>
            {event.title}
          </h4>
          <p className="text-muted text-[13px] mt-0.5">{event.summary}</p>
          <p className="text-text/90 text-[14px] leading-relaxed mt-2.5">
            {event.detail}
          </p>
          {event.note && (
            <p className="text-muted-2 text-[12px] mt-2">{event.note}</p>
          )}
        </div>
      </div>
    </article>
  );
}

function WindowRow({ window }: { window: AstroWindow }) {
  const { Icon, color } = window;
  const range = `${format(window.start)} – ${format(window.end)}`;
  return (
    <div className="flex items-start gap-3">
      <Icon
        size={14}
        strokeWidth={2}
        style={{ color }}
        className="shrink-0 mt-1"
        aria-hidden
      />
      <div className="min-w-0">
        <p className="text-[14px] text-text-strong leading-tight">
          {window.title}{" "}
          <span className="text-muted-2 text-[12px] whitespace-nowrap">{range}</span>
        </p>
        <p className="text-muted text-[13px] leading-relaxed mt-0.5">
          {window.detail}
        </p>
      </div>
    </div>
  );
}

function format(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
