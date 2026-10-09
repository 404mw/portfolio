"use client";
// The "Shown for: <card>" tag at the top of Agents and Process (ui-spec §0.6): it states the pick
// and changes it in place. A native <details>: the summary is the disclosure button, and the five
// cards open as a radio group in the flow under it (no overlay). Choosing one sets About's pick
// (`setAboutPick`), so both sections, About's radio and the WhatsApp links follow, and
// `holdInView` keeps the tag where it was while heights above it change (at once, and again when
// the sections' swap lands after its fade-out). A pointer choice closes
// the list and focuses the summary; an arrow-key change selects live and keeps it open; Escape, or
// a press or focus leaving the tag, closes it. After a change made here, only this tag's live
// region speaks. Hidden without JavaScript, where the sections stay on the default set.
// Motion (`useShownForMotion`), through the hooks `pick-tag` and `pick-tag-list`: the list fades in
// on open and the chevron turns; the markup is the static layout either way.
import { useRef, useState, type MouseEvent } from "react";
import { AboutPropGlyph } from "@/components/home/about/AboutPropGlyph";
import { ShownForOption } from "@/components/home/pick/ShownForOption";
import { ChevronUpIcon } from "@/components/icons/ChevronUpIcon";
import { about, shownFor } from "@/content/home";
import { useAboutPick } from "@/hooks/useAboutPick";
import { useCloseOnLeave } from "@/hooks/useCloseOnLeave";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useShownForMotion } from "@/hooks/useShownForMotion";
import { setAboutPick } from "@/lib/aboutPick";
import { aboutReply, aboutReplyProp } from "@/lib/aboutReplies";
import { holdInView } from "@/lib/holdInView";
import { focusRing } from "@/lib/styles";

type ShownForTagProps = {
  /** The section the tag sits in; its radio group is `<sectionId>-shown-for`. */
  readonly sectionId: string;
};

export function ShownForTag({ sectionId }: ShownForTagProps) {
  const pick = useAboutPick();
  const reply = aboutReply(pick);
  const { open, onToggle, close, detailsRef, summaryRef } = useDisclosure();
  useCloseOnLeave(detailsRef, open, close);
  useShownForMotion(detailsRef);
  // The last press in the list was a pointer's (not a key's): it closes the list.
  const byPointer = useRef(false);
  const [announced, setAnnounced] = useState("");

  function choose(key: string, label: string) {
    holdInView(summaryRef.current, () => setAboutPick(key));
    setAnnounced(`${shownFor.announce} ${label}`);
  }

  // A radio's click: a pointer's (also on the card already checked) closes the list.
  function onListClick(event: MouseEvent<HTMLFieldSetElement>) {
    if (!byPointer.current || !(event.target instanceof HTMLInputElement)) return;
    close();
    summaryRef.current?.focus({ preventScroll: true });
  }

  return (
    <div className="flex flex-col">
      <details ref={detailsRef} onToggle={onToggle} data-anim="pick-tag" className="group/tag noscript:hidden">
        <summary
          ref={summaryRef}
          className={`inline-flex min-h-11 max-w-full cursor-pointer list-none items-center gap-2.5 rounded-full border border-line py-2 pr-4 pl-3.5 text-left hover:border-muted active:bg-band group-open/tag:border-accent [&::-webkit-details-marker]:hidden ${focusRing}`}
        >
          <AboutPropGlyph prop={reply ? aboutReplyProp[reply.key] : null} className="size-5 shrink-0" />
          <span className="font-mono text-nav text-muted">{shownFor.label}</span>
          <span className="min-w-0 text-body font-medium text-text">{reply?.label ?? shownFor.everyone}</span>
          <ChevronUpIcon className="size-4 shrink-0 rotate-180 text-muted group-open/tag:rotate-0" />
        </summary>
        <fieldset
          data-anim="pick-tag-list"
          onPointerDown={() => {
            byPointer.current = true;
          }}
          onKeyDown={() => {
            byPointer.current = false;
          }}
          onClick={onListClick}
          className="mt-3 flex min-w-0 flex-wrap gap-2"
        >
          <legend className="sr-only">{shownFor.legend}</legend>
          {about.replies.map((option) => (
            <ShownForOption
              key={option.key}
              name={`${sectionId}-shown-for`}
              value={option.key}
              label={option.label}
              checked={pick === option.key}
              onChange={() => choose(option.key, option.label)}
            />
          ))}
        </fieldset>
      </details>
      <p className="sr-only" aria-live="polite">
        {announced}
      </p>
    </div>
  );
}
