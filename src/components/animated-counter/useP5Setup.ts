import p5 from 'p5';
import { Stream } from './Stream';

export const useP5Setup = (count: string, isTransitioning: boolean) => {
  return (p: p5) => {
    const streams: Stream[] = [];
    const symbolSize = 14;
    const fontSize = Math.min(window.innerWidth, window.innerHeight) * 0.6;
    let targetImage: p5.Graphics;
    let formationStarted = false;
    const formationDelay = isTransitioning ? 0 : 2500; // No delay during transition
    let startTime: number;
    let numberBounds = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    let dissolutionStarted = false;
    let dissolutionProgress = 0;

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

      const streamSpacing = symbolSize * 1.2;
      const streamCount = Math.floor((numberBounds.maxX - numberBounds.minX) / streamSpacing);
      for (let i = 0; i < streamCount; i++) {
        const x = numberBounds.minX + (i * streamSpacing);
        const stream = new Stream({ x, streamIndex: i, p });
        streams.push(stream);
      }

      if (isTransitioning) {
        dissolutionStarted = true;
        formationStarted = true;
        streams.forEach(stream => stream.startDissolving());
      }
    };

    p.draw = () => {
      p.background(0, 150);
      
      if (!formationStarted && p.millis() - startTime > formationDelay) {
        formationStarted = true;
        streams.forEach(stream => stream.startForming(numberBounds, symbolSize));
      }
      
      if (dissolutionStarted) {
        dissolutionProgress = Math.min(1, (p.millis() - startTime) / 2000);
        streams.forEach(stream => stream.updateDissolution(dissolutionProgress));
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

      streams.length = 0;
      const streamSpacing = symbolSize * 1.2;
      const streamCount = Math.floor((numberBounds.maxX - numberBounds.minX) / streamSpacing);
      for (let i = 0; i < streamCount; i++) {
        const x = numberBounds.minX + (i * streamSpacing);
        const stream = new Stream({ x, streamIndex: i, p });
        streams.push(stream);
      }
    };
  };
};