import Modal from "@molecules/Modal";
import { Dispatch, FC, SetStateAction } from "react";
import { IoClose, IoLogOutOutline } from "react-icons/io5";
import MetamaskIcon from "@public/icons/svgs/wallet/metamask.svg";
import Image, { StaticImageData } from "next/image";
import { HiOutlineExternalLink } from "react-icons/hi";
import ether from "@public/icons/svgs/network/ether.svg";
import useAuth from "@hooks/useAuth";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";
import { supportNetwork } from "@constants/network";
import { networkIcon } from "@helpers/getNetworkIcon";
import { getExplorerLink } from "@helpers/getExplorerLink";

interface DisconnectModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

const DisconnectModal: FC<DisconnectModalProps> = (props) => {
  const {
    account,
    loading: connecting,
    balance_formatted,
    chainId,
    disconnect,
  } = useAuth();
  return (
    <Modal
      {...props}
      className="max-w-[600px] w-full bg-footer p-4 sm:px-8 relative">
      <div className="w-full mt-16 ">
        <div
          onClick={() => props.setIsOpen((prev) => !prev)}
          className="absolute cursor-pointer hover:scale-110 flex items-center justify-center top-4 right-4 bg-[#5C5C5C] h-9 w-9 rounded-full">
          <IoClose size={26} fontWeight={700} />
        </div>

        <div className="flex flex-col gap-4">
          {account && (
            <a
              target="_blank"
              href={getExplorerLink(account, chainId, "address")}
              rel="noopener noreferrer">
              <div className="text-primary hover:underline flex items-center gap-2 cursor-pointer">
                <p className="text-xl sm:text-2xl font-semibold">Account</p>
                <HiOutlineExternalLink size={26} />
              </div>
            </a>
          )}
          <div className="px-4 py-2 pl-0 rounded-lg sm:rounded-2xl flex flex-col sm:flex-row justify-between gap-6 sm:items-center bg-gradient-to-r from-[#26182d] to-[#172223]">
            <div className="flex items-center">
              <div className="w-24 sm:w-28 h-auto">
                <Image
                  src={MetamaskIcon}
                  objectFit="contain"
                  alt="wallet-icon"
                />
              </div>
              <p className="text-white font-medium">
                {" "}
                {walletNameTrimmer(account)}
              </p>
            </div>

            <div
              onClick={(e) => {
                disconnect();
                props.setIsOpen(false);
              }}
              className="flex ml-6 sm:ml-0 cursor-pointer items-center gap-2 text-red-text3">
              <IoLogOutOutline size={32} />
              <p className="text-base sm:text-lg font-semibold">
                {"Disconnect"}
              </p>
            </div>
          </div>

          {chainId && (
            <>
              <div className="flex text-white text-sm sm:text-base md:text-lg  items-center gap-3 justify-between mt-4">
                <p>Balance</p>
                <p className="text-right">
                  {balance_formatted.toFixed(6)}{" "}
                  <span className="">{supportNetwork[chainId]?.symbol}</span>
                </p>
              </div>
              <div className="flex text-white text-sm sm:text-base md:text-lg  items-center gap-3 justify-between">
                <p>Network</p>
                <div className="flex w-full justify-end items-center gap-1">
                  <Image
                    src={networkIcon(chainId)}
                    alt="ether"
                    height={20}
                    objectFit="contain"
                  />
                  <p className="truncate">
                    {" "}
                    <span className="">{supportNetwork[chainId]?.name}</span>
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex text-white text-sm sm:text-base md:text-lg items-center gap-3 justify-between">
            <p>Wallet</p>
            <p>Metamask</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DisconnectModal;
