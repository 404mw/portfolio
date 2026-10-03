// About's scope (ui-spec 02a-about-options §2a.O0.2), pure: the section id, the radio group's
// `name` and the part ids for one About instance. On `/` (no option) it gives the home values
// (`about`, `about-for`, `about-<part>`), so the home markup is unchanged; an option gets its own
// (`about-b`, `about-for-b`, `about-b-<part>`), so picks never cross instances. The /rix playground
// runs option B's Rix under `aboutScope("b")`.
import { sectionIds } from "@/lib/routes";

/** Option B, the Poster board: the About build on `/`. */
export type AboutOption = "b";

/** The parts that carry an id: the prompt (the picks' label). */
export type AboutPart = "prompt";

export type AboutScope = {
  readonly sectionId: string;
  readonly name: string;
  readonly id: (part: AboutPart) => string;
};

export function aboutScope(option?: AboutOption): AboutScope {
  const base = sectionIds.about;
  const sectionId = option === undefined ? base : `${base}-${option}`;
  return {
    sectionId,
    name: option === undefined ? `${base}-for` : `${base}-for-${option}`,
    id: (part) => `${sectionId}-${part}`,
  };
}

/** The home radio group's `name`: the default for every hook and link that reads a pick. */
export const homeAboutName = aboutScope().name;
