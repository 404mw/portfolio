// The current year, read at build time (pages are static), for the footer's © line.
export function currentYear(): number {
  return new Date().getFullYear();
}
