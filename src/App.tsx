import { useState } from 'react';
import { Providers } from './components/Providers';
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

  return (
    <Providers>
      <div className="fixed inset-0 w-full h-full bg-[#0a0502] text-white flex flex-col font-sans overflow-hidden">
        {currentScreen === 'TITLE' && <TitleScreen setScreen={setCurrentScreen} />}
        {currentScreen === 'GAME' && <GameScreen setScreen={setCurrentScreen} gameState={gameState} setGameState={setGameState} />}
        {currentScreen === 'GAMEOVER' && <GameOverScreen setScreen={setCurrentScreen} gameState={gameState} />}
        {currentScreen === 'LEADERBOARD' && <LeaderboardScreen setScreen={setCurrentScreen} />}
        {currentScreen === 'CODE' && <CodexScreen setScreen={setCurrentScreen} />}
        {currentScreen === 'WORKSHOP' && <WorkshopScreen setScreen={setCurrentScreen} />}
      </div>
    </Providers>
  );
}
