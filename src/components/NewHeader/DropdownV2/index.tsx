import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import polygon from "@public/icons/svgs/network/polygon.svg";
import binance from "@public/icons/svgs/network/binance.svg";
import ether from "@public/icons/svgs/network/ether.svg";
import arbitrum from "@public/icons/svgs/network/arbitrum.svg";

import { FaChevronDown } from "react-icons/fa";
import { supportNetwork } from "@constants/network";
import { BiCheck } from "react-icons/bi";
import { useRouter } from "next/router";
import {
  SupportedNetworksArray,
  switchEthereumChain,
} from "@providers/UseWalletProvider";
interface IDropdownProps {
  label?: string;
  className?: string;
  dropdownList: string[] | number[];
  selectedOption: string | number | undefined;
  setSelectedOption: Dispatch<SetStateAction<string | number | any>>;
  currentChain?: number;
}

const Dropdown: React.FC<IDropdownProps> = ({
  dropdownList,
  setSelectedOption,
  selectedOption,
  label,
  className,
  currentChain,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside: any = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  const onChange = useCallback(
    async (chainId_: number) => {
      if (SupportedNetworksArray.includes(chainId_) && router.isReady) {
        switchEthereumChain({ chainId: chainId_ }).catch((e) => {
          setSelectedOption(currentChain);
        });
      }
    },
    [router.isReady, currentChain]
  );
  const handleSelectOption = async (item: string | number) => {
    await onChange(item as number);
    setSelectedOption(item);
    setShowDropdown(false);
  };

  const networkIcon = (chainId: number) => {
    // @ts-ignore
    switch (supportNetwork[chainId]?.symbol) {
      case "MATIC":
        return polygon;
      case "BNB":
        return binance;
      case "ETH":
        return ether;
      case "ARB":
        return arbitrum;
      default:
        return polygon;
    }
  };

  return (
    <div ref={dropdownRef} className={`relative  ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        id="dropdownDefault"
        data-dropdown-toggle="dropdown"
        className="flex w-[86px] items-center gap-2 py-2 px-4 rounded-full bg-gradient-btn text-primary border border-blue2"
        type="button">
        <Image
          src={networkIcon(selectedOption as number)}
          alt=""
          height={24}
          width={24}
          objectFit="contain"
        />
        <FaChevronDown className="ml-2 w-4 h-4" />
      </button>
      <div
        id="dropdown"
        className={`${
          showDropdown ? "block" : "hidden"
        } absolute top-14 right-0 z-50 bg-black rounded-lg divide-y divide-gray-100 shadow w-44 border border-gray-800`}>
        <ul
          className="py-1 text-sm text-white"
          aria-labelledby="dropdownDefault">
          {dropdownList.map((dl, index) => (
            <li key={`dl-${index}`}>
              <div
                onClick={() => handleSelectOption(dl)}
                className="flex justify-between items-center cursor-pointer py-2 px-4 hover:bg-gray-900 font-medium text-sm">
                <div className="flex items-center gap-2">
                  <Image
                    src={networkIcon(dl as number)}
                    alt=""
                    height={24}
                    width={24}
                    objectFit="contain"
                  />
                  <p className="w-26 truncate">{supportNetwork[dl]?.name}</p>
                </div>
                {selectedOption === dl && (
                  <BiCheck size={22} className="text-primary" />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
