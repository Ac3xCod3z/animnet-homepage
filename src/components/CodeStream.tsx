import { useEffect, useRef } from 'react';
import p5 from 'p5';

export const CodeStream = () => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sketchRef.current) return;

    // Remove any existing canvas
    const existingCanvas = sketchRef.current.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    const sketch = (p: p5) => {
      const streams: Stream[] = [];
      const symbolSize = 14;
      const explosionForce = 15; // Force applied when mouse collides
      const explosionRadius = 100; // Radius of effect around mouse
      
      class Symbol {
        x: number;
        y: number;
        value: string;
        speed: number;
        opacity: number;
        first: boolean;
        velocityX: number;
        velocityY: number;
        isDisrupted: boolean;
        
        constructor(x: number, y: number, speed: number, first: boolean) {
          this.x = x;
          this.y = y;
          this.value = '';
          this.speed = speed;
          this.first = first;
          this.opacity = first ? 255 : p.random(70, 100);
          this.velocityX = 0;
          this.velocityY = 0;
          this.isDisrupted = false;
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

        disrupt(mouseX: number, mouseY: number) {
          const dx = this.x - mouseX;
          const dy = this.y - mouseY;
          const distance = p.sqrt(dx * dx + dy * dy);
          
          if (distance < explosionRadius) {
            this.isDisrupted = true;
            const angle = p.atan2(dy, dx);
            const force = p.map(distance, 0, explosionRadius, explosionForce, 0);
            this.velocityX = p.cos(angle) * force;
            this.velocityY = p.sin(angle) * force;
          }
        }

        update() {
          if (this.isDisrupted) {
            this.x += this.velocityX;
            this.y += this.velocityY;
            this.velocityX *= 0.95; // Add drag
            this.velocityY *= 0.95;
            
            // Reset if off screen
            if (this.x < 0 || this.x > p.width || this.y < 0 || this.y > p.height) {
              this.isDisrupted = false;
              this.velocityX = 0;
              this.velocityY = 0;
            }
          } else {
            if (this.y >= p.height) {
              this.y = 0;
            } else {
              this.y += this.speed;
            }
          }
          
          if (p.random(1) < 0.1) {
            this.setToRandomSymbol();
          }
        }

        render() {
          if (this.first) {
            p.fill(255, 255, 255, this.opacity); // White for first symbol
          } else {
            p.fill(200, 200, 200, this.opacity); // Light gray for rest
          }
          p.text(this.value, this.x, this.y);
        }
      }

      class Stream {
        symbols: Symbol[];
        totalSymbols: number;
        speed: number;

        constructor(x: number) {
          this.totalSymbols = p.round(p.random(5, 35));
          this.speed = p.random(5, 10);
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

        disruptStream(mouseX: number, mouseY: number) {
          this.symbols.forEach(symbol => symbol.disrupt(mouseX, mouseY));
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

        // Create streams
        const streamCount = Math.floor(window.innerWidth / symbolSize);
        for (let i = 0; i < streamCount; i++) {
          const stream = new Stream(i * symbolSize);
          streams.push(stream);
        }
      };

      p.draw = () => {
        p.background(0, 150); // Creates trailing effect
        streams.forEach(stream => stream.render());
      };

      p.mouseMoved = () => {
        streams.forEach(stream => stream.disruptStream(p.mouseX, p.mouseY));
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
        // Recreate streams for new window size
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
  }, []);

  return (
    <div 
      ref={sketchRef} 
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};