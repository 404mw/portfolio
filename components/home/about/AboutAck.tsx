// About's acks (02a-about-options §2a.O0): one paragraph per reply, hidden until its radio is
// checked (CSS `:has`, so it works without JavaScript); another pick swaps it, each led by an
// accent hairline. `className` is its placement. Motion hook: `about-ack`.
import { about } from "@/content/home";
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
    </p>
  ));
}
