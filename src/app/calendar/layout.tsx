import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
  description:
    "Monthly numerology calendar — see your personal day for every date, with master days, peak days, and karmic days highlighted.",
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
