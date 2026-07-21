"use client";

import type { AstroEvent, AstroWindow } from "@/lib/astro/types";

interface Props {
  entry: AstroEvent | AstroWindow;
  /** Windows read as ongoing conditions, so they get a softer treatment. */
  muted?: boolean;
}

/** Compact pill naming one sky event — used in the hero and day headers. */
export function AstroChip({ entry, muted }: Props) {
  const { Icon, title, color } = entry;
  return (
    <span
      className="chip"
      style={{
        color: muted ? "var(--color-text)" : color,
        borderColor: muted ? "var(--color-line)" : `${color}55`,
        background: muted ? undefined : `color-mix(in srgb, ${color} 10%, transparent)`,
      }}
    >
      <Icon size={12} strokeWidth={2.25} style={{ color }} aria-hidden />
      {title}
    </span>
  );
}
