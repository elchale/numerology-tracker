import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
  description: "Configure your birth date and birth time.",
  robots: { index: false, follow: false },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
