import React, { useMemo } from "react";
import Heading from "@atoms/Heading";
import Button from "@atoms/Button";
import { MdKeyboardArrowRight } from "react-icons/md";
import Link from "next/link";
import SaleDetailsCard from "./SaleDetailsCard";
import ProjectInfo from "./ProjectInfo";
import ClaimMyToken from "./ClaimMyToken";
import HowToParticipate from "./HowToParticipate";
import ParticipateModal from "./Modals/ParticipateModal";
import CalenderModal from "./Modals/CalendarModal";
import ConnectModal from "./Modals/ConnectModal";
import { useRouter } from "next/router";
import { IconType } from "react-icons/lib";
import useAuth from "@hooks/useAuth";

export interface IInfoList {
  title: string;
  value: string | number;
  type?: "socials" | "address" | "txn";
}

export type DetailsType =
  | "presale"
  | "fairlaunch"
  | "airdrop"
  | "privatesale"
  | "leaderboard";

export interface IPoolDetailsData {
  status: "upcoming" | "sale live" | "sale ended" | "loading" | "cancelled";
  logo: string;
  banner: string;
  title: string;
  network?: string;
  poolChainid?: number;
  usdt_price: number;
  token: {
    name: string;
    symbol: string;
    supply: number;
    address?: string;
    token_decimals: number;
  };
  payment_currency: {
    id: any;
    decimals: number;
  };
  token_price: number;
  fees?: number;
  // myClaim?: number;
  // myContribution?: number;
  total_sold: number;
  myContribution: number;
  soft_cap: number;
  hard_cap: number;
  start_time: string;
  end_time: string;
  whitelist_ends_time: string;
  min_buy: number;
  max_buy: number;
  description: string;
  sale_type: "whitelist" | "public";
  pool_address: string;
  participants: number;
  poolState?: string;
  userWhitelisted?: boolean;
  nft: {
    name: string;
    address: string;
  };
  contract_address?: string;
  vesting: {
    cycle_time: string;
    cycle_percent: string;
    first_release: string;
  };
  round_type: string;
  claim_starts_at: string;
  created_at: string;
  finalised_at: string;
  initial_supply: number;
  socials: {
    title: string;
    link: string;
    icon: IconType;
  }[];
}

interface IDetails {
  data: IPoolDetailsData;
}

const Tabs = [
  { title: "Project Information", tab: "project_information" },
  { title: "Claim My Tokens", tab: "claim_my_Tokens" },
  { title: "How to Participate", tab: "how_to_participate" },
];

const DetailsPageComponent: React.FC<IDetails> = (props: IDetails) => {
  const { data } = props;
  const { account, chainId } = useAuth();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = React.useState("project_information");
  const [isParticipateModalOpen, setIsParticipateModalOpen] =
    React.useState<boolean>(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] =
    React.useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] =
    React.useState<boolean>(false);

  const filteredSocial = useMemo(() => {
    return data.socials.filter((social, index) => social.link !== "");
  }, [data.socials]);

  React.useEffect(() => {
    if (
      (!account || !(chainId == data.poolChainid)) &&
      selectedTab == "claim_my_Tokens"
    ) {
      setSelectedTab("project_information");
    }
  }, [account, chainId]);

  return (
    <>
      <div className="bg-footer">
        <div className="py-16 md:py-16 xl:py-20 mt-10 text-white container mx-auto px-6 xl:px-16">
          <div className="flex md:justify-between items-center lg:items-end flex-col lg:flex-row mb-16 gap-8">
            <div className="w-full lg:max-w-[75%]">
              <div className="flex items-center gap-4 text-[#6B6B6B] mb-3">
                <div
                  onClick={() => router.push("/launchpad/list")}
                  className="flex gap-4 items-center cursor-pointer hover:text-white">
                  <span>Projects</span>
                  <MdKeyboardArrowRight className="min-w-fit" />
                </div>
                <span className="truncate">{data.title}</span>
              </div>
              <Heading
                text={data.title}
                textSize="text-3xl md:text-5xl 2xl:text-7xl truncate"
              />
            </div>
            <Button
              className={` rounded-full min-w-fit cursor-auto capitalize ${
                data.status == "sale ended"
                  ? " border border-white text-rose-500 bg-transparent"
                  : data.status == "upcoming"
                  ? "border border-white text-white "
                  : ""
              }`}>
              {data.status}
            </Button>
          </div>
          <div className=" flex border-b border-[#6B6B6B] mb-24 overflow-x-auto pb-2 md:pb-0">
            {filteredSocial.map((social, index) => {
              return (
                <Link key={index} href={String(social.link)}>
                  <a key={index} target="_blank">
                    <div
                      className={` px-6 md:px-8 py-3 md:py-4 flex items-center gap-4 border border-[#6B6B6B] border-b-0 ${
                        index == 0
                          ? "rounded-tl-xl"
                          : index == filteredSocial.length - 1
                          ? "rounded-tr-xl"
                          : ""
                      }`}>
                      <social.icon size={20} className=" text-primary" />
                      <span className=" text-base capitalize">
                        {social.title}
                      </span>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col lg:flex-row gap-9 ">
            <div className=" flex-1 relative aspect-video h-full">
              <img
                src={data.banner}
                alt="banner"
                className="object-contain w-full aspect-video"
              />
            </div>
            <SaleDetailsCard
              setIsParticipateModalOpen={setIsParticipateModalOpen}
              setIsCalendarModalOpen={setIsCalendarModalOpen}
              setIsConnectModalOpen={setIsConnectModalOpen}
              data={data}
            />
          </div>
          <div className="mt-[100px]">
            <div className=" overflow-x-auto pb-2.5">
              <div className=" flex border-b border-[#6B6B6B]">
                {Tabs.map((tab, index) => {
                  if (
                    (!account || !(chainId == data.poolChainid)) &&
                    tab.tab == "claim_my_Tokens"
                  ) {
                    return;
                  }
                  return (
                    <div
                      onClick={() => setSelectedTab(tab.tab)}
                      className={`${
                        index == 0
                          ? "rounded-tl-xl"
                          : index == Tabs.length - 1
                          ? "rounded-tr-xl"
                          : ""
                      } flex justify-center items-center text-sm md:text-base font-semibold whitespace-nowrap py-4 md:py-5 px-8 md:px-12 cursor-pointer border border-[#6B6B6B] ${
                        selectedTab == tab.tab
                          ? "bg-primary text-[#05040B] border-primary"
                          : "text-white"
                      } `}
                      key={index}>
                      {tab.title}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="my-20">
              {selectedTab == Tabs[0].tab && <ProjectInfo data={data} />}
              {selectedTab == Tabs[1].tab && <ClaimMyToken data={data} />}
              {selectedTab == Tabs[2].tab && <HowToParticipate />}
            </div>
          </div>
        </div>
      </div>
      {isParticipateModalOpen && (
        <ParticipateModal
          data={data}
          isOpen={isParticipateModalOpen}
          setIsOpen={setIsParticipateModalOpen}
        />
      )}
      <CalenderModal
        data={data}
        isOpen={isCalendarModalOpen}
        setIsOpen={setIsCalendarModalOpen}
      />
      <ConnectModal
        isOpen={isConnectModalOpen}
        setIsOpen={setIsConnectModalOpen}
      />
    </>
  );
};

export default DetailsPageComponent;
