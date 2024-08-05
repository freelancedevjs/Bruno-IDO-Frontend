import React, { useEffect, useMemo, useState } from "react";
import { IPoolDetailsData } from "..";
import Image from "next/image";
import { useQuery } from "jsonapi-react";
import useAuth from "@hooks/useAuth";
import { ethers } from "ethers";
import moment from "moment";
import useTokenInfo from "@hooks/useTokenInfo";
import Button from "@atoms/Button";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

const PadCard = (props: { id: string; pad: any }) => {
  const { pad, id } = props;
  const { account, ethereum } = useAuth();

  const { erc721Info, fetchERC721TokenBalance } = useTokenInfo({
    tokenAddress: pad?.nft_address,
    ethereum: ethereum,
  });

  useEffect(() => {
    if (ethers.utils.isAddress(pad?.nft_address)) {
      fetchERC721TokenBalance();
    }
  }, [pad?.nft_address, account]);

  const ProjectStatus = useMemo(() => {
    if (!pad) return "loading";

    // if (pad.poolState != "Ongoing") {
    //   return "sale ended";
    // }

    let startTime, endTime;
    if (
      pad?.nft_address !== "0x0000000000000000000000000000000000000000" &&
      ethers.utils.isAddress(pad?.nft_address)
    ) {
      if (Number(erc721Info.balance) > 0) {
        startTime = moment(pad?.starts_at);
        endTime = moment(pad?.ends_at);
      } else {
        startTime = moment(pad?.whitelist_ends_at);
        endTime = moment(pad?.ends_at);
      }
    } else {
      startTime = moment(pad?.starts_at);
      endTime = moment(pad?.ends_at);
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
  }, [pad, account, erc721Info]);

  const poolchain = useMemo(() => {
    if (pad.network) {
      switch (pad.network) {
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
  }, [pad?.network]);

  const router = useRouter();
  const { chainId } = useAuth();

  const learnMoreHandler = () => {
    router.push(`/launchpad/details/${id}?blockchain=${chainId}`);
  };

  return (
    <div className=" flex flex-col lg:flex-row mb-16">
      <div className=" bg-black p-2 flex justify-center lg:max-h-full lg:h-auto overflow-hidden flex-[0.4] xl:flex-[0.3]">
        <img
          className="object-contain  h-full"
          src={pad.banner_image}
          alt={pad.title}
        />
      </div>
      <div className=" flex-[0.6] xl:flex-[0.7]  px-12 lg:px-20 py-10 lg:py-16">
        <div className=" flex justify-between gap-2">
          <div>
            <div className=" text-3xl font-semibold">{pad?.name}</div>
            <div className=" text-xl font-light uppercase mt-3">
              {ProjectStatus}
            </div>
            <div className="text-xl font-light my-10">
              {pad.short_description ?? pad.name + "..."}
            </div>

            <Button onClick={learnMoreHandler}>Learn More</Button>
          </div>
          <div className=" hidden md:block ml-10 mr-6 min-w-fit">
            <div className="mb-8">
              <div className=" text-xl font-semibold">Funding Goal</div>
              <div className=" text-base font-light">{`${(pad?.hardcap).toFixed(
                2
              )} USDT`}</div>
            </div>
            <div className="mb-8">
              <div className=" text-xl font-semibold">Price Per Token</div>
              <div className=" text-base font-light">
                {(1 / pad?.token_price).toFixed(2)} USDT
              </div>
            </div>
            <div className="mb-8">
              <div className=" text-xl font-semibold">Max Investment</div>
              <div className=" text-base font-light">{`${(pad?.max_investment).toFixed(
                2
              )} USDT`}</div>
            </div>
            <div className="">
              <div className=" text-xl font-semibold">Type of Round</div>
              <div className=" text-base font-light">{pad?.round_type}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MorePads = ({ pool_address }: { pool_address: string }) => {
  const [liveProjects, setLiveProjects] = useState([]);
  const [upcomingProjects, setUpcomingProjects] = useState([]);
  const [endedProjects, setEndedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterCurrentproject = (projectArr: any[]) => {
    return projectArr.filter(
      (pad) => pad.attributes.contract_address !== pool_address
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urls = [
          "/api/v1/presales?filter[live]=true&page[number]=1&page[size]=3&sort=-starts_at",
          "/api/v1/presales?filter[ended]=true&page[number]=1&page[size]=3&sort=-starts_at",
          "/api/v1/presales?filter[upcoming]=true&page[number]=1&page[size]=3&sort=-starts_at",
        ];

        const responses = await Promise.all(urls.map((url) => axios.get(url)));
        const [liveResponse, endedResponse, upcomingResponse] = responses;
        // @ts-ignore
        setLiveProjects(filterCurrentproject(liveResponse.data.data));
        // @ts-ignore
        setEndedProjects(filterCurrentproject(endedResponse.data.data));
        // @ts-ignore
        setUpcomingProjects(filterCurrentproject(upcomingResponse.data.data));
      } catch (error) {
        setError(error as any);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const projectsList = useMemo(() => {
    if (liveProjects.length > 1) {
      return [...liveProjects];
    } else if (liveProjects.length === 1 && upcomingProjects.length === 1) {
      return [...liveProjects, ...upcomingProjects];
    } else if (liveProjects.length === 1 && upcomingProjects.length < 1) {
      return [...liveProjects, endedProjects[0]];
    } else if (liveProjects.length < 1 && upcomingProjects.length > 1) {
      return [...upcomingProjects];
    } else if (liveProjects.length < 1 && upcomingProjects.length === 1) {
      return [...upcomingProjects, endedProjects[0]];
    } else {
      return [...endedProjects];
    }
  }, [endedProjects, liveProjects, upcomingProjects]);

  return (
    <div className="mt-20">
      <div className=" text-violet-secondary text-3xl md:text-4xl lg:text-5xl font-semibold mb-16">
        More Gems launched by Bipzy
      </div>
      {loading && <p className="text-white text-lg text-center">Loading...</p>}
      {projectsList && (
        <>
          {projectsList
            .slice(0, 2)
            .filter((item) => item !== undefined)
            .map((pad: any, index: number) => {
              return <PadCard key={index} id={pad.id} pad={pad.attributes} />;
            })}
        </>
      )}
    </div>
  );
};

export default MorePads;
