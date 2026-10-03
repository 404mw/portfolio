// Rix's props (02a-about-options §2a.O0.1): drawn inside the bot's `upper`, one group per reply
// that has one, just right of his right hand. Each starts hidden; the picked reply's prop shows
// with no JavaScript (CSS `:has` through `group/about`). Motion hooks: `data-bot="props"`,
// `data-bot="prop"` with `data-prop` / `data-prop-for`, and `data-prop-part` on flourish parts.
import { about } from "@/content/home";
import { aboutReplyProp, replyShow } from "@/lib/aboutReplies";
import { botFills } from "@/lib/botFills";
import { rixProps } from "@/lib/rixProps";

export function RixProps() {
  return (
    <g data-bot="props">
      {about.replies.map((reply, index) => {
        const name = aboutReplyProp[reply.key];
        if (name === null) return null;
        return (
          <g
            key={reply.key}
            data-bot="prop"
            data-prop={name}
            data-prop-for={index}
            className={`opacity-0 ${replyShow.opacity[index] ?? ""}`}
          >
            {rixProps[name].parts.map((part) => (
              <path
                key={part.d}
                d={part.d}
                fillRule="evenodd"
                data-prop-part={part.hook}
                className={botFills[part.colour]}
              />
            ))}
          </g>
        );
      })}
    </g>
  );
}
