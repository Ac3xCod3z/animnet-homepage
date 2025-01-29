import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

interface PacManProps {
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
}

export const PacMan = ({ onScoreChange, onGameOver }: PacManProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!gameRef.current) return;

    let player = {
      x: 200,
      y: 200,
      size: 30,
      speed: 3,
      direction: 0, // 0: right, 1: down, 2: left, 3: up
      mouthOpen: true
    };

    let dots: { x: number; y: number; }[] = [];
    let score = 0;
    let gameStarted = false;

    const sketch = (p: p5) => {
      p.setup = () => {
        console.log('Setting up Pac-Man game');
        p.createCanvas(400, 400);
        resetGame();
      };

      const resetGame = () => {
        player.x = p.width / 2;
        player.y = p.height / 2;
        player.direction = 0;
        score = 0;
        onScoreChange(0);
        
        // Create dots in a grid pattern
        dots = [];
        for (let x = 30; x < p.width; x += 40) {
          for (let y = 30; y < p.height; y += 40) {
            dots.push({ x, y });
          }
        }
      };

      p.draw = () => {
        p.background(0);

        if (!gameStarted) {
          p.fill(255);
          p.textSize(20);
          p.textAlign(p.CENTER);
          p.text('Click to start', p.width / 2, p.height / 2);
          p.textSize(16);
          p.text('Use arrow keys to move', p.width / 2, p.height / 2 + 30);
          return;
        }

        // Update player position based on direction
        if (p.keyIsDown(p.RIGHT_ARROW)) player.direction = 0;
        if (p.keyIsDown(p.DOWN_ARROW)) player.direction = 1;
        if (p.keyIsDown(p.LEFT_ARROW)) player.direction = 2;
        if (p.keyIsDown(p.UP_ARROW)) player.direction = 3;

        // Move player
        switch (player.direction) {
          case 0: player.x += player.speed; break;
          case 1: player.y += player.speed; break;
          case 2: player.x -= player.speed; break;
          case 3: player.y -= player.speed; break;
        }

        // Wrap around screen
        if (player.x > p.width) player.x = 0;
        if (player.x < 0) player.x = p.width;
        if (player.y > p.height) player.y = 0;
        if (player.y < 0) player.y = p.height;

        // Draw dots and check collection
        p.fill(255);
        dots = dots.filter(dot => {
          const distance = p.dist(player.x, player.y, dot.x, dot.y);
          if (distance < player.size / 2) {
            score++;
            console.log('Score increased:', score);
            onScoreChange(score);
            
            if (score >= 3) {
              console.log('Game won! Final score:', score);
              onGameOver();
              resetGame();
              gameStarted = false;
              return false;
            }
            return false;
          }
          p.circle(dot.x, dot.y, 8);
          return true;
        });

        // Draw Pac-Man
        p.fill(255, 255, 0);
        p.push();
        p.translate(player.x, player.y);
        p.rotate(player.direction * p.HALF_PI);
        
        // Animate mouth
        player.mouthOpen = p.frameCount % 30 < 15;
        if (player.mouthOpen) {
          p.arc(0, 0, player.size, player.size, p.PI / 6, -p.PI / 6);
        } else {
          p.circle(0, 0, player.size);
        }
        p.pop();
      };

      p.mousePressed = () => {
        if (!gameStarted) {
          gameStarted = true;
          resetGame();
        }
      };
    };

    const p5Instance = new p5(sketch, gameRef.current);
    setIsPlaying(true);

    return () => {
      console.log('Cleaning up Pac-Man game');
      p5Instance.remove();
      setIsPlaying(false);
    };
  }, [onScoreChange, onGameOver]);

  return (
    <div className="relative">
      <div ref={gameRef} className="rounded-lg overflow-hidden shadow-lg" />
      {isPlaying && (
        <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded">
          Use arrow keys to move
        </div>
      )}
    </div>
  );
};