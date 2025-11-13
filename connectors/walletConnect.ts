import { createPublicClient, http } from "viem";
import { Chain, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { getWagmiNetwork } from "utils/configUtils";

const wagmiNetwork = getWagmiNetwork();

const monadChain = {
  id: 10143,
  name: "Monad",
  network: "monad",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
    public: { http: ["https://testnet-rpc.monad.xyz"] },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" },
  },
  contracts: {},
  testnet: true,
} as const satisfies Chain;

export const viemClient = createPublicClient({
  chain: monadChain,
  transport: http(),
});

const customChains = [monadChain];
const { publicClient, chains } = configureChains(customChains, [
  publicProvider(),
]);
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
    }),
  ],
  publicClient,
});
