// Font loaders for marwix.dev, wired to CSS variables consumed by
// app/globals.css (`@theme inline`). One job: load fonts, nothing else.
// Acosta is the display face: a local file (assets/fonts/acosta.otf) with one
// weight, regular 400, and no variable axes. Acosta has letters and digits
// only, no punctuation at all, so next/font's automatic fallback family is
// turned off for it and the next family in the display stack is ours:
// `displayPunct`, IBM Plex Sans Bold as a local file
// (assets/fonts/ibm-plex-sans-latin-700.woff2, static 700, latin subset). It
// is local, not a second next/font/google instance, because next/font gives
// every Google instance of one font the same family name ("IBM Plex Sans"),
// which would merge it with the body face. A local file gets its own family
// name, and that family has only a 700 face, so any character Acosta lacks
// renders in Plex Sans Bold whatever weight the display element asks for.
// IBM Plex Sans is also the body face, loaded from Google as a variable font
// (its weight axis covers the 400, 500 and 600 the site uses). IBM Plex Mono
// has no variable version; it loads 400 and 500 for labels and meta.
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import localFont from "next/font/local";

export const acosta = localFont({
  src: "../assets/fonts/acosta.otf",
  variable: "--font-acosta",
  weight: "400",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
});

export const displayPunct = localFont({
  src: "../assets/fonts/ibm-plex-sans-latin-700.woff2",
  variable: "--font-display-punct",
  weight: "700",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
});

export const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});
