import Heading from "@atoms/Heading";
import { FC } from "react";
import { GoTriangleRight } from "react-icons/go";

interface BuyUsdtProps {}

const BuyUsdt: FC<BuyUsdtProps> = ({}) => {
  return (
    <div className="flex justify-center py-20 md:py-40 px-6 md:px-10">
      <div>
        <h3 className="font-semibold text-white text-2xl md:text-4xl mb-5 text-left">
          Buy USDT crypto <span className="text-primary">instantly.</span>
        </h3>
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <iframe
            className="w-full min-w-[230px] min-h-[366px] sm:w-[540px] sm:h-[370px] rounded-lg"
            allow="camera"
            src="https://widget.changelly.com/?from=usd%2Ceur%2Cars%2Cclp%2Cuyu%2Cmxn%2Ccop%2Cbob%2Caed%2Caud%2Ccad%2Cgtq%2Cjpy%2Cpab%2Cpyg%2Crub%2Chkd%2Ccny%2Cbrl&to=usdt20%2Cusdtbsc%2Cmaticpolygon%2Cbnbbsc%2Ceth&amount=150&address=&fromDefault=usd&toDefault=usdt20&merchant_id=amAxAh-vNE9I5e6s&payment_id=&v=3&type=no-rev-share&color=49ac1a&headerId=1&logo=hide&buyButtonTextId=1%22%3ECan%27t"></iframe>
          {/* src="https://widget.changelly.com?…uttonTextId=1"></iframe> */}
          <div className="max-w-sm">
            <p className="text-gray14 text-base">
              Choose the offer that suits you best and buy cryptocurrency in
              just a few clicks.
              <br />
              <br />
              Please note that you will need to buy USDT and ETH, Matic or BNB
              (depending on the network of the project you invest) in order to
              pay gas fees.
            </p>
            <a
              href={
                "https://bipzy.gitbook.io/bipzy-crypto-platform/buy-usdt/how-to-purchase-usdt"
              }
              target="_blank"
              rel="noreferrer">
              <div className="bg-gray18 cursor-pointer text-white font-normal flex items-center gap-2 p-1 px-3 rounded my-3 w-max ">
                <GoTriangleRight className="" />
                <p>More Information</p>
              </div>
            </a>
            <div className=" z-10 p-3 mt-10 px-3 relative ">
              <div className="absolute h-16 w-16 left-1 top-1 -z-10 designLeft"></div>
              <div className="absolute h-16 w-16 right-1 bottom-1 -z-10 designRight"></div>
              <div className="absolute w-28 h-2 right-10 top-1 -z-10 designTop"></div>
              <div className="absolute w-28 h-2 left-10 bottom-1 -z-10 designBottom"></div>
              <div className=" w-full border-[6px] border-[#030506] relative">
                <iframe
                  className="w-full aspect-video"
                  src="https://player.vimeo.com/video/846791810?h=338c6da5e3&title=0&byline=0&portrait=0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyUsdt;
