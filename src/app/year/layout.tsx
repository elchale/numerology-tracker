import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Year overview",
  description:
    "Twelve months of your personal year at a glance. Master months, peak days, and karmic days summarised.",
};

export default function YearLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
