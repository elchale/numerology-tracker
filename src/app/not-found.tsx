import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lost",
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center anim-fade-up">
      <div className="card p-8 sm:p-10 max-w-md text-center relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-25 bg-gold"
        />
        <p className="relative text-[11px] uppercase tracking-[0.22em] text-muted-2">
          Lost in transit
        </p>
        <h1 className="display num-display text-7xl sm:text-8xl text-gold mt-2 relative leading-none">
          404
        </h1>
        <p className="text-text/85 mt-4 leading-relaxed text-[15px] relative">
          The page you&apos;re looking for isn&apos;t in this calendar. Try one
          of the paths below.
        </p>
        <div className="relative mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/" className="btn btn-primary">
            Today
          </Link>
          <Link href="/calendar" className="btn btn-ghost">
            Calendar
          </Link>
          <Link href="/cheatsheet" className="btn btn-ghost">
            Cheat sheet
          </Link>
        </div>
      </div>
    </div>
  );
}
