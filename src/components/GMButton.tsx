import { useSendTransaction, useAccount, useSendCalls } from 'wagmi';
import { Sun } from 'lucide-react';
import { parseEther } from 'viem';
import { useWalletCapabilities } from '../hooks/useWalletCapabilities';
import { base } from 'wagmi/chains';

export function GMButton({ className }: { className?: string }) {
  const { isConnected } = useAccount();
  const { supportsBatching } = useWalletCapabilities();
  const { sendTransaction } = useSendTransaction();
  const { sendCalls } = useSendCalls();

  if (!isConnected) return null;

  const handleSendGM = () => {
    const targetData = '0x07626173656170700080218021802180218021802180218021' as `0x${string}`;
    const targetAddress = '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7' as `0x${string}`;

    if (supportsBatching && sendCalls) {
      sendCalls({
        calls: [
          {
            to: targetAddress,
            data: targetData,
            value: parseEther('0'),
          }
        ],
        capabilities: {
          dataSuffix: {
            value: '0x07626173656170700080218021802180218021802180218021',
            optional: true
          }
        }
      });
    } else {
      sendTransaction({
        to: targetAddress,
        data: targetData,
        value: parseEther('0'),
      });
    }
  };

  return (
    <button 
      onClick={handleSendGM}
      className={className || "px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold shadow-lg"}
    >
      <Sun className="w-4 h-4" />
      Say GM
    </button>
  );
}
