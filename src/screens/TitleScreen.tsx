import { motion } from 'motion/react';
import { ScreenState } from '../game/types';
import { useAccount, useConnect } from 'wagmi';

export default function TitleScreen({ setScreen }: { setScreen: (s: ScreenState) => void }) {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] bg-[#ff4e00] rounded-full mix-blend-screen filter blur-[80px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-[#8a2be2] rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
      </div>

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="z-10 text-center mb-12 flex flex-col items-center"
      >
        <h1 className="font-['Playfair_Display',_serif] text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-[#ffaa77] to-[#ff4e00] tracking-tighter leading-none mb-2 drop-shadow-[0_0_20px_rgba(255,78,0,0.5)]">
          CHAOS
          <br />
          LOOM
        </h1>
        <p className="font-mono text-sm sm:text-base text-[#ff4e00] tracking-[0.3em] uppercase opacity-80 mt-4">
          Master the Entropy
        </p>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="z-10 flex flex-col gap-4 w-64"
      >
        <button 
          onClick={() => setScreen('GAME')}
          className="relative group overflow-hidden rounded-full p-[1px]"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[#ff4e00] to-[#8a2be2] rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-300 blur-[2px]"></span>
          <div className="relative bg-black/80 backdrop-blur-md px-8 py-4 rounded-full border border-white/10 flex items-center justify-center">
            <span className="font-sans font-bold text-lg tracking-wider text-white">ENTER THE LOOM</span>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <MenuButton onClick={() => setScreen('CODE')} label="CODEX" />
          <MenuButton onClick={() => setScreen('WORKSHOP')} label="WORKSHOP" />
          <MenuButton onClick={() => setScreen('LEADERBOARD')} label="MASTERS" className="col-span-2" />
        </div>

        <div className="mt-8 flex flex-col items-center gap-2">
          {!isConnected ? (
            <button 
              onClick={() => connect({ connector: connectors[0] })}
              className="text-xs font-mono text-white/50 hover:text-white transition-colors uppercase border border-white/10 px-4 py-2 rounded-full"
            >
              Connect Wallet (Base)
            </button>
          ) : (
            <div className="text-xs font-mono text-[#00ffaa] border border-[#00ffaa]/20 bg-[#00ffaa]/5 px-4 py-2 rounded-full flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-[#00ffaa] animate-pulse"></span>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function MenuButton({ onClick, label, className = '' }: { onClick: () => void, label: string, className?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl transition-all duration-200 active:scale-95 flex items-center justify-center ${className}`}
    >
      <span className="font-sans text-xs font-semibold tracking-widest text-white/80">{label}</span>
    </button>
  );
}
