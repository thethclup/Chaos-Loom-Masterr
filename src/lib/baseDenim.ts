/// <reference types="vite/client" />
import { base } from 'wagmi/chains';

/**
 * Base Mainnet (Denim upgrade, 200ms canonical blocks).
 * Flashblocks, pending block-tag preconfirmations, and flashblock_index predicates
 * are retired; all reads and receipts resolve against canonical 200ms blocks.
 */
export const BASE_MAINNET_CHAIN = base;
export const BASE_MAINNET_CHAIN_ID = base.id; // 8453
export const BASE_DENIM_BLOCK_TIME_MS = 200;
export const BASE_CANONICAL_BLOCK_TAG = 'latest' as const;

export const BASE_MAINNET_RPC_URL =
  import.meta.env.VITE_BASE_MAINNET_RPC_URL || 'https://mainnet.base.org';

const rawWsUrl = import.meta.env.VITE_BASE_MAINNET_WS_URL || '';
// Never connect to retired Flashblocks WebSocket endpoints
export const BASE_MAINNET_WS_URL = rawWsUrl.includes('flashblocks.base.org')
  ? ''
  : rawWsUrl;

export const BASE_MAINNET_EXPLORER_URL = 'https://basescan.org';

export function getBaseScanTxUrl(txHash: string): string {
  return `${BASE_MAINNET_EXPLORER_URL}/tx/${txHash}`;
}
