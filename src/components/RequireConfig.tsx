"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useConfig, useHydrated } from "@/store/useConfig";

export function RequireConfig({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const birth = useConfig((s) => s.birth);

  useEffect(() => {
    if (hydrated && !birth) {
      router.replace("/settings");
    }
  }, [hydrated, birth, router]);

  if (!hydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-muted-2">
        <div className="flex flex-col items-center gap-3 anim-fade-up">
          <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center">
            <span className="display text-gold animate-pulse">N</span>
          </div>
          <p className="text-xs uppercase tracking-[0.25em]">Loading</p>
        </div>
      </div>
    );
  }

  if (!birth) return null;

  return <>{children}</>;
}
