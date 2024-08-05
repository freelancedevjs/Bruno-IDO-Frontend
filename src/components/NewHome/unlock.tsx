import { IoMdUnlock } from "react-icons/io";
import CustomButton from "../button";
import Heading from "@atoms/Heading";
import Image from "next/image";
import Link from "next/link";

const UnlockSection = () => {
  return (
    <div
      style={{
        background:
          "linear-gradient(53.71deg, #081014 0.51%, #0F0026 32.64%, #030506 68.39%, #101D24 100%)",
      }}
      className=" px-10 lg:px-20 py-20 md:py-24">
      <div className="flex flex-1  flex-col lg:flex-row lg:items-center lg:justify-center max-w-[1520px] mx-auto gap-x-8 xl:gap-x-10 2xl:gap-x-14">
        <div className="lg:self-end lg:flex-[0.4] max-w-[500px] xl:max-w-[550px]">
          <div className="mb-6 md:mb-8 2xl:mb-10 w-full">
            <Heading
              text={"unlock"}
              textSize="text-4xl md:text-7xl lg:text-8xl xl:text-[7rem] 2xl:text-[7.4rem] 4xl:text-[7.6rem] 5xl:text-[7.8rem] 6xl:text-[8rem] mb-3 lg:text-right truncate"
            />
            <p className="text-secondary capitalize lg:text-right text-2xl lg:text-3xl font-normal">
              priority access
            </p>
          </div>
          <p className="font-light text-gray14 text-base md:text-xl ">
            If you hold an NFT from the KManus88 collection, you will receive
            24-hour priority access to all token sales projects on the
            launchpad.
          </p>
          <div className="mt-10 flex">
            <a
              href={"https://www.kmanus88.com/"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded px-4 p-2 btn-primary text-lg">
              <IoMdUnlock size={20} className="text-primary flex-shrink-0" />
              <div className="flex">
                {"Acquire NFT "}{" "}
                <span className="hidden sm:block ml-2">
                  {" for priority access"}
                </span>
              </div>
            </a>
          </div>
        </div>
        <div className="relative mt-6 md:mt-0 md:flex-[0.6]  3xl:flex-[0.54] ">
          <img
            src="/images/unlock-section.png"
            alt={"unlock"}
            className="object-cover"
          />
          {/* <Image src="/images/unlock-section.png" alt={"unlock"} layout="responsive"/> */}
        </div>
      </div>
    </div>
  );
};

export default UnlockSection;
