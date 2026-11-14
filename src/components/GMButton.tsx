import { useState, useEffect } from 'react';
import {
  useSendTransaction,
  useAccount,
  useSendCalls,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useCallsStatus,
} from 'wagmi';
import { Sun, Loader2, Check } from 'lucide-react';
import { parseEther } from 'viem';
import { useWalletCapabilities } from '../hooks/useWalletCapabilities';
import { base } from 'wagmi/chains';
import { BASE_DENIM_BLOCK_TIME_MS } from '../lib/baseDenim';
import { ERC8021_DATA_SUFFIX } from '../lib/erc8021/utils';

const GM_TARGET_ADDRESS = '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7' as `0x${string}`;

export function GMButton({ className }: { className?: string }) {
  const { isConnected, chainId } = useAccount();
  const { supportsBatching } = useWalletCapabilities();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const {
    sendTransaction,
    data: txHash,
    isPending: isSendingTx,
    reset: resetTx,
  } = useSendTransaction();
  const {
    sendCalls,
    data: callsResult,
    isPending: isSendingCalls,
    reset: resetCalls,
  } = useSendCalls();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const callsId = callsResult?.id;

  const { data: receipt, isLoading: isConfirmingTx } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: base.id,
    pollingInterval: BASE_DENIM_BLOCK_TIME_MS,
  });

  const { data: callsStatus } = useCallsStatus({
    id: callsId as string,
    query: {
      enabled: Boolean(callsId),
      refetchInterval: (query) =>
        query.state.data?.status === 'success' || query.state.data?.status === 'failure'
          ? false
          : BASE_DENIM_BLOCK_TIME_MS,
    },
  });

  const isCallsConfirming = Boolean(callsId) && callsStatus?.status === 'pending';
  const isConfirmed =
    Boolean(receipt?.blockNumber) || callsStatus?.status === 'success';
  const confirmedBlockNumber =
    receipt?.blockNumber ?? callsStatus?.receipts?.[0]?.blockNumber;

  useEffect(() => {
    if (!isConfirmed) return;
    const timer = window.setTimeout(() => {
      resetTx();
      resetCalls();
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [isConfirmed, resetTx, resetCalls]);

  if (!isConnected) return null;

  const isWrongChain = chainId !== base.id;
  const isBusy = isSwitching || isSendingTx || isSendingCalls || isConfirmingTx || isCallsConfirming;

  const handleSendGM = async () => {
    setErrorMsg(null);
    try {
      if (isWrongChain) {
        await switchChainAsync({ chainId: base.id });
      }

      if (supportsBatching && sendCalls) {
        sendCalls({
          chainId: base.id,
          calls: [
            {
              to: GM_TARGET_ADDRESS,
              data: ERC8021_DATA_SUFFIX,
              value: parseEther('0'),
            },
          ],
          capabilities: {
            dataSuffix: {
              value: ERC8021_DATA_SUFFIX,
              optional: true,
            },
          },
        });
      } else {
        sendTransaction({
          chainId: base.id,
          to: GM_TARGET_ADDRESS,
          data: ERC8021_DATA_SUFFIX,
          value: parseEther('0'),
        });
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Transaction rejected');
    }
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleSendGM}
        disabled={isBusy}
        className={
          className ||
          "px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 disabled:opacity-60 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold shadow-lg"
        }
      >
        {isBusy ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isConfirmed ? (
          <Check className="w-4 h-4 text-[#00ffaa]" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
        {isSwitching
          ? 'Switching to Base...'
          : isSendingTx || isSendingCalls
            ? 'Sign GM...'
            : isConfirmingTx || isCallsConfirming
              ? 'Confirming...'
              : isConfirmed
                ? confirmedBlockNumber
                  ? `GM #${confirmedBlockNumber.toString()}`
                  : 'GM Confirmed'
                : isWrongChain
                  ? 'Switch to Base & GM'
                  : 'Say GM'}
      </button>
      {errorMsg && (
        <span className="text-[10px] font-mono text-red-400 max-w-[200px] truncate">
          {errorMsg}
        </span>
      )}
    </div>
  );
}
