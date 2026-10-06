// About's acks (02a-about-options §2a.O0, §2a.R3): one paragraph per reply, hidden until its radio
// is checked (CSS `:has`, so it works without JavaScript); another pick swaps it, each led by an
// accent hairline. A card with its own set in Agents and Process adds the shared "set for you"
// line, hidden without JavaScript, where those sections stay on the default. `className` is its
// placement. Motion hooks: `about-ack`, `about-ack-set`.
import { about } from "@/content/home";
import { pickSet } from "@/lib/aboutPick";
import { replyShow } from "@/lib/aboutReplies";

type AboutAckProps = { readonly className: string };

export function AboutAck({ className }: AboutAckProps) {
  return about.replies.map((reply, index) => (
    <p
      key={reply.key}
      data-anim="about-ack"
      className={`hidden ${replyShow.block[index] ?? ""} text-summary leading-snug text-pretty text-text ${className}`}
    >
      <span aria-hidden="true" className="mb-4 block h-0.5 w-6 bg-accent" />
      {reply.ack}
      {pickSet(reply.key) !== "default" && (
        <span
          data-anim="about-ack-set"
          className="mt-3 block text-lead leading-normal text-muted noscript:hidden"
        >
          {about.ackSet}
        </span>
      )}
    </p>
  ));
}
