import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface AnimatedCounterProps {
  count: string;
}

export const AnimatedCounter = ({ count }: AnimatedCounterProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sketchRef.current) return;
    
    // Validate that count is a positive number
    const numCount = parseInt(count);
    if (isNaN(numCount) || numCount <= 0) {
      console.error('AnimatedCounter: Invalid count value:', count);
      return;
    }
    
    console.log('AnimatedCounter: Updating counter with new value:', count);

    const existingCanvas = sketchRef.current.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

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
        lastUpdate: number;
        updateInterval: number;
        streamIndex: number;
        
        constructor(x: number, y: number, speed: number, first: boolean, streamIndex: number) {
          this.x = x;
          this.y = y;
          this.value = '';
          this.speed = speed;
          this.first = first;
          this.opacity = first ? 255 : p.random(70, 100);
          this.targetX = x;
          this.targetY = y;
          this.isForming = false;
          this.lastUpdate = p.millis();
          this.updateInterval = p.random(50, 150);
          this.streamIndex = streamIndex;
          this.setToRandomSymbol();
        }

        setToRandomSymbol() {
          const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
          this.value = charset[Math.floor(p.random(charset.length))];
        }

        update() {
          const currentTime = p.millis();
          
          if (!formationStarted) {
            this.y += this.speed;
            if (this.y >= numberBounds.maxY) {
              this.y = numberBounds.minY - symbolSize;
            }
          } else if (this.isForming) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            // Smoother easing for formation
            const easing = 0.08;
            this.x += dx * easing;
            this.y += dy * easing;
            
            if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
              this.x = this.targetX;
              this.y = this.targetY;
              this.isForming = false;
            }
          } else {
            // Consistent vertical falling motion within the number
            this.y += this.speed;
            if (this.y >= numberBounds.maxY) {
              this.y = numberBounds.minY;
            }
          }
          
          // Update symbols in a cascading pattern
          if (currentTime - this.lastUpdate > this.updateInterval) {
            if (!this.isForming) {
              this.setToRandomSymbol();
              const stream = streams[this.streamIndex];
              if (stream && this.first) {
                // Propagate the symbol change down the stream
                stream.symbols.forEach((symbol, index) => {
                  if (!symbol.first) {
                    setTimeout(() => {
                      symbol.value = this.value;
                    }, index * 25);
                  }
                });
              }
            }
            this.lastUpdate = currentTime;
          }
        }

        render() {
          const pixelColor = targetImage.get(Math.floor(this.x), Math.floor(this.y));
          const isInNumber = pixelColor[0] > 0;

          if (!formationStarted || (formationStarted && isInNumber)) {
            p.fill(255, this.opacity);
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

        constructor(x: number, streamIndex: number) {
          this.speed = p.random(3, 7);
          this.totalSymbols = p.round(p.random(5, 35));
          this.symbols = [];

          for (let i = 0; i < this.totalSymbols; i++) {
            const first = i === 0;
            const symbol = new Symbol(
              x,
              (i * symbolSize) - (this.totalSymbols * symbolSize),
              this.speed,
              first,
              streamIndex
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
          // Ensure symbols form within the number bounds
          this.symbols.forEach((symbol, index) => {
            const targetX = symbol.x;
            const targetY = numberBounds.minY + (index * symbolSize) % (numberBounds.maxY - numberBounds.minY);
            symbol.startForming(targetX, targetY);
          });
        }
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

        // Create streams only within the number bounds
        const streamSpacing = symbolSize * 1.2;
        const streamCount = Math.floor((numberBounds.maxX - numberBounds.minX) / streamSpacing);
        for (let i = 0; i < streamCount; i++) {
          const x = numberBounds.minX + (i * streamSpacing);
          const stream = new Stream(x, i);
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
          const stream = new Stream(x, i);
          streams.push(stream);
        }
      };
    };

    new p5(sketch, sketchRef.current);
  }, [count]);

  return (
    <div 
      ref={sketchRef} 
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
