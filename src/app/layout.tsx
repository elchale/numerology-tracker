import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { NavTabs } from "@/components/NavTabs";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const SITE_NAME = "Numen";
const SITE_TAGLINE = "Personal Numerology";
const SITE_DESCRIPTION =
  "A deterministic numerology calendar. See your personal year, month, and day energies — and the cheat sheet behind them. Stored locally, never sent to a server.";

export const metadata: Metadata = {
  metadataBase: new URL("https://numen.app"),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "numerology",
    "personal year",
    "personal day",
    "life path",
    "master numbers",
    "calendar",
  ],
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0a14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-ink-2 focus:text-text-strong focus:px-4 focus:py-2 focus:rounded-lg focus:border focus:border-gold"
        >
          Skip to main content
        </a>
        <div className="min-h-screen flex flex-col">
          <Header />
          <NavTabs />
          <main
            id="main"
            className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pb-24 pt-4 sm:pt-6"
          >
            {children}
          </main>
          <footer className="no-print border-t border-line-soft mt-auto">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-xs text-muted-2 flex flex-wrap items-center justify-between gap-2">
              <span className="display italic">{SITE_NAME}</span>
              <span>
                Pythagorean numerology · Stored locally on this device
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
