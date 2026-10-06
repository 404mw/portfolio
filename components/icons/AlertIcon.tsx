// A warning triangle: the spam diagram's "spots" step.
import { Icon, type IconProps } from "@/components/icons/Icon";

export function AlertIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.5L2.5 20h19L12 3.5z" />
      <path d="M12 10v4.5" />
      <path d="M12 17.25v.01" />
    </Icon>
  );
}
