"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useConfig } from "@/store/useConfig";
import { RequireConfig } from "@/components/RequireConfig";
import { YearTimeline } from "@/components/timeline/YearTimeline";
import { lifePath } from "@/lib/numerology";

export default function TimelinePage() {
  return (
    <RequireConfig>
      <TimelineInner />
    </RequireConfig>
  );
}

function TimelineInner() {
  const birth = useConfig((s) => s.birth);
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [windowSpan, setWindowSpan] = useState<"recent" | "future" | "wide">("recent");

  if (!birth) return null;

  const lp = lifePath(birth);
  const currentYear = today.getFullYear();
  const range =
    windowSpan === "recent"
      ? { from: currentYear - 3, to: currentYear + 9 }
      : windowSpan === "future"
        ? { from: currentYear, to: currentYear + 20 }
        : { from: birth.year, to: birth.year + 80 };

  return (
    <div className="anim-fade-up">
      <header className="mb-6 sm:mb-8">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-2">
          Lifetime view
        </p>
        <h1 className="display text-3xl sm:text-5xl text-text-strong mt-1">
          Your personal years
        </h1>
        <p className="text-muted mt-3 text-[15px] max-w-2xl">
          A linear walk through the 9-year cycle. Master years (11, 22, 33) and
          years that match your Life Path{" "}
          <span className="num-display text-cyan ml-1">{lp}</span> are highlighted.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <RangeButton
            active={windowSpan === "recent"}
            onClick={() => setWindowSpan("recent")}
          >
            Near term
          </RangeButton>
          <RangeButton
            active={windowSpan === "future"}
            onClick={() => setWindowSpan("future")}
          >
            Next 20 years
          </RangeButton>
          <RangeButton
            active={windowSpan === "wide"}
            onClick={() => setWindowSpan("wide")}
          >
            Whole life
          </RangeButton>
        </div>
      </header>

      <YearTimeline
        birth={birth}
        fromYear={range.from}
        toYear={range.to}
        currentYear={currentYear}
        onSelectYear={(y) => router.push(`/year?y=${y}`)}
      />
    </div>
  );
}

function RangeButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "chip transition",
        active
          ? "!border-gold/60 !text-gold !bg-gold/10"
          : "hover:border-gold/40",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
