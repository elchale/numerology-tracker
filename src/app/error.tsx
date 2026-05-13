"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center anim-fade-up">
      <div className="card p-8 sm:p-10 max-w-md text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
          Something cracked
        </p>
        <h1 className="display text-3xl sm:text-4xl text-text-strong mt-2">
          A small breakdown
        </h1>
        <p className="text-text/85 mt-3 leading-relaxed text-[15px]">
          The calculation hit a snag. Your data is safe on this device — try
          again, or head back to today.
        </p>
        {error.digest && (
          <p className="text-[10px] text-muted-2 mt-3 font-mono">
            ref: {error.digest}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={reset} className="btn btn-primary">
            Try again
          </button>
          <Link href="/" className="btn btn-ghost">
            Back to today
          </Link>
        </div>
      </div>
    </div>
  );
}
