"use client";

// The showcase diagram's motion (hooks/useShowcaseMotion.ts), mounted by `ShowcaseDiagram` inside
// its own takeover. It renders nothing, so the diagram and its markup stay server-rendered.
import { useElementById } from "@/hooks/useElementById";
import { useShowcaseMotion } from "@/hooks/useShowcaseMotion";

type ShowcaseMotionProps = {
  /** The id of the takeover `<dialog>` the diagram is in. */
  readonly dialogId: string;
};

export function ShowcaseMotion({ dialogId }: ShowcaseMotionProps) {
  // Declared first: its layout effect fills the ref before the motion hook's effect runs.
  const dialog = useElementById<HTMLDialogElement>(dialogId);
  useShowcaseMotion(dialog);
  return null;
}
