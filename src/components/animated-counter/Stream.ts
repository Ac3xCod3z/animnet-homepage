import p5 from 'p5';
import { Symbol } from './Symbol';

export class Stream {
  symbols: Symbol[];
  totalSymbols: number;
  speed: number;

  constructor(
    p: p5,
    x: number,
    streamIndex: number,
    streams: Stream[],
    numberBounds: { minX: number; maxX: number; minY: number; maxY: number },
    symbolSize: number
  ) {
    this.speed = p.random(3, 7);
    this.totalSymbols = p.round(p.random(5, 35));
    this.symbols = [];

    for (let i = 0; i < this.totalSymbols; i++) {
      const first = i === 0;
      const symbol = new Symbol(
        p,
        x,
        (i * symbolSize) - (this.totalSymbols * symbolSize),
        this.speed,
        first,
        streamIndex,
        streams,
        numberBounds,
        symbolSize
      );
      this.symbols.push(symbol);
    }
  }

  render(targetImage: p5.Graphics) {
    this.symbols.forEach(symbol => {
      symbol.render(targetImage);
      symbol.update();
    });
  }

  startForming() {
    this.symbols.forEach((symbol, index) => {
      const targetX = symbol.x;
      const targetY = symbol.targetY + (index * symbol.speed) % (symbol.targetY * 2);
      symbol.startForming(targetX, targetY);
    });
  }

  propagateSymbol(value: string) {
    this.symbols.forEach((symbol, index) => {
      if (!symbol.first) {
        setTimeout(() => {
          symbol.value = value;
        }, index * 25);
      }
    });
  }
}