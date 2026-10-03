// True once the page has hydrated in the browser; false on the server and in the server markup.
// For controls that only work with JavaScript (Rix's button), so no-JS visitors never meet a
// dead control.
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, onClient, onServer);
}
