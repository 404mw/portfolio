// The hero network canvas's backing-store scale (ui-spec §2.5): the device pixel ratio, capped at
// 2 and at 3840×2160 backing pixels.
const MAX_SCALE = 2;
const MAX_BACKING_PIXELS = 3840 * 2160;

export function backingScale(width: number, height: number, devicePixelRatio: number): number {
  return Math.min(devicePixelRatio || 1, MAX_SCALE, Math.sqrt(MAX_BACKING_PIXELS / (width * height)));
}
