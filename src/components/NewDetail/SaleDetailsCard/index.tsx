import React, { useEffect } from "react";
import PercentageLine from "./PercentageLine";
import { IoIosArrowDown } from "react-icons/io";
import Button from "@atoms/Button";
import BNBImage from "@public/images/bnb2.png";
import Image from "next/image";
import { DetailsType, IPoolDetailsData } from "..";
import moment from "moment";
import { CountdownTimer } from "@atoms/CountdownTimer";
import useAuth from "@hooks/useAuth";
import polygon from "@public/icons/svgs/network/polygon.svg";
import binance from "@public/icons/svgs/network/binance.svg";
import ether from "@public/icons/svgs/network/ether.svg";
import arbitrum from "@public/icons/svgs/network/arbitrum.svg";
import { formatPrice } from "@constants/contractHelper";
import { networkIconV2 } from "@helpers/getNetworkIcon";
import { useRouter } from "next/router";
import { switchEthereumChain } from "@providers/UseWalletProvider";
import millify from "millify";
interface IProps {
  data: IPoolDetailsData;
  setIsParticipateModalOpen: (value: boolean) => void;
  setIsCalendarModalOpen: (value: boolean) => void;
  setIsConnectModalOpen: (value: boolean) => void;
}

const SaleDetailsCard = (props: IProps) => {
  const {
    data,
    setIsParticipateModalOpen,
    setIsCalendarModalOpen,
    setIsConnectModalOpen,
  } = props;
  const { connect, account, chainId } = useAuth();
  const router = useRouter();
  const publicTime = React.useMemo(() => {
    let time;
    if (data.sale_type == "whitelist") {
      time = data.whitelist_ends_time;
    } else {
      time = data.start_time;
    }
    return time;
  }, [data]);

  const TimerTime = React.useMemo(() => {
    let start, end;
    if (data.sale_type == "whitelist") {
      if (data.userWhitelisted) {
        // var a = moment.tz(moment.unix(tableData.time), "GMT");
        start = moment.utc(data.start_time);
        end = moment.utc(data.end_time);
      } else {
        start = moment.utc(data.whitelist_ends_time);
        end = moment.utc(data.end_time);
      }
    } else {
      start = moment.utc(data.start_time);
      end = moment.utc(data.end_time);
    }

    if (moment(start).isAfter(moment().utc())) {
      return start;
    } else {
      return end;
    }
  }, [data.start_time, data.end_time, data.whitelist_ends_time, account, data]);

  const scheduleFunctionCall = (unixTimeUTC: number) => {
    const currentTimeUTC = moment().utc().unix();
    const delay = unixTimeUTC - currentTimeUTC;
    if (delay > 0) {
      const timerId = setTimeout(() => {
        router.reload();
      }, delay * 1000);
      return () => clearTimeout(timerId);
    }
  };

  useEffect(() => {
    const cleanup = scheduleFunctionCall(TimerTime.unix());
    return cleanup;
  }, [TimerTime]);

  useEffect(() => {
    if (account && data.poolChainid && data.poolChainid !== chainId) {
      switchEthereumChain({ chainId: data.poolChainid });
    }
  }, []);

  return (
    <div className=" w-full lg:w-1/2 2xl:w-[45%] buyDetailCard ">
      <div className="px-4 lg:px-10 pt-10 pb-7 border-b border-[#6100FF] flex flex-wrap flex-col sm:flex-row sm:justify-between sm:items-center">
        <div className="mr-3">
          <div className=" text-base text-[#FFFFFF] font-light">
            {data.status === "sale ended" ? "Total Raised" : "Funding Goal"}
          </div>
          <div className=" text-primary mt-2 whitespace-nowrap text-2xl sm:text-3xl md:text-[40px] font-semibold">
            {data.status === "sale ended"
              ? parseFloat((data?.total_sold).toFixed(2))
              : `${parseFloat((data?.total_sold).toFixed(2))}/${data?.hard_cap
              }`}{" "}
            USDT
          </div>
        </div>
        <div className="mt-2 text-sm sm:text-base bg-dull-green border w-max  border-primary text-white px-4 sm:px-8 py-2 rounded-[21px] ">
          {data?.token_price &&
            ` 1 ${data.token.symbol} = ${millify(data.usdt_price, {
              precision: 4,
            })} USDT`}
        </div>
      </div>
      <div className="px-4 lg:px-10 pt-6 pb-8">
        <PercentageLine percentage={(data.total_sold / data.hard_cap) * 100} />
        <div className=" flex flex-col sm:flex-row justify-between sm:items-center text-white text-sm mt-7 mb-3 gap-3">
          <div>
            {!(data.status == "sale ended") ? (
              data.status == "upcoming" ? (
                <>
                  <div className=" flex items-center gap-3">
                    <div>Starts on</div>
                    <span className="font-semibold text-base">
                      {TimerTime.format("MMMM Do hh:mm a UTC")}
                    </span>
                  </div>
                  <CountdownTimer
                    variant={"simple"}
                    date={TimerTime.toString()}
                  />
                </>
              ) : (
                <>
                  <div className=" flex items-center gap-3">
                    <div>Ends on</div>
                    <span className="font-semibold text-base">
                      {TimerTime.format("MMMM Do hh:mm a UTC")}
                    </span>
                  </div>
                  <CountdownTimer
                    variant={"simple"}
                    date={TimerTime.toString()}
                  />
                </>
              )
            ) : (
              <div>
                Ended on{" "}
                <span className="font-semibold text-base">
                  {TimerTime.format("MMMM Do hh:mm a UTC")}
                </span>{" "}
              </div>
            )}
          </div>
          <div>Participants: {data.participants}</div>
        </div>

        <div className=" px-4 lg:px-9 py-5 bg-[#0C0121] mb-7">
          {data.sale_type == "whitelist" && (
            <div className="flex justify-between gap-2 items-center mb-4">
              <div>
                <div className=" text-[15px] font-medium ">
                  Priority Access - {data?.nft?.name} NFT Holders
                </div>
                <div className="text-[#7C7C7C] font-medium text-[12px]">
                  {moment
                    .utc(data.start_time)
                    .format(" MMMM Do YYYY, hh:mm:ss a")}{" "}
                  UTC
                </div>
              </div>
              {data?.userWhitelisted && data.status !== "sale ended" ? (
                <div className="flex items-center gap-2">
                  <div className="text-primary text-[14px] font-medium">
                    Eligible
                  </div>
                  <IoIosArrowDown className=" text-primary rotate-90" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="text-[#7C7C7C] text-[14px] font-medium">
                    Not Eligible
                  </div>
                  <IoIosArrowDown className="text-[#7C7C7C] rotate-90" />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between gap-3 items-center">
            <div>
              <div className=" text-[15px] font-medium">Public Open Access</div>
              <div className="text-[#7C7C7C] font-medium text-[12px]">
                {moment.utc(publicTime).format(" MMMM Do YYYY, hh:mm:ss a")} UTC
              </div>
            </div>
            {data.status !== "sale ended" ? (
              <div className="flex items-center gap-2">
                <div className="text-primary text-[14px] font-medium">
                  Eligible
                </div>
                <IoIosArrowDown className=" text-primary rotate-90" />
              </div>
            ) : (
              <div className="flex items-center gap-2 ">
                <div className="text-[#7C7C7C] text-[14px] font-medium">
                  Not Eligible
                </div>
                <IoIosArrowDown className="text-[#7C7C7C] rotate-90" />
              </div>
            )}
          </div>
        </div>

        <div className=" flex justify-between items-center flex-col xl:flex-row gap-5 md:gap-7 xl:gap-0">
          {!account ? (
            <Button
              onClick={() => setIsConnectModalOpen(true)}
              className="text-base">
              Connect Wallet
            </Button>
          ) : data.poolChainid !== chainId ? (
            <Button
              onClick={async () => {
                if (data.poolChainid) {
                  switchEthereumChain({ chainId: data.poolChainid });
                }
              }}
              className="text-base">
              Change Network
            </Button>
          ) : (
            <Button
              disabled={!(data.status == "sale live")}
              onClick={() => setIsParticipateModalOpen(true)}>
              Invest Now
            </Button>
          )}
          <div
            onClick={() => {
              data.status !== "sale ended" && setIsCalendarModalOpen(true);
            }}
            className={`underline text-base ${data.status !== "sale ended"
              ? "text-[#B9B7B7] cursor-pointer"
              : " text-gray-500 cursor-not-allowed"
              }  font-medium`}>
            Add To My Calendar
          </div>
          {data?.network && <Image src={networkIconV2(data?.network)} />}
        </div>
      </div>
    </div>
  );
};

export default SaleDetailsCard;
