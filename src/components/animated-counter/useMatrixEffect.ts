import { useEffect, useRef } from 'react';
import p5 from 'p5';
import { Stream } from './Stream';

export const useMatrixEffect = (count: string) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sketchRef.current) return;
    console.log('AnimatedCounter: Updating counter with new value:', count);

    const existingCanvas = sketchRef.current.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    const sketch = (p: p5) => {
      const streams: Stream[] = [];
      const symbolSize = 14;
      const fontSize = Math.min(window.innerWidth, window.innerHeight) * 0.6;
      let targetImage: p5.Graphics;
      let formationStarted = false;
      const formationDelay = 2500;
      let startTime: number;
      let numberBounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };

      p.setup = () => {
        const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent(sketchRef.current!);
        p.background(0);
        p.textSize(symbolSize);
        p.textFont('Consolas');
        startTime = p.millis();

        targetImage = p.createGraphics(p.width, p.height);
        targetImage.background(0);
        targetImage.fill(255);
        targetImage.textSize(fontSize);
        targetImage.textAlign(p.CENTER, p.CENTER);
        targetImage.text(count, p.width / 2, p.height / 2);

        const textWidth = fontSize * count.length * 0.6;
        const textHeight = fontSize;
        numberBounds = {
          minX: (p.width - textWidth) / 2,
          maxX: (p.width + textWidth) / 2,
          minY: (p.height - textHeight) / 2,
          maxY: (p.height + textHeight) / 2
        };

        const streamSpacing = symbolSize * 1.2;
        const streamCount = Math.floor((numberBounds.maxX - numberBounds.minX) / streamSpacing);
        for (let i = 0; i < streamCount; i++) {
          const x = numberBounds.minX + (i * streamSpacing);
          streams.push(new Stream(p, x, i, streams, numberBounds, symbolSize));
        }
      };

      p.draw = () => {
        p.background(0, 150);
        
        if (!formationStarted && p.millis() - startTime > formationDelay) {
          formationStarted = true;
          streams.forEach(stream => stream.startForming());
        }
        
        streams.forEach(stream => stream.render(targetImage));
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
        targetImage = p.createGraphics(p.width, p.height);
        targetImage.background(0);
        targetImage.fill(255);
        targetImage.textSize(fontSize);
        targetImage.textAlign(p.CENTER, p.CENTER);
        targetImage.text(count, p.width / 2, p.height / 2);

        const textWidth = fontSize * count.length * 0.6;
        const textHeight = fontSize;
        numberBounds = {
          minX: (p.width - textWidth) / 2,
          maxX: (p.width + textWidth) / 2,
          minY: (p.height - textHeight) / 2,
          maxY: (p.height + textHeight) / 2
        };

        streams.length = 0;
        const streamSpacing = symbolSize * 1.2;
        const streamCount = Math.floor((numberBounds.maxX - numberBounds.minX) / streamSpacing);
        for (let i = 0; i < streamCount; i++) {
          const x = numberBounds.minX + (i * streamSpacing);
          streams.push(new Stream(p, x, i, streams, numberBounds, symbolSize));
        }
      };
    };

    new p5(sketch, sketchRef.current);
  }, [count]);

  return sketchRef;
};