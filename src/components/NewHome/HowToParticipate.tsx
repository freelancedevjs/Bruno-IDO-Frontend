import { FC, useState } from "react";
import Image, { StaticImageData } from "next/image";
import {
  NFT,
  Projects,
  Usdt,
  Wallet,
  Check,
} from "@public/images/homeIcon/participate";
import Heading from "@atoms/Heading";
import { FaPlay } from "react-icons/fa";
import React from "react";
import Link from "next/link";

interface HowToParticipateProps {
  howToParticipateRef: React.RefObject<HTMLDivElement | null>;
}
interface StepsProps {
  id: number;
  Icon: string | StaticImageData;
  subtitle: string;
  buttonText?: string;
  link?: string;
  externalLink?: boolean;
}

const StepsContentArray = [
  {
    id: 1,
    Icon: Wallet,
    subtitle: "Create a Wallet if you don't have one yet",
    buttonText: "Set up wallet",
    externalLink: true,
    link: "https://metamask.io/download/",
  },
  {
    id: 2,
    Icon: Usdt,
    subtitle: "Transfer funds to your Wallet",
    buttonText: "Buy USDT",
    link: "/buy-usdt",
  },
  {
    id: 3,
    Icon: NFT,
    subtitle:
      "Hold a KManus NFT if you want to get priority access to pre-sales",
    buttonText: "Buy KmanusNFT",
    externalLink: true,
    link: "https://www.kmanus88.com/",
  },
  {
    id: 4,
    Icon: Projects,
    subtitle: "Choose which project you want to invest in",
    buttonText: "Discover projects",
    link: "/launchpad/list",
  },
  {
    id: 5,
    Icon: Check,
    subtitle: "you’re All Set! You can Now participate",
  },
];

const Steps: FC<StepsProps> = ({
  id,
  Icon,
  subtitle,
  buttonText,
  link,
  externalLink,
}) => {
  return (
    <>
      <div className=" flex flex-col items-center w-44 relative">
        <div className="text-primary text-lg sm:text-xl absolute -top-8">{`0${id}`}</div>
        <div className="h-8 w-8 bg-primary/25 flex justify-center items-center rounded-full">
          <div className="h-4 w-4 bg-primary rounded-full"></div>
        </div>

        <div className="h-20 border-dashed border-l border-primary"></div>
        <div className="border border-primary rounded-lg p-8 flex justify-center ">
          <Image
            src={Icon}
            alt={subtitle.substring(0, 5)}
            height={60}
            width={60}
            objectFit="contain"
          />
        </div>
        <p className="text-primary capitalize text-sm text-center mt-8  md:mb-8 lg:mb-14 min-h-[80px]">
          {subtitle}
        </p>
        {buttonText &&
          link &&
          (externalLink ? (
            <a target="_blank" href={link} rel="noreferrer" className="w-full">
              <div className="w-full cursor-pointer text-black py-2 rounded-lg text-base  capitalize font-semibold bg-primary text-center ">
                {buttonText}
              </div>
            </a>
          ) : (
            <Link href={link}>
              <div className="w-full cursor-pointer text-black py-2 rounded-lg text-base  capitalize font-semibold bg-primary text-center ">
                {buttonText}
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

const HowToParticipate = React.forwardRef<
  HTMLDivElement,
  HowToParticipateProps
>(({ howToParticipateRef }, ref) => {
  const [show, setShow] = useState(false);
  return (
    <div
      ref={ref}
      className="bg-gradient-1 bg-center bg-no-repeat w-full py-20 md:py-48 ">
      <div
        ref={howToParticipateRef as React.RefObject<HTMLDivElement>}
        className=" flex w-full justify-center">
        <div className="flex flex-col items-center">
          <Heading
            text={"How To Participate"}
            className="text-center"
            textSize="px-4"
          />
          <p className="text-secondary text-center capitalize  text-2xl font-normal  px-4 sm:px-10">
            in 5 easy steps:
          </p>
          {/* Image Section */}
          <div className="w-full md:max-w-[76%] lg:max-w-[1150px] z-10 p-3 mt-10 px-4 sm:px-10 relative ">
            <div className="absolute h-20 w-20 md:h-36 md:w-36 left-[0.5rem] sm:left-8 top-1 -z-10 designLeft"></div>
            <div className="absolute h-20 w-20 md:h-36 md:w-36 right-[0.5rem] sm:right-8 bottom-1 -z-10 designRight"></div>
            <div className="absolute w-28 md:w-[400px] h-2 right-10 top-1 -z-10 designTop"></div>
            <div className="absolute w-28 md:w-[400px] h-2 left-10 bottom-1 -z-10 designBottom"></div>
            <div className=" w-full border-[12px] border-[#030506] relative">
              <iframe
                src="https://player.vimeo.com/video/846791829?h=4ed4fa66f0&title=0&byline=0&portrait=0"
                className="w-full aspect-video"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen></iframe>
            </div>
          </div>

          {/* Steps */}
          <div className="w-full custom-border mt-24 lg:mt-40 -mb-5 px-6 sm:px-10 " />
          <div className=" px-6 sm:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-16 lg:gap-20">
            {StepsContentArray.map((step) => (
              <Steps {...step} key={step.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

HowToParticipate.displayName = "HowToParticipate";

export default HowToParticipate;
