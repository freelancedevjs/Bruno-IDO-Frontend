import useChainId from "@providers/UseWalletProvider/useChainId";
import { useWallet, UseWalletProvider } from "use-wallet";
import { useEffect } from "react";
import { supportNetwork } from "@constants/network";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { BscConnector } from "@binance-chain/bsc-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

export enum Networks {
  BSC = 56,
  ARB = 42161,
  ETH = 1,
  MAINET = 137,
  MUMBAI = 80001,
}

export const DEFAULT_CHAIN_ID = Networks.BSC;
export const SupportedNetworksArray = [
  Networks.MAINET,
  Networks.ARB,
  Networks.ETH,
  Networks.BSC,
];

export async function switchEthereumChain({ chainId }: { chainId: number }) {
  if (!window.ethereum) return;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (err: any) {
    if (err && (err.code === 4902 || err.code === -32603)) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: supportNetwork[chainId].name,
              nativeCurrency: {
                name: supportNetwork[chainId].name,
                symbol: supportNetwork[chainId].symbol, // 2-6 characters long
                decimals: supportNetwork[chainId].decimals,
              },
              blockExplorerUrls: [supportNetwork[chainId].explorer],
              rpcUrls: [supportNetwork[chainId].rpc],
            },
          ],
        });
      } catch (addError) {
        console.error(addError);
        throw addError;
      }
    } else {
      throw err;
    }
    // console.error(e)
  }
}

const Wallet = ({ children }: any) => {
  const chainId = useChainId();
  const { reset } = useWallet();

  useEffect(() => {
    if (!!chainId) {
      if (!SupportedNetworksArray.includes(chainId)) {
        switchEthereumChain({
          chainId: supportNetwork["default"].chainId,
        }).catch((e) => {
          reset();
        });
      }
    }
    // Do not add reset ad dependency, it causes double requests
  }, [chainId]);
  return children;
};

const initWalletConnect = async () => {
  const walletConnectProvider = new WalletConnectProvider({
    // Options for the WalletConnect provider
    // For example, you can specify the RPC URL for the blockchain network you want to connect to
    rpc: {
      1: "https://rpc.ankr.com/eth",
      80001: "https://rpc.ankr.com/polygon_mumbai",
    },
  });

  await walletConnectProvider.enable(); // Enable the provider
  // You can also listen to events from the provider like 'disconnect' or 'chainChanged'

  // Connect the WalletConnect provider to the use-wallet library
  // You can access the connected account and other methods using the 'useWallet' hook
  return walletConnectProvider;
};

const bscConnector = async () => {
  return {
    web3ReactConnector({ chainId }: { chainId: number[] }) {
      return new BscConnector({
        supportedChainIds: SupportedNetworksArray,
      });
    },
  };
};

const injectedConnectors = {
  metamask: async () => {
    return {
      web3ReactConnector({ chainId }: { chainId: number[] }) {
        return new InjectedConnector({
          supportedChainIds: SupportedNetworksArray,
        });
      },
    };
  },
  trustwallet: async () => {
    return {
      web3ReactConnector({ chainId }: { chainId: number[] }) {
        return new InjectedConnector({
          supportedChainIds: SupportedNetworksArray,
        });
      },
    };
  },
};

const UseWalletProviderWrapper = (props: any) => {
  return (
    <UseWalletProvider
      connectors={{
        injected: { chain: SupportedNetworksArray },
        walletconnect: initWalletConnect,
        bsc: bscConnector,
        ...injectedConnectors,
      }}
      {...props}>
      <Wallet>{props.children}</Wallet>
    </UseWalletProvider>
  );
};

export default UseWalletProviderWrapper;
