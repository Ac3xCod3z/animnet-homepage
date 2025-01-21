import { useEffect, useRef } from 'react';
import p5 from 'p5';

export const CodeStream = () => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sketchRef.current) return;

    const sketch = (p: p5) => {
      const particles: Particle[] = [];
      const numParticles = 50;

      class Particle {
        pos: p5.Vector;
        vel: p5.Vector;
        acc: p5.Vector;
        code: string;
        
        constructor() {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel = p.createVector(0, 0);
          this.acc = p.createVector(0, 0);
          this.code = String.fromCharCode(p.random(33, 126));
        }

        update() {
          const mouse = p.createVector(p.mouseX, p.mouseY);
          const dir = p5.Vector.sub(mouse, this.pos);
          const d = dir.mag();
          
          if (d < 100) {
            dir.setMag(0.5);
            this.acc = dir;
          } else {
            this.acc = p.createVector(p.random(-0.1, 0.1), p.random(-0.1, 0.1));
          }
          
          this.vel.add(this.acc);
          this.vel.limit(2);
          this.pos.add(this.vel);
          
          if (this.pos.x < 0) this.pos.x = p.width;
          if (this.pos.x > p.width) this.pos.x = 0;
          if (this.pos.y < 0) this.pos.y = p.height;
          if (this.pos.y > p.height) this.pos.y = 0;
        }

        display() {
          p.fill(0, 255, 0, 150);
          p.noStroke();
          p.textSize(16);
          p.text(this.code, this.pos.x, this.pos.y);
        }
      }

      p.setup = () => {
        const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
        canvas.position(0, 0);
        canvas.style('z-index', '-1');
        
        for (let i = 0; i < numParticles; i++) {
          particles.push(new Particle());
        }
      };

      p.draw = () => {
        p.background(34, 34, 34, 250); // off-black background
        
        particles.forEach(particle => {
          particle.update();
          particle.display();
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);
    return () => p5Instance.remove();
  }, []);

  return <div ref={sketchRef} className="absolute inset-0" />;
};