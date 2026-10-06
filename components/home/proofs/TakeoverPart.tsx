// The frame of a takeover's parts 2 to 6 (ui-spec §7.3.1): a section named by its headline. The
// head holds the mono eyebrow over the project's own headline; the body sits under it, and from
// `lg` beside it (head in the left third, body in the right two thirds, its first line level with
// the headline); the optional wide slot (shots, the diagram) spans both.
import type { ReactNode } from "react";
import type { TakeoverPartKey } from "@/lib/proofs";
import { condensed, metaLabelOnCream } from "@/lib/styles";

type TakeoverPartProps = {
  readonly part: Exclude<TakeoverPartKey, "intro" | "means">;
  readonly headlineId: string;
  readonly label: string;
  readonly headline: string;
  readonly children: ReactNode;
  readonly wide?: ReactNode;
};

export function TakeoverPart({ part, headlineId, label, headline, children, wide }: TakeoverPartProps) {
  return (
    <section
      data-anim="takeover-part"
      data-part={part}
      aria-labelledby={headlineId}
      className="grid gap-x-10 gap-y-6 border-t border-ink/15 pt-8 md:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
    >
      <div data-anim="takeover-part-head" className="flex min-w-0 flex-col gap-3">
        <p className={`${metaLabelOnCream} font-medium tracking-[0.06em] uppercase`}>{label}</p>
        <h3
          id={headlineId}
          className={`max-w-xl font-display text-step leading-[1.05] font-semibold tracking-[-0.02em] text-balance text-ink ${condensed}`}
        >
          {headline}
        </h3>
      </div>
      <div data-anim="takeover-part-body" className="flex min-w-0 flex-col items-start gap-6 lg:pt-7.5">
        {children}
      </div>
      {wide && (
        <div data-anim="takeover-part-wide" className="mt-3 flex min-w-0 flex-col gap-6 lg:col-span-2">
          {wide}
        </div>
      )}
    </section>
  );
}
