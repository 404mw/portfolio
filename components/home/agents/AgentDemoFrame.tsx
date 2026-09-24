// The demo panel (ui-spec §4.1): a raised card with a status header ("agent running" and the
// agent's slug) over the demo. Below `lg` it's at least 384px tall; from `lg` it keeps a shape,
// 10:9 beside the tab list (variant A), 16:10 beside each stack row (variant B), as a minimum:
// `min-h-auto` and no overflow clipping let aspect-ratio grow the panel when the demo needs it.
import type { ReactNode } from "react";
import { agents } from "@/content/home";
import type { AgentsVariant } from "@/lib/agents";
import { metaLabel } from "@/lib/styles";

const shape: Record<AgentsVariant, string> = {
  tabs: "lg:aspect-[10/9]",
  stack: "lg:aspect-[16/10]",
};

type AgentDemoFrameProps = {
  readonly slug: string;
  readonly variant: AgentsVariant;
  readonly children: ReactNode;
};

export function AgentDemoFrame({ slug, variant, children }: AgentDemoFrameProps) {
  return (
    <div
      className={`flex min-h-96 flex-col rounded-3xl border border-line bg-band lg:min-h-auto ${shape[variant]}`}
    >
      <div
        className={`flex items-center justify-between gap-4 border-b border-line px-5 py-4 ${metaLabel}`}
      >
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            data-anim="demo-status-dot"
            className="size-1.5 rounded-full bg-accent"
          />
          {agents.demoStatus}
        </span>
        <span>{slug}</span>
      </div>
      <div className="relative flex flex-1 flex-col justify-center p-5 md:p-8 xl:p-9">
        {children}
      </div>
    </div>
  );
}
