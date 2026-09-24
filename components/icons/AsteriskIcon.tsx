// An eight-spoke asterisk: the marquee separator. Drawn, not typed, so it keeps the accent
// colour on every platform instead of falling back to a colour emoji.
import { Icon, type IconProps } from "@/components/icons/Icon";

export function AsteriskIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72M18.36 5.64L5.64 18.36" />
    </Icon>
  );
}
