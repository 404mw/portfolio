// The brief builder's pure parts (ui-spec §8.2): the default choices, the summary line and the
// mailto link, built from the choices and the `contact.brief.mail.*` slots. No state, no DOM.
import { contact } from "@/content/home";
import { links } from "@/content/shared";

export type Need = (typeof contact.brief.needs.options)[number];
export type Timeline = (typeof contact.brief.timeline.options)[number];

export type BriefChoices = {
  readonly needs: readonly Need[];
  readonly timeline: Timeline;
  readonly repeat: string;
};

/** Page doc: AI agents pressed, This month checked, nothing typed. */
export const defaultBrief: BriefChoices = {
  needs: [contact.brief.needs.options[0]],
  timeline: contact.brief.timeline.options[1],
  repeat: "",
};

/** The `name`s of the builder's timeline radios and its textarea (read back on mount). */
export const briefFieldNames = { timeline: "timeline", repeat: "repeat" } as const;

// Layout separators, not copy.
const needSeparator = " + ";
const summarySeparator = " · ";
// RFC 6068: line breaks in a mailto body are CRLF (encoded as %0D%0A).
const lineBreak = "\r\n";
const anyLineBreak = /\r\n|\r|\n/g;
// A lone UTF-16 surrogate (from pasted text) makes `encodeURIComponent` throw.
const loneSurrogate = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g;
const replacementChar = "�";

/** Whether a string (say, a radio's value read from the DOM) is one of the timeline options. */
export function isTimeline(value: string): value is Timeline {
  return (contact.brief.timeline.options as readonly string[]).includes(value);
}

/** `encodeURIComponent` that can't throw: lone surrogates become U+FFFD first. */
function encodeSafe(text: string): string {
  return encodeURIComponent(text.replace(loneSurrogate, replacementChar));
}

/** Toggles a need, keeping the options' order so the summary and mail read the same way. */
export function toggleNeed(needs: readonly Need[], need: Need): Need[] {
  const next = needs.includes(need) ? needs.filter((item) => item !== need) : [...needs, need];
  return contact.brief.needs.options.filter((option) => next.includes(option));
}

/** "AI agents + Website · This month", or `summaryEmpty` when no need is pressed. */
export function briefSummary({ needs, timeline }: BriefChoices): string {
  if (needs.length === 0) return contact.brief.summaryEmpty;
  return `${needs.join(needSeparator)}${summarySeparator}${timeline}`;
}

/** The mailto to `links.emailAddress` with the subject and body filled from the choices. */
export function briefMailto({ needs, timeline, repeat }: BriefChoices): string {
  const { mail } = contact.brief;
  const needText = needs.length > 0 ? needs.join(needSeparator) : mail.none;
  const repeatText = repeat.trim().replace(anyLineBreak, lineBreak) || mail.repeatEmpty;

  const subject = `${mail.subjectPrefix} ${needText}`;
  const body = [
    `${mail.need} ${needText}`,
    `${mail.timeline} ${timeline}`,
    `${mail.repeat} ${repeatText}`,
  ].join(lineBreak + lineBreak);

  return `mailto:${links.emailAddress}?subject=${encodeSafe(subject)}&body=${encodeSafe(body)}`;
}
