// Google Font loaders for marwix.dev, wired to CSS variables consumed by
// app/globals.css (`@theme inline`). One job: load fonts, nothing else.
// Bricolage Grotesque is the display face, loaded as a variable font with its
// `opsz` (optical size) and `wdth` (width) axes alongside weight. Geist is the
// body face. Geist Mono loads 400 and 500 for labels and 800 for the wordmark.
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";

export const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  weight: "variable",
  axes: ["opsz", "wdth"],
  subsets: ["latin"],
  display: "swap",
});

export const geist = Geist({
  variable: "--font-geist",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  weight: ["400", "500", "800"],
  subsets: ["latin"],
  display: "swap",
});
