import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { twMerge } from "tailwind-merge";

type IVariant =
  | "outline"
  | "primary"
  | "primary-sm"
  | "success"
  | "cancel"
  | "orange"
  | "primary-xs"
  | "new-black"
  | "new-outline"
  | "accent-1"
  | "accent-2"
  | "green1"
  | "green2"
  | "bigGreen"
  | "bigOutline";
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode | string;
  type?: "button" | "submit" | "reset";
  variant?: IVariant;
  disabled?: boolean;
  onClick?: (e: React.FormEvent<HTMLButtonElement>) => void;
  loading?: boolean;
}

const Button: React.FC<IButtonProps> = ({
  className,
  children,
  type = "button",
  disabled,
  variant = "primary",
  onClick,
  loading,
  ...rest
}) => {
  const returnBg = (variant: IVariant) => {
    switch (variant) {
      case "primary":
        return " border border-primary px-10 py-3 text-primary text-xl font-semibold bg-dull-green rounded-3xl disabled:opacity-50";
    }
  };

  return (
    <button
      className={twMerge(
        `flex justify-center items-center ${
          disabled ? "cursor-not-allowed" : ""
        }`,
        returnBg(variant),
        className
      )}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...rest}>
      {loading ? (
        <div className="animate-spin inline-flex h-full">
          <AiOutlineLoading className=" text-primary font-medium" size={24} />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
