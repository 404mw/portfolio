// The pick's memory for one visit (ui-spec §0.5): session storage only, so it ends with the tab.
// `marwix:about-for` holds the pick; `marwix:about-for-link` holds the last `?for=` value applied
// this visit, so a shared link wins once and the visitor's own later pick survives a reload. Every
// call is in try/catch: storage can be blocked or full, and the page works the same without it.
const pickKey = "marwix:about-for";
const linkKey = "marwix:about-for-link";

function read(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, value);
  } catch {
    // No storage: nothing is remembered.
  }
}

/** The remembered pick, or null. */
export const rememberedPick = () => read(pickKey);

/** Remembers the pick; null (nothing checked) forgets it. */
export const rememberPick = (key: string | null) => write(pickKey, key);

/** The last `?for=` value applied this visit, or null. */
export const rememberedLink = () => read(linkKey);

/** Remembers the `?for=` value just applied. */
export const rememberLink = (key: string) => write(linkKey, key);
