"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import { useConfig, useHydrated } from "@/store/useConfig";

export function Header() {
  const hydrated = useHydrated();
  const name = useConfig((s) => s.name);
  const birth = useConfig((s) => s.birth);

  const showSubject = hydrated && birth;
  const greetingName = name?.trim() || "Friend";

  return (
    <header className="no-print sticky top-0 z-20 border-b border-line-soft backdrop-blur-md bg-ink-0/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center bg-ink-1 overflow-hidden">
            <span className="display text-gold text-xl leading-none">N</span>
            <span className="absolute inset-0 rounded-full ring-1 ring-gold/20 group-hover:ring-gold/50 transition" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="display text-text-strong text-lg tracking-tight">
              Numen
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-2">
              {showSubject ? `for ${greetingName}` : "Personal Numerology"}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/cheatsheet"
            className="hidden sm:inline-flex chip hover:border-gold/40 transition"
          >
            Cheat sheet
          </Link>
          <Link
            href="/settings"
            className="chip hover:border-gold/40 transition"
            aria-label="Settings"
          >
            <Settings size={13} strokeWidth={2} aria-hidden />
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
