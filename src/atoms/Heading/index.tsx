import { twMerge } from "tailwind-merge";

const Heading = ({
  text,
  className,
  textSize,
  variant,
}: {
  text: string;
  className?: string;
  textSize?: string;
  variant?: string | "secondary";
}) => {
  const getColor = () => {
    switch (variant) {
      case "secondary":
        return {
          frontText: "text-[#0fffff]",
          backText: "title2",
        };
      case "tertiary":
        return {
          frontText: "text-[#0fffff]",
          backText: "text-blue2 -z-10",
        };

      default:
        return {
          frontText: "text-primary",
          backText: "title",
        };
    }
  };

  return (
    <h1
      className={twMerge(
        ` text-4xl sm:text-5xl md:text-7xl relative z-10 uppercase font-bold  w-full ${className}`,
        textSize,
        getColor().frontText
      )}>
      {text}
      <p
        className={twMerge(
          ` text-4xl sm:text-5xl md:text-7xl absolute top-[3px] left-[3px] sm:top-1 sm:left-1 md:top-2 md:left-2 w-full`,
          textSize,
          getColor().backText
        )}>
        {text}
      </p>
    </h1>
  );
};
export default Heading;
