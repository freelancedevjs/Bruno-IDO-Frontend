import Button from "@atoms/Button";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getWeb3 } from "@constants/connectors";
import useAuth from "@hooks/useAuth";
import { getContract } from "@constants/contractHelper";
import { IPoolDetailsData } from "..";
import poolAbi from "../../../ABIs/PresalePool/PresalePool.json";
import { useRouter } from "next/router";
import moment from "moment-timezone";
import useSWR from "swr";
import { ethers } from "ethers";
import poolContractABI from "../../../ABIs/PresalePool/PresalePool.json";

const heading = [
  "Invested Amount",
  "Tokens Equivalent",
  "Available to Claim",
  "Claimed",
];

const tableheading = ["Date", "Token Percentage", "Token Amount"];

const ClaimMyToken = ({ data }: { data: IPoolDetailsData }) => {
  const { account, chainId, library, ethereum } = useAuth();
  const { reload } = useRouter();
  const [claimLoading, setCtLoading] = useState(false);
  const [claimDataLoading, setClaimDataLoading] = useState(false);
  const [claimData, setClaimData] = useState({
    totalRaised: 0,
    paymentDecimals: 0,
    myContribution: 0,
    claimed: 0,
    availableClaim: 0,
    tokenPrice: 0,
  });

  const fetchClaimData = async () => {
    setClaimDataLoading(true);
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const contract = new ethers.Contract(
          data.pool_address,
          poolContractABI,
          provider
        );
        const paymentDecimals = await contract.getPaymentTokenDecimals();
        const totalRaisedHex = await contract.totalRaised();
        const totalRaised = parseInt(totalRaisedHex);
        const myContributionHex = await contract.contributionOf(account);
        const myContribution = parseInt(myContributionHex);
        const tokenPriceHex = await contract.rate();
        const tokenPrice = parseInt(tokenPriceHex);
        const claimedHex = await contract.claimedOf(account);
        const claimed = parseInt(claimedHex);
        const availableClaimHex = await contract.userAvailableClaim(account);
        const availableClaim = parseInt(availableClaimHex);
        setClaimData({
          totalRaised: totalRaised,
          paymentDecimals: paymentDecimals,
          myContribution: myContribution,
          claimed: claimed,
          availableClaim: availableClaim,
          tokenPrice: tokenPrice,
        });
      }
    } catch (error) {
      setClaimData({
        totalRaised: 0,
        paymentDecimals: 0,
        myContribution: 0,
        claimed: 0,
        availableClaim: 0,
        tokenPrice: 0,
      });
    } finally {
      setClaimDataLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClaimData();
  }, [account, chainId, data]);

  const claimToken = React.useMemo(() => {
    return (
      (claimData.tokenPrice * claimData.myContribution) /
      10 ** claimData.paymentDecimals
    );
  }, [claimData.tokenPrice, claimData.myContribution]);

  const vestingData = React.useMemo(() => {
    if (data.finalised_at) {
      const arr: {
        time: number;
        tokenPercent: number;
        tokenAmmount: number;
      }[] = [];
      let availableClaim = claimToken;
      let availablePercentage = 100;
      let vestingNumber: number = 0;
      let time = moment(data.finalised_at).unix();

      while (availableClaim > 0) {
        if (vestingNumber == 0) {
          availablePercentage =
            availablePercentage - Number(data.vesting.first_release) / 100;
          arr.push({
            time: time,
            tokenPercent: Number(data.vesting.first_release) / 100,
            tokenAmmount:
              (Number(data.vesting.first_release) * claimToken) / 10000,
          });
          availableClaim =
            availableClaim -
            (Number(data.vesting.first_release) * claimToken) / 10000;
        } else {
          availablePercentage =
            availablePercentage - Number(data.vesting.cycle_percent) / 100;
          time = time + Number(data.vesting.cycle_time);
          arr.push({
            time: time,
            tokenPercent:
              availablePercentage > 0
                ? Number(data.vesting.cycle_percent) / 100
                : Number(data.vesting.cycle_percent) / 100 +
                  availablePercentage,
            tokenAmmount:
              (Number(data.vesting.cycle_percent) * claimToken) / 10000 <
              availableClaim
                ? (Number(data.vesting.cycle_percent) * claimToken) / 10000
                : availableClaim,
          });
          availableClaim =
            availableClaim >
            (Number(data.vesting.cycle_percent) * claimToken) / 10000
              ? availableClaim -
                (Number(data.vesting.cycle_percent) * claimToken) / 10000
              : 0;
        }
        vestingNumber++;
      }
      return arr;
    } else {
      return [];
    }
  }, [data.finalised_at, data.vesting, claimToken]);

  const handleClaimToken = async () => {
    setCtLoading(true);
    try {
      if (account && chainId) {
        let poolContract = getContract(poolAbi, data.pool_address, library);

        // @ts-ignore
        let tx = await poolContract.claim({
          from: account,
        });

        await toast.promise(tx.wait, {
          pending: "Confirming Transaction...",
        });

        let web3 = getWeb3(chainId);
        var response = await web3.eth.getTransactionReceipt(tx.hash);
        if (response != null) {
          if (response.status) {
            toast.success("Transaction confirmed!");
            setCtLoading(false);
          } else if (!response.status) {
            toast.error("Transaction failed!");
            setCtLoading(false);
          } else {
            toast.error("Something went wrong!");
            setCtLoading(false);
          }
        }
      } else {
        toast.error("Please Connect to wallet !");
        setCtLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setCtLoading(false);
    }
  };

  const availableToClaim = useMemo(() => {
    return (
      (claimData.myContribution * claimData.tokenPrice) /
        10 ** (claimData.paymentDecimals + data.token.token_decimals) -
      claimData.claimed / 10 ** data.token.token_decimals
    );
  }, [claimData]);

  const total_Token = useMemo(() => {
    return (
      (claimData.myContribution * claimData.tokenPrice) /
      10 ** (claimData.paymentDecimals + data.token.token_decimals)
    );
  }, [claimData]);

  const [wcLoading, setWcLoading] = useState(false);

  const handleWithdrawContribution = async () => {
    setWcLoading(true);
    try {
      if (account && chainId) {
        let poolContract = getContract(poolAbi, data.pool_address, library);

        // @ts-ignore
        let tx = await poolContract.withdrawContribution({
          from: account,
        });

        await toast.promise(tx.wait, {
          pending: "Confirming Transaction...",
        });

        let web3 = getWeb3(chainId);
        var response = await web3.eth.getTransactionReceipt(tx.hash);
        if (response != null) {
          if (response.status) {
            toast.success("Transaction confirmed!");
            setWcLoading(false);
          } else if (!response.status) {
            toast.error("Transaction failed!");
            setWcLoading(false);
          } else {
            toast.error("Something went wrong!");
            setWcLoading(false);
          }
        }
      } else {
        toast.error("Please Connect to wallet !");
        setWcLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason ? err.reason : err.message);
      setWcLoading(false);
    }
  };

  return (
    <div>
      <div className=" projectDetailModal px-4 sm:px-6 md:px-8 xl:px-14 py-16 overflow-x-auto">
        <table className="w-full">
          <tr className="tokenDetailCard">
            {heading.map((heading, index) => {
              return (
                <th
                  key={index}
                  className="min-w-[250px] lg:w-1/4 py-10 border-b border-[#6100FF] text-primary-green text-lg sm:text-xl md:text-2xl font-semibold">
                  {heading}
                </th>
              );
            })}
          </tr>
          {!claimDataLoading && (
            <tr>
              <th
                className={`lg:w-1/4 py-10 text-base sm:text-xl font-semibold border-r border-[#6100FF] `}>
                {parseFloat(
                  (
                    claimData.myContribution /
                    10 ** claimData.paymentDecimals
                  ).toFixed(6)
                )}
              </th>
              <th
                className={`lg:w-1/4 py-10 text-base sm:text-xl font-semibold border-r border-[#6100FF] `}>
                {moment(data.finalised_at).isBefore(moment().utc())
                  ? parseFloat(total_Token.toFixed(6))
                  : "Upcoming"}
              </th>
              <th
                className={`lg:w-1/4 py-10 text-base sm:text-xl font-semibold border-r border-[#6100FF]`}>
                {moment(data.finalised_at).isBefore(moment().utc())
                  ? parseFloat(availableToClaim.toFixed(6))
                  : "Upcoming"}
              </th>
              <th
                className={`lg:w-1/4 py-10 text-base sm:text-xl font-semibold `}>
                {moment(data.finalised_at).isBefore(moment().utc())
                  ? parseFloat(
                      (
                        claimData.claimed /
                        10 ** data.token.token_decimals
                      ).toFixed(6)
                    )
                  : "Upcoming"}
              </th>
            </tr>
          )}
        </table>
        {claimDataLoading && (
          <div className="flex justify-center items-center pt-20">
            Loading....
          </div>
        )}
      </div>
      <div className=" flex justify-end mt-12 mb-20">
        {(data.status === "cancelled" || data.status === "sale ended") &&
        data.total_sold < data.soft_cap ? (
          <Button loading={wcLoading} onClick={handleWithdrawContribution}>
            Withdraw Contribution{" "}
          </Button>
        ) : (
          <Button
            loading={claimLoading}
            onClick={handleClaimToken}
            disabled={data.status !== "sale ended"}>
            Claim Tokens{" "}
          </Button>
        )}
      </div>

      <div className=" text-2xl font-semibold my-6">Vesting Schedule:</div>
      <div className="projectDetailModal px-4 sm:px-6 md:px-8 xl:px-14 py-10 md:py-16 overflow-x-auto">
        <table className="w-full">
          <tr className="tokenDetailCard px-28">
            {tableheading.map((heading, index) => {
              return (
                <th
                  key={index}
                  className={`offblending w-1/3 py-10 border-b border-[#6100FF] text-primary-green text-base sm:text-xl md:text-2xl font-semibold text-left ${
                    index == 0 ? "pl-5 2xl:pl-28" : ""
                  } ${
                    index == tableheading.length - 1
                      ? "lg:pr-28 pl-10 pr-10"
                      : ""
                  }`}>
                  {heading}
                </th>
              );
            })}
          </tr>
          {vestingData.map((tableData, index) => {
            var a = moment.tz(moment.unix(tableData.time), "GMT");
            const dataTime = a.format("MMMM Do YYYY");
            const clockTime = a.format("hh:mm:ss a");
            return (
              <tr
                key={index}
                className={`  ${
                  !(index == vestingData.length - 1)
                    ? "border-b border-[#6100FF]"
                    : ""
                } `}>
                <td className="py-10 pl-5 2xl:pl-28 w-2/5 min-w-[250px]">
                  <div className="text-base sm:text-lg md:text-xl font-semibold">
                    {dataTime}
                  </div>
                  <div className=" text-base font-normal text-[#727272]">
                    {clockTime} UTC
                  </div>
                </td>
                <td className="py-10">{tableData.tokenPercent} %</td>
                <td className="py-10 pl-10 pr-10">
                  {tableData.tokenAmmount / 10 ** data.token.token_decimals}{" "}
                  <span className=" text-primary">{data.token.symbol}</span>
                </td>
              </tr>
            );
          })}
        </table>
        {claimDataLoading && (
          <div className="flex justify-center items-center pt-20">
            Loading....
          </div>
        )}
        {vestingData.length == 0 && !claimDataLoading && (
          <div className="flex justify-center items-center pt-20">
            No Data to show
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimMyToken;
