import React from "react";
import Image, { StaticImageData } from "next/image";
import Diamond from "@public/images/diamond.svg";
import Fall from "@public/images/fall.svg";
import Shield from "@public/images/shield.svg";
import Chain from "@public/images/chain.svg";
import VectorRight from "@public/images/rightVector.png";
import VectorLeft from "@public/images/leftVector.png";
import Heading from "@atoms/Heading";

interface IProps {
  icon: StaticImageData;
  title?: string;
  desc?: string;
}

const AdvantageTile = (props: IProps) => {
  const { title, desc, icon } = props;
  return (
    <div className=" relative z-10">
      <div className="absolute h-[60px] w-[60px] -top-0.5 -left-0.5 -z-10 gradientBorderLeft"></div>
      <div className="absolute h-[60px] w-[60px] -bottom-0.5 -z-10 -right-0.5 gradientBorder "></div>
      <div className=" px-2.5 py-3 green-lower-card text-left h-full">
        <div className="green-upper-card p-4 sm:p-6 md:p-12  h-full ">
          <Image src={icon} alt="" height={75} width={75} />
          <div className="text-3xl capitalize md:text-4xl font-medium text-primary mt-10 mb-2.5">
            {title}
          </div>
          <div className=" text-sm text-white">{desc}</div>
        </div>
      </div>
    </div>
  );
};

const Advantages = () => {
  return (
    <div className="bg-advantage bg-cover bg-left bg-no-repeat relative overflow-hidden">
      {/* <div
        style={{
          width: "1300px",
          height: "2162px",
        }}
        className="absolute -top-[150px] -left-[300px]">
        <Image src={VectorLeft} layout="fill" />
      </div>
      <div
        style={{
          width: "1430px",
          height: "1955px",
        }}
        className="absolute -right-[600px] -top-[400px]">
        <Image src={VectorRight} layout="fill" />
      </div> */}
      <div className=" container mx-auto py-20 md:pt-[150px] md:pb-28 text-center px-6">
        <div className=" text-secondary text-2xl md:text-4xl font-normal mb-4">
          The 4 Main Advantages for you{" "}
        </div>
        <Heading
          text="Why participate in Bipzy Launchpad?"
          textSize="text-4xl md:text-6xl "
        />
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mt-24 mx-auto max-w-6xl">
          <AdvantageTile
            title="Invest in the best gems"
            desc="Thanks to the influence of our ambassadors, we get the best
            allocations for the most promising projects."
            icon={Diamond}
          />
          <AdvantageTile
            title="Get the lowest prices"
            desc="You will be able to invest at an early stage before the tokens hit
            the masses and get listed on major exchanges."
            icon={Fall}
          />
          <AdvantageTile
            title="Rigorously selected projects"
            desc="We carefully select projects, vetting and verifying the origin and
            legitimacy of the project team, the innovation of the idea
            and its ability to execute its vision."
            icon={Shield}
          />
          <AdvantageTile
            title="Flexible options to invest"
            desc="We support the most popular chains so you can choose the one
            that suits you best and save on commissions: Ethereum, Binance
            Smart Chain, Polygon, Arbitrum."
            icon={Chain}
          />
        </div>
      </div>
    </div>
  );
};

export default Advantages;
