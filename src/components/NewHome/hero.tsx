import { useState, useRef, useEffect, forwardRef, FC, useMemo } from "react";
import Heading from "@atoms/Heading";
import CustomButton from "@components/button";
import { FaPaperPlane, FaBook } from "react-icons/fa";
import DollarSack from "@public/icons/svgs/dollar-sack.svg";
import Rocket from "@public/images/rocket.png";
import dynamic from "next/dynamic";
import useWidth from "@hooks/useWidth";
import { useQuery } from "jsonapi-react";
//@ts-ignore
const CountUp: any = dynamic(() => import("react-countup"), {
  ssr: false,
});

interface HeroProps {
  projectFun: () => void;
  howToParticipateFun: () => void;
}

const Hero: FC<HeroProps> = ({ projectFun, howToParticipateFun }) => {
  const width = useWidth();

  const { data: stats } = useQuery(["settings"]);

  const Stats = useMemo(() => {
    let allStats;
    if (stats) {
      allStats = stats.reduce(
        (
          result: { [x: string]: number },
          item: { key: string | number; value: string }
        ) => {
          result[item.key] = parseFloat(item.value);
          return result;
        },
        {}
      );
    }

    return allStats;
  }, [stats]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (section) {
            observer.unobserve(section);
          }
        }
      });
    });
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  return (
    <div className="hero-section  px-10 lg:px-20 xl:px-[8.5rem] 2xl:px-40 pt-28 md:pt-40 pb-20 relative z-10">
      <div className="hero-internal mx-auto relative">
        <div
          className={`hidden md:block md:absolute animate-bouncy -top-[10.5rem] md:-top-2  sm:-right-2 max-w-[200px] sm:max-w-[250px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[500px] 2xl:max-w-[600px] -z-10`}>
          <img
            src={"/images/rocket.png"}
            alt="rocket"
            className="object-cover"
          />
        </div>
        <div className="flex flex-wrap items-center pb-20 md:pb-56">
          <div className="w-full md:w-8/12">
            <div className="md:mb-12">
              <p
                style={{ letterSpacing: "0.37em" }}
                className="text-secondary uppercase text-2xl font-normal">
                Invest in the most promising
              </p>
              <Heading text={"LAUNCHPAD GEMS"} className="my-2 sm:my-0" />
              <p className="text-secondary capitalize text-2xl font-normal">
                before they hit the market.
              </p>
            </div>
            <div className="flex w-full animate-bouncy md:hidden justify-center items-center my-12 ">
              <img
                src={"/images/rocket.png"}
                alt="rocket"
                className={`object-cover max-w-[255px] ${
                  width > 300 ? "max-w-[300px]" : ""
                } sm:max-w-[360px]`}
              />
            </div>
            <p className="font-light text-lg text-white md:w-8/12">
              Get early access to the most exclusive pre-sales and token
              launches of the ecosystem. We guarantee you projects with solid
              tokenomics and carefully selected by our experienced team
            </p>
            <div className="flex flex-wrap gap-x-4 mt-5">
              <CustomButton
                title={"Discover Projects to Invest"}
                type={"primary"}
                iconSrc={DollarSack}
                onClick={projectFun}
              />
              <CustomButton
                title={"How to participate?"}
                type={"secondary"}
                icon={<FaBook />}
                onClick={howToParticipateFun}
              />
              <a
                target="_blank"
                rel="noreferrer"
                href={"https://t.me/bipzycom"}>
                <CustomButton
                  title={"Get Notified"}
                  type={"secondary"}
                  icon={<FaPaperPlane />}
                />
              </a>
            </div>
          </div>
          <div className="w-full md:w-4/12"></div>
        </div>
        <div className="w-full mb-16">
          <p className="uppercase tracking-widest sm:tracking-[0.8em] text-xl font-semibold text-center text-white">
            Invest easily through your favorite networks
          </p>
          <div className="flex justify-center gap-4 sm:gap-0 flex-wrap items-center mt-5">
            <div
              className={`${
                width < 420 ? "max-w-[100px]" : "max-w-[150px]"
              } sm:max-w-none`}>
              <img className="sm:w-4/5" src="/images/bnbC.svg" />
            </div>
            <div
              className={`${
                width < 420 ? "max-w-[100px]" : "max-w-[150px]"
              } sm:max-w-none`}>
              <img className="sm:w-4/5" src="/images/polygonC.svg" />
            </div>
            <div
              className={`${
                width < 420 ? "max-w-[120px]" : "max-w-[150px]"
              } sm:max-w-none`}>
              <img className="sm:w-4/5" src="/images/arbitriumC.svg" />
            </div>
            <div
              className={`${
                width < 420 ? "max-w-[100px]" : "max-w-[150px]"
              } sm:max-w-none`}>
              <img className="sm:w-4/5" src="/images/etherC.svg" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-x-4 lg:gap-x-8">
          <div className="text-center">
            <h2 className="grad text-4xl xl:text-[3.2rem] font-semibold">
              {isVisible && (
                <CountUp
                  start={0}
                  end={Stats ? Stats["total_raised"] : 0}
                  prefix="$"
                  duration={3}
                />
              )}
            </h2>
            <p className="font-light text-secondary">Raised Funds</p>
          </div>
          <div className="text-center">
            <h2 className="grad text-4xl xl:text-[3.2rem] font-semibold">
              {isVisible && (
                <CountUp
                  start={0}
                  end={Stats ? Stats["total_launched"] : 0}
                  prefix="+"
                  duration={3}
                />
              )}
            </h2>
            <p className="font-light text-secondary">Launched Projects</p>
          </div>
          <div className="text-center">
            <h2 className="grad text-4xl xl:text-[3.2rem] font-semibold">
              {isVisible && (
                <CountUp
                  start={0}
                  end={Stats ? Stats["total_investors"] : 0}
                  duration={3}
                />
              )}
            </h2>
            <p className="font-light text-secondary">Unique Investors</p>
          </div>
          <div className="text-center">
            <h2 className="grad text-4xl xl:text-[3.2rem] font-semibold">
              {isVisible && (
                <CountUp
                  start={0}
                  end={Stats ? Stats["ath"] : 0}
                  suffix="X"
                  duration={3}
                />
              )}
            </h2>
            <p className="font-light text-secondary">ATH since Bipzy</p>
          </div>
        </div>
        <div ref={sectionRef}></div>
      </div>
    </div>
  );
};

export default Hero;
