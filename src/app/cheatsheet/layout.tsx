import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cheat sheet",
  description:
    "Reference guide for all life path numbers (1–9, plus master numbers 11, 22, 33), day types, karmic numbers, and the 9-year cycle.",
};

export default function CheatsheetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
