import { CountdownTimer } from "@atoms/CountdownTimer";
import Heading from "@atoms/Heading";
import useWidth from "@hooks/useWidth";
import { FC } from "react";

interface ComingSoonProps {}

export const NumberBox = ({ value }: { value: number }) => {
  const width = useWidth();
  return (
    <div
      className={`flex items-center justify-center ${
        width < 400 ? "h-[3rem] w-[2rem] rounded-md" : "h-16 w-12 rounded-lg"
      } sm:h-20 sm:w-16 text-2xl sm:text-4xl lg:text-5xl font-medium text-white px-3 rounded-lg border bg-blue2 border-[#00FFFF] `}>
      {value}
    </div>
  );
};

const ComingSoon: FC<ComingSoonProps> = ({}) => {
  return (
    <div className="pt-40 px-6 sm:px-10 min-h-[calc(100vh-386px)] w-full  comming-soon z-10">
      <p className="text-white  text-center text-lg mb-8 font-normal">
        This 2023 be ready to delegate your crypto trading to a
        <br />
        professionally vettedalgorithmic strategy.
      </p>
      {/* <h1
        className={`text-[#00FFFF] font-bebas text-center uppercase text-7xl md:text-[10rem] lg:text-[12rem] xl:text-[15rem] relative z-20 w-full `}>
        Coming Soon
        <span
          className={`font-bebas text-center uppercase text-7xl md:text-[10rem] lg:text-[12rem] xl:text-[15rem] absolute top-2 left-0 text-blue2 -z-10 w-full`}>
          {"Coming Soon"}
        </span>
      </h1> */}
      <Heading
        variant="tertiary"
        text="Coming Soon"
        textSize={`font-bebas font-normal text-center uppercase text-7xl sm:text-8xl md:text-[10rem] lg:text-[12rem] xl:text-[15rem]`}
      />

      <CountdownTimer variant={"coming-soon"} date={"1703486960"} isTimeUnix />

      <p className="text-center text-white font-normal my-8">
        Risk management is our main concern, which is why we are taking all the
        time required to
        <br className="hidden xl:block" />
        complete a complex compliance process, analyzing all of the algorithm’s
        results from the past
        <br className="hidden xl:block" />
        two years trading in a real account, as well as all the quantitative
        tests about how it
        <br className="hidden xl:block" />
        would behave in the worst-case scenarios. We want you to make money, but
        <br className="hidden xl:block" />
        above all, we don’t want you to lose it.
      </p>
      <div className="flex justify-center py-10">
        <a
          target="_blank"
          rel="noreferrer"
          href={"https://t.me/bipzycom"}
          className="rounded-full text-2xl text-center font-medium text-primary w-full max-w-[250px] py-3 bg-blue4">
          Get Notified
        </a>
      </div>
    </div>
  );
};

export default ComingSoon;
