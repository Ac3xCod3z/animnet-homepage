import p5 from 'p5';
import { Stream } from './Stream';

export const useP5Setup = (count: string) => {
  return (p: p5) => {
    const streams: Stream[] = [];
    const symbolSize = 14;
    const fontSize = Math.min(window.innerWidth, window.innerHeight) * 0.6;
    let targetImage: p5.Graphics;
    let formationStarted = false;
    let dissolving = false;
    const formationDelay = 2500;
    let startTime: number;
    let numberBounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    let previousCount: string | null = null;

    p.setup = () => {
      const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
      if (canvas.parent()) {
        canvas.parent(canvas.parent());
      }
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

      initializeStreams();
    };

    const initializeStreams = () => {
      streams.length = 0;
      const streamSpacing = symbolSize * 1.2;
      const streamCount = Math.floor((numberBounds.maxX - numberBounds.minX) / streamSpacing);
      for (let i = 0; i < streamCount; i++) {
        const x = numberBounds.minX + (i * streamSpacing);
        const stream = new Stream({ x, streamIndex: i, p });
        streams.push(stream);
      }
    };

    p.draw = () => {
      p.background(0, 150);
      
      if (previousCount !== null && previousCount !== count) {
        dissolving = true;
        formationStarted = false;
        startTime = p.millis();
        previousCount = count;
        
        // Reset streams for new number formation
        initializeStreams();
      }

      if (dissolving) {
        streams.forEach(stream => {
          stream.dissolve();
          if (stream.isFullyDissolved()) {
            dissolving = false;
            formationStarted = false;
            startTime = p.millis();
          }
        });
      } else if (!formationStarted && p.millis() - startTime > formationDelay) {
        formationStarted = true;
        streams.forEach(stream => stream.startForming(numberBounds, symbolSize));
      }
      
      streams.forEach(stream => stream.render(targetImage, formationStarted, numberBounds, streams, symbolSize));
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

      initializeStreams();
    };
  };
};