// An arrow pointing up and right: links that open elsewhere.
import { Icon, type IconProps } from "@/components/icons/Icon";

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 17L17 7M8 7h9v9" />
    </Icon>
  );
}
