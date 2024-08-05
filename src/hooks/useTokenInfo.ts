import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import erc20abi from "src/ABIs/ERC20/ERC20ABI.json";
import erc721abi from "src/ABIs/ERC721/ERC721ABI.json";
import uniswapV2abi from "src/ABIs/UniswapV2/UniswapV2.json";
import { toast } from "react-toastify";

const useTokenInfo = ({
  tokenAddress,
  ethereum,
}: {
  tokenAddress: string;
  ethereum?: any;
}) => {
  const [isLPToken, setIsLPToken] = useState(false);
  const [LPtokenInfo, setLPtokenInfo] = useState({
    token0: "",
    token1: "",
  });
  const [pair, setPair] = useState("");
  const [contractInfo, setContractInfo] = useState({
    address: "",
    tokenName: "",
    tokenSymbol: "",
    totalSupply: "",
    decimals: "",
  });
  const [error, setError] = useState("");
  const [balanceInfo, setBalanceInfo] = useState({
    address: "",
    balance: "",
  });

  const [erc721Info, seterc721Info] = useState({
    name: "",
    balance: "0",
  });

  const fetchTokenBalance = async () => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const erc20 = new ethers.Contract(tokenAddress, erc20abi, provider);
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();
        const balance = await erc20.balanceOf(signerAddress);
        setBalanceInfo({
          address: signerAddress,
          balance: String(balance),
        });
      }
    } catch (err) {
      setBalanceInfo({
        address: "",
        balance: "",
      });
    }
  };
  const fetchERC721TokenBalance = async () => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const erc721 = new ethers.Contract(tokenAddress, erc721abi, provider);
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();
        const name = await erc721.name();
        const balance = await erc721.balanceOf(signerAddress);
        seterc721Info({
          name: name,
          balance: String(balance),
        });
      } else {
        seterc721Info({
          name: "",
          balance: "0",
        });
      }
    } catch (err) {
      seterc721Info({
        name: "",
        balance: "0",
      });
    }
  };

  const fetchtokenDetail = async () => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const erc20 = new ethers.Contract(tokenAddress, erc20abi, provider);
        const tokenName = await erc20.name();
        const tokenSymbol = await erc20.symbol();
        const totalSupply = await erc20.totalSupply();
        const decimals = await erc20.decimals();

        setContractInfo({
          address: tokenAddress,
          tokenName,
          tokenSymbol,
          totalSupply,
          decimals,
        });
        setError("");
      }
    } catch (err) {
      setContractInfo({
        address: "",
        tokenName: "",
        tokenSymbol: "",
        totalSupply: "",
        decimals: "",
      });
      setError("Invalid Address");
    }
  };

  const LPTokenBalanceFetcher = async () => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const uniswap = new ethers.Contract(
          tokenAddress,
          uniswapV2abi,
          provider
        );
        const signer = await provider.getSigner();
        const signerAddress = await signer.getAddress();
        const balance = await uniswap.balanceOf(signerAddress);
        setBalanceInfo({
          address: signerAddress,
          balance: String(balance),
        });
      }
    } catch (err) {
      toast.error("something went wrong");
    }
  };

  const fetchLPTokenDetail = async () => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const uniswap = new ethers.Contract(
          tokenAddress,
          uniswapV2abi,
          provider
        );
        const token0 = await uniswap.token0();
        const token1 = await uniswap.token1();
        setLPtokenInfo({
          token0: token0,
          token1: token1,
        });
        setIsLPToken(true);
      }
    } catch (err) {
      setIsLPToken(false);
    }
  };

  const PairFetcher = async (address0: string, address1: string) => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const erc20token0 = new ethers.Contract(address0, erc20abi, provider);
        const erc20token1 = new ethers.Contract(address1, erc20abi, provider);
        const tokenSymbol0 = await erc20token0.symbol();
        const tokenSymbol1 = await erc20token1.symbol();
        setPair(`${tokenSymbol0} / ${tokenSymbol1}`);
      }
    } catch (err) {
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    if (isLPToken) {
      PairFetcher(LPtokenInfo.token0, LPtokenInfo.token1);
      LPTokenBalanceFetcher();
    }
  }, [isLPToken, tokenAddress]);

  return {
    address: contractInfo.address,
    tokenName: contractInfo.tokenName,
    tokenSymbol: contractInfo.tokenSymbol,
    totalSupply: contractInfo.totalSupply,
    decimals: contractInfo.decimals,
    fetchTokenError: error,
    tokenBalance: balanceInfo.balance,
    fetchtokenDetail,
    fetchTokenBalance,
    fetchLPTokenDetail,
    erc721Info: erc721Info,
    fetchERC721TokenBalance,
    isLPToken: isLPToken,
    pair: pair,
  };
};

export default useTokenInfo;
