// A keyed store of one text line per key, with change listeners: the shape behind Rix's quip
// (lib/rixQuip.ts) and his live status (lib/rixStatus.ts). Keys are About instances' section ids.
// Empty until a line is set.
type Listener = () => void;

export type LineStore = {
  /** The current line for `key`; empty if nothing has been set. */
  readonly read: (key: string) => string;
  /** Sets `key`'s line (it replaces the current one) and tells its listeners. */
  readonly set: (key: string, text: string) => void;
  /** Calls `listener` whenever `key`'s line is set; returns the unsubscribe. */
  readonly subscribe: (key: string, listener: Listener) => () => void;
};

export function createLineStore(): LineStore {
  const lines = new Map<string, string>();
  const listeners = new Map<string, Set<Listener>>();
  return {
    read: (key) => lines.get(key) ?? "",
    set: (key, text) => {
      lines.set(key, text);
      listeners.get(key)?.forEach((listener) => listener());
    },
    subscribe: (key, listener) => {
      const set = listeners.get(key) ?? new Set<Listener>();
      set.add(listener);
      listeners.set(key, set);
      return () => {
        set.delete(listener);
      };
    },
  };
}
