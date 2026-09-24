// A chevron pointing up: direction on the process return line.
import { Icon, type IconProps } from "@/components/icons/Icon";

export function ChevronUpIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 15l6-6 6 6" />
    </Icon>
  );
}
