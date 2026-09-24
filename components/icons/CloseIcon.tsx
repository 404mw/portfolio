// A cross: the phone menu button when open, and takeover close.
import { Icon, type IconProps } from "@/components/icons/Icon";

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  );
}
