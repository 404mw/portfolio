// Customer messages demo, finished state (ui-spec §4.4): the customer asks, the agent replies,
// the customer thanks it. The typing dots are in the markup but hidden until the motion pass.
import { agents } from "@/content/home";
import { metaLabel } from "@/lib/styles";

const customerBubble =
  "max-w-[70%] self-start rounded-xl rounded-bl-sm bg-line/40 px-4.5 py-3.5 text-body-lg text-text";

const typingDots = ["a", "b", "c"] as const;

export function ChatDemo() {
  const { customer, reply, replyMeta, thanks } = agents.demos.chat;
  return (
    <div className="flex flex-col gap-3.5">
      <p data-demo-order={1} className={customerBubble}>
        {customer}
      </p>
      <div
        aria-hidden="true"
        data-anim="demo-typing"
        data-demo-order={2}
        className="hidden items-center gap-1.5 self-end rounded-xl rounded-br-sm bg-line/40 px-4.5 py-4"
      >
        {typingDots.map((dot) => (
          <span key={dot} className="size-1.5 rounded-full bg-muted" />
        ))}
      </div>
      <div data-demo-order={3} className="flex max-w-[72%] flex-col items-end gap-1.5 self-end">
        <p className="rounded-xl rounded-br-sm bg-accent px-4.5 py-3.5 text-body-lg text-on-accent">
          {reply}
        </p>
        <p className={metaLabel}>{replyMeta}</p>
      </div>
      <p data-demo-order={4} className={customerBubble}>
        {thanks}
      </p>
    </div>
  );
}
