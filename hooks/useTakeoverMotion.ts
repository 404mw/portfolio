// The takeover's motion (ui-spec §7.7, Motion), handed to hooks/useHashTakeover.ts as its
// `transitions`: that hook still owns every open, close, history step, focus move and scroll
// reset; this only animates around them. Returns a stable object.
//
// Full motion:
// - Open over the page: the dialog's `clip-path` expands from its card's on-screen rect to full
//   screen (0.75s, `power4.inOut`), and `takeover-content` rises 40px and fades in, starting 0.35s
//   in. With no card on screen (a hash link or Forward from elsewhere), the dialog plain-fades in
//   instead. Title morph (user's choice, 2026-09-27: the card title grows into the heading, so
//   there's only ever one title on screen): the `takeover-title` h2 starts exactly over the card's
//   `proof-card-title` h3 (its text box on the h3's text box: x/y offset, font-size ratio as
//   `scale` from its top-left corner) and travels and grows to rest on the clip's own ease and
//   duration. It starts in the h3's typography too (the face's optical size, which the browser
//   ties to font size, and the h3's letter spacing), which then follows its scale to its own at
//   rest, so it's the h3's very glyphs at the swap (lib/takeoverTitleMorph.ts; skipped, leaving a
//   width mismatch, if that typography would re-wrap the h2). The h3 lies inside the card box
//   and the h2's rest inside the full box, and every edge of both moves linearly in the shared
//   eased progress, so the title never leaves the growing clip; `morphFits` checks both ends
//   (text box, via a Range) and skips the morph if either fails. The h3 is under the dialog's
//   cream from the first frame, so the swap needs no hiding; if the two wrap to different line
//   counts the h2 fades in over 0.15s instead. The h2 is visible from frame one, so the content
//   wrapper doesn't fade: the bar and the h2's siblings rise 40px and fade in on the same timing
//   instead. If the h2 starts under the sticky bar (a card title near the top of the screen), the
//   bar is held at opacity 0 until the h2's glyphs are below it (never before the rest starts
//   at 0.35s; at most about 0.4s in), then fades in over 0.3s. With no card title, or the text
//   off screen or unable to stay inside the clip, no morph: the content fades as above.
//   Band morph (user's choice, 2026-10-07; ui-spec/07-proofs-band.md): the h2 sits on an ink band
//   (`takeover-band`; the two share the head, `takeover-head`), which is the card's banner grown
//   wider and thinner. It starts
//   exactly over the banner's ground (`proof-banner`, its rect and radius) and travels to rest on
//   the clip's ease and duration, as one tweened box written each frame as a translate, a width,
//   a height and a radius (lib/takeoverBand.ts; no scale, which would stretch its hatch). It is
//   opaque throughout and takes `zIndex 1` like the h2, which comes later in the markup and so
//   paints over it; it is not one of the head's rising siblings. The banner lies inside the card
//   box and the band's rest inside the full box, so like the h2 it never leaves the clip;
//   `bandFits` checks both ends, and where the clip is cut to the screen, what's beyond it is off
//   screen. The two morph together or neither does: if either check fails, the content fades as
//   above with the band inside it. The bar's hold waits for the later of the h2's glyphs and the
//   band's top edge. Title colour (lib/takeoverTitleTone.ts): each glyph pixel is `text` over the
//   band and ink over cream, split at the band's top and bottom edges in the h2's own coordinates
//   (a gradient clipped to the text) while an edge crosses its line box, and one colour
//   otherwise, worked out each frame from the tweened numbers. So it starts in ink under the
//   banner, the card title's colour, and lands in `text`.
// - Condense (user's choice, 2026-10-07; ui-spec/07-proofs-sticky-band.md): while a takeover is
//   open, its head sticks under the top bar and, as the dialog scrolls, the band shrinks to a slim
//   ink strip hanging from the bar (its top 12px tucked under it) and the title to the card
//   title's size inside it, as a pure function of `scrollTop` (lib/takeoverCondense.ts,
//   lib/takeoverCondenseTrigger.ts: a ScrollTrigger on the dialog, no scrub). The band's height
//   and radius change, never its width, place or scale; the title moves by transform only and
//   stays `text`. The dialog carries `data-condense`, `--takeover-stick` and an inline
//   `scroll-padding-top` meanwhile. An open sets them at its start (at the dialog's top, so
//   nothing moves) and the condense writes nothing until the open ends, then applies the pose for
//   the scroll then, once; a direct load and a slide's end start it at once, and entering full
//   motion with a takeover open starts it on the next frame, before that frame's paint.
// - Next (user's choice, 2026-09-26; replaces "content rises 60px"): the two projects slide up
//   together, reading as scrolling on into the next project, and the next project's title is one
//   title throughout. The old dialog (still open beneath the new modal, wherever it was scrolled)
//   goes `yPercent 0 → -100`. The new dialog stays at rest, at its top, with its background
//   cleared so it shows through; its `takeover-content` carries the cream and rises `y: H → 0`
//   (H: the dialog's height), so both move by the same amount (0.85s, `power3.inOut`, transforms
//   only), no gap opens and nothing moves sideways; then the old one closes. Title morph: the old
//   Next title (`takeover-next-title`) is hidden and the new `takeover-title` h2 starts exactly
//   over it (x offset, font-size ratio as `scale` from its top-left corner, its own y undoing the
//   content's rise), then grows and travels to rest on the same ease and duration. If the two wrap
//   to different line counts they crossfade over 0.15s instead of swapping. The new sticky top bar
//   (`takeover-bar`), which the title flies up through, is held at opacity 0 until the title's
//   glyphs are measured to be below it (about 0.55–0.65s in), then fades in over 0.3s; this can
//   run the slide's end, and so the old dialog's close, up to 0.3s past 0.85s. With the old Next
//   title off screen (reached another way), no morph: the h2 just rises with its content and the
//   bar is left alone. The new project's band is written nowhere: it rises with its content,
//   faster than the title, so its top edge passes up through the title, whose colour follows the
//   same rule: ink over the old Next title (a crossfade fades it in already in ink), `text` once
//   it is on its band; with no morph it rises on its band in `text`, with no inline colour.
//   The old project's condense is frozen where it stands (its pose, `data-condense` and
//   `--takeover-stick` kept), so it slides away as it stands, usually slim, and is cleared when
//   it closes at the slide's end; the new one's starts then.
//   The incoming dialog carries `data-sliding` meanwhile, which its
//   `data-sliding:backdrop:bg-transparent` class uses to stop its default backdrop dimming the
//   old one. A new hash mid-slide (Next again, Back, Esc, Close) ends it at once: both dialogs
//   and both titles snap to rest and the old one closes before the new step starts.
// - Close (Esc, Close and Back alike, after the hash change): the clip shrinks back to the card
//   (0.6s), then the dialog closes; with no card on screen it fades out. Title morph back (user's
//   choice, 2026-09-27, the open reversed): the heading travels and shrinks from where it is onto
//   the card's `proof-card-title` h3 (the open's start pose and typography) on the clip's ease and
//   duration, so when the dialog closes the real h3, the same glyphs, is in exactly its place; if
//   the two wrap to different line counts it fades out over the last 0.15s instead. The bar and
//   the heading's siblings fade out first (0.2s, opacity only), so the bar never paints over it,
//   and the whole dialog fades out over the last 0.15s, so the card dissolves in beneath it
//   rather than its image and text popping in when the dialog closes. The dialog's scroll is
//   frozen where it stands for the close (a smooth or momentum scroll in flight stops, wheel and
//   touch can't start another), so a close mid-scroll lands on the card.
//   Band morph back (2026-10-07): the band travels from where it stands onto the card banner's
//   rect and radius on the same ease and duration. It isn't one of the siblings that fade and
//   stays opaque, so the last dissolve shows the real banner in exactly its place; the heading
//   turns back to ink as it leaves the band, by the same colour rule. From any point of the
//   condense (full, mid-way or slim): the pose is taken from the condense's function at the frozen
//   `scrollTop` (so a close mid-fling starts exactly there), its trigger is killed and the head
//   stays sticky, so the reads at rest are of the full band where the head is stuck; the band
//   starts from the condensed box and the heading from the condensed pose, its own typography
//   blending into the card title's over the flight (lib/takeoverCondense.ts `condensedTypeAt`), so
//   from slim it's a pure slide. It applies only when the heading's text is inside the clip now
//   and, over the h3, inside the card box (both ends, so throughout, as on open), and the band
//   passes its own check at both ends; else neither morphs. With no card title on screen (cut by
//   the screen's edge, or none), a failed check, or a plain open cut off mid-rise, the content
//   fades out first from its opacity (0.2s, opacity only), with the condensed pose put back, so
//   the clip shrinks as plain cream, and the whole dialog fades out over the last 0.15s as above,
//   so the card dissolves in rather than popping. A close mid-open reads the clip box, the
//   heading's transform and opacity, the band's box and the rest's fade before snapping them to
//   rest, and starts from there, so nothing jumps (the colour needs no state: it follows the
//   positions); a plain open (no morph) cut off mid-rise has no morph back: its content snaps to
//   rest and fades out from its opacity then. The content is `inert` meanwhile, so nothing in it
//   can be clicked or activated; focus then returns to the card.
// Reduced motion: no clip, no rise, no slide, no title or band morph, no condense (the head isn't
// sticky and scrolls away) and no colour change: the band is at rest with the title in `text` on
// it, and nothing is written on either. Open shows
// the dialog at once and fades the content in; Next shows the new project at once at its top,
// fades its content in and closes the old one at once; close is instant.
// On load the dialog is already on screen (the no-JS `:target` display, until JS takes over), so
// nothing replays it. Every inline style is cleared when a transition ends, is cut short, or its
// mode stops applying; an exit or slide cut off by a mode switch still closes its dialog. The
// per-open tweens, the slide timeline and each condense's trigger are created in callbacks after
// setup (or ignored by the branch's context), so they stay
// outside any GSAP context (a context keeps every tween it records, so repeated opens would pile
// up, and useGSAP's `contextSafe` inside a matchMedia branch can make a context contain itself);
// `reset` and `stopSlide` kill them by hand (the morphs' tweens whole, so a reopen mid-close
// can't be written over; the condense with its attribute, variable and padding), and the
// matchMedia cleanup resets every dialog.
import { useMemo, useRef } from "react";
import type { TakeoverOpening, TakeoverTransitions } from "@/hooks/useHashTakeover";
import { gsap, useGSAP } from "@/lib/gsap";
import { animTargets, duration, ease, motionQuery } from "@/lib/motion";
import {
  applyBand,
  bandBarClearProgress,
  bandFits,
  bandMorph,
  clearBand,
  liftBand,
  type BandMorph,
  type BandRect,
} from "@/lib/takeoverBand";
import { cardBox, clipPathOf, fullBox, screenBoxOf, sourceCard, type ClipBox } from "@/lib/takeoverClip";
import { condensedTypeAt } from "@/lib/takeoverCondense";
import { startCondense, type Condense } from "@/lib/takeoverCondenseTrigger";
import {
  applyType,
  barClearProgress,
  barClearProgressOnOpen,
  morphFits,
  textFits,
  titleMorph,
  type TitleMorph,
  type TitlePose,
  type TitleType,
} from "@/lib/takeoverTitleMorph";
import { applyTone, clearTone, titleTone, titleToneFrame, type ToneFrame } from "@/lib/takeoverTitleTone";

/** Seconds the clip takes to open from the card, and to close back to it. */
const OPEN_SECONDS = 0.75;
const CLOSE_SECONDS = 0.6;
/** The clip's ease: slow off the card, fast through the middle, soft landing. */
const CLIP_EASE = "power4.inOut";
/** Content rise on open: distance (px), length, and the wait before it starts (s). */
const OPEN_RISE = 40;
const OPEN_RISE_SECONDS = 0.7;
const OPEN_RISE_DELAY = 0.35;
/** Next: how long the two dialogs take to slide up, and the ease they share. */
const SLIDE_SECONDS = 0.85;
const SLIDE_EASE = "power3.inOut";
/** Set on the incoming dialog while it slides; its class turns its `::backdrop` transparent. */
const slidingFlag = "data-sliding";
/** The incoming content's background while it slides over its see-through dialog. */
const CREAM = "var(--color-cream)";
/** Title morph: the crossfade when the two titles wrap differently (s). */
const CROSSFADE_SECONDS = 0.15;
/** Title morph: the sticky top bar's fade-in once the flying title is below it (s). */
const BAR_FADE_SECONDS = 0.3;
/** Close with a title morph: the bar and the heading's siblings fade out first (s). */
const CLOSE_FADE_SECONDS = 0.2;
/** Close with a title morph: the whole dialog dissolves over the card in its last moment (s). */
const CLOSE_DISSOLVE_SECONDS = 0.15;

/** Seconds into a `seconds`-long tween on `easeName` at which it reaches eased `progress`. */
function timeAtProgress(easeName: string, seconds: number, progress: number): number {
  const curve = gsap.parseEase(easeName);
  let low = 0;
  let high = 1;
  for (let i = 0; i < 24; i += 1) {
    const mid = (low + high) / 2;
    if (curve(mid) < progress) low = mid;
    else high = mid;
  }
  return high * seconds;
}

/** `el`'s current `prop` as GSAP reads it (its own transform cache, else computed style). */
function numberOf(el: HTMLElement, prop: string, fallback: number): number {
  const value = Number(gsap.getProperty(el, prop));
  return Number.isFinite(value) ? value : fallback;
}

/**
 * Sets `title` in `type` at `from` now, then keeps its typography on the scale `tween` gives it,
 * from `from` to `to` on the tween's eased ratio. The ratio, not a read of the transform: a
 * read (`getProperty`) after `clearProps` would write the transform back as `none`s.
 */
function followType(tween: gsap.core.Tween, title: HTMLElement, type: TitleType, from: number, to: number) {
  applyType(title, type, from);
  tween.eventCallback("onUpdate", () => applyType(title, type, from + (to - from) * tween.ratio));
}

/** Clears the typography `applyType` set on `title`. */
function clearType(title: HTMLElement) {
  title.style.fontVariationSettings = "";
  title.style.letterSpacing = "";
}

/** The title at rest, untransformed. */
const REST_POSE: TitlePose = { x: 0, y: 0, scale: 1 };

/** The pose a tween from `from` to `to` has at eased `ratio`: its offset and scale both lerp on it. */
function poseBetween(from: TitlePose, to: TitlePose, ratio: number): TitlePose {
  return {
    x: from.x + (to.x - from.x) * ratio,
    y: from.y + (to.y - from.y) * ratio,
    scale: from.scale + (to.scale - from.scale) * ratio,
  };
}

/**
 * The band's half of a card morph: the band, its two ends (`from` and `to`, between the card's
 * banner and rest), the measurements behind them and the title's colour frame.
 */
type BandFlight = {
  readonly band: HTMLElement;
  readonly morph: BandMorph;
  readonly from: Readonly<BandRect>;
  readonly to: Readonly<BandRect>;
  readonly tone: ToneFrame;
};

type Slide = {
  readonly timeline: gsap.core.Timeline;
  readonly dialog: HTMLDialogElement;
  readonly previous: HTMLDialogElement;
  readonly done: () => void;
};

export function useTakeoverMotion(ids: readonly string[]): TakeoverTransitions {
  // The active mode's transitions, set by the matching `gsap.matchMedia()` branch.
  const active = useRef<TakeoverTransitions | null>(null);

  useGSAP(() => {
    const dialogs = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLDialogElement => el instanceof HTMLDialogElement);
    if (dialogs.length === 0) return;

    const contentOf = (dialog: HTMLDialogElement) => animTargets(dialog, "takeover-content")[0];
    const titleOf = (dialog: HTMLDialogElement) => animTargets(dialog, "takeover-title");
    const nextTitleOf = (dialog: HTMLDialogElement) => animTargets(dialog, "takeover-next-title");
    const barOf = (root: HTMLElement) => animTargets(root, "takeover-bar");
    const bandOf = (dialog: HTMLDialogElement) => animTargets(dialog, "takeover-band");
    /**
     * The head's siblings in the column: everything below the title and its band (which share the
     * head, `takeover-head`) that fades up on open and out on close.
     */
    const bodyPartsOf = (dialog: HTMLDialogElement) => {
      const head = animTargets(dialog, "takeover-head")[0];
      return Array.from(head?.parentElement?.children ?? []).filter(
        (el): el is HTMLElement => el instanceof HTMLElement && el !== head,
      );
    };
    // Each dialog's clip box while a clip plays; GSAP tweens its numbers.
    const boxes = new Map<HTMLDialogElement, ClipBox>();
    // Each dialog's band box while its band flies; GSAP tweens its numbers too.
    const bands = new Map<HTMLDialogElement, BandRect>();
    // The tweens of each dialog's last title-morph open or close (the band's flight among them),
    // killed whole in `reset`. The rise (and the close's fade) is one tween over the bar and the
    // title's siblings; `killTweensOf` on only some of a tween's targets, before its delay ends,
    // merely marks them overwritten, and the tween then wakes and writes its from-state
    // (`y: 40, opacity: 0`) on every frame, after `reset` has cleared it.
    const titleTweens = new Map<HTMLDialogElement, gsap.core.Tween[]>();
    // The exit playing now: its `done` closes the dialog.
    let exiting: { dialog: HTMLDialogElement; done: () => void } | null = null;
    // The Next slide playing now: its `done` closes the old dialog.
    let sliding: Slide | null = null;
    // Each dialog whose scroll a close holds still, with what lets it go again.
    const frozen = new Map<HTMLDialogElement, () => void>();
    // Each dialog's condense (its head shrinking to a slim sticky strip as it scrolls), from its
    // open's start (held until the open ends) to its close's end; `reset` stops it.
    const condenses = new Map<HTMLDialogElement, Condense>();

    /** Starts `dialog`'s condense afresh; `held` while an open or slide still owns its band and title. */
    const condense = (dialog: HTMLDialogElement, held: boolean) => {
      condenses.get(dialog)?.stop(false);
      condenses.delete(dialog);
      const started = startCondense(dialog, { held });
      if (started) condenses.set(dialog, started);
    };

    /** The open or slide that held `dialog`'s condense has ended: it applies the pose now, once. */
    const release = (dialog: HTMLDialogElement) => condenses.get(dialog)?.release();

    /**
     * Holds `dialog`'s scroll where it stands: a smooth or momentum scroll in flight stops (the
     * `scrollTop` write cancels Chromium's, `overflow: hidden` iOS's) and wheel and touch can't
     * start another, so what a close measures stays on screen where it was measured. A step the
     * compositor had already taken still lands a frame later; its `scroll` event puts it back
     * before the frame's tweens run. A classic scrollbar keeps its gutter, so the content doesn't
     * widen and re-wrap.
     */
    const freezeScroll = (dialog: HTMLDialogElement) => {
      if (frozen.has(dialog)) return;
      const top = dialog.scrollTop;
      if (dialog.offsetWidth > dialog.clientWidth) dialog.style.scrollbarGutter = "stable";
      dialog.style.overflowY = "hidden";
      dialog.scrollTop = top;
      const block = (event: Event) => event.preventDefault();
      const hold = () => {
        if (dialog.scrollTop !== top) dialog.scrollTop = top;
      };
      dialog.addEventListener("wheel", block, { passive: false });
      dialog.addEventListener("touchmove", block, { passive: false });
      dialog.addEventListener("scroll", hold);
      frozen.set(dialog, () => {
        dialog.removeEventListener("wheel", block);
        dialog.removeEventListener("touchmove", block);
        dialog.removeEventListener("scroll", hold);
        dialog.style.overflowY = "";
        dialog.style.scrollbarGutter = "";
      });
    };

    /**
     * Stops every tween on `dialog`, kills its condense's trigger and clears the inline styles
     * motion set on it (its band's and title's pose included). With `hold` (a close snapping an
     * open or a condensed head to rest, still to measure it; Next freezing the old project), its
     * scroll stays frozen and its head stays sticky (`data-condense`, `--takeover-stick` and the
     * scroll padding stay); otherwise those go too.
     */
    const reset = (dialog: HTMLDialogElement | null, hold = false) => {
      if (!dialog) return;
      if (!hold) {
        frozen.get(dialog)?.();
        frozen.delete(dialog);
      }
      condenses.get(dialog)?.stop(hold);
      if (!hold) condenses.delete(dialog);
      const box = boxes.get(dialog);
      if (box) gsap.killTweensOf(box);
      boxes.delete(dialog);
      titleTweens.get(dialog)?.forEach((tween) => tween.kill());
      titleTweens.delete(dialog);
      bands.delete(dialog);
      bandOf(dialog).forEach(clearBand);
      titleOf(dialog).forEach(clearTone);
      const content = contentOf(dialog);
      const titles = [...titleOf(dialog), ...nextTitleOf(dialog)];
      const bars = barOf(dialog);
      const parts = bodyPartsOf(dialog);
      gsap.killTweensOf(dialog);
      if (content) gsap.killTweensOf(content);
      if (titles.length > 0) gsap.killTweensOf(titles);
      if (bars.length > 0) {
        gsap.killTweensOf(bars);
        gsap.set(bars, { clearProps: "opacity,transform,willChange" });
      }
      if (parts.length > 0) {
        gsap.killTweensOf(parts);
        gsap.set(parts, { clearProps: "transform,opacity,willChange" });
      }
      dialog.style.clipPath = "";
      dialog.style.backgroundColor = "";
      dialog.removeAttribute(slidingFlag);
      gsap.set(dialog, { clearProps: "opacity,transform,willChange" });
      if (content) {
        content.style.backgroundColor = "";
        content.style.overflowX = "";
        gsap.set(content, { clearProps: "transform,opacity,willChange" });
        content.removeAttribute("inert");
      }
      if (titles.length > 0) {
        gsap.set(titles, {
          clearProps: "transform,transformOrigin,zIndex,opacity,willChange,fontVariationSettings,letterSpacing",
        });
      }
    };

    /** Ends the slide playing now, if any, with both dialogs back at rest. Doesn't call `done`. */
    const stopSlide = (): Slide | null => {
      const slide = sliding;
      sliding = null;
      if (!slide) return null;
      slide.timeline.kill();
      reset(slide.previous);
      reset(slide.dialog);
      return slide;
    };

    /** Tweens `dialog`'s clip from `from` to `to`, writing it on every frame. */
    const clip = (dialog: HTMLDialogElement, from: ClipBox, to: ClipBox, seconds: number) => {
      const box = { ...from };
      boxes.set(dialog, box);
      dialog.style.clipPath = clipPathOf(box);
      return gsap.to(box, {
        ...to,
        duration: seconds,
        ease: CLIP_EASE,
        onUpdate: () => {
          dialog.style.clipPath = clipPathOf(box);
        },
      });
    };

    /** Content fades in; in full motion it also rises `rise` px. Then `onComplete`, if given. */
    const contentIn = (
      dialog: HTMLDialogElement,
      vars: { rise: number; seconds: number; delay: number; onComplete?: () => void },
    ) => {
      const content = contentOf(dialog);
      if (!content) {
        vars.onComplete?.();
        return;
      }
      const moves = vars.rise !== 0;
      gsap.fromTo(
        content,
        { opacity: 0, ...(moves ? { y: vars.rise } : {}) },
        {
          opacity: 1,
          ...(moves ? { y: 0 } : {}),
          duration: vars.seconds,
          delay: vars.delay,
          ease: ease.follow,
          clearProps: "transform,opacity",
          onComplete: vars.onComplete,
        },
      );
    };

    /**
     * The morph from `dialog`'s card title to its heading as the clip grows from `from`, or null
     * when there's no card title, it isn't wholly on screen, or the heading's text wouldn't stay
     * inside the growing clip at both ends (and so throughout). Reads layout.
     */
    const cardMorph = (dialog: HTMLDialogElement, from: ClipBox, title: HTMLElement) => {
      const morph = cardTitleMorph(dialog, title);
      if (!morph) return null;
      const fits = morphFits(morph, title, screenBoxOf(dialog, from), screenBoxOf(dialog, fullBox()));
      return fits ? morph : null;
    };

    /** How the untransformed `title` sits over `dialog`'s card title, or null with no card title. */
    const cardTitleMorph = (dialog: HTMLDialogElement, title: HTMLElement) => {
      const card = sourceCard(dialog);
      const cardTitle = card ? animTargets(card, "proof-card-title")[0] : undefined;
      return cardTitle ? titleMorph(cardTitle, title, { matchType: true }) : null;
    };

    /**
     * The morph back from where the heading is now (`pose`, over its rest) to the card title as the
     * clip shrinks from `from` to `to`, or null when there's no card title on screen or the
     * heading's text isn't inside `from` now (cut by an opening clip) or wouldn't be inside `to`
     * over the card title. As on open, holding at both ends holds throughout. `ownType`: the
     * heading is posed by the condense, in its own typography, not the card title's. Reads layout,
     * with the title untransformed.
     */
    const cardMorphBack = (
      dialog: HTMLDialogElement,
      from: ClipBox,
      to: ClipBox,
      title: HTMLElement,
      pose: TitlePose,
      ownType: boolean,
    ) => {
      const morph = cardTitleMorph(dialog, title);
      if (!morph) return null;
      const fits =
        textFits(title, pose, screenBoxOf(dialog, from), ownType ? null : morph.type) &&
        textFits(title, morph, screenBoxOf(dialog, to), morph.type);
      return fits ? morph : null;
    };

    /**
     * `dialog`'s band and how it sits over its card banner's ground, or null when the takeover has
     * no band, the card no banner, or either has no size. Reads layout, with the band at rest.
     */
    const bandOverBanner = (dialog: HTMLDialogElement) => {
      const band = bandOf(dialog)[0];
      const card = sourceCard(dialog);
      const banner = card ? animTargets(card, "proof-banner")[0] : undefined;
      const morph = band && banner ? bandMorph(band, banner) : null;
      return band && morph ? { band, morph } : null;
    };

    /**
     * The band's half of a card morph as the clip goes from `clipFrom` to `clipTo`: the band
     * travels between its rest and the card banner's ground, `ends` picking which way from the
     * two. Null when the takeover has no band, the card no banner, either is unmeasurable, or the
     * band wouldn't stay inside the clip at both ends (and so throughout): the caller then skips
     * the title's morph too, as the two travel together or not at all. Reads layout, with the
     * band and the title at rest.
     */
    const bandFlight = (
      dialog: HTMLDialogElement,
      title: HTMLElement,
      clipFrom: ClipBox,
      clipTo: ClipBox,
      ends: (morph: BandMorph) => { readonly from: Readonly<BandRect>; readonly to: Readonly<BandRect> },
    ): BandFlight | null => {
      const measured = bandOverBanner(dialog);
      if (!measured) return null;
      const { band, morph } = measured;
      const { from, to } = ends(morph);
      const fits = bandFits(
        morph,
        from,
        to,
        screenBoxOf(dialog, clipFrom),
        screenBoxOf(dialog, clipTo),
        screenBoxOf(dialog, fullBox()),
      );
      return fits ? { band, morph, from, to, tone: titleToneFrame(title, band) } : null;
    };

    /**
     * Flies `dialog`'s band along `flight` on the clip's ease, over `seconds`, as its title goes
     * from `titleFrom` to `titleTo` on the same clock. Each frame writes the band's box (offset,
     * size and radius: no scale) and the title's colour, both from the tween's own numbers: the
     * band stays opaque, above the rising parts and under the title, and the title is `text` over
     * it and ink over cream. Nothing is cleared at the end; the caller does that.
     */
    const flyBand = (
      dialog: HTMLDialogElement,
      title: HTMLElement,
      flight: BandFlight,
      titleFrom: TitlePose,
      titleTo: TitlePose,
      seconds: number,
    ) => {
      const { band, tone, to } = flight;
      const rect: BandRect = { ...flight.from };
      bands.set(dialog, rect);
      const paint = (ratio: number) => {
        applyBand(band, rect);
        applyTone(title, titleTone(tone, poseBetween(titleFrom, titleTo, ratio), rect));
      };
      liftBand(band);
      paint(0);
      const tween = gsap.to(rect, {
        ...to,
        duration: seconds,
        ease: CLIP_EASE,
        onUpdate: () => paint(tween.ratio),
      });
      return tween;
    };

    /**
     * Open from a card with a title morph: the heading grows out of the card title and its band
     * out of the card's banner (`flight`) on the clip's ease and duration, and everything else in
     * the content (the bar and the heading's other siblings) rises and fades in as the whole
     * content does without a morph. `clear` is the morph progress at which the heading's glyphs
     * and the band's top edge are both below the bar (0: neither passes under it). Its tweens go
     * in `titleTweens`, for `reset` to kill whole.
     */
    const morphIn = (
      dialog: HTMLDialogElement,
      content: HTMLElement,
      title: HTMLElement,
      parts: HTMLElement[],
      bar: HTMLElement | undefined,
      morph: TitleMorph,
      flight: BandFlight,
      clear: number,
    ) => {
      const tweens: gsap.core.Tween[] = [];
      titleTweens.set(dialog, tweens);
      // The small, offset heading's box can reach past the right edge; clip it inside the content
      // so the dialog never scrolls sideways. Only its empty box is cut: its text stays in the card.
      content.style.overflowX = "clip";
      // Above its siblings, which are transformed too and come later in paint order.
      gsap.set(title, {
        transformOrigin: "0 0",
        zIndex: 1,
        willChange: morph.crossfade ? "transform,opacity" : "transform",
      });
      const { type } = morph;
      tweens.push(
        gsap.fromTo(
          title,
          { x: morph.x, y: morph.y, scale: morph.scale },
          {
            x: 0,
            y: 0,
            scale: 1,
            duration: OPEN_SECONDS,
            ease: CLIP_EASE,
            clearProps: "transform,transformOrigin,zIndex,opacity,willChange",
            onComplete: () => {
              content.style.overflowX = "";
              // After the last onUpdate, which runs after clearProps.
              clearType(title);
            },
          },
        ),
      );
      // Set in the card title's typography from frame one, so the swap is the same glyphs.
      if (type) followType(tweens[tweens.length - 1], title, type, morph.scale, 1);
      // The band leaves the card's banner as the heading leaves the card title, and lands under
      // it; the heading starts in ink below the banner and turns `text` as the band's floor
      // passes down through it. At rest both go back to their classes.
      const { band } = flight;
      tweens.push(
        flyBand(dialog, title, flight, morph, REST_POSE, OPEN_SECONDS).eventCallback("onComplete", () => {
          bands.delete(dialog);
          clearBand(band);
          clearTone(title);
          // The open no longer owns the band and title (the title's tween, created first, has
          // just ended too): the condense takes them at the current scroll.
          release(dialog);
        }),
      );
      // The card title is already under the dialog's cream, so a straight swap needs no hiding;
      // when they wrap differently the heading fades in instead of popping.
      if (morph.crossfade) {
        tweens.push(
          gsap.fromTo(title, { opacity: 0 }, { opacity: 1, duration: CROSSFADE_SECONDS, ease: ease.out }),
        );
      }

      const rising = bar && clear === 0 ? [bar, ...parts] : parts;
      if (rising.length > 0) {
        gsap.set(rising, { willChange: "transform,opacity" });
        tweens.push(
          gsap.fromTo(
            rising,
            { opacity: 0, y: OPEN_RISE },
            {
              opacity: 1,
              y: 0,
              duration: OPEN_RISE_SECONDS,
              delay: OPEN_RISE_DELAY,
              ease: ease.follow,
              clearProps: "transform,opacity,willChange",
            },
          ),
        );
      }
      // The heading and its band pass under the sticky bar, which would paint across them: the bar
      // stays unseen until the heading's glyphs and the band's top edge are below it (and no sooner
      // than the rest starts), then fades in. Opacity only, so a Close link that `showModal()`
      // focused keeps its focus.
      if (bar && clear > 0) {
        gsap.set(bar, { opacity: 0, willChange: "opacity" });
        tweens.push(
          gsap.to(bar, {
            opacity: 1,
            duration: BAR_FADE_SECONDS,
            delay: Math.max(OPEN_RISE_DELAY, timeAtProgress(CLIP_EASE, OPEN_SECONDS, clear)),
            ease: ease.out,
            clearProps: "opacity,willChange",
          }),
        );
      }
    };

    /**
     * Close to a card with a title morph, the open played backwards: the heading travels and
     * shrinks from `start` (where it is now) onto the card title, and its band from where it
     * stands onto the card's banner (`flight`), on the clip's ease and duration. Everything else
     * in the content (`fading`: the bar and the heading's other siblings) fades out first from
     * where it is now (`fadeFrom`), so nothing is painted over the moving heading; the band isn't
     * one of them and stays opaque. `ownType`: the heading starts posed by the condense, in its
     * own typography, which blends into the card title's over the flight. Its tweens go in
     * `titleTweens`, for `reset` to kill whole.
     */
    const morphOut = (
      dialog: HTMLDialogElement,
      content: HTMLElement,
      title: HTMLElement,
      start: TitlePose & { readonly opacity: number },
      ownType: boolean,
      morph: TitleMorph,
      flight: BandFlight,
      fading: HTMLElement[],
      fadeFrom: { readonly opacity: number; readonly y: number }[],
    ) => {
      const tweens: gsap.core.Tween[] = [];
      titleTweens.set(dialog, tweens);
      content.style.overflowX = "clip";
      const fades = morph.crossfade || start.opacity < 1;
      gsap.set(title, {
        transformOrigin: "0 0",
        zIndex: 1,
        x: start.x,
        y: start.y,
        scale: start.scale,
        opacity: start.opacity,
        willChange: fades ? "transform,opacity" : "transform",
      });
      // Its typography follows its scale, from wherever it is now to the card title's own.
      const { type } = morph;
      tweens.push(
        gsap.to(title, { x: morph.x, y: morph.y, scale: morph.scale, duration: CLOSE_SECONDS, ease: CLIP_EASE }),
      );
      const titleFlight = tweens[tweens.length - 1];
      if (type && ownType) {
        const paint = () => {
          const scale = start.scale + (morph.scale - start.scale) * titleFlight.ratio;
          Object.assign(title.style, condensedTypeAt(type, scale, titleFlight.ratio));
        };
        paint();
        titleFlight.eventCallback("onUpdate", paint);
      } else if (type) {
        followType(titleFlight, title, type, start.scale, morph.scale);
      }
      // The band shrinks back onto the card's banner, opaque to the end, so the dialog's last
      // dissolve shows the real banner exactly in its place; the heading turns back to ink, the
      // card title's colour, as it leaves the band.
      tweens.push(flyBand(dialog, title, flight, start, morph, CLOSE_SECONDS));
      // The card's image, meta line and description would appear at once when the dialog closes:
      // the whole dialog fades out over the close's last moment instead, so the card dissolves in
      // under its own title.
      tweens.push(
        gsap.to(dialog, {
          opacity: 0,
          duration: CLOSE_DISSOLVE_SECONDS,
          delay: CLOSE_SECONDS - CLOSE_DISSOLVE_SECONDS,
          ease: ease.out,
        }),
      );
      // When the two wrap differently the heading fades out as it lands, instead of popping into
      // the card title; a heading still fading in from a cut-off open finishes that first.
      if (morph.crossfade) {
        tweens.push(
          gsap.to(title, {
            opacity: 0,
            duration: CROSSFADE_SECONDS,
            delay: CLOSE_SECONDS - CROSSFADE_SECONDS,
            ease: ease.out,
          }),
        );
      } else if (start.opacity < 1) {
        tweens.push(gsap.to(title, { opacity: 1, duration: CROSSFADE_SECONDS, ease: ease.out }));
      }

      if (fading.length > 0) {
        // Picks up a rise cut off mid-open where it stands: opacity only from there.
        const risen = fadeFrom.some((from) => from.y !== 0);
        gsap.set(fading, {
          opacity: (i: number) => fadeFrom[i]?.opacity ?? 1,
          ...(risen ? { y: (i: number) => fadeFrom[i]?.y ?? 0 } : {}),
          willChange: "opacity",
        });
        tweens.push(gsap.to(fading, { opacity: 0, duration: CLOSE_FADE_SECONDS, ease: ease.out }));
      }
    };

    /**
     * Close to a card with no title morph: the content fades out first from where it is now
     * (`fadeFrom`, a plain open cut off mid-fade), so the clip shrinks as plain cream, and the
     * whole dialog dissolves over the clip's last moment, as in `morphOut`, so the card dissolves
     * in under it. Its tweens go in `titleTweens`, for `reset` to kill whole.
     */
    const plainOut = (dialog: HTMLDialogElement, content: HTMLElement | undefined, fadeFrom: number) => {
      const tweens: gsap.core.Tween[] = [];
      titleTweens.set(dialog, tweens);
      if (content) {
        gsap.set(content, { opacity: fadeFrom, willChange: "opacity" });
        tweens.push(gsap.to(content, { opacity: 0, duration: CLOSE_FADE_SECONDS, ease: ease.out }));
      }
      tweens.push(
        gsap.to(dialog, {
          opacity: 0,
          duration: CLOSE_DISSOLVE_SECONDS,
          delay: CLOSE_SECONDS - CLOSE_DISSOLVE_SECONDS,
          ease: ease.out,
        }),
      );
    };

    const mm = gsap.matchMedia();

    mm.add({ full: motionQuery.full, reduced: motionQuery.reduced }, (context) => {
      const reduced = Boolean(context.conditions?.reduced);

      const opened = (dialog: HTMLDialogElement, how: TakeoverOpening) => {
        reset(dialog);
        // A direct load is already on screen at rest: its condense starts at once.
        if (how === "load") {
          if (!reduced) condense(dialog, false);
          return;
        }

        if (reduced) {
          contentIn(dialog, { rise: 0, seconds: duration.fade, delay: 0 });
          return;
        }

        // Every read first, with the dialog at rest and at its top.
        const from = cardBox(dialog);
        const content = contentOf(dialog);
        const title = titleOf(dialog)[0];
        const titleIn = from && content && title ? cardMorph(dialog, from, title) : null;
        // The heading and its band morph together or neither does.
        const flight =
          from && title && titleIn
            ? bandFlight(dialog, title, from, fullBox(), ({ banner, rest }) => ({ from: banner, to: rest }))
            : null;
        const morph = flight ? titleIn : null;
        const bar = morph && content ? barOf(content)[0] : undefined;
        const barBottom = bar ? bar.getBoundingClientRect().bottom : 0;
        // The bar waits for the later of the two: the heading's glyphs and the band's top edge.
        const clear =
          morph && flight && bar
            ? Math.max(barClearProgressOnOpen(morph, barBottom), bandBarClearProgress(flight.morph, barBottom))
            : 0;
        const parts = morph ? bodyPartsOf(dialog) : [];
        // At its top the head can't be stuck yet, so making it sticky now moves nothing; the
        // condense is measured here, at rest, and writes nothing until the open ends.
        condense(dialog, true);

        if (from) {
          clip(dialog, from, fullBox(), OPEN_SECONDS).eventCallback("onComplete", () => {
            boxes.delete(dialog);
            dialog.style.clipPath = "";
          });
        } else {
          gsap.fromTo(
            dialog,
            { opacity: 0 },
            { opacity: 1, duration: duration.fade, ease: ease.out, clearProps: "opacity" },
          );
        }
        if (morph && flight && content && title) morphIn(dialog, content, title, parts, bar, morph, flight, clear);
        else {
          contentIn(dialog, {
            rise: OPEN_RISE,
            seconds: OPEN_RISE_SECONDS,
            delay: OPEN_RISE_DELAY,
            onComplete: () => release(dialog),
          });
        }
      };

      const replacing = (
        dialog: HTMLDialogElement,
        previous: HTMLDialogElement,
        done: () => void,
      ) => {
        stopSlide();
        // The old project (usually condensed: its Next link is at the bottom) slides away as it
        // stands: its condense is frozen there, its head still sticky, its pose re-applied over
        // anything its own open left. Cleared when it closes at the slide's end.
        const old = condenses.get(previous);
        const oldPose = old ? old.poseAt(previous.scrollTop) : null;
        reset(previous, !reduced);
        if (old && oldPose && !reduced) old.apply(oldPose);
        reset(dialog);

        if (reduced) {
          done();
          contentIn(dialog, { rise: 0, seconds: duration.fade, delay: 0 });
          return () => {};
        }

        const timeline = gsap.timeline({
          defaults: { duration: SLIDE_SECONDS, ease: SLIDE_EASE },
          onComplete: () => {
            if (sliding?.timeline !== timeline) return;
            sliding = null;
            done();
            reset(previous);
            reset(dialog);
            // The new project's condense takes over at the current scroll.
            condense(dialog, false);
          },
        });
        // Every read first, with both dialogs at rest and the new one at its top.
        const content = contentOf(dialog);
        const title = titleOf(dialog)[0];
        const nextTitle = nextTitleOf(previous)[0];
        const bar = content ? barOf(content)[0] : undefined;
        const height = dialog.clientHeight;
        const morph = content && title && nextTitle ? titleMorph(nextTitle, title) : null;
        const barBottom = morph && bar ? bar.getBoundingClientRect().bottom : 0;
        const band = morph ? bandOf(dialog)[0] : undefined;
        const tone = morph && title && band ? titleToneFrame(title, band) : null;
        // Sticky from the start (at its top, so nothing moves), measured at rest, held to the end.
        condense(dialog, true);

        // The new modal's default `::backdrop` would dim the old project beneath it.
        dialog.setAttribute(slidingFlag, "");
        gsap.set(previous, { willChange: "transform" });
        timeline.fromTo(previous, { yPercent: 0 }, { yPercent: -100 }, 0);

        if (!content) {
          gsap.set(dialog, { willChange: "transform" });
          timeline.fromTo(dialog, { yPercent: 100 }, { yPercent: 0 }, 0);
        } else {
          // The dialog stays put (so its scroll box never clips the title's flight) and shows
          // through; its content carries the cream up instead.
          dialog.style.backgroundColor = "transparent";
          content.style.backgroundColor = CREAM;
          gsap.set(content, { willChange: "transform" });
          timeline.fromTo(content, { y: height }, { y: 0 }, 0);
        }

        if (content && title && nextTitle && morph) {
          // Lerps from the old Next title to rest on screen: its own y undoes the content's rise.
          gsap.set(title, {
            transformOrigin: "0 0",
            willChange: morph.crossfade ? "transform,opacity" : "transform",
          });
          const flyFrom: TitlePose = { x: morph.x, y: morph.y - height, scale: morph.scale };
          timeline.fromTo(title, { ...flyFrom }, { x: 0, y: 0, scale: 1 }, 0);
          // The band is written nowhere: it rises with its content, faster than the title, and
          // its top edge passes up through the title. The title's colour follows where the two
          // are on every frame: ink over the old Next title (a crossfade fades it in already in
          // ink), `text` once it's on its band. The title's flight is the slide's first
          // `SLIDE_SECONDS`, on the slide's ease.
          if (tone) {
            const curve = gsap.parseEase(SLIDE_EASE);
            const paint = (ratio: number) =>
              applyTone(title, titleTone(tone, poseBetween(flyFrom, REST_POSE, ratio)));
            paint(0);
            timeline.eventCallback("onUpdate", () => paint(curve(Math.min(1, timeline.time() / SLIDE_SECONDS))));
          }
          if (morph.crossfade) {
            const fade = { duration: CROSSFADE_SECONDS, ease: ease.out };
            gsap.set(nextTitle, { willChange: "opacity" });
            timeline
              .fromTo(nextTitle, { opacity: 1 }, { opacity: 0, ...fade }, 0)
              .fromTo(title, { opacity: 0 }, { opacity: 1, ...fade }, 0);
          } else {
            gsap.set(nextTitle, { opacity: 0 });
          }
          // The title flies up through the new sticky bar, which would paint across it: the bar
          // stays unseen until the title's glyphs are below it, then fades in. Opacity only, so
          // a Close link that `showModal()` focused keeps its focus.
          if (bar) {
            const clear = barClearProgress(morph, height, barBottom);
            gsap.set(bar, { opacity: 0, willChange: "opacity" });
            timeline.to(
              bar,
              { opacity: 1, duration: BAR_FADE_SECONDS, ease: ease.out },
              timeAtProgress(SLIDE_EASE, SLIDE_SECONDS, clear),
            );
          }
        }
        sliding = { timeline, dialog, previous, done };

        return () => {
          if (sliding?.timeline === timeline) stopSlide();
        };
      };

      const closing = (dialog: HTMLDialogElement, done: () => void) => {
        if (reduced) {
          reset(dialog);
          done();
          return () => {};
        }

        // Before any read, its scroll stops where it stands and stays there to the end, so the
        // heading and band measured now are still where they were measured when they land.
        freezeScroll(dialog);
        // The condensed pose at the frozen scroll, from the condense's function rather than its
        // last write, so a close mid-fling starts exactly there. None while an open still owns
        // the band and title (their in-flight state is read below instead).
        const running = condenses.get(dialog);
        const condensed = running && !running.held ? running.poseAt(dialog.scrollTop) : null;
        // Every read of an open still playing comes before `reset` snaps it to rest, so the close
        // picks it up where it stands: the clip box (else full screen), the heading's transform
        // and opacity, and how far the bar and the heading's siblings have risen and faded in.
        const from = { ...(boxes.get(dialog) ?? fullBox()) };
        const content = contentOf(dialog);
        const title = titleOf(dialog)[0];
        // A plain open (no morph) still rising moves the whole content, heading and all: no morph
        // back from there; it snaps to rest and fades out from its opacity now as the clip shrinks.
        const heading = content && title && !gsap.isTweening(content) ? title : undefined;
        const contentFrom = content ? numberOf(content, "opacity", 1) : 1;
        const opacity = heading ? numberOf(heading, "opacity", 1) : 1;
        let start: (TitlePose & { readonly opacity: number }) | null = null;
        if (heading && condensed) start = { ...condensed.title, opacity };
        else if (heading) {
          start = {
            x: numberOf(heading, "x", 0),
            y: numberOf(heading, "y", 0),
            scale: numberOf(heading, "scale", 1),
            opacity,
          };
        }
        // Condensed, the heading is its own type scaled down, not the card title's.
        const ownType = Boolean(condensed && condensed.progress > 0);
        const bar = content ? barOf(content)[0] : undefined;
        const fading = heading ? [...(bar ? [bar] : []), ...bodyPartsOf(dialog)] : [];
        const fadeFrom = fading.map((el) => ({ opacity: numberOf(el, "opacity", 1), y: numberOf(el, "y", 0) }));
        // Where the band stands: its box if it's still flying in, else the condensed box, else
        // at rest.
        const flying = bands.get(dialog);
        const standing = flying ? { ...flying } : (condensed?.band ?? null);
        // Snaps everything to rest with the scroll still frozen and the head still sticky, so the
        // reads below are of the full band and heading where the head is stuck.
        reset(dialog, true);
        // Then the reads at rest, with the heading and its band untransformed.
        const to = cardBox(dialog);
        const titleBack = to && heading && start ? cardMorphBack(dialog, from, to, heading, start, ownType) : null;
        // The heading and its band morph back together or neither does.
        const flight =
          to && heading && titleBack
            ? bandFlight(dialog, heading, from, to, ({ banner, rest }) => ({ from: standing ?? rest, to: banner }))
            : null;
        const morph = flight ? titleBack : null;
        // Every other path puts the condensed pose back first, so nothing snaps to full size as
        // it fades.
        if (!morph && running && condensed) running.apply(condensed);
        // Nothing inside can be clicked or activated while it closes (Next would rewrite history).
        content?.setAttribute("inert", "");
        const tween = to
          ? clip(dialog, from, to, CLOSE_SECONDS)
          : gsap.to(dialog, { opacity: 0, duration: duration.fade, ease: ease.out });
        if (morph && flight && content && heading && start) {
          morphOut(dialog, content, heading, start, ownType, morph, flight, fading, fadeFrom);
        } else if (to) {
          plainOut(dialog, content, contentFrom);
        }

        exiting = { dialog, done };
        tween.eventCallback("onComplete", () => {
          exiting = null;
          done();
          reset(dialog);
        });
        return () => {
          exiting = null;
          reset(dialog);
        };
      };

      active.current = { opened, replacing, closing };
      // Entering full motion with a takeover open (a reduced-motion switch, or back from one):
      // its condense starts at the current scroll, a frame later (still before that frame's
      // paint). This media change ends in a ScrollTrigger refresh that puts every scroller back
      // where it recorded it; a trigger created before that would wipe the dialog's record and
      // leave it at its top. Every condense is stopped by hand in `reset`.
      let entering = 0;
      if (!reduced) {
        entering = requestAnimationFrame(() => {
          entering = 0;
          dialogs
            .filter((dialog) => dialog.open && !condenses.has(dialog) && !sliding && exiting?.dialog !== dialog)
            .forEach((dialog) => condense(dialog, false));
        });
      }

      return () => {
        active.current = null;
        cancelAnimationFrame(entering);
        // An exit or slide cut off here still has to close its dialog.
        const cut = exiting;
        const slide = sliding;
        exiting = null;
        context.ignore(() => {
          stopSlide();
          dialogs.forEach((dialog) => reset(dialog));
        });
        cut?.done();
        slide?.done();
      };
    });

    return () => mm.revert();
  });

  return useMemo<TakeoverTransitions>(
    () => ({
      opened: (dialog, how) => active.current?.opened(dialog, how),
      replacing: (dialog, previous, done) => {
        if (active.current) return active.current.replacing(dialog, previous, done);
        done();
        return () => {};
      },
      closing: (dialog, done) => {
        if (active.current) return active.current.closing(dialog, done);
        done();
        return () => {};
      },
    }),
    [],
  );
}
