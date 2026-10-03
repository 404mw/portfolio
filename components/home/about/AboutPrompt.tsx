// The display prompt above the picks (02a-about-options §2a.B): the board title. It labels the
// picks' fieldset by its id. Motion hook: `about-prompt`.
import { about } from "@/content/home";
import { condensed } from "@/lib/styles";

type AboutPromptProps = { readonly id: string };

export function AboutPrompt({ id }: AboutPromptProps) {
  return (
    <h3
      id={id}
      data-anim="about-prompt"
      className={`max-w-160 font-display text-card font-semibold leading-[1.05] tracking-[-0.02em] text-balance text-text ${condensed}`}
    >
      {about.prompt}
    </h3>
  );
}
