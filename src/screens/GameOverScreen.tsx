import { ScreenState, GameState } from '../game/types';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';

export default function GameOverScreen({ setScreen, gameState }: { setScreen: (s: ScreenState) => void, gameState: GameState }) {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleRecordOnChain = async () => {
    if (!address) {
      alert("Please connect your wallet first.");
      return;
    }
    
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: `Record Chaos Loom Entropy Score: ${gameState.score.toFixed(0)}`,
        uri: window.location.origin,
        version: '1',
        chainId: chainId || 8453, // fallback to base
        nonce: Math.random().toString(36).substring(2, 10), // normally fetched from backend
      });

      const signature = await signMessageAsync({
        account: address as `0x${string}`,
        message: message.prepareMessage(),
      });

      console.log("SIWE Signature generated:", signature);
      alert("Glorious Chaos Recorded On-Chain! (Signature generated: " + signature.slice(0,10) + "...)");
      setScreen('LEADERBOARD');
    } catch (error) {
      console.error(error);
      alert("Failed to sign payload.");
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-[#0a0502] z-50">
      
      {/* Background glitch effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/40 via-black to-black z-0 pointer-events-none"></div>

      <div className="z-10 flex flex-col items-center max-w-sm w-full">
        <h1 className="text-5xl font-serif font-bold text-red-500 mb-2 tracking-tighter text-center" style={{ textShadow: '0 0 20px red' }}>
          LOOM COLLAPSED
        </h1>
        <p className="text-white/60 font-mono text-sm mb-8 text-center uppercase tracking-widest">Maximum Instability Reached</p>

        <div className="w-full bg-red-950/20 border border-red-500/30 rounded-3xl p-8 flex flex-col items-center mb-8 backdrop-blur-md">
          <p className="text-white/40 font-mono text-xs mb-2">FINAL ENTROPY SCORE</p>
          <p className="text-5xl font-mono font-bold text-white mb-6">
            {gameState.score.toFixed(0)}
          </p>
          
          <div className="w-full grid grid-cols-2 gap-4 text-center">
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 font-mono uppercase">Max Combo</span>
              <span className="text-lg font-bold text-[#ffaa77]">x{gameState.highestCombo.toFixed(1)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-white/40 font-mono uppercase">Instability</span>
              <span className="text-lg font-bold text-red-400">100%</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleRecordOnChain}
          className="w-full bg-gradient-to-r from-[#ff4e00] to-red-600 hover:from-[#ff6e00] hover:to-red-500 py-4 rounded-xl font-bold tracking-widest text-sm flex items-center justify-center gap-2 mb-4 shadow-[0_0_20px_rgba(255,78,0,0.4)]"
        >
          <Trophy size={18} />
          RECORD GLORIOUS CHAOS
        </button>

        <button 
          onClick={() => setScreen('GAME')}
          className="w-full border border-white/20 bg-white/5 hover:bg-white/10 py-4 rounded-xl font-bold tracking-widest text-sm text-white/60 hover:text-white transition-colors"
        >
          WEAVE AGAIN
        </button>
      </div>
    </div>
  );
}
