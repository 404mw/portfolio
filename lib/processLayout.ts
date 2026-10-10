// Process' classes that depend on the flow's step count (ui-spec §5.1), written out as literal
// strings so Tailwind sees each one. Below `wide` (1440) the steps are rows; from `wide` they stand
// across on the ground line. Six across at 1440 with the usual 32px gap give about 195px columns
// for the 136px bots, and the widest step title (about 200px) still clears the next by about 25px;
// at 1280 it didn't, so every flow stays stacked below 1440. Both counts share one gap.
import type { process } from "@/content/home";

/** The step counts the flows use. */
export type FlowCount = (typeof process.flows)[keyof typeof process.flows]["steps"]["length"];

export type FlowLayout = {
  /** The list's and the return row's column grid. */
  readonly grid: string;
  /** Where each chevron sits: centred in the gap after its step, on the ground line. */
  readonly chevron: string;
  /** The return path's box: from the last bot back to step 2's. */
  readonly returnBox: string;
  /** The fix arch's right edge: from step 4's bot over to step 5's (one gap + 64px past step 4, `FIX_STEP`). */
  readonly fixBox: string;
  /**
   * The hand-off elbow's right edge: from step 3's column to the list's right end, the ground
   * line's (the columns and gaps past step 3, `HANDOFF_STEP`), so its arrowhead's tip stops there.
   */
  readonly handoffBox: string;
};

export const flowLayouts: Record<FlowCount, FlowLayout> = {
  5: {
    grid: "wide:grid-cols-5 wide:gap-x-8",
    chevron: "wide:-right-6",
    returnBox: "wide:col-start-2 wide:col-span-3 wide:ml-15.5 wide:-mr-24",
    fixBox: "wide:-right-24",
    handoffBox: "wide:right-[calc(-200%_-_4rem)]",
  },
  6: {
    grid: "wide:grid-cols-6 wide:gap-x-8",
    chevron: "wide:-right-6",
    returnBox: "wide:col-start-2 wide:col-span-4 wide:ml-15.5 wide:-mr-24",
    fixBox: "wide:-right-24",
    handoffBox: "wide:right-[calc(-300%_-_6rem)]",
  },
};
