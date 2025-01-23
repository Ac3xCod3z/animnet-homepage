import p5 from 'p5';

export interface SymbolState {
  value: string;
  opacity: number;
  isForming: boolean;
  lastUpdate: number;
}

export interface SymbolPosition {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

export interface SymbolConfig {
  speed: number;
  first: boolean;
  updateInterval: number;
  streamIndex: number;
}