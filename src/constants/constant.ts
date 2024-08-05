export const trimAddress = (addr: string) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};
export const contract: Record<string | number, any> = {
  80001: {
    subgraph:
      "https://api.thegraph.com/subgraphs/name/martianatwork/derma-doom",
  },
  1: {
    subgraph:
      "https://api.thegraph.com/subgraphs/name/adminbipzy/bipzy-mainnet",
  },
  137: {
    subgraph:
      "https://api.thegraph.com/subgraphs/name/adminbipzy/bipzy-polygon",
  },
  42161: {
    subgraph:
      "https://api.thegraph.com/subgraphs/name/adminbipzy/bipzy-arbitrum",
  },
  56: {
    subgraph: "https://api.thegraph.com/subgraphs/name/adminbipzy/bipzy-bsc",
  },
  default: {
    subgraph: "https://api.thegraph.com/subgraphs/name/adminbipzy/bipzy-bsc",
  },
};
