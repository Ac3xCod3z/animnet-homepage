import p5 from 'p5';
import { Stream } from '../animated-counter/Stream';

export const useP5Setup = (type: 'granted' | 'denied', containerRef: HTMLDivElement | null) => {
  return (p: p5) => {
    const streams: Stream[] = [];
    const symbolSize = 14;
    const message = type === 'granted' ? 'ACCESS GRANTED' : 'ACCESS DENIED';
    const matrixGreen = '#0FA0CE'; // Matrix-style bright green
    const textColor = type === 'granted' ? '#22c55e' : '#ef4444';
    const streamColor = type === 'granted' ? matrixGreen : '#ffffff';
    const fontSize = Math.min(window.innerWidth, window.innerHeight) * 0.15;
    let targetImage: p5.Graphics;
    
    p.setup = () => {
      console.log('Access Message P5 Setup: Initializing with type:', type);
      const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
      if (containerRef) {
        canvas.parent(containerRef);
      }
      p.background(0);
      p.textSize(symbolSize);
      p.textFont('Consolas');

      targetImage = createTargetImage();
      initializeStreams();
    };

    const createTargetImage = () => {
      const img = p.createGraphics(p.width, p.height);
      img.background(0);
      img.fill(textColor);
      img.textSize(fontSize);
      img.textFont('Orbitron');
      img.textAlign(p.CENTER, p.CENTER);
      img.text(message, p.width / 2, p.height / 2);
      return img;
    };

    const initializeStreams = () => {
      const streamSpacing = symbolSize * 1.2;
      const streamCount = Math.floor(p.width / streamSpacing);
      
      for (let i = 0; i < streamCount; i++) {
        const x = i * streamSpacing;
        const stream = new Stream({ 
          x, 
          streamIndex: i, 
          p,
          color: streamColor 
        });
        streams.push(stream);
      }
    };

    p.draw = () => {
      p.background(0, 150);
      streams.forEach(stream => stream.render(targetImage, true, {
        minX: 0,
        maxX: p.width,
        minY: 0,
        maxY: p.height
      }, streams, symbolSize));
    };

    p.windowResized = () => {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
      targetImage = createTargetImage();
      streams.length = 0;
      initializeStreams();
    };
  };
};