// Rix's juggle (ui-spec/00-rix.md R6.1), an idle play, full motion: three emblems (the picked one
// first, or before a pick the board's first three) pop into his right hand a stagger apart, each
// thrown high over his head to the left hand and passed back low, `JUGGLE.rounds` times, with a
// flick of the right arm on each throw and the left on each pass, his eyes up and following the
// arcs. Then each goes out in the hand (a picked one stays) and he's `happy`, with the `sparkle`.
// With a drop, the last
// throw misses: it falls to the line and bounces, he's `surprised` then `sad`, looking at it, and it
// fades. The props are `rix.loose` while out, so a cut puts them back.
import { gsap } from "@/lib/gsap";
import { stripMotion } from "@/lib/processBotRig";
import { cut, keepProp, play, timeline } from "@/lib/rixActs";
import { emotionIn, emotionOut } from "@/lib/rixEmote";
import { JUGGLE, LOOK_AT, PROP_IN, PROP_OUT, PROP_PIVOT } from "@/lib/rixMotion";
import { propFor, type Rix } from "@/lib/rixRig";

/** The props he plays with: the picked one first, then the board's first ones, `count` in all. */
export function playProps(rix: Rix, count: number): SVGGElement[] {
  const picked = rix.picked !== null ? propFor(rix, rix.picked) : undefined;
  const rest = rix.props.filter((prop) => prop !== picked);
  return (picked ? [picked, ...rest] : rest).slice(0, count);
}

export const isPicked = (rix: Rix, prop: SVGGElement) => rix.picked !== null && prop.dataset.propFor === String(rix.picked);

/** Shows a prop in the hand at `at` (`PROP_IN`), unless it's the picked one (already there). */
export function propIn(rix: Rix, tl: gsap.core.Timeline, prop: SVGGElement, at: number) {
  gsap.set(prop, { svgOrigin: PROP_PIVOT, x: 0, y: 0, rotation: 0 });
  if (isPicked(rix, prop)) {
    gsap.set(prop, { opacity: 1 });
    return;
  }
  gsap.set(prop, { opacity: 0, scale: PROP_IN.from });
  tl.to(prop, { opacity: 1, duration: PROP_IN.fade, ease: "none" }, at).to(
    prop,
    { scale: 1, duration: PROP_IN.duration, ease: PROP_IN.ease },
    at,
  );
}

/** Takes a prop out in the hand at `at` (`PROP_OUT`), or keeps it if picked. */
export function propOut(rix: Rix, tl: gsap.core.Timeline, prop: SVGGElement, at: number) {
  if (isPicked(rix, prop)) {
    tl.call(() => keepProp(rix, prop), [], at);
    return;
  }
  tl.to(prop, { scale: PROP_OUT.to, opacity: 0, duration: PROP_OUT.duration, ease: PROP_OUT.ease }, at).call(
    () => stripMotion([prop]),
    [],
    at + PROP_OUT.duration,
  );
}

export function juggle(rix: Rix, drop: boolean) {
  const { bot } = rix;
  const { ch } = bot;
  const { stagger, rounds, flick, look, fall } = JUGGLE;
  const props = playProps(rix, JUGGLE.props);
  if (props.length === 0) return;
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  tl.to(ch, { look: look.d, perp: look.p, ...LOOK_AT }, 0);
  const cycle = JUGGLE.throw.duration + JUGGLE.pass.duration;
  const up = JUGGLE.throw.duration / 2;
  const low = JUGGLE.pass.duration / 2;
  const dropped = drop ? props[props.length - 1] : undefined;
  let end = 0;

  props.forEach((prop, k) => {
    const start = k * stagger;
    rix.loose.push(prop);
    propIn(rix, tl, prop, start);
    for (let r = 0; r < rounds; r += 1) {
      const at = start + r * cycle;
      const miss = prop === dropped && r === rounds - 1;
      // The throw over the head, with a flick; the eyes follow the arc.
      tl.to(prop, { x: miss ? fall.x : JUGGLE.throw.x, duration: JUGGLE.throw.duration, ease: "none" }, at)
        .to(prop, { y: JUGGLE.throw.rise, duration: up, ease: "power2.out" }, at)
        .to(ch, { actR: flick.r, mixR: 0, duration: flick.out, ease: "power2.out" }, at)
        .to(ch, { actR: 0, duration: flick.back, ease: "power2.inOut" }, at + flick.out)
        .to(ch, { perp: look.p + (r % 2 === 0 ? look.follow : -look.follow), duration: up, ease: "sine.inOut" }, at);
      if (miss) {
        const land = at + up + fall.duration;
        tl.to(prop, { y: fall.y, duration: fall.duration, ease: fall.ease }, at + up)
          .to(prop, { y: fall.y - JUGGLE.bounce, duration: JUGGLE.bounceTimes[0], ease: "power2.out" }, land)
          .to(prop, { y: fall.y, duration: JUGGLE.bounceTimes[1], ease: "power2.in" }, land + JUGGLE.bounceTimes[0])
          .add(emotionIn(rix, "surprised"), at + up)
          .add(emotionIn(rix, "sad", { look: JUGGLE.dropLook }), at + up + JUGGLE.surprised)
          .to(prop, { opacity: 0, duration: JUGGLE.fade, ease: "power1.in" }, land + JUGGLE.bounceTimes[0] + JUGGLE.bounceTimes[1])
          .add(emotionOut(rix, "sad"), at + up + JUGGLE.surprised + JUGGLE.sad);
        end = Math.max(end, at + up + JUGGLE.surprised + JUGGLE.sad);
        continue;
      }
      tl.to(prop, { y: 0, duration: up, ease: "power2.in" }, at + up);
      // The low pass back, with the left arm.
      const pass = at + JUGGLE.throw.duration;
      tl.to(prop, { x: 0, duration: JUGGLE.pass.duration, ease: "none" }, pass)
        .to(prop, { y: JUGGLE.pass.rise, duration: low, ease: "power2.out" }, pass)
        .to(prop, { y: 0, duration: low, ease: "power2.in" }, pass + low)
        .to(ch, { actL: flick.l, mixL: 0, duration: flick.out, ease: "power2.out" }, pass)
        .to(ch, { actL: 0, duration: flick.back, ease: "power2.inOut" }, pass + flick.out);
      end = Math.max(end, pass + JUGGLE.pass.duration);
    }
  });

  // Out in the hand (a picked one stays), then glad, or the dropped one fades.
  props.forEach((prop) => {
    if (prop === dropped) tl.call(() => stripMotion([prop]), [], end);
    else propOut(rix, tl, prop, end);
  });
  tl.call(
    () => {
      rix.loose = [];
    },
    [],
    end,
  ).to(ch, { look: bot.restLook, perp: 0, mixL: 1, mixR: 1, duration: 0.3, ease: "power2.inOut" }, end);
  if (!drop) tl.add(emotionIn(rix, "happy", { emote: "sparkle" }), end).add(emotionOut(rix, "happy"), end + JUGGLE.happy);
  play(rix, tl, "play");
}
