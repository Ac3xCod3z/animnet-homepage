import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface AnimatedCounterProps {
  count: string;
}

export const AnimatedCounter = ({ count }: AnimatedCounterProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sketchRef.current) return;

    // Remove any existing canvas
    const existingCanvas = sketchRef.current.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    const sketch = (p: p5) => {
      const symbols: Symbol[] = [];
      const symbolSize = 60; // Larger size for the counter
      
      class Symbol {
        x: number;
        y: number;
        value: string;
        opacity: number;
        switchInterval: number;
        lastSwitch: number;
        
        constructor(x: number, y: number, value: string) {
          this.x = x;
          this.y = y;
          this.value = value;
          this.opacity = 255;
          this.switchInterval = p.random(100, 300);
          this.lastSwitch = p.millis();
        }

        setToRandomSymbol() {
          const charTypes = [
            count,
            '0123456789',
            '∈∉∊∋∌∍∎∏∐∑−∓∔∕∖∗∘∙√∛∜∝∞∟∠∡∢∣'
          ];
          const charset = charTypes[Math.floor(p.random(charTypes.length))];
          this.value = charset[Math.floor(p.random(charset.length))];
        }

        update() {
          const now = p.millis();
          if (now - this.lastSwitch > this.switchInterval) {
            if (p.random(1) < 0.1) {
              this.setToRandomSymbol();
            } else {
              this.value = count;
            }
            this.lastSwitch = now;
          }
        }

        render() {
          p.fill(255, 255, 255, this.opacity);
          p.text(this.value, this.x, this.y);
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(200, 100);
        canvas.parent(sketchRef.current!);
        p.background(0, 0);
        p.textSize(symbolSize);
        p.textFont('Consolas');
        p.textAlign(p.CENTER, p.CENTER);

        // Create single symbol in the center
        const symbol = new Symbol(p.width / 2, p.height / 2, count);
        symbols.push(symbol);
      };

      p.draw = () => {
        p.clear();
        symbols.forEach(symbol => {
          symbol.render();
          symbol.update();
        });
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    
    return () => {
      p5Instance.remove();
    };
  }, [count]);

  return (
    <div 
      ref={sketchRef} 
      className="w-[200px] h-[100px] mx-auto"
      style={{ zIndex: 10 }}
    />
  );
};