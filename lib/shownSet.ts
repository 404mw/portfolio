// The set Agents and Process show, and its swap (ui-spec §0.5). One store for every reader, so all
// of them change in the same commit: `useProcessBots` never rigs a flow whose markup isn't mounted.
//
// The About pick (the checked radio) names the set to show. When that differs from the set shown,
// the registered wrappers fade out over `SWAP_OUT`, the shown set changes (one synchronous React
// commit), and the wrappers of the new markup fade in over `SWAP_IN`. Opacity only, so it is the
// same under reduced motion; nothing moves, and focus and scroll are left alone.
//
// - The fade-out starts on the ticker's next tick and runs its full time, however busy the frame
//   of the pick was; the fade-in starts once the swap's own commit is done.
// - A pick during the fade-out only changes where the swap lands: the pick is read again when the
//   fade-out ends. If it is back on the set shown, nothing swaps and the wrappers fade back in.
// - A pick during the fade-in starts a new fade-out from the opacity the wrappers have reached.
// - A pick that names the set already shown (no pick and "Not sure yet" are both `default`) does
//   nothing.
// - The first reader's subscription reads the pick too, so a radio checked before hydration (or a
//   `?for=` applied before the store listened) swaps with the same fade.
//
// One tween drives every wrapper, so the sections can't drift apart. It is made outside any GSAP
// context: a pick can arrive inside another hook's context-safe callback (Rix's deselect), and
// that context must not collect the swap's tween and revert it later. When the last reader leaves,
// the fade is stopped, the wrappers' inline opacity is cleared and the store goes back to `default`.
import { flushSync } from "react-dom";
import { pickSet, type AboutSet } from "@/lib/aboutPick";
import { checkedAboutKey, isAboutChange } from "@/lib/aboutReplies";
import { homeAboutName } from "@/lib/aboutScope";
import { gsap } from "@/lib/gsap";
import { ease } from "@/lib/motion";

/** Seconds the old set takes to fade out before the swap (ui-spec §0.5). */
const SWAP_OUT = 0.15;
/** Seconds the new set takes to fade in after it. */
const SWAP_IN = 0.25;

/** The set in the server markup, and with no pick. */
const SERVER_SET: AboutSet = "default";

/** The elements a section fades across a swap, read when a fade starts (a swap remounts some). */
type Wrappers = () => readonly Element[];
/** Runs just before the swap's commit; what it returns runs once the new set is in the DOM. */
type SwapHold = () => (() => void) | void;

let shown: AboutSet = SERVER_SET;
let phase: "idle" | "out" | "in" = "idle";
let tween: gsap.core.Tween | null = null;
/** The ticker listener that starts the fade-out on the next tick, while it waits. */
let starting: gsap.Callback | null = null;
let outside: gsap.Context | null = null;
let holds: SwapHold[] = [];
const readers = new Set<() => void>();
const sections = new Set<Wrappers>();

const pickedSet = () => pickSet(checkedAboutKey(homeAboutName));
const wrappers = () => Array.from(sections).flatMap((find) => Array.from(find()));

/** Stops the fade that is running, or about to start, where it is. */
function halt() {
  if (starting) gsap.ticker.remove(starting);
  starting = null;
  tween?.kill();
  tween = null;
}

/** Replaces the running tween with the one `make` builds, outside every GSAP context. */
function run(make: () => gsap.core.Tween) {
  halt();
  // With no function, `gsap.context()` returns the context now running, so pass an empty one.
  outside ??= gsap.context(() => {});
  outside.ignore(() => {
    tween = make();
  });
}

/** Fades the wrappers in. `lag` is how long this frame has already run, in seconds. */
function fadeIn(lag = 0) {
  phase = "in";
  const targets = wrappers();
  if (targets.length === 0) {
    halt();
    phase = "idle";
    return;
  }
  run(() => {
    // Set at once, not as the tween's start state: GSAP writes a start state lazily, which can be
    // a tick late, and the new markup must never paint at full opacity before its fade.
    gsap.set(targets, { opacity: 0 });
    return gsap.to(targets, {
      opacity: 1,
      duration: SWAP_IN,
      delay: lag,
      ease: ease.out,
      clearProps: "opacity",
      onComplete: () => {
        tween = null;
        phase = "idle";
      },
    });
  });
}

/** The fade-out has ended: show the picked set, if it still differs, then fade back in. */
function swap() {
  const began = performance.now();
  const next = pickedSet();
  if (next !== shown) {
    const settle = holds.map((hold) => hold());
    shown = next;
    // One commit for every reader, finished before the fade-in looks for the new wrappers.
    flushSync(() => readers.forEach((notify) => notify()));
    settle.forEach((done) => done?.());
  }
  holds = [];
  // A tween starts on the clock of the tick it is made in, and the commit above ran inside this
  // one: without the lag, the fade-in would lose the commit's time and open part-way through.
  fadeIn((performance.now() - began) / 1000);
}

/**
 * Fades the wrappers out from the opacity they have, then swaps. The tween is made on the ticker's
 * next tick, not here: a tween made between ticks starts on the last tick's clock, so a busy frame
 * just before the pick would eat into the fade-out, or all of it.
 */
function fadeOut() {
  phase = "out";
  halt();
  starting = gsap.ticker.add(() => {
    starting = null;
    const targets = wrappers();
    run(() =>
      targets.length === 0
        ? gsap.delayedCall(SWAP_OUT, swap)
        : gsap.to(targets, { opacity: 0, duration: SWAP_OUT, ease: "none", onComplete: swap }),
    );
  }, true);
}

/** The pick may have changed: start a swap unless one is already on its way out. */
function onPick() {
  if (phase === "out" || pickedSet() === shown) return;
  fadeOut();
}

function onChange(event: Event) {
  if (isAboutChange(event, homeAboutName)) onPick();
}

function reset() {
  halt();
  phase = "idle";
  holds = [];
  shown = SERVER_SET;
}

/** The set to draw. */
export const shownSet = () => shown;

/** The set in the server markup. */
export const serverShownSet = () => SERVER_SET;

/** For `useSyncExternalStore`: `notify` runs when the shown set changes. */
export function subscribeShownSet(notify: () => void): () => void {
  if (readers.size === 0) document.addEventListener("change", onChange);
  readers.add(notify);
  onPick();
  return () => {
    readers.delete(notify);
    if (readers.size > 0) return;
    document.removeEventListener("change", onChange);
    const left = wrappers();
    reset();
    if (left.length > 0) gsap.set(left, { clearProps: "opacity" });
  };
}

/** Adds a section's wrappers to the swap's fade. Returns the cleanup, which shows them again. */
export function addSwapWrappers(find: Wrappers): () => void {
  sections.add(find);
  return () => {
    sections.delete(find);
    const left = Array.from(find());
    if (left.length > 0) gsap.set(left, { clearProps: "opacity" });
  };
}

/**
 * For a swap that is on its way only: `hold` runs just before its commit, and the function it
 * returns runs once the new set is in the DOM, in the same frame. Dropped if the pick goes back
 * and nothing swaps. With no swap pending it does nothing.
 */
export function aroundPendingSwap(hold: SwapHold) {
  if (phase === "out") holds.push(hold);
}
