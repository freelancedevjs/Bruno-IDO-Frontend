import { useWallet } from "use-wallet";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  SupportedNetworksArray,
  switchEthereumChain,
} from "@providers/UseWalletProvider";

const useAuth = () => {
  const wallet = useWallet();
  const router = useRouter();
  const [currentProvider, setcurrentProvider] = useState<
    "metamask" | "walletconnect" | "trustwallet" | "bsc" | null
  >(null);

  const { blockchain: defaultChainID } = router.query;
  const activate = (connector: string) => wallet.connect(connector);
  const debugAccount = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage?.getItem("debug_account");
    }
  }, []);

  const finalChainId = useMemo(() => {
    if (wallet.chainId && SupportedNetworksArray.includes(wallet.chainId)) {
      return wallet.chainId;
    } else if (defaultChainID) {
      return Number(defaultChainID);
    } else {
      return undefined;
    }
  }, [defaultChainID, wallet.account, wallet.chainId, wallet.status]);

  function activateInjectedProvider(providerName: "MetaMask" | "TrustWallet") {
    const { ethereum } = window;

    if (!ethereum?.providers) {
      return undefined;
    }

    let provider;
    switch (providerName) {
      case "TrustWallet":
        provider = ethereum.providers.find(
          ({ isTrustWallet }: { isTrustWallet: boolean }) => isTrustWallet
        );
        break;
      case "MetaMask":
        provider = ethereum.providers.find(
          ({ isMetaMask }: { isMetaMask: boolean }) => isMetaMask
        );
        break;
    }

    if (provider) {
      ethereum.setSelectedProvider(provider);
    }
  }

  return {
    ethereum: wallet.ethereum,
    chainId: finalChainId,
    balance: wallet.balance,
    balance_formatted: parseInt(wallet.balance || "0") / 10 ** 18,
    metamaskConnect: () => {
      setcurrentProvider("metamask");
      activateInjectedProvider("MetaMask");
      activate("metamask");
    },
    bscConnect: () => {
      setcurrentProvider("bsc");
      activate("bsc");
    },
    trustwalletConnect: () => {
      setcurrentProvider("trustwallet");
      activateInjectedProvider("TrustWallet");
      activate("trustwallet");
    },
    walletConnect: () => {
      setcurrentProvider("walletconnect");
      activate("walletconnect");
    },
    connect: () => activate("injected"),
    loading: wallet.status === "connecting",
    account: debugAccount || wallet.account,
    disconnect: () => {
      setcurrentProvider(null);
      wallet.reset();
    },
    isLoggedIn: wallet.status === "connected" && wallet.chainId == finalChainId,
    library: wallet.ethereum
      ? new ethers.providers.Web3Provider(wallet.ethereum)
      : undefined,
    currentProvider,
    setcurrentProvider,
  };
};

export default useAuth;
