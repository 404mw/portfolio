// A proof card's proof line (ui-spec §7.2): one fact in mono caps behind a violet "live" dot, over a
// hairline. `mt-auto` pins it to the card's foot, so the rules line up across a row.
type ProofLineProps = {
  readonly text: string;
};

export function ProofLine({ text }: ProofLineProps) {
  return (
    <p className="mt-auto flex items-center gap-2.5 border-t border-ink/15 pt-3 font-mono text-meta leading-[1.3] font-medium tracking-[0.06em] text-ink uppercase">
      <span aria-hidden="true" className="size-1.75 shrink-0 rounded-full bg-accent ring-3 ring-accent/25" />
      {text}
    </p>
  );
}
