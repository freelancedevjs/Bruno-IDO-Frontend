import React, { useEffect, useMemo, useState } from "react";
// import DetailsPageComponent, { IInfoList } from "@components/Details";
import { useRouter } from "next/router";

import moment from "moment";

import Loader from "@components/Loader";
import useSWR from "swr";
import DetailsPageComponent, { IInfoList } from "@components/NewDetail";
import { BsDiscord, BsGlobe, BsTelegram, BsTwitter } from "react-icons/bs";
import { RiFilePaperLine } from "react-icons/ri";
import useAuth from "@hooks/useAuth";
import { ethers } from "ethers";
import poolContractABI from "../../../ABIs/PresalePool/PresalePool.json";
import { fetcher } from "@helpers/gqlFetcher";
import { useNFTData } from "src/contexts/NFTContext";
import { toast } from "react-toastify";

const LaunchpadDetails = () => {
  const [myContribution, setMyContribution] = useState<number>(0);
  const router = useRouter();
  const id = router?.query?.slug;
  const fetchData = (url: string) => fetch(url).then((r) => r.json());
  const { account, chainId, ethereum } = useAuth();

  const {
    data: JSONData,
    isValidating: isLoading,
    error: jsonError,
  } = useSWR(`https://backend.bipzy.com/api/v1/presales/${id}`, fetchData);
  const data = JSONData?.data?.attributes;

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
        case "arbitrum":
          return 42161;
        default:
          return;
      }
    }
  }, [data?.network]);

  const fetch1 = (query: any[], variables: any) =>
    fetcher(query, variables, poolchain);

  const {
    data: subData,
    error,
    isValidating,
    mutate,
  } = useSWR<any>(
    `{
  pool(id : "${data?.contract_address.toLowerCase()}") {
    contributors {
      contribution
    }
    totalRaised
  }
}`,
    fetch1,
    {
      refreshInterval: 20 * 1000,
      revalidateOnReconnect: true,
      refreshWhenHidden: true,
      refreshWhenOffline: false,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    mutate();
  }, [data, data?.contract_address, account, chainId]);

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

  const ProjectStatus = useMemo(() => {
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

  const fetchContributionData = async () => {
    try {
      if (ethereum && data.contract_address) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(
          data.contract_address,
          poolContractABI,
          provider
        );
        const paymentDecimals = await contract.getPaymentTokenDecimals();
        const myContributionHex = await contract.contributionOf(account);
        const myContribution =
          ethers.BigNumber.from(myContributionHex).toNumber() /
          10 ** paymentDecimals;
        setMyContribution(myContribution);
      }
    } catch (error) {
      // toast.error(String(error));
    }
  };

  useEffect(() => {
    if (account) {
      fetchContributionData();
    }
  }, [account, chainId, id, data]);

  if (isLoading && !data) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <>
        <div>
          <div
            className={`flex justify-center items-center text-white min-h-screen`}>
            No Pool Found.
          </div>
        </div>
      </>
    );
  }

  return (
    <DetailsPageComponent
      data={{
        myContribution: myContribution,
        participants: subData?.pool?.contributors.length || 0,
        status: ProjectStatus,
        logo: data?.log_image || "",
        banner: data?.banner_image || "",
        title: data?.name || "",
        network: data?.network,
        poolChainid: poolchain || 0,
        token: {
          name: data?.token_name || "",
          symbol: data?.symbol || "",
          supply: data?.total_supply || 0,
          address: data?.token_address,
          token_decimals: data?.token_decimals,
        },
        payment_currency: {
          id: data?.payment_currency || "",
          decimals: data?.payment_currency_decimals || 18,
        },
        token_price: data?.token_price,
        total_sold:
          subData?.pool?.totalRaised / 10 ** data?.payment_currency_decimals ||
          0,
        soft_cap: data?.softcap || 0,
        hard_cap: data?.hardcap || 0,
        usdt_price: data?.usdt_price || 0,
        start_time: data?.starts_at || 0,
        end_time: data?.ends_at || 0,
        whitelist_ends_time: data?.whitelist_ends_at || 0,
        description: data?.description || "",
        pool_address: data?.contract_address || "",
        sale_type:
          data?.nft_address !== "0x0000000000000000000000000000000000000000" &&
            ethers.utils.isAddress(data?.nft_address)
            ? "whitelist"
            : "public",
        min_buy: data?.min_investment || 0,
        max_buy: data?.max_investment || 0,
        userWhitelisted: isWhitelisted,
        nft: {
          name: "Kmanus",
          address: String(data?.nft_address) || "",
        },
        contract_address: data.contract_address || "",
        vesting: {
          cycle_time: data?.vesting_schedule?.cycle_time || "",
          cycle_percent: data?.vesting_schedule?.cycle_percent || "",
          first_release: data?.vesting_schedule?.first_release || "",
        },
        round_type: data?.round_type,
        claim_starts_at: data?.claim_starts_at || "",
        created_at: data?.created_at || "",
        finalised_at: data?.finalised_at || "",
        initial_supply: data?.initial_supply || 0,
        socials: [
          {
            link: data?.socials?.discord || "",
            title: "discord",
            icon: BsDiscord,
          },
          {
            link: data?.socials?.telegram || "",
            title: "telegram",
            icon: BsTelegram,
          },
          {
            link: data?.socials?.twitter || "",
            title: "twitter",
            icon: BsTwitter,
          },
          {
            link: data?.socials?.website || "",
            title: "website",
            icon: BsGlobe,
          },
          {
            link: data?.socials?.whitepaper || "",
            title: "whitepaper",
            icon: RiFilePaperLine,
          },
        ],
      }}
    />
  );
};

export default LaunchpadDetails;
