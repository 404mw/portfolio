"use client";
// The brief builder (ui-spec §8.1–8.2): needs, timeline and a free-text line, then a Send link
// that opens the reader's email app with the brief filled in. The form never posts. The server
// renders the default choices' mailto, so Send works without JavaScript; there, the controls it
// can't follow and the summary are hidden (`noscript:hidden`), so Send sends what it shows. With
// JavaScript, Send and the summary follow the choices live, including any made before hydration.
import { useId, useRef, type FormEvent } from "react";
import { NeedChips } from "@/components/home/contact/NeedChips";
import { RepeatField } from "@/components/home/contact/RepeatField";
import { SendBriefLink } from "@/components/home/contact/SendBriefLink";
import { TimelineSegments } from "@/components/home/contact/TimelineSegments";
import { contact } from "@/content/home";
import { useBriefState } from "@/hooks/useBriefState";
import { briefMailto, briefSummary, defaultBrief } from "@/lib/brief";
import { metaLabel } from "@/lib/styles";

function preventSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
}

export function BriefBuilder() {
  const headingId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const { brief, toggle, setTimeline, setRepeat } = useBriefState(formRef);
  const copy = contact.brief;

  return (
    <form
      ref={formRef}
      data-anim="reveal"
      aria-labelledby={headingId}
      onSubmit={preventSubmit}
      className="flex flex-col gap-8 rounded-3xl border border-line bg-band p-6 md:p-8 lg:p-10"
    >
      <h3 id={headingId} className="sr-only">
        {copy.heading}
      </h3>
      <NeedChips
        legend={copy.needs.legend}
        options={copy.needs.options}
        pressed={brief.needs}
        onToggle={toggle}
      />
      <TimelineSegments
        legend={copy.timeline.legend}
        options={copy.timeline.options}
        defaultChecked={defaultBrief.timeline}
        onChange={setTimeline}
      />
      <RepeatField
        label={copy.repeat.label}
        placeholder={copy.repeat.placeholders[0]}
        onChange={setRepeat}
      />
      <SendBriefLink href={briefMailto(brief)} label={copy.send} hint={copy.sendHint} />
      <p aria-live="polite" className={`text-center noscript:hidden ${metaLabel}`}>
        {briefSummary(brief)}
      </p>
    </form>
  );
}
