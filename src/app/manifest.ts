import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Numen — Personal Numerology",
    short_name: "Numen",
    description:
      "A deterministic numerology calendar. Personal year, month, and day energies — and the cheat sheet behind them.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0a14",
    theme_color: "#0b0a14",
    categories: ["lifestyle", "utilities", "reference"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
