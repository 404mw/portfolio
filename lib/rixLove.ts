// Rix's love act after a pet (ui-spec/00-rix.md R3.1 `love`, R6B.2; ≈ 2.4s), full motion,
// character sheet only. At 0 the act cuts what runs (a stretch brakes): the eyes turn into
// diamonds (45° about each eye's centre), a dreamy look up, the melt, arms down, the right foot
// pops. From 0.1 the hearts rise (`HEARTS`) and the eyes beat (`LOVE.beat`); from 0.3 he sways.
// The pet's line types from 0.6 (never announced). At 2.4 love goes out: no new hearts start and
// the rising ones finish; the beat, sway, melt and foot ease back. While a fine pointer still rests
// on him the Out waits, up to `LOVE.max` from the start. The beat and sway run in the crew as
// `rix.loveLoop`, so a cut stops them (lib/rixActs.ts).
import { gsap } from "@/lib/gsap";
import { cut, play, timeline } from "@/lib/rixActs";
import { emoteIn, emotionIn, emotionOut } from "@/lib/rixEmote";
import { LOVE, TALK } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";

export type LoveOptions = {
  /** A fine pointer still rests on him: the Out waits (up to `LOVE.max`). */
  readonly resting?: () => boolean;
  /** Called once love has gone out (the pet's rest starts here). */
  readonly done?: () => void;
};

/** The eyes' double beat every `every`, and the sway: one loop, until love goes out. */
function loveLoop(rix: Rix): gsap.core.Timeline {
  const { parts, ch } = rix.bot;
  const { beat, sway } = LOVE;
  const beats = gsap.timeline({ repeat: -1 });
  for (let i = 0; i < beat.count; i += 1) {
    const at = i * beat.gap;
    beats.to(parts.eye, { scale: beat.scale, ...beat.up }, at).to(parts.eye, { scale: 1, ...beat.down }, at + beat.up.duration);
  }
  beats.set({}, {}, beat.every);
  const swaying = gsap
    .timeline()
    .to(ch, { tilt: sway.tilt, duration: sway.half / 2, ease: "sine.out" })
    .to(ch, { tilt: -sway.tilt, duration: sway.half, ease: sway.ease, repeat: -1, yoyo: true });
  return gsap
    .timeline()
    .add(beats, LOVE.heartsAt)
    .add(swaying, sway.from);
}

/** The love act, typing `line` (none for the /dev emotion button). */
export function love(rix: Rix, line: string | null, options: LoveOptions = {}) {
  const { bot, crew } = rix;
  const { parts, ch } = bot;
  const { melt, arms, footPop, back } = LOVE;
  const start = crew.now();
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  tl.add(emotionIn(rix, "love", { eyesOnly: true, skipEmote: true }), 0)
    .to(parts.upper, { scaleX: melt.scaleX, scaleY: melt.scaleY, y: melt.y, duration: melt.duration, ease: melt.ease }, 0)
    .to(ch, { actL: arms.l, actR: arms.r, mixL: 0, mixR: 0, duration: arms.duration, ease: arms.ease }, 0)
    .to(parts.footRight, { y: footPop.y, duration: footPop.duration, ease: footPop.ease }, 0)
    .call(
      () => {
        rix.loveLoop?.kill();
        rix.loveLoop = crew.run(loveLoop(rix));
      },
      [],
      0,
    )
    .add(emoteIn(rix, "hearts", "love"), LOVE.heartsAt);
  if (line) rix.say(line, { at: TALK.afterPet, style: "type" });

  // 2.4: the Out, unless a fine pointer still rests on him (then it waits, up to `LOVE.max`).
  let poll: gsap.core.Tween | null = null;
  const resting = options.resting ?? (() => false);
  const waitOut = () => {
    poll = null;
    if (bot.busy !== tl) return;
    if (resting() && crew.now() - start < LOVE.max) {
      poll = crew.after(LOVE.poll, waitOut);
      return;
    }
    tl.play();
  };
  tl.addPause(LOVE.length, waitOut)
    .call(
      () => {
        rix.loveLoop?.kill();
        rix.loveLoop = null;
      },
      [],
      LOVE.length,
    )
    .to(parts.eye, { scale: 1, ...back }, LOVE.length)
    .to(ch, { tilt: 0, actL: 0, actR: 0, mixL: 1, mixR: 1, ...back }, LOVE.length)
    .to(parts.upper, { scaleX: 1, scaleY: 1, y: 0, ...back }, LOVE.length)
    .to(parts.footRight, { y: 0, ...back }, LOVE.length)
    .add(emotionOut(rix, "love", { eyesOnly: true }), LOVE.length)
    .call(() => options.done?.(), [], ">");
  tl.eventCallback("onInterrupt", () => poll?.kill());
  play(rix, tl, "pet");
}
