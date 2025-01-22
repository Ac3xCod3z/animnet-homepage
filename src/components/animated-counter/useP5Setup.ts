import p5 from 'p5';
import { Symbol } from './Symbol';

export const useP5Setup = (count: string) => {
  const createSketch = (p: p5) => {
    const symbols: Symbol[] = [];
    const symbolSize = 120;

    p.setup = () => {
      const canvas = p.createCanvas(400, 200);
      // Correctly set the parent element
      if (canvas.parent()) {
        canvas.parent(canvas.parent());
      }
      p.background(0, 0);
      p.textSize(symbolSize);
      p.textFont('Consolas');
      p.textAlign(p.CENTER, p.CENTER);

      // Create single symbol in the center
      const symbol = new Symbol(p, p.width / 2, p.height / 2, count);
      symbols.push(symbol);
    };

    p.draw = () => {
      p.clear();
      symbols.forEach(symbol => {
        symbol.render();
        symbol.update();
      });
    };
  };

  return createSketch;
};