"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BirthDate } from "@/lib/types";

interface ConfigState {
  birth: BirthDate | null;
  name: string;
  fullName: string;
  theme: "light" | "dark" | "system";
  setBirth: (birth: BirthDate) => void;
  setName: (name: string) => void;
  setFullName: (fullName: string) => void;
  setTheme: (theme: "light" | "dark" | "system") => void;
  reset: () => void;
}

export const useConfig = create<ConfigState>()(
  persist(
    (set) => ({
      birth: null,
      name: "",
      fullName: "",
      theme: "system",
      setBirth: (birth) => set({ birth }),
      setName: (name) => set({ name }),
      setFullName: (fullName) => set({ fullName }),
      setTheme: (theme) => set({ theme }),
      reset: () => set({ birth: null, name: "", fullName: "" }),
    }),
    {
      name: "numerology-config",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        birth: state.birth,
        name: state.name,
        fullName: state.fullName,
        theme: state.theme,
      }),
    },
  ),
);

/**
 * Returns true once the persist middleware has finished rehydrating from
 * localStorage on the client. Always false on server / first paint, so use
 * this to gate redirects and content that depend on persisted state.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (callback) => useConfig.persist.onFinishHydration(callback),
    () => useConfig.persist.hasHydrated(),
    () => false,
  );
}
