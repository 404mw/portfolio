// Rix balances an emblem (ui-spec/00-rix.md R6.7), an idle play, full motion: a prop (the picked
// one, or before a pick the board's first) is tossed up onto his head in an arc, he wobbles with it
// counter-rotating about `PROP_PIVOT` and his arms out, then it comes back to the hand (or goes out
// with `PROP_OUT` if it isn't picked) and he's `happy`. The prop is `rix.loose` while out.
import { cut, play, timeline } from "@/lib/rixActs";
import { emotionIn, emotionOut } from "@/lib/rixEmote";
import { isPicked, playProps, propIn, propOut } from "@/lib/rixJuggle";
import { BALANCE, PROP_IN } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";

export function balance(rix: Rix) {
  const [prop] = playProps(rix, 1);
  if (!prop) return;
  const { ch } = rix.bot;
  const { to, wobbleAt, wobble, arms, backAt, back, happy } = BALANCE;
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  rix.loose.push(prop);
  propIn(rix, tl, prop, 0);
  tl.to(prop, { x: to.x, duration: to.duration, ease: "none" }, 0).to(prop, { y: to.y, duration: to.duration, ease: "power2.out" }, 0);
  // The wobble: the rig tilts, the prop counter-rotates, arms out.
  const [actL, actR] = arms;
  tl.to(ch, { actL, actR, mixL: 0, mixR: 0, duration: wobble.half, ease: "power2.out" }, wobbleAt);
  for (let i = 0; i < wobble.count; i += 1) {
    const side = i % 2 === 0 ? 1 : -1;
    const at = wobbleAt + i * wobble.half;
    tl.to(ch, { tilt: side * wobble.tilt, duration: wobble.half, ease: "sine.inOut" }, at).to(
      prop,
      { rotation: -side * wobble.prop, duration: wobble.half, ease: "sine.inOut" },
      at,
    );
  }
  tl.to(ch, { tilt: 0, actL: 0, actR: 0, mixL: 1, mixR: 1, duration: back, ease: "power2.inOut" }, backAt);
  if (isPicked(rix, prop)) {
    tl.to(prop, { x: 0, y: 0, rotation: 0, duration: back, ease: "power2.inOut" }, backAt);
    propOut(rix, tl, prop, backAt + back);
  } else {
    tl.to(prop, { rotation: 0, duration: PROP_IN.fade, ease: "power2.out" }, backAt);
    propOut(rix, tl, prop, backAt);
  }
  tl.call(
    () => {
      rix.loose = rix.loose.filter((each) => each !== prop);
    },
    [],
    backAt + back,
  )
    .add(emotionIn(rix, "happy"), backAt + back)
    .add(emotionOut(rix, "happy"), backAt + back + happy);
  play(rix, tl, "play");
}
