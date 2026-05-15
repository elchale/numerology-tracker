import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Numerology Chart",
  description: "Your full numerology profile — Life Path, Birthday, Attitude, Pinnacles, Challenges, and name-based numbers.",
};

export default function ChartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
