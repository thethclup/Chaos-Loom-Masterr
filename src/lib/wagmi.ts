import { http, webSocket, fallback, createConfig } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected, coinbaseWallet } from 'wagmi/connectors'
import {
  BASE_DENIM_BLOCK_TIME_MS,
  BASE_MAINNET_RPC_URL,
  BASE_MAINNET_WS_URL,
} from './baseDenim'

const baseMainnetTransport = BASE_MAINNET_WS_URL
  ? fallback([webSocket(BASE_MAINNET_WS_URL), http(BASE_MAINNET_RPC_URL)])
  : http(BASE_MAINNET_RPC_URL)

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: 'Chaos Loom Master',
      preference: 'smartWalletOnly',
    }),
  ],
  pollingInterval: BASE_DENIM_BLOCK_TIME_MS,
  ssr: true,
  transports: {
    [base.id]: baseMainnetTransport,
  },
})
