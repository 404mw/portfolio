// Process' classes that depend on the flow's step count (ui-spec §5.1), written out as literal
// strings so Tailwind sees each one. Below `lg` the steps are rows; from `lg` they stand across on
// the ground line. Six across fit 1024 with a 16px gap up to `xl` (144px columns for the 136px
// bots), then the usual 32px.
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
  /** The fix arch's right edge: from step 3's bot over to step 4's (one gap + 64px past step 3). */
  readonly fixBox: string;
};

export const flowLayouts: Record<FlowCount, FlowLayout> = {
  5: {
    grid: "lg:grid-cols-5 lg:gap-x-8",
    chevron: "lg:-right-6",
    returnBox: "lg:col-start-2 lg:col-span-3 lg:ml-15.5 lg:-mr-24",
    fixBox: "lg:-right-24",
  },
  6: {
    grid: "lg:grid-cols-6 lg:gap-x-4 xl:gap-x-8",
    chevron: "lg:-right-4 xl:-right-6",
    returnBox: "lg:col-start-2 lg:col-span-4 lg:ml-15.5 lg:-mr-20 xl:-mr-24",
    fixBox: "lg:-right-20 xl:-right-24",
  },
};
