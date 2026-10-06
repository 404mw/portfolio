// A closed padlock: the spam diagram's "shuts it down" step.
import { Icon, type IconProps } from "@/components/icons/Icon";

export function LockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="4.5" y="11" width="15" height="10" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </Icon>
  );
}
