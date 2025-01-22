import p5 from 'p5';
import { Symbol } from './Symbol';

export const useP5Setup = (count: string) => {
  const createSketch = (p: p5) => {
    const symbols: Symbol[] = [];
    const symbolSize = 180;
    let previousCount = count;
    let transitioning = false;

    const createNumberSymbols = (num: string, forming: boolean = true) => {
      const x = p.width / 2;
      const y = p.height / 2;
      return new Symbol(p, x, y, num, forming);
    };

    p.setup = () => {
      const canvas = p.createCanvas(400, 400);
      if (canvas.parent()) {
        canvas.parent(canvas.parent());
      }
      p.background(0, 0);
      p.textSize(symbolSize);
      p.textFont('Consolas');
      p.textAlign(p.CENTER, p.CENTER);

      // Create initial symbol
      symbols.push(createNumberSymbols(count));
    };

    p.draw = () => {
      p.clear();
      p.background(0, 150);

      // Update and render all symbols
      for (let i = symbols.length - 1; i >= 0; i--) {
        const symbol = symbols[i];
        const shouldRemove = symbol.update();
        symbol.render();

        if (shouldRemove) {
          symbols.splice(i, 1);
        }
      }

      // Check for count changes
      if (previousCount !== count && !transitioning) {
        transitioning = true;
        // Make current symbols dissipate
        symbols.forEach(symbol => symbol.startDissipating());
        // Create new symbols for the new number
        symbols.push(createNumberSymbols(count));
        previousCount = count;
        setTimeout(() => {
          transitioning = false;
        }, 1000);
      }
    };
  };

  return createSketch;
};