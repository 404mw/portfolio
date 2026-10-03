// Rix's peek-a-boo (ui-spec/00-rix.md R6.5), an idle play, full motion, where he stands: the stage
// clips at the shelf's line and he sinks behind it, holds, rises until only his eyes clear it,
// looks left and right (the arrival's search), then pops up (the arrival's hop on `y`), the clip
// cleared at the peak, `surprised` then `happy`. The clip is always cleared (a cut clears it too).
import { ANTICIPATE, DROP_SQUASH, SETTLE, STRETCH } from "@/lib/processBotMotion";
import { cut, play, timeline } from "@/lib/rixActs";
import { emotionIn, emotionOut } from "@/lib/rixEmote";
import { PEEK_HOP, PEEK_LAND_SQUASH, PEEK_OUT, PEEK_SEARCH, PEEKABOO } from "@/lib/rixMotion";
import type { Rix } from "@/lib/rixRig";

export function peekaboo(rix: Rix) {
  const { bot, stage } = rix;
  const { parts, ch } = bot;
  const tl = timeline();
  const settle = cut(rix);
  if (settle) tl.add(settle, 0);
  tl.set(stage, { clipPath: PEEKABOO.clip }, 0)
    .to(parts.rig, { y: PEEKABOO.sink, ...PEEKABOO.sinkMove }, 0)
    .to(parts.rig, { y: PEEKABOO.rise, ...PEEK_OUT }, PEEKABOO.riseAt);
  // The search: left, hold, right, hold.
  const right = PEEKABOO.searchAt + PEEK_SEARCH.left.duration + PEEK_SEARCH.holdLeft;
  tl.to(ch, { look: -PEEK_SEARCH.look, ...PEEK_SEARCH.left }, PEEKABOO.searchAt).to(
    ch,
    { look: PEEK_SEARCH.look, ...PEEK_SEARCH.right },
    right,
  );
  // The pop: anticipate, up past the line (the clip goes at the peak), down, squash, settle.
  const go = PEEKABOO.popAt + PEEK_HOP.anticipate.duration;
  const peak = go + PEEK_HOP.up.duration;
  const land = peak + PEEK_HOP.down.duration;
  tl.to(parts.upper, { ...ANTICIPATE, ...PEEK_HOP.anticipate }, PEEKABOO.popAt)
    .add(emotionIn(rix, "surprised"), PEEKABOO.popAt)
    .to(ch, { look: bot.restLook, perp: 0, ...PEEK_HOP.lean }, PEEKABOO.popAt)
    .to(parts.rig, { y: PEEK_HOP.rise, ...PEEK_HOP.up }, go)
    .to(parts.upper, { ...STRETCH, ...PEEK_HOP.up }, go)
    .set(stage, { clearProps: "clipPath" }, peak)
    .to(parts.rig, { y: 0, ...PEEK_HOP.down }, peak)
    .to(parts.upper, { ...DROP_SQUASH, duration: PEEK_LAND_SQUASH, ease: "power2.out" }, land)
    .to(parts.upper, { scaleX: 1, scaleY: 1, ...SETTLE }, land + PEEK_LAND_SQUASH)
    .add(emotionOut(rix, "surprised"), land)
    .add(emotionIn(rix, "happy"), land)
    .add(emotionOut(rix, "happy"), land + PEEKABOO.happy);
  play(rix, tl, "play");
}
