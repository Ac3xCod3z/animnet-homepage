import { useEffect, useRef } from 'react';
import p5 from 'p5';

interface HeroProps {
  count: number;
}

export const Hero = ({ count }: HeroProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const previousCount = useRef(count);

  useEffect(() => {
    if (!canvasRef.current) return;

    const sketch = (p: p5) => {
      const symbols: Symbol[] = [];
      const symbolSize = 14;
      const fontSize = 400; // Large size for the background number
      let targetPoints: p5.Vector[] = [];
      let transitionSymbols: Symbol[] = [];
      
      class Symbol {
        x: number;
        y: number;
        value: string;
        speed: number;
        opacity: number;
        targetX?: number;
        targetY?: number;
        isTransitioning: boolean;
        
        constructor(x: number, y: number, speed: number, isTransitioning = false) {
          this.x = x;
          this.y = y;
          this.value = '';
          this.speed = speed;
          this.opacity = p.random(70, 100);
          this.isTransitioning = isTransitioning;
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
          if (this.isTransitioning && this.targetX !== undefined && this.targetY !== undefined) {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            this.x += dx * 0.1;
            this.y += dy * 0.1;
            
            if (p.abs(dx) < 0.1 && p.abs(dy) < 0.1) {
              this.x = this.targetX;
              this.y = this.targetY;
              this.isTransitioning = false;
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
          p.fill(255, 255, 255, this.opacity);
          p.text(this.value, this.x, this.y);
        }
      }

      const createNumberPoints = (num: number) => {
        p.textSize(fontSize);
        p.textAlign(p.CENTER, p.CENTER);
        const points: p5.Vector[] = [];
        const bbox = p.font.textBounds(num.toString(), p.width/2, p.height/2, fontSize);
        
        for (let x = 0; x < p.width; x += symbolSize) {
          for (let y = 0; y < p.height; y += symbolSize) {
            const px = x + symbolSize/2;
            const py = y + symbolSize/2;
            if (p.font.textBounds(num.toString(), px, py, fontSize).contains(x, y)) {
              points.push(p.createVector(px, py));
            }
          }
        }
        return points;
      };

      p.setup = () => {
        const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent(canvasRef.current!);
        p.textFont('Consolas');
        p.textSize(symbolSize);
        
        // Create initial number points
        targetPoints = createNumberPoints(count);
        
        // Create symbols for streaming effect
        const streamCount = Math.floor(window.innerWidth / symbolSize);
        for (let i = 0; i < streamCount; i++) {
          const symbol = new Symbol(i * symbolSize, 0, p.random(2, 5));
          symbols.push(symbol);
        }
        
        // Create symbols for the number shape
        targetPoints.forEach(point => {
          const symbol = new Symbol(
            p.random(p.width),
            -symbolSize,
            0,
            true
          );
          symbol.targetX = point.x;
          symbol.targetY = point.y;
          transitionSymbols.push(symbol);
        });
      };

      p.draw = () => {
        p.background(0, 150);
        
        // Update and render streaming symbols
        symbols.forEach(symbol => {
          symbol.update();
          symbol.render();
        });
        
        // Update and render transitioning symbols
        transitionSymbols.forEach(symbol => {
          symbol.update();
          symbol.render();
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
        targetPoints = createNumberPoints(count);
      };
    };

    const p5Instance = new p5(sketch, canvasRef.current);
    
    return () => {
      p5Instance.remove();
    };
  }, [count]);

  return (
    <div 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
};