import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Button from "@atoms/Button";
import { IPoolDetailsData } from "@components/NewDetail";
import useAuth from "@hooks/useAuth";
import Link from "next/link";
import { toast } from "react-toastify";
import presalePoolAbi from "../../../../ABIs/PresalePool/PresalePool.json";
import { parseEther } from "ethers/lib/utils";
import { getWeb3 } from "@constants/connectors";
import {
  approveTokens,
  getContract,
  mulDecimal,
} from "@constants/contractHelper";
import { ethers } from "ethers";
import erc20abi from "src/ABIs/ERC20/ERC20ABI.json";

interface Iprops {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  data: IPoolDetailsData;
}

const ParticipateModal = (props: Iprops) => {
  const { data, isOpen, setIsOpen } = props;
  const [inputAmount, setInputAmount] = useState<string>("");
  const [UsdtBalance, setUsdtBalance] = useState<string>("0");
  const [serviceAccepted, setServiceAccepted] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const { chainId, balance_formatted, account, library, ethereum } = useAuth();

  const fetchPaymentCurrencyBalance = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const contractAddress = data.payment_currency.id; // USDT contract address on Ethereum mainnet
      const usdtContract = new ethers.Contract(
        contractAddress,
        erc20abi,
        provider
      );
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();
      const balance = await usdtContract.balanceOf(signerAddress);
      setUsdtBalance(
        ethers.utils.formatUnits(balance, data.payment_currency.decimals || 6)
      ); // Assuming 6 decimal places for USDT
    } catch (error) {
      console.error("Error fetching USDT balance:", error);
    }
  };

  useEffect(() => {
    if (account) {
      fetchPaymentCurrencyBalance();
    }
  }, [account]);

  const handleSubmitContribution = async () => {
    setLoading(true);
    const amount = Number(inputAmount);
    try {
      if (amount > 0 && amount < data.min_buy) {
        toast.error("Minimum buy is not valid");
        setLoading(false);
        return;
      } else if (amount > 0 && amount > data.max_buy) {
        toast.error("Maximum buy is not valid");
        setLoading(false);
        return;
      }
      let paymentCbalance = Number(UsdtBalance);
      if (
        data?.payment_currency?.id?.toLowerCase() ===
        "0x0000000000000000000000000000000000000000"
      ) {
        paymentCbalance = balance_formatted;
      }
      if (amount > 0 && (data.max_buy >= amount || data.min_buy <= amount)) {
        if (account) {
          if (chainId) {
            if (paymentCbalance >= amount) {
              let poolContract = getContract(
                presalePoolAbi,
                data.pool_address,
                library
              );
              const finalAmount = mulDecimal(
                amount,
                data?.payment_currency?.decimals || 18
              ).toString();
              let nativeAmount = mulDecimal(
                amount,
                data?.payment_currency?.decimals || 18
              ).toString();

              if (
                data?.payment_currency?.id &&
                data?.payment_currency?.id?.toLowerCase() !==
                  "0x0000000000000000000000000000000000000000"
              ) {
                nativeAmount = "0";
                const approved = await approveTokens({
                  token: data?.payment_currency?.id || "",
                  library,
                  account,
                  chainId,
                  amount: finalAmount,
                  spender: data.pool_address,
                });
                if (!approved) {
                  setLoading(false);
                  return;
                }
              }

              // @ts-ignore
              let tx = await poolContract.contribute(finalAmount, {
                from: account,
                value: nativeAmount,
              });
              await toast.promise(tx.wait, {
                pending: "Confirming Transaction...",
              });

              let web3 = getWeb3(chainId);
              var response = await web3.eth.getTransactionReceipt(tx.hash);
              if (response != null) {
                if (response.status) {
                  toast.success("Transaction confirmed!");
                  setIsOpen(false);
                  setLoading(false);
                } else if (!response.status) {
                  toast.error("Transaction failed!");
                  setLoading(false);
                } else {
                  toast.error("Something went wrong!");
                  setLoading(false);
                }
              }
            } else {
              toast.error("you don't have enough balance !");
              setLoading(false);
            }
          } else {
            toast.error("Please connect your wallet");
            setLoading(false);
          }
        } else {
          toast.error("Please connect your wallet");
          setLoading(false);
        }
      } else {
        toast.error("Please Enter Valid Amount !");
        setLoading(false);
      }
    } catch (err: any) {
      toast.error(err.reason);
      setLoading(false);
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  const percentageHandler = (percentage: number) => {
    let amt = data.max_buy * (percentage / 100);
    let formatedNumber = parseFloat(amt.toFixed(6));
    if (formatedNumber < data.min_buy) {
      toast.warn(
        `Invalid amount!, Please select amount more than ${data.min_buy}`
      );
    } else {
      setInputAmount(formatedNumber.toString());
    }
  };

  const handleInputChange = (e: any) => {
    setInputAmount(e.target.value);
  };

  const handleInputFocus = () => {
    if (inputAmount === "0") {
      // Clear the input value only if it's equal to '0'
      setInputAmount("");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-[800px] transform overflow-hidden bg-[#0B0D1B] pt-12 pb-10 text-left align-middle shadow-xl transition-all relative">
                <Dialog.Title
                  as="h3"
                  className="text-2xl sm:text-3xl md:text-5xl font-semibold text-primary text-center">
                  Participate
                </Dialog.Title>
                <div>
                  <div className="px-6 lg:px-24 mt-12 border-b border-[#6100FF] pb-12">
                    <div className="flex items-center justify-between text-lg sm:text-xl md:text-2xl gap-4">
                      <div className=" text-[#757575] font-normal">
                        Min Invest
                      </div>
                      <div className=" text-right font-semibold text-primary">
                        {data.min_buy} USDT
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-lg sm:text-xl md:text-2xl mt-4 gap-3">
                      <div className=" text-[#757575] font-normal">
                        Max Invest
                      </div>
                      <div className="text-right  font-semibold text-primary">
                        {data.max_buy} USDT
                      </div>
                    </div>
                    <div className="mt-6 text-primary font-semibold text-lg sm:text-xl md:text-2xl">
                      Invested Amount
                    </div>
                    <div className="rounded-lg border border-primary h-[60px] md:h-[80px] mt-6 flex items-center">
                      <input
                        type="number"
                        className="flex-1 border-none outline-none h-full text-white text-lg sm:text-xl md:text-2xl ml-6 md:ml-10 min-w-0"
                        value={inputAmount}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                      />
                      <div className=" text-white font-semibold text-lg sm:text-xl md:text-2xl mx-4 md:mx-10">
                        USDT
                      </div>
                    </div>
                    <div className="text-[#757575] text-base sm:text-xl mt-5">{`(Balance: ${UsdtBalance})`}</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 sm:mt-16">
                      <div
                        onClick={() => percentageHandler(25)}
                        className=" py-6 text-center tokenDetailCard text-primary font-semibold text-lg sm:text-xl md:text-2xl cursor-pointer">
                        25%
                      </div>
                      <div
                        onClick={() => percentageHandler(50)}
                        className=" py-6 text-center tokenDetailCard text-primary font-semibold text-lg sm:text-xl md:text-2xl cursor-pointer">
                        50%
                      </div>
                      <div
                        onClick={() => percentageHandler(75)}
                        className=" py-6 text-center tokenDetailCard text-primary font-semibold text-lg sm:text-xl md:text-2xl cursor-pointer">
                        75%
                      </div>
                      <div
                        onClick={() => percentageHandler(100)}
                        className=" py-6 text-center tokenDetailCard text-primary font-semibold text-lg sm:text-xl md:text-2xl cursor-pointer">
                        100%
                      </div>
                    </div>
                    <div className="mt-6">
                      <input
                        checked={serviceAccepted}
                        onChange={() => setServiceAccepted((prev) => !prev)}
                        type="checkbox"
                        id="conditon"
                      />
                      <label
                        className=" text-[#757575] text-base sm:text-lg md:text-xl mx-3 cursor-pointer"
                        htmlFor="conditon">
                        I read and accept the{" "}
                        <Link href={"/terms-of-service"}>
                          <span className="text-primary cursor-pointer">
                            Terms of Services
                          </span>
                        </Link>
                      </label>
                    </div>
                  </div>
                  <div className=" flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mt-12">
                    <Button
                      loading={loading}
                      onClick={handleSubmitContribution}
                      disabled={!serviceAccepted}>
                      Invest Now
                    </Button>
                    <a href={"/buy-usdt"} target="_blank" rel="noreferrer">
                      <Button className=" border-[#6100FF] bg-transparent text-[#6100FF] font-normal">
                        Buy USDT
                      </Button>
                    </a>
                  </div>
                </div>
                <div
                  onClick={closeModal}
                  className=" bg-[#5C5C5C] rounded-full w-[35px] md:w-[50px] h-[35px] md:h-[50px] text-black flex justify-center items-center text-4xl rotate-45 cursor-pointer absolute right-4 md:right-8 top-4 md:top-7">
                  +
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ParticipateModal;
