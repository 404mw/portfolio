// The relay job's vector geometry (ui-spec §5.7, "The job"): a 24 × 24 cream sheet with its
// top-right corner cut at 45° by 6, drawn finished with one mark per bot: two ink rules and a violet
// stamp (rules), a violet band and step (team), an ink tick (check) and a folded corner flap
// (update). The `glow` is check's outline flash, so its static state is hidden. 1 unit = 1px; the
// viewBox is `0 -5 24 29` so the step can rise 5 above the sheet. The trail's ghosts are the bare
// `base` silhouette. `jobPivots` gives the motion each part's pivot (viewBox units, for
// `svgOrigin`), so it never measures the SVG. Hardcoded from the spec.

/** The sheet's outline, shared by the job, its ghosts and the glow. */
export const jobBase = "M0 0H18L24 6V24H0Z";

/** The job's marks, in paint order after the base. */
export const jobParts = {
  rules: ["M3 4h11v2.5H3Z", "M3 9h7v2.5H3Z"],
  stamp: "M3 13h5v5H3Z",
  band: "M0 19.5h24V24H0Z",
  step: "M0 -5h10v5H0Z",
  tick: "M11.5 14.5L13 13L15 15L19 11L20.5 12.5L15 18Z",
  fold: "M18 0V6H24Z",
  glow: jobBase,
} as const;

/** Each part's pivot, viewBox units. */
export const jobPivots = {
  rules: [
    [3, 5.25],
    [3, 10.25],
  ],
  stamp: [5.5, 15.5],
  band: [12, 24],
  step: [5, 0],
  tick: [16, 14.5],
  fold: [18, 6],
  glow: [12, 12],
} as const;
