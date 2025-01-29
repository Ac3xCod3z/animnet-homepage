export interface Position {
  x: number;
  y: number;
}

export interface Player extends Position {
  size: number;
  speed: number;
  direction: number; // 0: right, 1: down, 2: left, 3: up
  mouthOpen: boolean;
}

export interface Ghost extends Position {
  color: number[];
  direction: number;
}

export interface GameState {
  player: Player;
  ghosts: Ghost[];
  dots: Position[];
  score: number;
  totalDots: number;
  gameStarted: boolean;
}