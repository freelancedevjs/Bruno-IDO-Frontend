import useAuth from "@hooks/useAuth";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  Multicall,
  ContractCallResults,
  ContractCallContext,
} from "ethereum-multicall";
import Web3 from "web3";
import { supportNetwork } from "@constants/network";

interface NFTEntry {
  address: string;
}

interface NFTData {
  [key: number]: NFTEntry[];
}

interface WhitelistNFTData {
  [key: number]: {
    [key: string]: WhitelistNFTEntry;
  };
}

interface WhitelistNFTEntry {
  address: string;
  whitelisted: boolean;
}

const NFT: NFTData = {
  80001: [{ address: "0x59108B6bdC157126bc44BbB5Ee13d365eA76C944" }],
  1: [{ address: "0x3aa510DC091980E3fDdEde457E7597BFd5d4d64C" }],
  137: [{ address: "0xf6Be6edD904440CdF89E31B2bC0503e8b57A2f6f" }],
};

const NFTContext = createContext<any>(null);

const NFTContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [NFTData, setNFTData] = useState<WhitelistNFTData>();
  const { account } = useAuth();

  const fetchTokenInfo = async () => {
    let array: WhitelistNFTData = {};
    for (let index = 0; index < Object.keys(NFT).length; index++) {
      const web3 = new Web3(
        supportNetwork[Number(Object.keys(NFT)[index])].rpc
      );
      const multicall = new Multicall({
        web3Instance: web3,
        tryAggregate: true,
      });
      const element = NFT[Number(Object.keys(NFT)[index])];
      const contractCallContext: ContractCallContext[] = element.map(
        (address) => ({
          reference: "testContract",
          contractAddress: address.address,
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              name: "balanceOf",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
          calls: [
            {
              reference: "balanceOf",
              methodName: "balanceOf",
              methodParameters: [account],
            },
          ],
        })
      );
      const results: ContractCallResults = await multicall.call(
        contractCallContext
      );

      array[Number(Object.keys(NFT)[index])] = {};
      element.forEach((address) => {
        array[Number(Object.keys(NFT)[index])][address.address] = {
          address: account || "",
          // @ts-ignore
          whitelisted:
            results.results.testContract.callsReturnContext[0].returnValues[0]
              .hex > 0,
        };
      });
    }
    setNFTData(array);
  };

  useEffect(() => {
    if (account) {
      setNFTData({});
      fetchTokenInfo();
    }
  }, [account]);

  return (
    <NFTContext.Provider value={{ NFTData }}>{children}</NFTContext.Provider>
  );
};

export const useNFTData = () => {
  const { NFTData } = useContext(NFTContext);
  return NFTData;
};

export default NFTContextProvider;
