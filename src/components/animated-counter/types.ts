import p5 from 'p5';

export interface AnimatedCounterProps {
  count: string;
}

export interface SymbolProps {
  x: number;
  y: number;
  speed: number;
  first: boolean;
  streamIndex: number;
  p: p5;
}

export interface StreamProps {
  x: number;
  streamIndex: number;
  p: p5;
}