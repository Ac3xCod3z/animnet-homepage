import p5 from 'p5';
import { Symbol } from './Symbol';
import { StreamProps } from './types';

export class Stream {
  symbols: Symbol[];
  totalSymbols: number;
  speed: number;
  private p: p5;

  constructor({ x, streamIndex, p }: StreamProps) {
    this.p = p;
    this.speed = this.p.random(3, 7);
    this.totalSymbols = this.p.round(this.p.random(5, 35));
    this.symbols = [];

    const symbolSize = 14;
    for (let i = 0; i < this.totalSymbols; i++) {
      const first = i === 0;
      const symbol = new Symbol({
        x,
        y: (i * symbolSize) - (this.totalSymbols * symbolSize),
        speed: this.speed,
        first,
        streamIndex,
        p: this.p
      });
      this.symbols.push(symbol);
    }
  }

  render(targetImage: p5.Graphics, formationStarted: boolean, numberBounds: any, streams: Stream[], symbolSize: number) {
    this.symbols.forEach(symbol => {
      symbol.render(targetImage, formationStarted);
      symbol.update(formationStarted, numberBounds, streams, symbolSize);
    });
  }

  startForming(numberBounds: any, symbolSize: number) {
    this.symbols.forEach((symbol, index) => {
      const targetX = symbol.x;
      const targetY = numberBounds.minY + (index * symbolSize) % (numberBounds.maxY - numberBounds.minY);
      symbol.startForming(targetX, targetY);
    });
  }
}