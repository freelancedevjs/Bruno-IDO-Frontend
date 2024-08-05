import { divider } from "@uiw/react-md-editor";
import { StaticImageData } from "next/image";
import Link from "next/link";
import Image from "next/image";

interface Iprops {
  type: string;
  title: string;
  icon?: any;
  url?: string;
  customClass?: string;
  iconSrc?: StaticImageData | string;
  onClick?: any;
}

const CustomButton = ({
  type,
  title,
  icon,
  url,
  customClass,
  iconSrc,
  ...rest
}: Iprops) => {
  return (
    <div {...rest} className={`my-5  truncate cursor-pointer ${customClass}`}>
      <div
        className={`btn-${type} text-lg flex  items-center  gap-1 rounded px-4 p-2 `}>
        {icon && <div className="flex-shrink-0">{icon}</div>}
        {!icon && iconSrc && (
          <Image
            src={iconSrc}
            alt={title.substring(0, 5)}
            height={20}
            width={20}
            objectFit="contain"
          />
        )}
        <span className="truncate">{title}</span>
      </div>
    </div>
  );
};

export default CustomButton;
