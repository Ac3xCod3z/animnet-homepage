import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface AnimatedCounterProps {
  count: string;
}

export const AnimatedCounter = ({ count }: AnimatedCounterProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sketchRef.current) return;
    console.log('AnimatedCounter: Updating counter with new value:', count);

    // Remove any existing canvas
    const existingCanvas = sketchRef.current.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    const sketch = (p: p5) => {
      const streams: Stream[] = [];
      const symbolSize = 14;
      const fontSize = Math.min(window.innerWidth, window.innerHeight) * 0.6; // 60% of viewport
      let targetImage: p5.Graphics;
      
      class Symbol {
        x: number;
        y: number;
        value: string;
        speed: number;
        opacity: number;
        first: boolean;
        
        constructor(x: number, y: number, speed: number, first: boolean) {
          this.x = x;
          this.y = y;
          this.value = '';
          this.speed = speed;
          this.first = first;
          this.opacity = first ? 255 : p.random(70, 100);
          this.setToRandomSymbol();
        }

        setToRandomSymbol() {
          const charTypes = [
            'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ',
            '0123456789',
            'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            '∈∉∊∋∌∍∎∏∐∑−∓∔∕∖∗∘∙√∛∜∝∞∟∠∡∢∣'
          ];
          const charset = charTypes[Math.floor(p.random(charTypes.length))];
          this.value = charset[Math.floor(p.random(charset.length))];
        }

        update() {
          if (this.y >= p.height) {
            this.y = 0;
          } else {
            this.y += this.speed;
          }
          if (p.random(1) < 0.1) {
            this.setToRandomSymbol();
          }
        }

        render() {
          const pixelColor = targetImage.get(this.x, this.y);
          const isInNumber = pixelColor[0] > 0; // Check if the pixel is part of the number

          if (isInNumber) {
            if (this.first) {
              p.fill(255, 255, 255, this.opacity);
            } else {
              p.fill(200, 200, 200, this.opacity);
            }
            p.text(this.value, this.x, this.y);
          }
        }
      }

      class Stream {
        symbols: Symbol[];
        totalSymbols: number;
        speed: number;

        constructor(x: number) {
          this.totalSymbols = p.round(p.random(5, 35));
          this.speed = p.random(3, 7);
          this.symbols = [];

          for (let i = 0; i < this.totalSymbols; i++) {
            const first = i === 0;
            const symbol = new Symbol(
              x,
              (i * symbolSize) - (this.totalSymbols * symbolSize),
              this.speed,
              first
            );
            this.symbols.push(symbol);
          }
        }

        render() {
          this.symbols.forEach(symbol => {
            symbol.render();
            symbol.update();
          });
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent(sketchRef.current!);
        p.background(0);
        p.textSize(symbolSize);
        p.textFont('Consolas');

        // Create target image with the number
        targetImage = p.createGraphics(p.width, p.height);
        targetImage.background(0);
        targetImage.fill(255);
        targetImage.textSize(fontSize);
        targetImage.textAlign(p.CENTER, p.CENTER);
        targetImage.text(count, p.width / 2, p.height / 2);

        // Create streams
        const streamCount = Math.floor(window.innerWidth / symbolSize);
        for (let i = 0; i < streamCount; i++) {
          const stream = new Stream(i * symbolSize);
          streams.push(stream);
        }
      };

      p.draw = () => {
        p.background(0, 150);
        streams.forEach(stream => stream.render());
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
        // Recreate target image and streams for new window size
        targetImage = p.createGraphics(p.width, p.height);
        targetImage.background(0);
        targetImage.fill(255);
        targetImage.textSize(fontSize);
        targetImage.textAlign(p.CENTER, p.CENTER);
        targetImage.text(count, p.width / 2, p.height / 2);

        streams.length = 0;
        const streamCount = Math.floor(window.innerWidth / symbolSize);
        for (let i = 0; i < streamCount; i++) {
          const stream = new Stream(i * symbolSize);
          streams.push(stream);
        }
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    
    return () => {
      console.log('Cleaning up p5 sketch...');
      p5Instance.remove();
    };
  }, [count]);

  return (
    <div 
      ref={sketchRef} 
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};