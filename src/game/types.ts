export type ScreenState = 'TITLE' | 'GAME' | 'CODE' | 'LEADERBOARD' | 'WORKSHOP' | 'GAMEOVER';

export interface GameState {
  score: number;
  multiplier: number;
  instability: number;
  highestCombo: number;
}
