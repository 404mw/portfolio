// The pick lock on About's cards (ui-spec/00-rix.md R6A.9), both motion modes, home's About only:
// while Rix throws his tantrum (from its start to the forgive's end) the visitor can't pick a card.
// DOM only, no motion: the dim is an instant class switch (the cards key on `data-locked`'s
// presence on their fieldset). Locking sets `aria-disabled="true"` on each radio of group `name`
// (never native `disabled`: the radios keep their place in the tab order and focus stays where it
// is) and `data-locked` on their fieldset. Capture-phase listeners on the root swallow, while
// locked, the visitor's own input only: a click inside a card, Space and the arrow keys on a radio,
// and, as a safety net, any trusted `change` that slips through (the previous radio is checked
// again and nobody else hears it). Untrusted changes still apply: the toss's deselect, `?for=`, the
// session memory. A swallowed press calls `pressed` (the sulk's hmph) and says `lockLine` again,
// at most once per `PICK_LOCK.remind`; `unlock` says `unlockLine`. The failsafe unlocks after
// `PICK_LOCK.max` of live time (a crew timer, like the chain it follows). `stop` and
// `stripPickLock` put the markup back exactly as server-rendered.
import type { Crew } from "@/lib/processBotCrew";
import { PICK_LOCK } from "@/lib/rixMotion";

export type PickLock = {
  /** The tantrum's start: the cards lock. The caller appends `lockLine` to the line it announces. */
  readonly lock: () => void;
  /** The forgive's end (or the failsafe): the cards unlock and `unlockLine` is announced. */
  readonly unlock: () => void;
  readonly locked: () => boolean;
  /** Teardown: unlocks silently and removes the listeners. */
  readonly stop: () => void;
};

type PickLockOptions = {
  /** The About instance's section: the listeners' root. */
  readonly root: HTMLElement;
  /** About's radio group. */
  readonly name: string;
  readonly crew: Pick<Crew, "after" | "now">;
  /** Screen-reader lines (`about.rix.lockLine`, `about.rix.unlockLine`). */
  readonly lockLine: string;
  readonly unlockLine: string;
  /** Announces a whole line in `RixStatus`. */
  readonly announce: (line: string) => void;
  /** A press on a locked card was swallowed. */
  readonly pressed?: () => void;
};

/** The keys that check a radio or move the group's roving pick. */
const pickKeys: readonly string[] = [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

/** Takes the lock's attributes off everything under `root` (teardown). */
export function stripPickLock(root: ParentNode) {
  root.querySelectorAll("fieldset[data-locked]").forEach((board) => board.removeAttribute("data-locked"));
  root.querySelectorAll('input[type="radio"][aria-disabled]').forEach((radio) => radio.removeAttribute("aria-disabled"));
}

export function pickLock({ root, name, crew, lockLine, unlockLine, announce, pressed }: PickLockOptions): PickLock {
  const group = `input[type="radio"][name="${name}"]`;
  const radios = Array.from(root.querySelectorAll<HTMLInputElement>(group));
  const board = radios[0]?.closest("fieldset") ?? null;
  let locked = false;
  let checked: HTMLInputElement | null = null;
  let lastSaid = -Infinity;
  let failsafe: ReturnType<Crew["after"]> | null = null;

  const radioOf = (target: EventTarget | null) =>
    target instanceof HTMLInputElement && target.type === "radio" && target.name === name ? target : null;
  const inCard = (target: EventTarget | null) =>
    target instanceof Element && (target.closest("label")?.querySelector(group) ?? null) !== null;

  /** A swallowed press: the caller's answer, and the reminder (spaced `PICK_LOCK.remind` apart). */
  const press = () => {
    pressed?.();
    const now = crew.now();
    if (now - lastSaid < PICK_LOCK.remind) return;
    lastSaid = now;
    announce(lockLine);
  };

  const onClick = (event: MouseEvent) => {
    if (!locked || !event.isTrusted || !inCard(event.target)) return;
    event.preventDefault();
    press();
  };
  const onKey = (event: KeyboardEvent) => {
    if (!locked || !radioOf(event.target) || !pickKeys.includes(event.key)) return;
    event.preventDefault();
    if (!event.repeat) press();
  };
  const onChange = (event: Event) => {
    const radio = radioOf(event.target);
    if (!radio || !locked) return;
    if (!event.isTrusted) {
      // The toss's deselect, `?for=`, the memory: it applies, and is the pick to put back from here.
      checked = radios.find((each) => each.checked) ?? null;
      return;
    }
    radio.checked = false;
    if (checked) checked.checked = true;
    event.stopImmediatePropagation();
    press();
  };
  root.addEventListener("click", onClick, true);
  root.addEventListener("keydown", onKey, true);
  root.addEventListener("change", onChange, true);

  const release = () => {
    locked = false;
    checked = null;
    failsafe?.kill();
    failsafe = null;
    board?.removeAttribute("data-locked");
    radios.forEach((radio) => radio.removeAttribute("aria-disabled"));
  };
  const unlock = () => {
    if (!locked) return;
    release();
    announce(unlockLine);
  };

  return {
    lock: () => {
      if (locked) return;
      locked = true;
      checked = radios.find((each) => each.checked) ?? null;
      // The tantrum's own line carries `lockLine`: the first reminder waits its turn after it.
      lastSaid = crew.now();
      board?.setAttribute("data-locked", "");
      radios.forEach((radio) => radio.setAttribute("aria-disabled", "true"));
      failsafe = crew.after(PICK_LOCK.max, unlock);
    },
    unlock,
    locked: () => locked,
    stop: () => {
      release();
      root.removeEventListener("click", onClick, true);
      root.removeEventListener("keydown", onKey, true);
      root.removeEventListener("change", onChange, true);
    },
  };
}
