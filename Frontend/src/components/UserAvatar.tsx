import * as Avatar from "@radix-ui/react-avatar";
import { Tooltip } from "./ToolTip";

export const UserAvatar = ({
  name,
  image,
  color,
  size = 40,
  tooltip = false,
}: UserAvatarProps): JSX.Element => {
  const imageMinName = image?.replace(".webp", "-min.webp");
  const imageSrc = size > 80 ? `${image}` : `${image}`;
  const imageSize = {
    width: `${size}px`,
    minWidth: `${size}px`,
    height: `${size}px`,
  };
  const acronym = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <Tooltip title={name} show={tooltip}>
      <Avatar.Root className="flex  rounded-full" style={imageSize}>
        <Avatar.Image
          className="rounded-full object-cover"
          src={image && imageSrc}
          style={imageSize}
          alt={name}
        />
        <Avatar.Fallback
          delayMs={0}
          className="flex items-center justify-center rounded-full text-font-main"
          style={{
            ...imageSize,
            backgroundColor: color,
            fontSize: `${size / 2}px`,
          }}
        >
          {acronym}
        </Avatar.Fallback>
      </Avatar.Root>
    </Tooltip>
  );
};

interface UserAvatarProps {
  name?: string;
  image?: string;
  color?: string;
  size?: number;
  tooltip?: boolean;
}
