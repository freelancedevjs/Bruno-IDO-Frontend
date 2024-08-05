import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import airbaloonIcon from "@public/icons/svgs/sidebar/airdrop.svg";
import crownIcon from "@public/icons/svgs/crownicon.svg";
import lockIcon from "@public/icons/svgs/sidebar/lock.svg";
import shieldIcon from "@public/icons/svgs/sidebar/shield.svg";
import spaceshipIcon from "@public/icons/svgs/sidebar/launchpad.svg";
import usersIcon from "@public/icons/svgs/sidebar/kyc.svg";
import createIcon from "@public/icons/svgs/create.svg";
import Accordian from "@molecules/Accordian";
import useAuth from "@hooks/useAuth";
import { walletNameTrimmer } from "@helpers/walletNameTrimmer";
import { useRouter } from "next/router";
import useWidth from "@hooks/useWidth";
import { toast } from "react-toastify";
import { Popover, Transition } from "@headlessui/react";
import {
  BiListCheck,
  BiListPlus,
  BiLock,
  BiLockOpen,
  BiLockOpenAlt,
  BiPlusCircle,
  BiRocket,
} from "react-icons/bi";
import {
  DEFAULT_CHAIN_ID,
  SupportedNetworksArray,
} from "@providers/UseWalletProvider";
import { BsFacebook, BsTwitter, BsGlobe, BsDiscord } from "react-icons/bs";
import { GiAirBalloon } from "react-icons/gi";
import { IconType } from "react-icons/lib";
import {
  FaDiscord,
  FaGithub,
  FaInstagram,
  FaReddit,
  FaTelegramPlane,
  FaWallet,
} from "react-icons/fa";
import { supportNetwork } from "@constants/network";
import { IoWalletOutline } from "react-icons/io5";
import { SiGitbook } from "react-icons/si";
import { SocialMediaItems } from "@components/NewHeader";
import DisconnectModal from "@components/NewHeader/DisconnectModal";
import Dropdown from "../NewHeader/DropdownV2";
import Link from "next/link";

interface IProps {
  isDrawerOpen: boolean;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const sideBarMenu = (chain_id?: number) => {
  const chainId = chain_id || DEFAULT_CHAIN_ID;
  return [
    {
      title: "Launchpad",
      haveSubmenu: true,
      submenu: [
        {
          title: "Discover Projects to Invest",
          icon: <BiListCheck size={18} className="mr-3" />,
          link: `/launchpad/list`,
        },
        {
          title: "Purchase KmanusNFT",
          isExternalLink: true,
          icon: <BiListCheck size={18} className="mr-3" />,
          link: `https://www.kmanus88.com/`,
        },
        {
          title: "Claim & Funded Projects",
          icon: <BiListCheck size={18} className="mr-3" />,
          link: `/launchpad/list`,
        },
        {
          title: "Guides",
          icon: <BiListCheck size={18} className="mr-3" />,
          link: "https://bipzy.gitbook.io/bipzy-crypto-platform/",
        },
      ],
    },
    {
      title: "Algo Trading",
      icon: crownIcon,
      link: `/trading`,
    },
    {
      title: "Buy USDT",
      icon: crownIcon,
      link: `/buy-usdt`,
      isExternalLink: true,
    },
    {
      title: "Contact Us",
      icon: crownIcon,
      link: `/contact`,
    },
  ];
};

interface ISubmenu {
  title: string;
  link?: string;
  haveNestedMenu?: boolean;
  icon?: any;
  isExternalLink?: boolean;
  nestedMenus?: { title: string; link: string; isExternalLink?: boolean }[];
}
interface ISideBarListComp {
  title: string;
  icon?: any;
  haveSubmenu?: boolean;
  submenu?: ISubmenu[];
  link?: string;
  isExternalLink?: boolean;
  handleDrawer: (value: boolean) => void;
  selectedTab: string;
  setSelectedTab: (value: string) => void;
}

// const SocialMediaItems = [
//   // {
//   //   title: "Website",
//   //   link: "/",
//   //   icon: BsGlobe,
//   // },
//   // {
//   //   title: "Reddit",
//   //   link: "/",
//   //   icon: FaReddit,
//   // },
//   {
//     title: "Telegram",
//     link: "/",
//     icon: FaTelegramPlane,
//   },
//   {
//     title: "Instagram",
//     link: "/",
//     icon: FaInstagram,
//   },
//   {
//     title: "Twitter",
//     link: "/",
//     icon: BsTwitter,
//   },
//   // {
//   //   title: "Github",
//   //   link: "/",
//   //   icon: FaGithub,
//   // },
//   // {
//   //   title: "Facebook",
//   //   link: "/",
//   //   icon: BsFacebook,
//   // },
//   {
//     title: "Discord",
//     link: "/",
//     icon: FaDiscord,
//   },
// ];

export const SocialIcon = ({
  title,
  link,
  icon,
}: {
  title: string;
  link: string;
  icon: IconType;
}) => {
  const Icon = icon;
  return (
    <a href={link} key={title} target="_blank" rel="noreferrer">
      <Icon
        className="hover:scale-125 transform transition duration-500 text-blue2"
        size={18}
      />
    </a>
  );
};

const SideBarListComp = (props: ISideBarListComp) => {
  const router = useRouter();
  const width = useWidth();

  const {
    title,
    icon,
    haveSubmenu,
    submenu,
    link,
    handleDrawer,
    selectedTab,
    setSelectedTab,
    isExternalLink,
  } = props;

  const linkHandler = (link: string, menutitle: string) => {
    router.push(link);
    handleDrawer(false);
    setSelectedTab(link);
  };
  return (
    <>
      {haveSubmenu ? (
        <Accordian
          title={title}
          icon={icon}
          defaultOpen={true}
          // defaultOpen={[...(submenu?.map((s) => s.link) ?? [])].includes(
          //   selectedTab
          // )}
        >
          <ul>
            {submenu?.map((menu, index) => {
              if (menu.link) {
                if (menu.isExternalLink) {
                  return (
                    <a
                      href={menu.link}
                      target="_blank"
                      key={index}
                      className={`flex items-center text-sm font-medium py-3 px-10 cursor-pointer text-white`}
                      rel="noreferrer">
                      {menu.icon ? (
                        menu.icon
                      ) : (
                        <BiPlusCircle size={18} className="mr-3" />
                      )}
                      <p className={`truncate`}>{menu.title}</p>
                    </a>
                  );
                }

                return (
                  <div
                    key={index}
                    className={`flex items-center text-sm font-medium py-3 px-10 cursor-pointer text-white`}
                    onClick={() =>
                      menu.link && linkHandler(menu.link, menu.title)
                    }>
                    {menu.icon ? (
                      menu.icon
                    ) : (
                      <BiPlusCircle size={18} className="mr-3" />
                    )}
                    <p className={`truncate`}>{menu.title}</p>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="ml-4 text-xs">
                    <Accordian defaultOpen={true} title={menu.title}>
                      <ul>
                        {menu.nestedMenus?.map((nm, i) => {
                          return (
                            <div
                              key={i}
                              className={`flex items-center text-sm font-medium py-3 px-10 cursor-pointer  ${
                                selectedTab === nm.link
                                  ? "text-primary-green"
                                  : " text-white"
                              }`}
                              onClick={() =>
                                nm.link && linkHandler(nm.link, nm.title)
                              }>
                              <BiPlusCircle size={18} className="mr-3" />
                              <p className={` truncate`}>{nm.title}</p>
                            </div>
                          );
                        })}
                      </ul>
                    </Accordian>
                  </div>
                );
              }
            })}
          </ul>
        </Accordian>
      ) : isExternalLink && link ? (
        <Link href={link}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center text-base font-medium px-6  py-3 cursor-pointer    ${
              selectedTab === link ? "text-primary-green" : "text-white"
            }`}>
            <p className={` truncate`}>{title}</p>
          </a>
        </Link>
      ) : (
        <>
          {link && (
            <div
              onClick={() => linkHandler(link, title)}
              className={`flex items-center text-base font-medium px-6  py-3 cursor-pointer    ${
                selectedTab === link ? "text-primary-green" : "text-white"
              }`}>
              <p className={` truncate`}>{title}</p>
            </div>
          )}
        </>
      )}
    </>
  );
};

const SidebarComp = (props: IProps) => {
  const { setIsDrawerOpen, isDrawerOpen } = props;
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(router.pathname);
  const width = useWidth();
  const {
    connect,
    isLoggedIn,
    account,
    balance_formatted,
    chainId,
    loading,
    ethereum,
    disconnect,
  } = useAuth();
  const [isMount, setIsMount] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(
    Number(router?.query?.blockchain)
  );
  useEffect(() => {
    setIsMount(true);
  });

  const walletconnectHandler = () => {
    if (window.ethereum) {
      connect();
    } else {
      if (width > 1000) {
        toast.error("Install Metamask");
      } else {
        router.push("https://metamask.io/download");
      }
    }
  };

  const ref = React.useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (
      ref.current &&
      !ref.current?.contains(event.target) &&
      showDisconnectModal
    ) {
      setIsDrawerOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <>
      <div
        ref={ref}
        className={`transform transition-all duration-300 ease-linear fixed top-[4.76rem] z-[30] left-0 border-tertiary-green-border custom-scrollbar w-full h-full sm:h-auto sm:w-auto bg-gray10 ${
          isMount ? "translate-y-0 opacity-100" : "-translate-y-1/4 opacity-10"
        }`}>
        <div className="h-[calc(100%_-_100px)] overflow-y-auto sm:h-full w-full sm:max-w-[250px] bg-gray10">
          <div className="bg-gray10">
            <div className="md:hidden flex items-center justify-center gap-3 py-3">
              {!isLoggedIn || !account ? (
                <button
                  className="flex justify-center px-8 items-center bg-gradient-btn w-max rounded-full py-2 text-primary font-semibold border border-blue2 text-sm"
                  disabled={loading}
                  onClick={walletconnectHandler}>
                  {"Connect"}
                  <span className="ml-2">
                    <FaWallet />
                  </span>
                </button>
              ) : (
                <>
                  <button
                    className="flex justify-center px-4 items-center bg-gradient-btn w-max rounded-full py-2.5 text-primary font-semibold border border-blue2 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDisconnectModal(true);
                    }}>
                    {walletNameTrimmer(account)}
                  </button>

                  <Dropdown
                    dropdownList={SupportedNetworksArray}
                    selectedOption={selectedNetwork}
                    setSelectedOption={setSelectedNetwork}
                  />
                </>
              )}
            </div>
            <div className="">
              {sideBarMenu(chainId).map((menu, index) => {
                return (
                  <SideBarListComp
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    key={index}
                    {...menu}
                    handleDrawer={setIsDrawerOpen}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 my-4 md:my-8 px-6">
              {SocialMediaItems.map((sm, i) => (
                <SocialIcon key={i} {...sm} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <DisconnectModal
        isOpen={showDisconnectModal}
        setIsOpen={setShowDisconnectModal}
      />
    </>
  );
};

export default SidebarComp;
