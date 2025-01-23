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
      console.log('P5 Setup: Initializing with count:', count);
      const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
      if (canvas.parent()) {
        canvas.parent(canvas.parent());
      }
      p.background(0);
      p.textSize(symbolSize);
      p.textFont('Consolas');
      startTime = p.millis();

      targetImage = createTargetImage();
      numberBounds = calculateNumberBounds();
      initializeStreams();
      previousCount = count;
    };

    const createTargetImage = () => {
      const img = p.createGraphics(p.width, p.height);
      img.background(0);
      img.fill(255);
      img.textSize(fontSize);
      img.textAlign(p.CENTER, p.CENTER);
      img.text(count, p.width / 2, p.height / 2);
      return img;
    };

    const calculateNumberBounds = () => {
      const textWidth = fontSize * count.length * 0.6;
      const textHeight = fontSize;
      return {
        minX: (p.width - textWidth) / 2,
        maxX: (p.width + textWidth) / 2,
        minY: (p.height - textHeight) / 2,
        maxY: (p.height + textHeight) / 2
      };
    };

    const initializeStreams = () => {
      console.log('Initializing streams for count:', count);
      streams.length = 0;
      const streamSpacing = symbolSize * 1.2;
      const streamCount = Math.floor((numberBounds.maxX - numberBounds.minX) / streamSpacing);
      for (let i = 0; i < streamCount; i++) {
        const x = numberBounds.minX + (i * streamSpacing);
        const stream = new Stream({ 
          x, 
          streamIndex: i, 
          p,
          color: '#FFFFFF' // Adding the required color property
        });
        streams.push(stream);
      }
    };

    p.draw = () => {
      p.background(0, 150);
      
      if (previousCount !== count) {
        console.log('Count changed from', previousCount, 'to', count);
        dissolving = true;
        formationStarted = false;
        startTime = p.millis();
        
        // Update target image for new number
        targetImage = createTargetImage();
        numberBounds = calculateNumberBounds();
        previousCount = count;
      }

      if (dissolving) {
        let allDissolved = true;
        streams.forEach(stream => {
          stream.dissolve();
          if (!stream.isFullyDissolved()) {
            allDissolved = false;
          }
        });
        
        if (allDissolved) {
          console.log('All streams dissolved, reinitializing for new number');
          dissolving = false;
          formationStarted = false;
          startTime = p.millis();
          initializeStreams();
        }
      } else if (!formationStarted && p.millis() - startTime > formationDelay) {
        console.log('Starting formation of new number');
        formationStarted = true;
        streams.forEach(stream => stream.startForming(numberBounds, symbolSize));
      }
      
      streams.forEach(stream => stream.render(targetImage, formationStarted, numberBounds, streams, symbolSize));
    };

    p.windowResized = () => {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
      targetImage = createTargetImage();
      numberBounds = calculateNumberBounds();
      initializeStreams();
    };
  };
};