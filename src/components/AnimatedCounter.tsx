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
      
      class Symbol {
        x: number;
        y: number;
        value: string;
        speed: number;
        opacity: number;
        first: boolean;
        targetX: number;
        targetY: number;
        isForming: boolean;
        
        constructor(x: number, y: number, speed: number, first: boolean) {
          this.x = x;
          this.y = y;
          this.value = '';
          this.speed = speed;
          this.first = first;
          this.opacity = first ? 255 : p.random(70, 100);
          this.targetX = x;
          this.targetY = y;
          this.isForming = false;
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
          if (!formationStarted) {
            this.y += this.speed;
            if (this.y >= p.height) {
              this.y = -symbolSize;
              this.x = p.random(numberBounds.minX, numberBounds.maxX);
            }
          } else if (this.isForming) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            this.x += dx * 0.1;
            this.y += dy * 0.1;
            
            if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
              this.isForming = false;
              this.y = numberBounds.minY;
            }
          } else {
            // Continuous downward streaming within number bounds
            this.y += this.speed * 0.5;
            if (this.y >= numberBounds.maxY) {
              this.y = numberBounds.minY;
              this.setToRandomSymbol();
            }
          }
          
          if (p.random(1) < 0.1) {
            this.setToRandomSymbol();
          }
        }

        render() {
          const pixelColor = targetImage.get(Math.floor(this.x), Math.floor(this.y));
          const isInNumber = pixelColor[0] > 0;

          if (!formationStarted || (formationStarted && isInNumber)) {
            if (this.first) {
              p.fill(255, 255, 255, this.opacity);
            } else {
              p.fill(200, 200, 200, this.opacity);
            }
            p.text(this.value, this.x, this.y);
          }
        }

        startForming(tx: number, ty: number) {
          this.isForming = true;
          this.targetX = tx;
          this.targetY = ty;
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

        startForming() {
          this.symbols.forEach(symbol => {
            const targetX = p.random(numberBounds.minX, numberBounds.maxX);
            const targetY = p.random(numberBounds.minY, numberBounds.maxY);
            symbol.startForming(targetX, targetY);
          });
        }
      }

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

        const streamDensity = 0.25;
        const streamCount = Math.floor(textWidth / (symbolSize * streamDensity));
        for (let i = 0; i < streamCount; i++) {
          const x = p.map(i, 0, streamCount - 1, numberBounds.minX, numberBounds.maxX);
          const stream = new Stream(x);
          streams.push(stream);
        }
      };

      p.draw = () => {
        p.background(0, 150);
        
        if (!formationStarted && p.millis() - startTime > formationDelay) {
          formationStarted = true;
          streams.forEach(stream => stream.startForming());
        }
        
        streams.forEach(stream => stream.render());
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
        targetImage = p.createGraphics(p.width, p.height);
        targetImage.background(0);
        targetImage.fill(255);
        targetImage.textSize(fontSize);
        targetImage.textAlign(p.CENTER, p.CENTER);
        targetImage.text(count, p.width / 2, p.height / 2);

        // Recalculate number bounds
        const textWidth = fontSize * count.length * 0.6;
        const textHeight = fontSize;
        numberBounds = {
          minX: (p.width - textWidth) / 2,
          maxX: (p.width + textWidth) / 2,
          minY: (p.height - textHeight) / 2,
          maxY: (p.height + textHeight) / 2
        };

        // Recreate streams with new bounds
        streams.length = 0;
        const streamDensity = 0.5;
        const streamCount = Math.floor(textWidth / (symbolSize * streamDensity));
        for (let i = 0; i < streamCount; i++) {
          const x = p.map(i, 0, streamCount - 1, numberBounds.minX, numberBounds.maxX);
          const stream = new Stream(x);
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