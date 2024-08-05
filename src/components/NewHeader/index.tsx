import React, {
  useState,
  useRef,
  Fragment,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import Link from "next/link";
import { TbGridDots } from "react-icons/tb";
import { MdArrowDropDown, MdClose } from "react-icons/md";
import useWidth from "@hooks/useWidth";
import { Popover, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { supportNetwork } from "@constants/network";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";
import useAuth from "@hooks/useAuth";
import { toast } from "react-toastify";
import Image from "next/image";
import Bipzylogo from "@public/icons/svgs/logo_h.svg";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { FaDiscord, FaInstagram, FaWallet } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";
import { BsTwitter } from "react-icons/bs";
import { SocialIcon } from "@components/Sidebar";
import { SupportedNetworksArray } from "@providers/UseWalletProvider";
import Dropdown from "./DropdownV2";
import ConnectWalletModal from "./ConnectWalletModal";
import DisconnectModal from "./DisconnectModal";
import { Claim, Discover, Guide, Purchase } from "@public/icons/svgs/menu";
import { NFT } from "@public/images/homeIcon/participate";
import UserIcon from "@public/icons/svgs/user-icon.svg";
import ConnectModal from "@components/NewDetail/Modals/ConnectModal";

interface IProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  additionalProps: {
    projectsRef: React.MutableRefObject<HTMLDivElement | null>;
    scrollToProjectSection: () => void;
  };
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface IMenu {
  title: string;
  link?: string;
  nestedMenus?: { title: string; link: string }[];
}

interface IPopoverProps {
  title: string;
  subMenu: IMenu[];
}

const Menus = [
  {
    title: "Launchpad",
    link: "/",
  },
  {
    title: "Algo Trading",
    link: "/trading",
  },
  {
    title: "Buy USDT",
    link: "/buy-usdt",
    isExternalLink: true,
  },
  {
    title: "Contact Us",
    link: "/contact",
  },
];

export const SocialMediaItems = [
  {
    title: "Telegram",
    link: "https://t.me/bipzycom",
    icon: FaTelegramPlane,
  },

  {
    title: "Instagram",
    link: "https://instagram.com/bipzycom",
    icon: FaInstagram,
  },
  {
    title: "Twitter",
    link: "https://twitter.com/Bipzycom",
    icon: BsTwitter,
  },
  {
    title: "Discord",
    link: "https://discord.gg/MPfpMy2hQW",
    icon: FaDiscord,
  },
];

const LaunchPadMenus = [
  {
    title: "Discover Projects to Invest",
    isScroll: true,
    link: "/",
    icon: Discover,
    description:
      "Learn more about the IDOs launched in Bipzy, and how to join them.",
  },
  {
    title: "Purchase KmanusNFT",
    isExternalLink: true,
    link: "https://www.kmanus88.com/",
    icon: NFT,
    description:
      "Acquire a NFT to receive 24 hour priority access to all the token pre-sales.",
  },
  {
    title: "Claim & All Funded Projects",
    link: "/launchpad/list",
    icon: Claim,
    description:
      "Browse the available claims and see the ones you are eligible for.",
  },
  {
    title: "Guides",
    link: "https://bipzy.gitbook.io/bipzy-crypto-platform/",
    icon: Guide,
    description:
      "Explore our documentations & help articles to guide your quest at Bipzy.",
  },
];

const NewHeader = (props: IProps) => {
  const { setIsDrawerOpen, isDrawerOpen, additionalProps } = props;
  const { scrollToProjectSection } = additionalProps;
  const {
    connect,
    isLoggedIn,
    account,
    loading: connecting,
    balance_formatted,
    chainId,
    ethereum,
    disconnect,
    setcurrentProvider,
  } = useAuth();
  const router = useRouter();
  const width = useWidth();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] =
    React.useState<boolean>(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(
    Number(router?.query?.blockchain)
  );

  const [navbarBackground, setNavbarBackground] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const handleScroll = () => {
      const isTop = window.scrollY > 50;
      if (isMounted) {
        setNavbarBackground(isTop);
      }
    };

    if (typeof window !== "undefined" && window.addEventListener) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      isMounted = false;
      if (typeof window !== "undefined" && window.removeEventListener) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    setSelectedNetwork(Number(router?.query?.blockchain));
  }, [router.query]);

  const walletconnectHandler = () => {
    setIsConnectModalOpen(true);
  };
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const launchMenuRef = useRef<HTMLButtonElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    buttonRef?.current?.click();
  };

  const toggleLaunch = () => {
    launchMenuRef?.current?.click();
  };
  const SubMenu = ({ className, close }: { className: string; close: any }) => {
    return (
      <div
        className={`group md:grid grid-cols-1 z-40 md:grid-cols-2 gap-8 p-6  w-full  border border-dull-green2 rounded-xl ${className}  bg-black transition-opacity duration-500 opacity-100 hover:opacity-100`}>
        {LaunchPadMenus.map((lm, i) => {
          if (lm.isExternalLink) {
            return (
              <a
                target="_blank"
                href={lm.link}
                key={i}
                className="flex cursor-pointer items-center gap-3 hover:bg-slate-900 py-2 px-3  rounded-lg"
                rel="noreferrer">
                <div className="flex flex-shrink-0">
                  <Image
                    src={lm.icon}
                    alt="icon"
                    height={32}
                    objectFit="contain"
                    width={32}
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-primary font-semibold text-lg">
                    {lm.title}
                  </p>
                  <p className="text-gray17 group-hover:text-white font-normal text-sm">
                    {lm.description}
                  </p>
                </div>
              </a>
            );
          }

          return (
            <div
              onClick={() => {
                if (lm.isScroll) {
                  if (router.pathname !== lm.link) {
                    router.push(lm.link as string);
                    setTimeout(() => {
                      scrollToProjectSection();
                      close();
                    }, 800);
                  } else {
                    scrollToProjectSection();
                    close();
                  }
                } else {
                  router.push(lm.link as string);
                  close();
                }
              }}
              key={i}
              className="flex cursor-pointer items-center gap-3 hover:bg-slate-900 py-2 px-3  rounded-lg">
              <div className="flex flex-shrink-0">
                <Image
                  src={lm.icon}
                  alt="icon"
                  height={32}
                  objectFit="contain"
                  width={32}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-primary font-semibold text-lg">{lm.title}</p>
                <p className="text-gray17 group-hover:text-white font-normal text-sm">
                  {lm.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      ref={menuRef}
      className={`flex ${
        navbarBackground ? "bg-gray10/40  backdrop-blur-lg" : ""
      }  justify-between items-center h-[76px] py-3 px-6 lg:px-12  fixed top-0 w-full z-50`}>
      <div className="flex relative justify-between gap-4 items-center w-full">
        <div className="flex gap-4 items-center">
          <div
            className="cursor-pointer text-white flex lg:hidden"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            {isDrawerOpen ? <MdClose size={32} /> : <TbGridDots size={32} />}
          </div>
          <Link href={"/"}>
            <div className="hidden md:flex gap-2 items-center cursor-pointer">
              <Image
                src={Bipzylogo}
                alt="Bipzy"
                height={44}
                objectFit="contain"
              />
            </div>
          </Link>
        </div>
        <Link href={"/"}>
          <div className="gap-2 flex md:hidden items-center cursor-pointer">
            <Image src={Bipzylogo} alt="Bipzy" />
          </div>
        </Link>

        <div className="hidden lg:flex gap-6 xl:gap-10 ">
          {Menus.map((menu) => {
            if (menu.title === "Launchpad") {
              return (
                <Popover key={menu.link}>
                  {({ open, close }) => (
                    <div
                      className="relative"
                      onMouseEnter={() => toggleLaunch()}
                      onMouseLeave={() => toggleLaunch()}>
                      <Popover.Button
                        ref={launchMenuRef}
                        className={"outline-none border-none"}>
                        <p className="text-white text-base font-normal cursor-pointer">
                          {menu.title}
                        </p>
                      </Popover.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1">
                        <Popover.Panel
                          className={
                            "z-10 top-16 -left-1/2  xl:-left-6 absolute min-w-[700px] xl:min-w-[800px] w-full "
                          }>
                          <SubMenu close={close} className="w-full" />
                        </Popover.Panel>
                      </Transition>
                    </div>
                  )}
                </Popover>
              );
            } else if (menu.isExternalLink) {
              return (
                <a
                  key={menu.title}
                  href={menu.link}
                  className="cursor-pointer"
                  target="_blank"
                  rel="noreferrer">
                  <p className="text-white text-base font-normal cursor-pointer">
                    {menu.title}
                  </p>
                </a>
              );
            } else {
              return (
                <Link
                  href={menu.link}
                  key={menu.title}
                  className="cursor-pointer">
                  <p className="text-white text-base font-normal cursor-pointer">
                    {menu.title}
                  </p>
                </Link>
              );
            }
          })}
        </div>
        <div className="hidden xl:flex gap-6">
          {SocialMediaItems.map((sm, i) => (
            <SocialIcon key={i} {...sm} />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center text-sm " id={"network-info"}>
              {
                // <div className="flex items-center gap-2 py-2 px-4 rounded-full bg-gradient-btn text-primary border border-blue2">
                //   <div className="flex items-center">
                //     <Image
                //       width={20}
                //       height={20}
                //       src={networkIcon()}
                //       alt="network-icon"
                //     />
                //   </div>
                //   <div className="font-normal">
                //     {supportNetwork[chainId || "default"]?.name}
                //   </div>
                // </div>
                account && (
                  <Dropdown
                    dropdownList={SupportedNetworksArray}
                    selectedOption={selectedNetwork}
                    setSelectedOption={setSelectedNetwork}
                    currentChain={chainId}
                  />
                )
              }
            </div>
            {/* <ReactTooltip
              anchorId={"network-info"}
              place="bottom"
              className="max-w-sm"
              content={
                "Change the network from Metamask. Supported networks are : Polygon, BSC and Arbitrum."
              }
            /> */}

            {!isLoggedIn || !account ? (
              <button
                className="flex justify-center px-8 items-center bg-gradient-btn w-max rounded-full py-2 text-primary font-semibold border border-blue2 text-sm"
                disabled={connecting}
                onClick={walletconnectHandler}>
                {"Connect"}
                <span className="ml-2">
                  <FaWallet />
                </span>
              </button>
            ) : (
              // <Popover className="relative">
              //   {({ open }) => (
              //     <div
              //       onMouseEnter={() => toggleMenu()}
              //       onMouseLeave={() => toggleMenu()}>
              //       <Popover.Button
              //         ref={buttonRef}
              //         className={`
              //   ${open ? "" : "text-opacity-90"}
              //   group inline-flex items-center rounded-full text-base font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}>
              //         <div className="flex items-center border border-blue2 px-4 py-2 bg-gradient-btn text-primary  rounded-full cursor-pointer">
              //           <div>
              //             <div className="text-xs font-normal">
              //               {walletNameTrimmer(account)}
              //             </div>
              //             {chainId && (
              //               <div className="text-xs font-normal text-center ">
              //                 {balance_formatted.toFixed(6)}{" "}
              //                 <span className="">
              //                   {supportNetwork[chainId]?.symbol}
              //                 </span>
              //               </div>
              //             )}
              //           </div>
              //         </div>
              //       </Popover.Button>
              //       <Transition
              //         as={Fragment}
              //         enter="transition ease-out duration-200"
              //         enterFrom="opacity-0 translate-y-1"
              //         enterTo="opacity-100 translate-y-0"
              //         leave="transition ease-in duration-150"
              //         leaveFrom="opacity-100 translate-y-0"
              //         leaveTo="opacity-0 translate-y-1">
              //         <Popover.Panel className="z-10 min-h-max absolute top-16 bg-card-green-bg-color py-1  border border-tertiary-green-border min-w-fit">
              //           {/* <div
              //             onClick={disconnect}
              //             className="submenu flex items-center px-5 py-3 cursor-pointer hover:bg-dull-green text-white">
              //             <div className="h-2.5 w-2.5 border border-primary-green rotate-45 mr-2.5 boderedIcon"></div>
              //             <div className="h-2.5 w-2.5 bg-primary-green rotate-45 mr-2.5 solidIcon"></div>
              //             <div className="text-base font-semibold">Logout</div>
              //           </div> */}
              //           <DisconnectModal
              //             isOpen={showDisconnectModal}
              //             setIsOpen={setShowDisconnectModal}
              //           />
              //         </Popover.Panel>
              //       </Transition>
              //     </div>
              //   )}
              // </Popover>
              <button
                className="flex justify-center px-8 items-center bg-gradient-btn w-max rounded-full py-2 text-primary font-semibold border border-blue2 text-sm"
                onClick={() => setShowDisconnectModal(true)}>
                {walletNameTrimmer(account)}
              </button>
            )}
          </div>
        </div>
      </div>
      <DisconnectModal
        isOpen={showDisconnectModal}
        setIsOpen={setShowDisconnectModal}
      />
      <ConnectModal
        isOpen={isConnectModalOpen}
        setIsOpen={setIsConnectModalOpen}
      />
    </div>
  );
};

export default NewHeader;
