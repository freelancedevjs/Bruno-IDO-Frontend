import Modal from "@molecules/Modal";
import { Dispatch, FC, SetStateAction } from "react";
import Image, { StaticImageData } from "next/image";
import { IoClose, IoWallet } from "react-icons/io5";
import MetamaskIcon from "@public/icons/wallet/metamask.png";
import WalletConnectIcon from "@public/icons/wallet/WalletConnect.png";
import TrustWalletIcon from "@public/icons/wallet/trust.png";

interface ConnectWalletModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

interface ISubSection {
  iconSrc: StaticImageData | string;
  title: string;
  description: string;
}

const SubSection: FC<ISubSection> = ({ iconSrc, title, description }) => {
  return (
    <div className="p-4 rounded-2xl flex flex-col items-center bg-gradient-to-r from-[#26182d] to-[#172223]">
      <div className="h-20 w-20 flex justify-center items-center mb-1">
        <Image
          src={iconSrc}
          alt={title}
          objectFit="contain"
          className="h-auto w-full"
        />
      </div>
      <p className="font-semibold text-xl text-white">{title}</p>
      <p className="text-gray15 text-base font-normal">{description}</p>
    </div>
  );
};

const ConnectWalletModal: FC<ConnectWalletModalProps> = (props) => {
  return (
    <Modal
      {...props}
      className="max-w-[600px] w-full bg-footer p-4 px-8 relative">
      <div className="w-full mt-16 ">
        <div
          onClick={() => props.setIsOpen((prev) => !prev)}
          className="absolute cursor-pointer hover:scale-110 flex items-center justify-center top-4 right-4 bg-[#5C5C5C] h-9 w-9 rounded-full">
          <IoClose size={26} fontWeight={700} />
        </div>

        <div className="flex flex-col gap-8">
          <SubSection
            iconSrc={MetamaskIcon}
            title={"Metamask"}
            description="Connect to your MetaMask Wallet"
          />
          <SubSection
            iconSrc={TrustWalletIcon}
            title={"Trust Wallet"}
            description="Connect to your Trust Wallet"
          />
          <SubSection
            iconSrc={WalletConnectIcon}
            title={"Walletconnect"}
            description="Connect to your Walletconnect Wallet"
          />
          <div className="p-4 text-[#AAAAAA] rounded-2xl flex justify-center gap-6 items-center bg-gradient-to-r from-[#26182d] to-[#172223]">
            <IoWallet size={32} />
            <p className="text-lg font-semibold">{"I don't have a Wallet"}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConnectWalletModal;
