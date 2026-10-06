// The pointer panel (ui-spec §4.4): the website card's "custom websites" row. Not an agent demo:
// it states the offer, previews section 03's step titles (existing copy) and links to that
// section. Its header has no status dot. The link is secondary, in page: Book a call stays the
// only primary action. Timed parts carry `data-demo-order` for the motion pass.
import { AgentDemoFrame } from "@/components/home/agents/AgentDemoFrame";
import { ArrowRightIcon } from "@/components/icons/ArrowRightIcon";
import { agents, web } from "@/content/home";
import type { AgentsVariant } from "@/lib/agents";
import { listNumber } from "@/lib/listNumber";
import { routes } from "@/lib/routes";
import { condensed, metaLabel, pillOutline } from "@/lib/styles";

type AgentPointerPanelProps = { readonly variant: AgentsVariant };

export function AgentPointerPanel({ variant }: AgentPointerPanelProps) {
  return (
    <AgentDemoFrame
      variant={variant}
      header={
        <>
          <span>{agents.pointer.status}</span>
          <span>{web.number}</span>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <p
          data-demo-order={1}
          className={`font-display text-card font-semibold leading-[1.05] tracking-[-0.02em] text-balance text-text ${condensed}`}
        >
          {agents.pointer.heading}
        </p>
        <ol data-demo-order={2} className="flex flex-col border-t border-line">
          {web.steps.map((step, index) => (
            <li key={step.title} className="flex items-baseline gap-4 border-b border-line py-3">
              <span className={metaLabel}>{listNumber(index)}</span>
              <span className="text-body-lg text-text">{step.title}</span>
            </li>
          ))}
        </ol>
        <a data-demo-order={3} href={routes.web} className={`${pillOutline} gap-2 self-start`}>
          {agents.pointer.cta}
          <ArrowRightIcon className="size-4 rotate-90" />
        </a>
      </div>
    </AgentDemoFrame>
  );
}
