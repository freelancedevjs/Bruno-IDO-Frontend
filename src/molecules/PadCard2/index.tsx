import React, { useEffect, useMemo } from "react";
import Image, { StaticImageData } from "next/image";
import ArrowIcon from "@public/images/arrowInvest.svg";
import moment from "moment";
import getProjectLink from "@helpers/getProjectLink";
import useAuth from "@hooks/useAuth";
import Link from "next/link";
import { networkIcon, networkIconV2 } from "@helpers/getNetworkIcon";
import useWidth from "@hooks/useWidth";
import millify from "millify";
import { ethers } from "ethers";
import useTokenInfo from "@hooks/useTokenInfo";
import { CountdownTimer } from "@atoms/CountdownTimer";
import { useRouter } from "next/router";
import { useNFTData } from "src/contexts/NFTContext";

interface IProps {
  data: any;
  id: string;
}

const PadCard2 = (props: IProps) => {
  const { data, id } = props;
  const { chainId, account, ethereum } = useAuth();
  const width = useWidth();

  const poolchain = useMemo(() => {
    if (data?.network) {
      switch (data.network) {
        case "ethereum":
          return 1;
        case "mumbai":
          return 80001;
        case "polygon":
          return 137;
        case "binance":
          return 56;
        default:
          return;
      }
    }
  }, [data?.network]);

  const NFTData = useNFTData();

  const isWhitelisted: boolean = useMemo(() => {
    if (
      poolchain &&
      NFTData &&
      NFTData[poolchain] &&
      data?.nft_address &&
      Object.keys(NFTData[poolchain]).includes(data?.nft_address)
    ) {
      let nft_local_data = NFTData[poolchain][data?.nft_address];
      let is_whitelisted =
        nft_local_data["address"] === account && nft_local_data["whitelisted"];
      return is_whitelisted;
    }
    return false;
  }, [NFTData, account, data?.nft_address, poolchain]);

  const project_status = useMemo(() => {
    if (!data) return "loading";

    if (data.status == "Cancelled") {
      return "sale ended";
    }

    if (data.status == "finalised") {
      return "sale ended";
    }

    let startTime, endTime;
    if (
      data?.nft_address !== "0x0000000000000000000000000000000000000000" &&
      ethers.utils.isAddress(data?.nft_address)
    ) {
      if (isWhitelisted) {
        startTime = moment(data?.starts_at);
        endTime = moment(data?.ends_at);
      } else {
        startTime = moment(data?.whitelist_ends_at);
        endTime = moment(data?.ends_at);
      }
    } else {
      startTime = moment(data?.starts_at);
      endTime = moment(data?.ends_at);
    }

    if (startTime.isAfter(moment().utc())) {
      return "upcoming";
    } else if (
      startTime.isBefore(moment().utc()) &&
      endTime.isAfter(moment().utc())
    ) {
      return "sale live";
    } else {
      return "sale ended";
    }
  }, [data, account, isWhitelisted, chainId]);

  const TimerTime = React.useMemo(() => {
    let start, end;
    if (
      data?.nft_address !== "0x0000000000000000000000000000000000000000" &&
      ethers.utils.isAddress(data?.nft_address)
    ) {
      if (isWhitelisted) {
        start = moment(data.starts_at);
        end = moment(data.ends_at);
      } else {
        start = moment(data.whitelist_ends_at);
        end = moment(data.ends_at);
      }
    } else {
      start = moment(data.starts_at);
      end = moment(data.ends_at);
    }

    if (moment(start).isAfter(moment().utc())) {
      return start;
    } else {
      return end;
    }
  }, [
    data.start_time,
    data.end_time,
    data.whitelist_ends_time,
    account,
    data,
    chainId,
    isWhitelisted,
  ]);

  const poolLink = getProjectLink(id, "launchpad", chainId);

  const buttonComp = (project_status: string) => {
    switch (project_status) {
      case "upcoming":
        return (
          <button className=" flex gap-4 justify-center items-center bg-violet-primary h-[56px] md:h-[70px] w-full text-base md:text-xl font-semibold rounded-lg mt-12">
            STARTS IN{" "}
            {moment(data.starts_at).utc().unix() - moment().utc().unix() >
            24 * 60 * 60 ? (
              moment(data.starts_at).utc().format("DD/MM/YYYY")
            ) : (
              <CountdownTimer date={TimerTime.toString()} variant={"card"} />
            )}
          </button>
        );
      case "sale live":
        return (
          <button className=" flex gap-4 justify-center items-center bg-primary h-[56px] md:h-[70px] w-full text-base md:text-xl font-semibold rounded-lg mt-12">
            INVEST NOW!
            <Image src={ArrowIcon} />
          </button>
        );
      case "sale ended":
        return (
          <button className=" flex gap-4 justify-center items-center bg-[#282B2A] h-[56px] md:h-[70px] w-full text-base md:text-xl font-semibold rounded-lg mt-12">
            ENDED ON {moment(data.ends_at).utc().format("DD/MM/YYYY")}
          </button>
        );
      default:
        return;
    }
  };

  const formatDescription = (description: string) => {
    if (description.length < 30) {
      return description;
    } else {
      return description.substring(0, 30) + "...";
    }
  };

  return (
    <Link href={`/${poolLink}`}>
      <div className="relative z-10 cursor-pointer h-full">
        <div
          className={`absolute h-16 w-16 md:h-20 md:w-20 -right-1 -top-1 -z-10 ${
            project_status === "sale live"
              ? "cardGreenTopRight"
              : "cardTopRight"
          } `}></div>
        <div
          className={`absolute h-16 w-16 md:h-20 md:w-20 -left-1 -bottom-1 -z-10 ${
            project_status === "sale live"
              ? "cardGreenBottomLeft"
              : "cardBottomLeft"
          } cardBottomLeft`}></div>

        <div className="px-3 sm:px-4 py-6 bg-[#070E12] cardShadow h-full flex flex-col justify-between">
          <div>
            <div className="bg-cover bg-no-repeat bg-center text-center w-full relative">
              <img
                src={data?.banner_image}
                alt={data?.name?.substring(0, 4)}
                className="w-full object-contain h-[200px] lg:h-[276px]"
              />
              <div className="h-24 w-24 flex justify-center items-center md:h-[116px] md:w-[116px] bg-[#070E12] p-2 absolute rounded-full -bottom-[58px] md:left-8 overflow-hidden">
                <div className="flex h-[5.3rem] w-[5.3rem] justify-center items-center p-3 rounded-full bg-gray18">
                  {/* <Image src={data.logo} layout="fill" alt={data.poolDetails.title} /> */}
                  <img
                    src={data?.logo_image}
                    className="object-cover rounded-full "
                    alt={data.poolDetails?.name?.substring(0, 5)}
                  />
                </div>
              </div>
            </div>
            <div className="mt-16 text-left mx-4 md:mx-6 relative ">
              <div className="absolute right-0 top-0 flex items-center justify-center p-2 rounded-full bg-gray18">
                <Image
                  src={networkIconV2(data?.network)}
                  alt=""
                  height={24}
                  width={24}
                  objectFit="contain"
                />
              </div>
              <div
                className={`text-primary font-medium text-xl sm:text-2xl  ${
                  width < 600
                    ? width < 300
                      ? "max-w-[130px] w-full"
                      : "max-w-[160px] w-full"
                    : ""
                }  md:w-[85%]`}>
                <p className="truncate w-full">{data?.name}</p>
              </div>
              <div className=" text-base text-[#646464]">{`${data?.symbol}`}</div>
              <div className=" text-secondary text-lg font-medium my-4 sm:min-h-[60px]">
                {formatDescription(data?.short_description ?? data?.name)}
              </div>
              {project_status !== "sale ended" ? (
                <>
                  <div className=" flex items-center gap-3 justify-between text-[#646464] text-sm md:text-base">
                    <span>Funding Goal</span>
                    <span className="text-right">
                      $
                      {millify(data.hardcap, {
                        precision: 2,
                      })}
                    </span>
                  </div>
                  <div className=" flex items-center gap-3 justify-between text-[#646464] text-sm md:text-base">
                    <span>Price per Token</span>
                    <span className=" text-right">
                      {data?.token_price &&
                        ` 1 ${data?.symbol}  = ${millify(
                          data?.usdt_price || 0,
                          {
                            precision: 4,
                          }
                        )} USDT`}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className=" flex items-center gap-3 justify-between text-[#646464] text-sm md:text-base">
                    <span>Total Raised</span>
                    <span className="text-right">
                      $
                      {millify(data.total_raised, {
                        precision: 2,
                      })}
                    </span>
                  </div>

                  <div className=" flex items-center gap-3 justify-between text-[#646464] text-sm md:text-base">
                    <span>ATH Since Bipzy</span>
                    <span className=" text-right">
                      $
                      {millify(data?.ath, {
                        precision: 2,
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {buttonComp(project_status)}
        </div>
      </div>
    </Link>
  );
};

export default PadCard2;
