// One offer's row text (ui-spec §4.1): number, giant title, and the one-line offer under it.
// `titleAs="h3"` in the stack (variant B); `"span"` inside a tab button (variant A), where
// headings aren't allowed. `active` lights the number and title; unselected tabs are dimmed.
// `line` is left out on unselected tabs, so it renders on the selected row only.
// `labelId` gives the number and title ids (`agentRowIds`), so a tab can take its name from
// them without the line.
import { agentRowIds } from "@/lib/agents";
import { rowTitle } from "@/lib/styles";

type AgentRowTextProps = {
  readonly number: string;
  readonly title: string;
  readonly line?: string;
  readonly titleAs: "h3" | "span";
  readonly active: boolean;
  readonly labelId?: string;
};

export function AgentRowText({
  number,
  title,
  line,
  titleAs: Title,
  active,
  labelId,
}: AgentRowTextProps) {
  const Wrapper = Title === "h3" ? "div" : "span";
  const Line = Title === "h3" ? "p" : "span";
  const ids = labelId ? agentRowIds(labelId) : undefined;
  return (
    <Wrapper className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2.5">
      <span
        id={ids?.number}
        className={`font-mono text-meta ${active ? "text-accent" : "text-muted"}`}
      >
        {number}
      </span>
      <Title
        id={ids?.title}
        className={`block ${rowTitle} ${active ? "text-text" : "text-muted/60 group-hover:text-muted"}`}
      >
        {title}
      </Title>
      {line && (
        <Line className="col-start-2 block text-lead leading-normal text-muted">{line}</Line>
      )}
    </Wrapper>
  );
}
