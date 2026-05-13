"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS: { href: string; label: string; glyph: string }[] = [
  { href: "/", label: "Today", glyph: "◉" },
  { href: "/calendar", label: "Month", glyph: "▦" },
  { href: "/year", label: "Year", glyph: "◫" },
  { href: "/timeline", label: "Timeline", glyph: "═" },
  { href: "/cheatsheet", label: "Cheat sheet", glyph: "✦" },
];

export function NavTabs() {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="no-print border-b border-line-soft bg-ink-0/40">
      <div className="mx-auto max-w-6xl px-2 sm:px-4 lg:px-6">
        <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide -mb-px">
          {TABS.map((tab) => {
            const active =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={[
                  "relative shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-sm transition",
                  active
                    ? "text-text-strong"
                    : "text-muted hover:text-text-strong",
                ].join(" ")}
              >
                <span
                  className={[
                    "text-base leading-none",
                    active ? "text-gold" : "text-muted-2",
                  ].join(" ")}
                  aria-hidden
                >
                  {tab.glyph}
                </span>
                <span>{tab.label}</span>
                {active && (
                  <span className="absolute left-2 right-2 -bottom-px h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
