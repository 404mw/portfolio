// Option B's board (02a-about-options §2a.B): the poster cards in content order (groups first,
// "Just looking" last), two columns on phones and three from `md`, labelled by the prompt.
import { AboutPosterCard } from "@/components/home/about/poster/AboutPosterCard";
import { about } from "@/content/home";
import { aboutReplyProp } from "@/lib/aboutReplies";
import type { AboutScope } from "@/lib/aboutScope";

type AboutPosterBoardProps = { readonly scope: AboutScope };

export function AboutPosterBoard({ scope }: AboutPosterBoardProps) {
  return (
    <fieldset
      aria-labelledby={scope.id("prompt")}
      className="mt-4 grid min-w-0 grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
    >
      {about.replies.map((reply, index) => (
        <AboutPosterCard
          key={reply.key}
          index={index}
          value={reply.key}
          label={reply.label}
          prop={aboutReplyProp[reply.key]}
          name={scope.name}
        />
      ))}
    </fieldset>
  );
}
