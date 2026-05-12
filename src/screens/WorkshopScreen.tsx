import { ScreenState } from '../game/types';
import { ArrowLeft } from 'lucide-react';
import { useAccount, useSendTransaction, useSignMessage } from 'wagmi';
import { generateAttributedTransactionPayload } from '../lib/erc8021/utils';
import { delegateToAgent } from '../lib/erc8004/utils';

export default function WorkshopScreen({ setScreen }: { setScreen: (s: ScreenState) => void }) {
  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const { signMessage } = useSignMessage();

  const handleSayGM = () => {
    if (!isConnected) return alert('Connect wallet first!');
    
    // Example transaction utilizing ERC-8021
    const tx = generateAttributedTransactionPayload({
      to: '0x0000000000000000000000000000000000000000', // Burn address for GM dummy tx
      value: 0n,
      data: '0x', // normally encoded GM data
    }, "say_gm");
    
    console.log("Sending attributed TX:", tx);
    
    sendTransaction(tx as any);
  };

  const handleDelegateAgent = () => {
    if (!isConnected) return alert('Connect wallet first!');
    const task = delegateToAgent('auto_weave_surplus', { riskThreshold: 0.8 });
    alert(`Delegated task to agent: ${task.action} (Status: ${task.status})`);
  };

  return (
    <div className="relative w-full h-full flex flex-col p-6 overflow-y-auto z-10 bg-[#050505]">
      <button onClick={() => setScreen('TITLE')} className="absolute top-6 left-6 p-2 rounded-full bg-white/10">
        <ArrowLeft size={20} />
      </button>
      
      <h2 className="text-3xl font-serif text-[#ffaa77] mt-16 mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa77] to-[#ff4e00]">LOOM WORKSHOP</h2>
      
      <div className="space-y-6 max-w-md mx-auto w-full">
        {/* On-Chain Interactions */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="font-mono text-xs text-white/50 uppercase tracking-widest mb-4">On-Chain Actions (Base)</h3>
          
          <button 
            onClick={handleSayGM}
            className="w-full mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 py-4 rounded-xl font-bold tracking-wide transition-all active:scale-95 shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-blue-400/20"
          >
            "SAY GM" & BURN CHAOS
          </button>

          <p className="text-[10px] text-white/40 text-center font-mono mt-2">Includes ERC-8021 Attribution</p>
        </section>

        {/* ERC-8004 Agent */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="font-mono text-xs text-white/50 uppercase tracking-widest mb-4">Trustless Weaving (ERC-8004)</h3>
          <p className="text-sm text-white/70 mb-4 font-sans leading-relaxed">
            Delegate excess entropy generation to an autonomous smart agent. It will play idle patterns to generate base score while you are offline.
          </p>
          <button 
            onClick={handleDelegateAgent}
            className="w-full bg-[#151515] border border-green-500/30 text-green-400 hover:bg-[#1a1a1a] py-3 rounded-xl font-mono text-sm tracking-wide transition-all active:scale-95"
          >
            AUTHORIZE AUTO-WEAVER AGENT
          </button>
        </section>

        {/* Upgrades placeholder */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 opacity-50">
          <h3 className="font-mono text-xs text-white/50 uppercase tracking-widest mb-4">Loom Upgrades</h3>
          <div className="text-center text-sm py-4">Locked. Reach 10k Entropy to unlock.</div>
        </section>
      </div>
    </div>
  );
}
