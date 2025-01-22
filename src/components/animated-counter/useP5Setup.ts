import p5 from 'p5';
import { Symbol } from './Symbol';

export const useP5Setup = (count: string) => {
  const createSketch = (p: p5) => {
    const symbols: Symbol[] = [];
    const symbolSize = 14;
    let previousCount = count;
    let transitioning = false;
    const numberBounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    const createNumberSymbols = (x: number, y: number, streamIndex: number) => {
      return new Symbol(
        p,
        x,
        y,
        p.random(3, 7), // speed
        true, // first
        streamIndex,
        symbols as any[], // streams - we'll type this as any[] since we're not using stream functionality here
        numberBounds,
        symbolSize
      );
    };

    p.setup = () => {
      const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
      // Fix: Use the canvas's parent element directly
      if (canvas.elt.parentElement) {
        canvas.parent(canvas.elt.parentElement);
      }
      
      p.background(0, 0);
      p.textSize(symbolSize);
      p.textFont('Consolas');
      p.textAlign(p.CENTER, p.CENTER);

      // Create initial symbols
      const streamSpacing = symbolSize * 1.2;
      const streamCount = Math.floor(p.width / streamSpacing);
      
      for (let i = 0; i < streamCount; i++) {
        const x = i * streamSpacing;
        const y = -symbolSize;
        symbols.push(createNumberSymbols(x, y, i));
      }
    };

    p.draw = () => {
      p.clear();
      p.background(0, 150);

      // Update and render all symbols
      for (let i = symbols.length - 1; i >= 0; i--) {
        const symbol = symbols[i];
        symbol.update();
        symbol.render(p.createGraphics(p.width, p.height));
      }

      // Check for count changes
      if (previousCount !== count && !transitioning) {
        transitioning = true;
        // Reset symbols for the new number
        symbols.length = 0;
        const streamSpacing = symbolSize * 1.2;
        const streamCount = Math.floor(p.width / streamSpacing);
        
        for (let i = 0; i < streamCount; i++) {
          const x = i * streamSpacing;
          const y = -symbolSize;
          symbols.push(createNumberSymbols(x, y, i));
        }
        
        previousCount = count;
        setTimeout(() => {
          transitioning = false;
        }, 1000);
      }
    };

    p.windowResized = () => {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
  };

  return createSketch;
};