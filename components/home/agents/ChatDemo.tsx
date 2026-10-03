// Customer messages demo, finished state (ui-spec §4.4): the customer asks, the agent replies,
// the customer thanks it. The typing dots are in the markup but hidden until the motion pass.
import { TypingBubble } from "@/components/TypingBubble";
import { agents } from "@/content/home";
import { metaLabel } from "@/lib/styles";

const customerBubble =
  "max-w-[70%] self-start rounded-xl rounded-bl-sm bg-line/40 px-4.5 py-3.5 text-body-lg text-text";

export function ChatDemo() {
  const { customer, reply, replyMeta, thanks } = agents.demos.chat;
  return (
    <div className="flex flex-col gap-3.5">
      <p data-demo-order={1} className={customerBubble}>
        {customer}
      </p>
      <TypingBubble side="end" anim="demo-typing" data-demo-order={2} />
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
