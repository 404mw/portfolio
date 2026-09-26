// A chevron pointing right: the step-to-step direction on the process ground line.
import { Icon, type IconProps } from "@/components/icons/Icon";

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 6l6 6-6 6" />
    </Icon>
  );
}
