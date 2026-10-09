// Chat demo, finished state (ui-spec §4.4): one short exchange, drawn from an ordered list of
// messages, so either side can open it (the reminder opens with the agent). Each bubble starts
// with its speaker's name for screen readers, so the turn isn't carried by side and colour alone.
// Before each agent message sits its typing dots, in the markup but hidden until the motion pass.
// One entry is the action taken (§4.10): the receipt, on neither side, at the point the job got
// done. Every part carries its place in the sequence (`data-demo-order`).
import { Fragment } from "react";
import { DemoActionLine } from "@/components/home/agents/DemoActionLine";
import { TypingBubble } from "@/components/TypingBubble";
import { agents } from "@/content/home";
import type { ChatDemoContent } from "@/lib/agents";
import { metaLabel } from "@/lib/styles";

const themBubble =
  "max-w-[70%] self-start rounded-xl rounded-bl-sm bg-line/40 px-4.5 py-3.5 text-body-lg text-text";

type ChatDemoProps = { readonly demo: ChatDemoContent };

export function ChatDemo({ demo }: ChatDemoProps) {
  // Each entry's place in the sequence: an agent message comes after its typing dots.
  const orders = demo.messages.reduce<number[]>((list, message, index) => {
    const before = index === 0 ? 0 : list[index - 1];
    return [...list, before + (message.from === "agent" ? 2 : 1)];
  }, []);
  return (
    <div className="flex flex-col gap-3.5">
      {demo.messages.map((message, index) =>
        message.from === "action" ? (
          <DemoActionLine key={index} action={message} order={orders[index]} />
        ) : message.from === "them" ? (
          <p key={index} data-demo-order={orders[index]} className={themBubble}>
            <span className="sr-only">{demo.asker} </span>
            {message.text}
          </p>
        ) : (
          <Fragment key={index}>
            <TypingBubble side="end" anim="demo-typing" data-demo-order={orders[index] - 1} />
            <div
              data-demo-order={orders[index]}
              className="flex max-w-[72%] flex-col items-end gap-1.5 self-end"
            >
              <p className="rounded-xl rounded-br-sm bg-accent px-4.5 py-3.5 text-body-lg text-on-accent">
                <span className="sr-only">{agents.demoAgent} </span>
                {message.text}
              </p>
              {message.meta !== undefined && <p className={metaLabel}>{message.meta}</p>}
            </div>
          </Fragment>
        ),
      )}
    </div>
  );
}
