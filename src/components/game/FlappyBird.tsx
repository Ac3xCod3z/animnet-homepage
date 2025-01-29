import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

interface FlappyBirdProps {
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
}

export const FlappyBird = ({ onScoreChange, onGameOver }: FlappyBirdProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Add event listener to prevent spacebar scrolling
  useEffect(() => {
    const preventSpacebarScroll = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', preventSpacebarScroll);

    return () => {
      window.removeEventListener('keydown', preventSpacebarScroll);
    };
  }, []);

  useEffect(() => {
    if (!gameRef.current) return;

    let bird = {
      y: 200,
      x: 64,
      velocity: 0,
      gravity: 0.6,
      lift: -10, // Reduced from -15 to -10 for softer jumps
    };

    let pipes: { x: number; top: number; bottom: number }[] = [];
    let score = 0;
    let gameStarted = false;

    const sketch = (p: p5) => {
      p.setup = () => {
        console.log('Setting up Flappy Bird game');
        p.createCanvas(400, 400);
        reset();
      };

      const reset = () => {
        bird.y = 200;
        bird.velocity = 0;
        pipes = [];
        score = 0;
        gameStarted = false;
        onScoreChange(0);
      };

      p.draw = () => {
        p.background(0);

        if (!gameStarted) {
          p.fill(255);
          p.textSize(20);
          p.textAlign(p.CENTER);
          p.text('Click or Press SPACE to start', p.width / 2, p.height / 2);
          return;
        }

        // Update and draw bird
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y > p.height) {
          bird.y = p.height;
          bird.velocity = 0;
        }

        p.fill(255);
        p.ellipse(bird.x, bird.y, 32, 32);

        // Update and draw pipes
        if (p.frameCount % 100 === 0) {
          let gap = 125;
          let topHeight = p.random(p.height / 6, (3 / 4) * p.height);
          pipes.push({
            x: p.width,
            top: topHeight,
            bottom: topHeight + gap,
          });
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
          let pipe = pipes[i];
          pipe.x -= 2;

          // Draw pipes
          p.fill(0, 255, 0);
          p.rect(pipe.x, 0, 50, pipe.top);
          p.rect(pipe.x, pipe.bottom, 50, p.height);

          // Check collision
          if (
            bird.x > pipe.x &&
            bird.x < pipe.x + 50 &&
            (bird.y < pipe.top || bird.y > pipe.bottom)
          ) {
            console.log('Game Over! Final score:', score);
            onGameOver();
            reset();
            return;
          }

          // Score point
          if (pipe.x + 25 < bird.x && pipe.x + 27 > bird.x) {
            score++;
            onScoreChange(score);
            console.log('Score increased:', score);
          }

          // Remove pipes that are off screen
          if (pipe.x < -50) {
            pipes.splice(i, 1);
          }
        }

        // Show score
        p.fill(255);
        p.textSize(32);
        p.text(score, p.width / 2, 50);
      };

      p.mousePressed = () => {
        if (!gameStarted) {
          gameStarted = true;
          return;
        }
        bird.velocity += bird.lift;
      };

      p.keyPressed = () => {
        if (p.keyCode === 32) { // spacebar
          if (!gameStarted) {
            gameStarted = true;
            return;
          }
          bird.velocity += bird.lift;
        }
      };
    };

    const p5Instance = new p5(sketch, gameRef.current);
    setIsPlaying(true);

    return () => {
      console.log('Cleaning up Flappy Bird game');
      p5Instance.remove();
      setIsPlaying(false);
    };
  }, [onScoreChange, onGameOver]);

  return (
    <div className="relative">
      <div ref={gameRef} className="rounded-lg overflow-hidden shadow-lg" />
      {isPlaying && (
        <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded">
          Use SPACE or CLICK to jump
        </div>
      )}
    </div>
  );
};
