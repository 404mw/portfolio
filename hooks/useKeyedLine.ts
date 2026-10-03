// The current line for `key` in a keyed line store (lib/lineStore.ts: Rix's quip or his live
// status), re-rendering whenever it's set. Empty on the server and in the server markup.
import { useCallback, useSyncExternalStore } from "react";
import type { LineStore } from "@/lib/lineStore";

const serverLine = () => "";

export function useKeyedLine(
  read: LineStore["read"],
  subscribe: LineStore["subscribe"],
  key: string,
): string {
  const onChange = useCallback((listener: () => void) => subscribe(key, listener), [subscribe, key]);
  const current = useCallback(() => read(key), [read, key]);
  return useSyncExternalStore(onChange, current, serverLine);
}
