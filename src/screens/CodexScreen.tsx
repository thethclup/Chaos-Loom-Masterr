import { ScreenState } from '../game/types';
import { ArrowLeft } from 'lucide-react';

export default function CodexScreen({ setScreen }: { setScreen: (s: ScreenState) => void }) {
  const mutations = [
    { name: 'Void Thread', desc: 'Absorbs nearby threads, destroying them but massive points.', rarity: 'Rare', color: 'bg-purple-900' },
    { name: 'Neon Splinter', desc: 'Splits upon collision, creating 3 hyper-fast shards.', rarity: 'Uncommon', color: 'bg-cyan-400' },
    { name: 'Entropy Bomb', desc: 'Causes a massive chain reaction, highly destabilizing.', rarity: 'Legendary', color: 'bg-orange-500' },
  ];

  return (
    <div className="relative w-full h-full flex flex-col p-6 overflow-y-auto z-10 bg-[#0a0a0a]">
      <button onClick={() => setScreen('TITLE')} className="absolute top-6 left-6 p-2 rounded-full border border-white/10 bg-white/5">
        <ArrowLeft size={20} />
      </button>

      <h2 className="text-3xl font-serif text-white mt-16 mb-8 text-center tracking-widest">ENTROPY CODEX</h2>

      <div className="space-y-4 max-w-md mx-auto w-full">
        {mutations.map((mut, i) => (
          <div key={i} className="flex bg-[#111] border border-[#222] rounded-2xl p-4 gap-4 items-center">
            <div className={`w-12 h-12 rounded-full ${mut.color} flex-shrink-0 shadow-[0_0_10px_currentColor]`} style={{ boxShadow: '0 0 15px var(--tw-bg-opacity, 1)'}}></div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold font-sans text-lg">{mut.name}</h3>
                <span className="text-[10px] font-mono border border-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">{mut.rarity}</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{mut.desc}</p>
            </div>
          </div>
        ))}

        <div className="mt-12 text-center p-8 border border-dashed border-white/10 rounded-3xl">
          <p className="text-white/30 font-mono text-sm">Discover more mutations by spinning the loom...</p>
        </div>
      </div>
    </div>
  );
}
