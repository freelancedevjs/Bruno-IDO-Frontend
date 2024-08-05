import Heading from "@atoms/Heading";
import { FC, useState, useMemo, useEffect, useCallback } from "react";
import { MdDoubleArrow, MdOutlineSearch } from "react-icons/md";
import { BsPlayFill } from "react-icons/bs";
import { IoMdArrowDropright } from "react-icons/io";

import polygon from "@public/icons/svgs/network/polygon.svg";
import ether from "@public/icons/svgs/network/ether.svg";
import bnb from "@public/icons/svgs/network/binance.svg";
import arbitrum from "@public/icons/svgs/network/arbitrum.svg";
import Pagination, { IPaginationSelected } from "@components/Pagination";

import p1 from "@public/images/projects/p1.png";
import Image from "next/image";
import useAuth from "@hooks/useAuth";
import moment from "moment";
import { supportNetwork } from "@constants/network";
import { TIME_FORMAT_V2 } from "@constants/timeFormats";
import { IoCloseCircle } from "react-icons/io5";
import { Networks, SupportedNetworksArray } from "@providers/UseWalletProvider";
import { useRouter } from "next/router";
import getProjectLink from "@helpers/getProjectLink";
import Link from "next/link";
import { TiTick } from "react-icons/ti";
import { useQuery } from "jsonapi-react";
import Loader from "@components/Loader";
import useSWR from "swr";
import { toast } from "react-toastify";
import useWidth from "@hooks/useWidth";
import useTokenInfo from "@hooks/useTokenInfo";
import { ethers } from "ethers";

export interface IPoolDataV1 {
  ath: string;
  banner_image: string;
  contract_address: string;
  created_at: string;
  description: string;
  ends_at: string;
  hardcap: number;
  id: string;
  initial_supply: number;
  logo_image: string;
  max_investment: number;
  min_investment: number;
  name: string;
  network: string;
  nft_address: string;
  payment_currency: string;
  round_type: string;
  socials: {
    discord: string;
    twitter: string;
    website: string;
    telegram: string;
    whitepaper: string;
  };
  softcap: number;
  starts_at: string;
  status: string;
  symbol: string;
  token_address: null | string;
  token_name: string;
  token_price: number;
  total_supply: number;
  total_raised: number;
  updated_at: string;
  vesting_schedule: {
    cycle_time: string;
    cycle_percent: string;
    first_release: string;
  };
  whitelist_ends_at: string;
  whitelist_max_investment: number;
  whitelist_min_investment: number;
  whitelist_starts_at: string;
}
type ITab = "All" | "Live Now";

interface ListProps {}
const Tabs: ITab[] = ["All", "Live Now"];

const networksIcons = [
  {
    icon: bnb,
    chainId: Networks.BSC,
    name: "binance",
  },
  {
    icon: polygon,
    chainId: Networks.MUMBAI,
    name: "mumbai",
  },
  {
    icon: polygon,
    chainId: Networks.MAINET,
    name: "polygon",
  },
  {
    icon: ether,
    chainId: Networks.ETH,
    name: "ethereum",
  },
  {
    icon: arbitrum,
    chainId: Networks.ARB,
    name: "arbitrum",
  },
];

const List: FC<ListProps> = ({}) => {
  const [selectedTab, setSelectedTabs] = useState<ITab>("All");
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [forContributor, setForContributor] = useState<boolean>(false);
  const [network, setNetwork] = useState<string | undefined>();
  const [isSearch, setIsSearch] = useState(false);
  const FIRST = 10;
  const { chainId, account, ethereum } = useAuth();
  const router = useRouter();
  const [pageCount, setPageCount] = useState(1);
  const width = useWidth();
  const [sortField, setSortField] = useState<
    "starts_at" | "-starts_at" | "ath" | "-ath"
  >("-starts_at");

  const filter = useMemo(() => {
    let filterObj: {
      network?: string;
      project_name?: string;
      live?: boolean;
      my_claim?: string;
    } = {};
    if (network) {
      filterObj["network"] = network;
    }
    if (isSearch && searchValue) {
      filterObj["project_name"] = searchValue;
      setPageCount(1);
    }
    if (selectedTab === "Live Now") {
      filterObj["live"] = true;
    }
    if (account && forContributor) {
      filterObj["my_claim"] = account.toLowerCase();
    }

    return filterObj;
  }, [network, isSearch, selectedTab, forContributor]);

  const {
    data: launchpadList,
    meta,
    isFetching,
    isLoading,
  } = useQuery([
    "presales",
    {
      filter: filter,
      sort: [sortField],
      page: {
        number: pageCount,
        size: FIRST,
      },
    },
  ]);

  useEffect(() => {
    if (!searchValue || searchValue.length === 0) {
      setIsSearch(false);
    }
  }, [searchValue]);

  const Row = ({ data }: { data: IPoolDataV1 }) => {
    const poolLink = getProjectLink(data.id, "launchpad", chainId);
    const { erc721Info, fetchERC721TokenBalance } = useTokenInfo({
      tokenAddress: data?.nft_address,
      ethereum: ethereum,
    });

    useEffect(() => {
      if (ethers.utils.isAddress(data?.nft_address)) {
        fetchERC721TokenBalance();
      }
    }, [data?.nft_address, account, chainId]);

    const ProjectStatus = useMemo(() => {
      if (!data) return "loading";

      // if (data.poolState != "Ongoing") {
      //   return "sale ended";
      // }

      let startTime, endTime;
      if (
        data?.nft_address !== "0x0000000000000000000000000000000000000000" &&
        ethers.utils.isAddress(data?.nft_address)
      ) {
        if (Number(erc721Info.balance) > 0) {
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
    }, [data, account, erc721Info, chainId]);

    return (
      <Link href={`/${poolLink}`}>
        <tr className="border-b border-gray14 cursor-pointer">
          <td className="text-sm p-4 py-16 w-full">
            <div className="flex  w-full whitespace-nowrap gap-10 items-center">
              <div className="flex flex-shrink-0">
                <img
                  src={data.banner_image ?? p1.src}
                  height={80}
                  width={80}
                  alt="banner"
                />
              </div>
              <div>
                <p className="text-primary text-lg max-w-[250px] 2xl:max-w-lg font-semibold truncate">
                  {data.name}
                </p>
                <div className="flex items-center gap-2">
                  <img
                    src={data.logo_image ?? p1.src}
                    alt="token-img"
                    height={24}
                    width={24}
                    className="object-contain"
                  />
                  <span className="text-xs text-gray14">
                    {data?.symbol ?? "--"}
                  </span>
                </div>
              </div>
            </div>
          </td>
          <td className="text-sm  p-4 py-16 capitalize">
            {data.network === "binance" ? "BSC" : data.network}
          </td>
          <td className="text-sm  p-4 py-16 ">{`${
            data.total_raised.toFixed(2) ?? 0
          } USDT`}</td>
          <td className="text-sm  p-4 py-16 ">{`${data.ath}%`}</td>
          <td className="text-sm  p-4 py-16 capitalize">{ProjectStatus}</td>
          <td className="text-sm  p-4 py-16 whitespace-nowrap">
            {moment(data.starts_at).utc().format(TIME_FORMAT_V2)}
          </td>
        </tr>
      </Link>
    );
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    setPageCount(selected + 1);
  };
  return (
    <div className="mt-40 px-10 md:px-20">
      <Heading text={"Funded Projects"} />
      <div className="flex flex-wrap gap-y-8 my-20 items-center justify-between sm:border-b border-gray13">
        <div className="flex overflow-x-auto">
          {Tabs.map((tab, index) => {
            return (
              <div
                onClick={() => setSelectedTabs(tab)}
                className={`${
                  index == 0
                    ? "rounded-tl-xl"
                    : index == Tabs.length - 1
                    ? "rounded-tr-xl"
                    : ""
                }  text-center items-center py-3 px-4 text-lg md:text-xl whitespace-nowrap w-[180px] cursor-pointer border border-gray13 ${
                  selectedTab == tab
                    ? "bg-primary text-blue3 border-blue3"
                    : "text-white"
                } `}
                key={index}>
                {tab}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-8 md:gap-10">
          <div className="flex items-center h-max px-3 max-w-[200px] text-primary  border-b border-primary">
            <input
              type="text"
              className="outline-none text-base border-0 py-3 w-[85%] placeholder:text-primary/70 placeholder:select-none"
              placeholder="Search"
              value={searchValue}
              onKeyDown={(e) => {
                if (
                  searchValue &&
                  searchValue?.length < 3 &&
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  toast.warn("Please enter more than 3 letters to search !");
                }
                if (
                  searchValue &&
                  searchValue?.length >= 3 &&
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  setIsSearch(true);
                }
              }}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {isSearch ? (
              <IoCloseCircle
                size={22}
                className="cursor-pointer"
                onClick={() => {
                  setSearchValue("");
                  setIsSearch(false);
                }}
              />
            ) : (
              <MdOutlineSearch
                size={22}
                className="cursor-pointer"
                onClick={() => {
                  setIsSearch(true);
                }}
              />
            )}
          </div>

          <div
            className={`flex items-center gap-4  ${
              !account ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => {
              if (!account) {
                toast.warning(
                  "Please connect your wallet to view your claims!"
                );
              }
              if (account) {
                setForContributor((prev) => !prev);
              }
            }}>
            <div
              className={`h-4 w-4 ${
                forContributor ? "bg-primary" : "bg-gray14"
              }`}>
              {forContributor ? <TiTick /> : ""}
            </div>
            <p
              className={`${
                forContributor ? "text-primary" : "text-gray14"
              }  select-none`}>
              My Claims
            </p>
          </div>

          <div
            className={`flex  gap-2 md:gap-4 ${
              width < 377 ? "flex-col" : "flex-row items-center"
            }`}>
            <p className="text-gray14 user-select-none">Select Network:</p>

            <div className="flex items-center gap-4">
              {networksIcons.map((nt, id) => (
                <div key={id} className="relative">
                  {network === nt.name && (
                    <div className="absolute z-10 -right-1 -top-1 h-2 w-2 bg-primary rounded-full"></div>
                  )}
                  <Image
                    width={24}
                    height={24}
                    objectFit="contain"
                    className="cursor-pointer"
                    src={nt.icon}
                    alt=""
                    onClick={() => {
                      if (network === nt.name) {
                        setNetwork("");
                      } else {
                        setNetwork(nt.name);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* table */}

      <div className="overflow-x-auto bg-list">
        <table className="table-fixed w-full">
          <thead className="border-b border-gray14 text-gray4">
            <th className="w-[25rem]"></th>
            <th className="capitalize w-[10rem] text-left whitespace-nowrap font-semibold p-4 py-6">
              Network
            </th>
            <th className="capitalize w-[10rem] text-left whitespace-nowrap font-semibold p-4 py-6">
              Total Raised
            </th>
            <th className="capitalize w-[10rem] text-left whitespace-nowrap font-semibold p-4 py-6">
              <div className="flex items-center gap-2">
                <div>ATH ROI </div>
                <div className="flex flex-col gap-[2px]">
                  <span
                    className={`h-4 cursor-pointer ${
                      sortField === "ath" ? "text-primary" : " text-white"
                    }`}
                    onClick={() => setSortField("ath")}>
                    {" "}
                    ▲
                  </span>
                  <span
                    className={`h-4 cursor-pointer ${
                      sortField === "-ath" ? "text-primary" : " text-white"
                    }`}
                    onClick={() => setSortField("-ath")}>
                    ▼
                  </span>
                </div>
              </div>
            </th>
            <th className="capitalize w-[10rem] text-left whitespace-nowrap font-semibold p-4 py-6">
              Status
            </th>
            <th className="capitalize w-[11rem] text-left whitespace-nowrap font-semibold p-4 py-6">
              <div className="flex items-center gap-2">
                <div>Live Date </div>
                <div className="flex flex-col gap-[1px]">
                  <span
                    className={`h-4 cursor-pointer ${
                      sortField === "starts_at" ? "text-primary" : " text-white"
                    }`}
                    onClick={() => setSortField("starts_at")}>
                    ▲
                  </span>
                  <span
                    className={`h-4 cursor-pointer ${
                      sortField === "-starts_at"
                        ? "text-primary"
                        : " text-white"
                    }`}
                    onClick={() => setSortField("-starts_at")}>
                    ▼
                  </span>
                </div>
              </div>
            </th>
          </thead>
          <tbody className="text-gray4">
            {isLoading || isFetching ? (
              <tr>
                <td colSpan={6} className="text-center py-10 w-full relative">
                  <Loader />
                </td>
              </tr>
            ) : (
              <></>
            )}

            {launchpadList && launchpadList.length > 0 ? (
              <>
                {launchpadList?.map((ul: IPoolDataV1, i: number) => {
                  return <Row data={ul} key={i} />;
                })}
              </>
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-20">
                  No Projects Found{" "}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center sm:justify-end my-14 z-10 relative">
        <div className="flex gap-5 text-base items-center px-3 py-2">
          <Pagination handlePageClick={handlePageClick} meta={meta} />
        </div>
      </div>
    </div>
  );
};

export default List;
