import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import etherImage from "@public/images/ether.png";
import BNBImage from "@public/images/bnbwallet.png";
import PolygonImage from "@public/images/polygon.png";
import ArbiImage from "@public/images/arbitrum.png";
import Metamask from "@public/images/metaFox.png";
import BNBBig from "@public/images/bnbbig.png";
import WalletConnect from "@public/images/WalletConnect-Logo.png";
import TrustWallet from "@public/images/trustwallet.svg";

import useAuth from "@hooks/useAuth";
import { supportNetwork } from "@constants/network";
import { useRouter } from "next/router";
import { IoClose } from "react-icons/io5";
import { switchEthereumChain } from "@providers/UseWalletProvider";

interface Iprops {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const ConnectModal = (props: Iprops) => {
  const { isOpen, setIsOpen } = props;
  const [currentNetwork, setCurrentNetwork] = useState<number>(1);

  function closeModal() {
    setIsOpen(false);
  }
  const router = useRouter();

  const {
    walletConnect,
    bscConnect,
    metamaskConnect,
    isLoggedIn,
    chainId,
    currentProvider,
    setcurrentProvider,
  } = useAuth();
  const connectWallet = async (fun: any) => {
    try {
      router.push(
        {
          query: {
            ...router.query,
            blockchain: currentNetwork,
          },
        },
        undefined,
        { shallow: true }
      );
      await fun();
    } catch (e) {}
  };

  useEffect(() => {
    const internalChainId = supportNetwork[currentNetwork];
    if (
      isLoggedIn &&
      chainId !== internalChainId?.chainId &&
      !!internalChainId?.chainId &&
      isOpen
    ) {
      switchEthereumChain({ chainId: currentNetwork });
    }
    if (isLoggedIn && isOpen && chainId === internalChainId?.chainId)
      setIsOpen(false);
  }, [isLoggedIn, chainId]);

  useEffect(() => {
    if (isLoggedIn && isOpen) {
      setIsOpen(false);
    }
  }, [isLoggedIn, chainId]);

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
              <Dialog.Panel className="w-full max-w-[1100px] transform overflow-hidden projectDetailModal pt-12 pb-16 text-left align-middle shadow-xl transition-all relative">
                <Dialog.Title
                  as="h3"
                  className="text-3xl md:text-5xl font-semibold text-primary text-center">
                  Connect Wallet
                </Dialog.Title>
                <div className="px-6 lg:px-24 mt-12">
                  <div className="mt-6 text-primary font-semibold text-3xl">
                    Choose Network
                  </div>
                  <div className=" grid grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
                    <div
                      onClick={() => {
                        setCurrentNetwork(1);
                        setcurrentProvider(null);
                      }}
                      className={`${
                        currentNetwork === 1 ? "border-2 border-primary" : ""
                      } flex items-center flex-col-reverse md:flex-row justify-between gap-3 md:gap-5 px-6 py-5 tokenDetailCard cursor-pointer`}>
                      <div className=" text-white font-semibold text-base md:text-xl">
                        Ethereum
                      </div>
                      <Image
                        width={40}
                        height={40}
                        src={etherImage}
                        alt="ethereum logo"
                      />
                    </div>
                    <div
                      onClick={() => {
                        setCurrentNetwork(56);
                        setcurrentProvider(null);
                      }}
                      className={` ${
                        currentNetwork === 56 ? "border-2 border-primary" : ""
                      } flex items-center flex-col-reverse md:flex-row justify-between gap-3 md:gap-5 px-6 py-5 tokenDetailCard cursor-pointer`}>
                      <div className=" text-white font-semibold text-base md:text-xl">
                        BSC
                      </div>
                      <Image
                        width={40}
                        height={40}
                        src={BNBImage}
                        alt="BNB logo"
                      />
                    </div>
                    <div
                      onClick={() => {
                        setCurrentNetwork(137);
                        setcurrentProvider(null);
                      }}
                      className={` ${
                        currentNetwork === 137 ? "border-2 border-primary" : ""
                      } flex items-center flex-col-reverse md:flex-row justify-between gap-3 md:gap-5 px-6 py-5 tokenDetailCard cursor-pointer`}>
                      <div className=" text-white font-semibold text-base md:text-xl">
                        Polygon
                      </div>
                      <Image
                        height={40}
                        src={PolygonImage}
                        alt="Polygon logo"
                        objectFit="contain"
                      />
                    </div>
                    <div
                      onClick={() => {
                        setCurrentNetwork(42161);
                        setcurrentProvider(null);
                      }}
                      className={`${
                        currentNetwork === 42161
                          ? "border-2 border-primary"
                          : ""
                      } flex items-center flex-col-reverse md:flex-row justify-between gap-3 md:gap-5 px-6 py-5 tokenDetailCard cursor-pointer`}>
                      <div className=" text-white font-semibold text-base md:text-xl">
                        Arbitrum
                      </div>
                      <Image
                        width={40}
                        height={40}
                        src={ArbiImage}
                        alt="Arbi logo"
                      />
                    </div>
                  </div>
                  <div className="mt-16 text-primary font-semibold text-3xl">
                    Choose Wallet
                  </div>
                  <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
                    <div
                      onClick={metamaskConnect}
                      className={` ${
                        currentProvider === "metamask"
                          ? "bg-primary"
                          : "tokenDetailCard"
                      } flex  items-center flex-col gap-2 px-6 py-5  cursor-pointer`}>
                      <Image
                        height={60}
                        src={Metamask}
                        alt="Meta logo"
                        objectFit="contain"
                      />
                      <div className=" text-white font-semibold text-base md:text-xl">
                        Metamask
                      </div>
                    </div>
                    <div
                      onClick={() => connectWallet(walletConnect)}
                      className={`${
                        currentProvider === "walletconnect"
                          ? "bg-primary"
                          : "tokenDetailCard"
                      } flex  items-center flex-col gap-2 px-6 py-5  cursor-pointer`}>
                      <Image
                        height={60}
                        src={WalletConnect}
                        alt="wallet logo"
                        objectFit="contain"
                      />
                      <div className=" text-white font-semibold text-base md:text-xl">
                        WalletConnect
                      </div>
                    </div>
                    <div
                      onClick={bscConnect}
                      className={`${
                        currentProvider === "bsc"
                          ? "bg-primary"
                          : "tokenDetailCard"
                      } flex  items-center flex-col gap-2 px-6 py-5  cursor-pointer`}>
                      <Image
                        height={60}
                        src={BNBBig}
                        alt="bsc logo"
                        objectFit="contain"
                      />
                      <div className=" text-white font-semibold text-base md:text-xl">
                        BSC Wallet
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  onClick={closeModal}
                  className=" bg-[#5C5C5C] rounded-full h-9 w-9 text-black flex justify-center items-center text-4xl cursor-pointer absolute right-4 md:right-10 top-4 md:top-10">
                  <IoClose size={26} fontWeight={700} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConnectModal;
