import { ScreenState } from '../game/types';
import { ArrowLeft } from 'lucide-react';

export default function LeaderboardScreen({ setScreen }: { setScreen: (s: ScreenState) => void }) {
  const topScores = [
    { rank: 1, address: '0x1A2B...3c4D', score: 1420580, combo: 14.5 },
    { rank: 2, address: '0x9E8D...aa11', score: 985100, combo: 11.2 },
    { rank: 3, address: '0x5F66...be20', score: 712000, combo: 9.8 },
    { rank: 4, address: '0x33A1...440C', score: 550400, combo: 8.0 },
    { rank: 5, address: '0x7C22...dd99', score: 480100, combo: 7.5 },
  ];

  return (
    <div className="relative w-full h-full flex flex-col p-6 overflow-y-auto z-10 bg-[#050505]">
      <button onClick={() => setScreen('TITLE')} className="absolute top-6 left-6 p-2 rounded-full border border-white/10 bg-white/5">
        <ArrowLeft size={20} />
      </button>

      <h2 className="text-3xl font-serif text-[#ffaa77] mt-16 mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa77] to-white">MASTERS OF ENTROPY</h2>
      <p className="text-center font-mono text-xs text-white/40 uppercase tracking-widest mb-10">On-Chain Hybrid Leaderboard</p>

      <div className="w-full max-w-md mx-auto space-y-3">
        {/* Header row */}
        <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-mono text-white/40 uppercase tracking-wider mb-2 border-b border-white/10">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-5">Weaver</div>
          <div className="col-span-5 text-right">Entropy</div>
        </div>

        {/* Data rows */}
        {topScores.map((row) => (
          <div 
            key={row.rank} 
            className="grid grid-cols-12 items-center px-4 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className={`col-span-2 text-center font-mono font-bold ${row.rank === 1 ? 'text-[#ffaa77] text-xl drop-shadow-[0_0_10px_rgba(255,170,119,0.5)]' : 'text-white/60'}`}>
              #{row.rank}
            </div>
            <div className="col-span-5 flex flex-col">
              <span className="font-mono text-sm text-white/90">{row.address}</span>
            </div>
            <div className="col-span-5 flex flex-col items-end">
              <span className="font-mono font-bold text-[#ffaa77]">{row.score.toLocaleString()}</span>
              <span className="text-[10px] text-white/40 font-mono">Max x{row.combo.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
