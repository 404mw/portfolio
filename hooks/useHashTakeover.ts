// Opens and closes the project takeovers from the address hash (ui-spec §7.3).
//
// - On load and on every hash change, a takeover hash opens its dialog with `showModal()` and
//   locks the page's scroll (`overflow-hidden` on <html>); any other hash closes it and returns
//   focus to that project's card (`[data-proof-card][href="#id"]`). The hash is compared raw
//   against the known ids, so a badly encoded hash (`#%`) just means "no project".
// - Every takeover opens at its top: its `scrollTop` is reset right after `showModal()` (a closed
//   dialog is `display: none`, where a reset is ignored and the old offset kept), and again just
//   before each close, while it's still displayed.
// - A page that loads straight on a takeover hash (a shared link, or a card clicked before the
//   page was ready) first gets a `homeHash` entry beneath it: the entry is rewritten to
//   `homeHash` and the takeover hash pushed on top (once: the pushed entry is marked). So every open takeover has a page entry
//   under it, and Esc (the dialog's `cancel` event, default prevented), the Close link (which
//   raises `cancel`), a dialog closed any other way and the browser's Back all leave the same
//   way: `history.back()`. The hash change that follows does the closing.
// - Next (a takeover hash replacing another): the new dialog is shown as the modal on top of the
//   old one, which stays open beneath it (inert, blocked by the new modal) until the handover
//   ends, then closes. Only the new dialog takes focus, Esc and Close from the moment it opens.
// - While this runs, <html> carries `data-takeover-js`, which turns off the no-JS `:target`
//   display, so only the dialog's `open` state shows it.
// - Opening from a card must not move the page: the scroll position at the click is kept.
// - Motion (optional `transitions`, hooks/useTakeoverMotion.ts) plays around this, never instead
//   of it: `opened` runs right after `showModal()`; `replacing` plays the Next handover and then
//   lets the old dialog close; when the hash leaves a takeover, `closing` plays the exit and the
//   dialog closes (and focus returns) when it ends. So Esc, Close and Back all get the same exit,
//   after the hash change. Any new hash first ends the handover or exit still playing (`settle`),
//   so no dialog is ever left half-open, half-closed or open beneath another. Without
//   `transitions`, or for a dialog the browser already closed, it's instant.
import { useEffect } from "react";
import { proofCardSelector } from "@/lib/proofs";

/** How a takeover came up: on page load (already shown by `:target`), or over the page. */
export type TakeoverOpening = "load" | "page";

/** Motion around a takeover's open, Next and close. Must be a stable object. */
export type TakeoverTransitions = {
  /** Runs right after `showModal()` when a takeover opens over the page or on load. */
  readonly opened: (dialog: HTMLDialogElement, how: TakeoverOpening) => void;
  /**
   * Next: runs right after `dialog`'s `showModal()`, while `previous` is still open beneath it.
   * Plays the handover, then calls `done`, which closes `previous`. Returns `stop`, which ends the
   * handover at once (both dialogs back to their resting state) without calling `done`.
   */
  readonly replacing: (
    dialog: HTMLDialogElement,
    previous: HTMLDialogElement,
    done: () => void,
  ) => () => void;
  /**
   * Runs once the hash has left `dialog`, while it's still open: plays the exit, then calls
   * `done`, which closes it. Returns `stop`, which ends the exit at once without calling `done`.
   */
  readonly closing: (dialog: HTMLDialogElement, done: () => void) => () => void;
};

const scrollLock = "overflow-hidden";
const jsFlag = "data-takeover-js";
// Marks the entry this hook pushed, so a reload or a remount doesn't push a second one.
const pushedMark = "takeoverPushed";

/** Closes `dialog` if it's open, back at its top first (while it's still displayed). */
function closeAtTop(dialog: HTMLDialogElement): void {
  if (!dialog.open) return;
  dialog.scrollTop = 0;
  dialog.close();
}

export function useHashTakeover(
  ids: readonly string[],
  homeHash: string,
  transitions?: TakeoverTransitions,
): void {
  useEffect(() => {
    const root = document.documentElement;
    const dialogs = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLDialogElement => el instanceof HTMLDialogElement);

    let current: HTMLDialogElement | null = null;
    let leaving = false;
    let scrollAtClick: number | null = null;
    // The handover or exit playing now, if any: `stop` ends its motion, `finish` closes its dialog.
    let pending: { stop: () => void; finish: () => void } | null = null;
    // True only for the first sync, on load.
    let loading = true;

    const dialogForHash = () => {
      const id = window.location.hash.slice(1);
      return dialogs.find((dialog) => dialog.id === id) ?? null;
    };

    /** Ends the handover or exit still playing at once, closing its dialog. */
    const settle = () => {
      const was = pending;
      pending = null;
      if (!was) return;
      was.stop();
      was.finish();
    };

    /** Plays `start` (a transition) around `finish`; with no transition, finishes at once. */
    const play = (finish: () => void, start: ((done: () => void) => () => void) | null) => {
      let finished = false;
      const once = () => {
        if (finished) return;
        finished = true;
        if (pending?.finish === once) pending = null;
        finish();
      };
      const stop = start ? start(once) : null;
      if (stop && !finished) pending = { stop, finish: once };
      else once();
    };

    const sync = () => {
      const next = dialogForHash();
      const previous = current;
      const keepScroll = scrollAtClick;
      scrollAtClick = null;
      leaving = false;
      if (next === previous) return;
      settle();
      current = next;

      if (next) {
        if (!previous) {
          root.classList.add(scrollLock);
          if (keepScroll !== null && window.scrollY !== keepScroll) {
            window.scrollTo(window.scrollX, keepScroll);
          }
        }
        // Next: the old takeover stays open beneath the new modal until the handover ends.
        next.showModal();
        next.scrollTop = 0;
        const landed = document.activeElement;

        if (previous?.open) {
          const handOver = () => {
            closeAtTop(previous);
            // Closing the dialog beneath may try to restore its own earlier focus; keep it here.
            if (next.open && !next.contains(document.activeElement)) {
              const target = landed instanceof HTMLElement && next.contains(landed) ? landed : next;
              target.focus({ preventScroll: true });
            }
          };
          play(handOver, transitions ? (done) => transitions.replacing(next, previous, done) : null);
        } else {
          transitions?.opened(next, loading ? "load" : "page");
        }
      } else if (previous) {
        const backToPage = () => {
          closeAtTop(previous);
          root.classList.remove(scrollLock);
          document.querySelector<HTMLElement>(proofCardSelector(previous.id))?.focus();
        };
        play(
          backToPage,
          transitions && previous.open ? (done) => transitions.closing(previous, done) : null,
        );
      }
    };

    const leave = () => {
      if (leaving) return;
      leaving = true;
      window.history.back();
    };

    const onCancel = (event: Event) => {
      event.preventDefault();
      if (event.currentTarget === current) leave();
    };

    // A dialog closed by the browser itself (not by `sync`) still leaves through the hash. The
    // event arrives a task later, so one closed and already reopened by `sync` is left alone.
    const onClose = (event: Event) => {
      if (current && event.currentTarget === current && !current.open) leave();
    };

    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("[data-proof-card]")) {
        scrollAtClick = window.scrollY;
      }
    };

    dialogs.forEach((dialog) => {
      dialog.addEventListener("cancel", onCancel);
      dialog.addEventListener("close", onClose);
    });
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", sync);
    window.addEventListener("popstate", sync);
    root.setAttribute(jsFlag, "");

    const loadedOn = dialogForHash();
    if (loadedOn && window.history.state?.[pushedMark] !== true) {
      window.history.replaceState(null, "", homeHash);
      window.history.pushState({ [pushedMark]: true }, "", `#${loadedOn.id}`);
    }
    sync();
    loading = false;

    return () => {
      pending?.stop();
      pending = null;
      dialogs.forEach((dialog) => {
        dialog.removeEventListener("cancel", onCancel);
        dialog.removeEventListener("close", onClose);
        closeAtTop(dialog);
      });
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
      root.removeAttribute(jsFlag);
      root.classList.remove(scrollLock);
    };
  }, [ids, homeHash, transitions]);
}
