import React, { useEffect, useRef, useState } from 'react';
import { ScreenState, GameState } from '../game/types';
import { LoomEngine } from '../game/LoomEngine';
import { motion, AnimatePresence } from 'motion/react';

export default function GameScreen({ 
  setScreen, 
  gameState, 
  setGameState 
}: { 
  setScreen: (s: ScreenState) => void,
  gameState: GameState,
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<LoomEngine | null>(null);
  const requestRef = useRef<number>();
  
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const engine = new LoomEngine();
    engineRef.current = engine;
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      engine.resize(canvas.width, canvas.height);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    engine.init(canvas.width, canvas.height);

    let lastTime = 0;
    const gameLoop = (time: number) => {
      // Assuming 60fps fixed step for simplicity
      engine.update();
      engine.draw(ctx);
      
      setGameState({
        score: engine.score,
        multiplier: engine.multiplier,
        instability: Math.min(100, engine.instability),
        highestCombo: engine.highestCombo
      });

      if (engine.instability >= 100) {
        // trigger game over
        setScreen('GAMEOVER');
        return; // stop loop
      }

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [setScreen, setGameState]);

  // Input Handling
  const handlePointerDown = (e: React.PointerEvent) => {
    setTouchStart({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (touchStart && engineRef.current) {
       engineRef.current.fling(touchStart.x, touchStart.y, e.clientX, e.clientY);
       // Haptic feedback if supported
       if (navigator.vibrate) navigator.vibrate(50);
    }
    setTouchStart(null);
  };

  const isFinalFrenzy = gameState.instability > 85;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black touch-none">
      <canvas 
        ref={canvasRef} 
        className={`absolute inset-0 w-full h-full touch-none ${isFinalFrenzy ? 'animate-pulse' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      />
      
      {/* HUD overlays */}
      <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start pointer-events-none">
        
        {/* Score & Combo */}
        <div className="flex flex-col">
          <div className="font-mono text-xs text-white/50 mb-1 tracking-widest uppercase">Entropy</div>
          <div className="font-mono text-3xl font-bold tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {gameState.score.toFixed(0)}
          </div>
          <AnimatePresence>
            {gameState.multiplier > 1.5 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="mt-1 font-sans text-xl font-black italic text-[#ffaa77]"
              >
                x{gameState.multiplier.toFixed(1)} COMBO!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instability Bar */}
        <div className="flex flex-col items-end w-48">
          <div className="font-mono text-[10px] text-white/50 mb-2 tracking-widest uppercase flex w-full justify-between">
            <span>Instability</span>
            <span className={isFinalFrenzy ? 'text-red-500 animate-pulse' : ''}>
              {gameState.instability.toFixed(0)}%
            </span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${isFinalFrenzy ? 'bg-red-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
              style={{ width: `${Math.min(100, Math.max(0, gameState.instability))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {isFinalFrenzy && (
        <div className="absolute inset-x-0 top-32 flex justify-center pointer-events-none">
           <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.5, direction: "alternate" }}
              className="text-red-500 font-bold tracking-[0.5em] text-sm bg-red-500/10 border border-red-500/30 px-6 py-2 rounded-full"
           >
              WARNING: LOOM COLLAPSE IMMINENT
           </motion.div>
        </div>
      )}
    </div>
  );
}
