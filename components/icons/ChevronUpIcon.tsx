// A chevron pointing up: the arrowhead on the process return path.
import { Icon, type IconProps } from "@/components/icons/Icon";

export function ChevronUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 15l6-6 6 6" />
    </Icon>
  );
}
