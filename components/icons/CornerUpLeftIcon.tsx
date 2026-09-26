// An arrow turning up and back to the left: the process loop's return, on phone and tablet.
import { Icon, type IconProps } from "@/components/icons/Icon";

export function CornerUpLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 14L4 9l5-5" />
      <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
    </Icon>
  );
}
