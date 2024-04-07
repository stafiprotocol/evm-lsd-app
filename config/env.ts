import { getTokenName } from "utils/configUtils";
import appConfig from "./appConf/app.json";
import appDevConfig from "./appConf/dev.json";
import appProdConfig from "./appConf/prod.json";
import { getLsdTokenContract } from "./contract";
import { getExplorerUrl } from "./explorer";

export function isDev() {
  return process.env.NEXT_PUBLIC_ENV !== "production";
}

export function isNativeToken() {
  return appConfig.token.isNative === undefined || !!appConfig.token.isNative;
}

export function getEvmChainId() {
  if (isDev()) {
    return appDevConfig.chain.id;
  }
  return appProdConfig.chain.id;
}

export function getEvmChainName() {
  if (isDev()) {
    return appDevConfig.chain.name;
  }
  return appProdConfig.chain.name;
}

export function getEvmRpc() {
  if (isDev()) {
    return appDevConfig.rpc;
  }
  return appProdConfig.rpc;
}

export function getLsdTokenMetamaskParam() {
  return {
    tokenAddress: getLsdTokenContract(),
    tokenSymbol: appConfig.token.lsdTokenName,
    tokenDecimals: appConfig.token.tokenDecimals,
    tokenImage: appConfig.token.lsdTokenIconUri,
  };
}

export function getWagmiChainConfig() {
  return {
    id: getEvmChainId(),
    name: getEvmChainName(),
    network: getEvmChainName(),
    nativeCurrency: {
      decimals: 18,
      name: getTokenName(),
      symbol: getTokenName(),
    },
    rpcUrls: {
      default: {
        http: [getEvmRpc()],
      },
      public: {
        http: [getEvmRpc()],
      },
    },
    blockExplorers: {
      etherscan: {
        name: "",
        url: getExplorerUrl(),
      },
      default: {
        name: "",
        url: getExplorerUrl(),
      },
    },
    contracts: {},
    testnet: isDev(),
  };
}
