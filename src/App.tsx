import { useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { Sun } from 'lucide-react';
import { parseEther } from 'viem';
import { ScreenState, GameState } from './game/types';
import TitleScreen from './screens/TitleScreen';
import GameScreen from './screens/GameScreen';
import GameOverScreen from './screens/GameOverScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import CodexScreen from './screens/CodexScreen';
import WorkshopScreen from './screens/WorkshopScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('TITLE');
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    multiplier: 1,
    instability: 0,
    highestCombo: 0,
  });

  const { isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xc35B9997B63B1CE14f8F513f7eddD9a7ABbB33d7',
      data: '0x', // or maybe just a simple transaction, but we represent 'Say GM' action. Since the prompt didn't specify ABI, we send an empty tx or maybe a zero value tx if it's just meant as a "ping" to the address?  Actually, "calls the sendGMTransaction function" implies we just send a zero-value tx to the address on base.
      value: parseEther('0'),
    });
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-[#0a0502] text-white flex flex-col font-sans overflow-hidden">
      {isConnected && (
        <div className="absolute top-4 left-4 z-50">
          <button 
            onClick={sendGMTransaction}
            className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
          >
            <Sun className="w-4 h-4" />
            Say GM
          </button>
        </div>
      )}
      {currentScreen === 'TITLE' && <TitleScreen setScreen={setCurrentScreen} />}
      {currentScreen === 'GAME' && <GameScreen setScreen={setCurrentScreen} gameState={gameState} setGameState={setGameState} />}
      {currentScreen === 'GAMEOVER' && <GameOverScreen setScreen={setCurrentScreen} gameState={gameState} />}
      {currentScreen === 'LEADERBOARD' && <LeaderboardScreen setScreen={setCurrentScreen} />}
      {currentScreen === 'CODE' && <CodexScreen setScreen={setCurrentScreen} />}
      {currentScreen === 'WORKSHOP' && <WorkshopScreen setScreen={setCurrentScreen} />}
    </div>
  );
}
