// Mirrors the colour tokens in app/globals.css. This copy exists only
// because OG image generation can't read CSS variables. Update both files
// together; do not let them drift.
export const tokens = {
  colors: {
    bg: "#0B0B0A",
    band: "#141413",
    text: "#F2F1EC",
    muted: "#9A9993",
    line: "#2A2A27",
    cream: "#EEECE5",
    ink: "#0E0E0C",
    creamMuted: "#6B6A63",
    accent: "#B69CFF",
    onAccent: "#0B0B0A",
  },
} as const;
