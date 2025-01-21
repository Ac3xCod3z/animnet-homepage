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
      const particles: Particle[] = [];
      const numParticles = 100;
      const connectionDistance = 100;

      class Particle {
        pos: p5.Vector;
        vel: p5.Vector;
        acc: p5.Vector;
        code: string;
        
        constructor() {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
          this.acc = p.createVector(0, 0);
          const codeChars = ['0', '1', '{', '}', '<', '>', '/', '*', '=', ';'];
          this.code = codeChars[Math.floor(p.random(codeChars.length))];
        }

        update() {
          const mouse = p.createVector(p.mouseX, p.mouseY);
          const dir = p5.Vector.sub(mouse, this.pos);
          const d = dir.mag();
          
          if (d < 200) {
            dir.setMag(0.5);
            this.acc = dir;
          } else {
            this.acc = p.createVector(p.random(-0.1, 0.1), p.random(-0.1, 0.1));
          }
          
          this.vel.add(this.acc);
          this.vel.limit(3);
          this.pos.add(this.vel);
          
          if (this.pos.x < 0) this.pos.x = p.width;
          if (this.pos.x > p.width) this.pos.x = 0;
          if (this.pos.y < 0) this.pos.y = p.height;
          if (this.pos.y > p.height) this.pos.y = 0;
        }

        display() {
          p.fill(0, 255, 0, 200);
          p.noStroke();
          p.textSize(14);
          p.text(this.code, this.pos.x, this.pos.y);
        }

        connect(particles: Particle[]) {
          particles.forEach(other => {
            const d = p5.Vector.dist(this.pos, other.pos);
            if (d < connectionDistance) {
              const alpha = p.map(d, 0, connectionDistance, 100, 0);
              p.stroke(0, 255, 0, alpha);
              p.line(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
            }
          });
        }
      }

      p.setup = () => {
        console.log('Setting up p5 sketch...'); // Debug log
        const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        canvas.parent(sketchRef.current!);
        
        for (let i = 0; i < numParticles; i++) {
          particles.push(new Particle());
        }
      };

      p.draw = () => {
        p.background(34, 34, 34, 250);
        
        particles.forEach(particle => {
          particle.update();
          particle.connect(particles);
          particle.display();
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    
    return () => {
      console.log('Cleaning up p5 sketch...'); // Debug log
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