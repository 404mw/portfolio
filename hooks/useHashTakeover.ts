// Opens and closes the project takeovers from the address hash (ui-spec §7.3).
//
// - On load and on every hash change, a takeover hash opens its dialog with `showModal()` and
//   locks the page's scroll (`overflow-hidden` on <html>); any other hash closes it and returns
//   focus to that project's card (`[data-proof-card][href="#id"]`). The hash is compared raw
//   against the known ids, so a badly encoded hash (`#%`) just means "no project".
// - A page that loads straight on a takeover hash (a shared link, or a card clicked before the
//   page was ready) first gets a `homeHash` entry beneath it: the entry is rewritten to
//   `homeHash` and the takeover hash pushed on top (once: the pushed entry is marked). So every open takeover has a page entry
//   under it, and Esc (the dialog's `cancel` event, default prevented), the Close link (which
//   raises `cancel`), a dialog closed any other way and the browser's Back all leave the same
//   way: `history.back()`. The hash change that follows does the closing.
// - While this runs, <html> carries `data-takeover-js`, which turns off the no-JS `:target`
//   display, so only the dialog's `open` state shows it.
// - Opening from a card must not move the page: the scroll position at the click is kept.
import { useEffect } from "react";

const scrollLock = "overflow-hidden";
const jsFlag = "data-takeover-js";
// Marks the entry this hook pushed, so a reload or a remount doesn't push a second one.
const pushedMark = "takeoverPushed";

export function useHashTakeover(ids: readonly string[], homeHash: string): void {
  useEffect(() => {
    const root = document.documentElement;
    const dialogs = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLDialogElement => el instanceof HTMLDialogElement);

    let current: HTMLDialogElement | null = null;
    let leaving = false;
    let scrollAtClick: number | null = null;

    const dialogForHash = () => {
      const id = window.location.hash.slice(1);
      return dialogs.find((dialog) => dialog.id === id) ?? null;
    };

    const sync = () => {
      const next = dialogForHash();
      const previous = current;
      const keepScroll = scrollAtClick;
      scrollAtClick = null;
      leaving = false;
      if (next === previous) return;
      current = next;

      if (previous?.open) previous.close();

      if (next) {
        if (!previous) {
          root.classList.add(scrollLock);
          if (keepScroll !== null && window.scrollY !== keepScroll) {
            window.scrollTo(window.scrollX, keepScroll);
          }
        }
        next.scrollTop = 0;
        next.showModal();
      } else if (previous) {
        root.classList.remove(scrollLock);
        document.querySelector<HTMLElement>(`[data-proof-card][href="#${previous.id}"]`)?.focus();
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

    // A dialog closed by the browser itself (not by `sync`) still leaves through the hash.
    const onClose = (event: Event) => {
      if (event.currentTarget === current) leave();
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

    return () => {
      dialogs.forEach((dialog) => {
        dialog.removeEventListener("cancel", onCancel);
        dialog.removeEventListener("close", onClose);
        if (dialog.open) dialog.close();
      });
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", sync);
      window.removeEventListener("popstate", sync);
      root.removeAttribute(jsFlag);
      root.classList.remove(scrollLock);
    };
  }, [ids, homeHash]);
}
