import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timeline",
  description:
    "A lifetime view of your personal years. Master years and Life Path years are highlighted.",
};

export default function TimelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
