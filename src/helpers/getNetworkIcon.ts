import polygon from "@public/icons/svgs/network/polygon.svg";
import binance from "@public/icons/svgs/network/binance.svg";
import ether from "@public/icons/svgs/network/ether.svg";
import arbitrum from "@public/icons/svgs/network/arbitrum.svg";
import { supportNetwork } from "@constants/network";

export const networkIcon = (chainId: number) => {
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
export const networkIconV2 = (network: string) => {
  // @ts-ignore
  switch (network.toLowerCase()) {
    case "polygon":
      return polygon;
    case "binance":
      return binance;
    case "ethereum":
      return ether;
    case "arbitrum":
      return arbitrum;
    default:
      return polygon;
  }
};
