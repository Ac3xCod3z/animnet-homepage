import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

interface FroggerProps {
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
}

export const Frogger = ({ onScoreChange, onGameOver }: FroggerProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!gameRef.current) return;

    let frog = {
      x: 200,
      y: 380,
      size: 20,
      speed: 20
    };

    let cars: { x: number; y: number; width: number; speed: number; }[] = [];
    let logs: { x: number; y: number; width: number; speed: number; }[] = [];
    let score = 0;
    let gameStarted = false;
    let successfulCrossings = 0;

    const sketch = (p: p5) => {
      p.setup = () => {
        console.log('Setting up Frogger game');
        p.createCanvas(400, 400);
        setupGame();
      };

      const setupGame = () => {
        // Initialize cars in three lanes with better spacing
        cars = [
          { x: 50, y: 280, width: 40, speed: 3 },
          { x: 250, y: 320, width: 40, speed: -2.5 },
          { x: 150, y: 360, width: 40, speed: 2 }
        ];

        // Initialize logs with better initial positions and spacing
        logs = [
          { x: 50, y: 240, width: 80, speed: 2 },    // First log closer to safe zone
          { x: 200, y: 200, width: 80, speed: -1.5 },
          { x: 100, y: 160, width: 80, speed: 1.8 }
        ];

        frog.x = 200;
        frog.y = 380;
        score = 0;
        successfulCrossings = 0;
        onScoreChange(0);
        gameStarted = false;  // Reset game started state
      };

      p.draw = () => {
        p.background(0);

        if (!gameStarted) {
          // Draw start screen with clear instructions
          p.fill(255);
          p.textSize(20);
          p.textAlign(p.CENTER);
          p.text('Click to start', p.width / 2, p.height / 2 - 20);
          p.textSize(16);
          p.text('Use arrow keys to move', p.width / 2, p.height / 2 + 20);
          return;
        }

        // Draw safe zones
        p.fill(50, 150, 50);
        p.rect(0, 0, p.width, 40);    // Goal zone
        p.rect(0, 380, p.width, 20);  // Start zone

        // Draw water
        p.fill(0, 100, 255);
        p.rect(0, 160, p.width, 120);

        // Draw road
        p.fill(70);
        p.rect(0, 280, p.width, 100);

        // Update and draw logs
        logs.forEach(log => {
          log.x += log.speed;
          if (log.x > p.width) log.x = -log.width;
          if (log.x < -log.width) log.x = p.width;
          
          p.fill(139, 69, 19);
          p.rect(log.x, log.y, log.width, 20);
        });

        // Update and draw cars
        cars.forEach(car => {
          car.x += car.speed;
          if (car.x > p.width) car.x = -car.width;
          if (car.x < -car.width) car.x = p.width;
          
          p.fill(255, 0, 0);
          p.rect(car.x, car.y, car.width, 20);
        });

        // Draw frog
        p.fill(0, 255, 0);
        p.rect(frog.x, frog.y, frog.size, frog.size);

        // Check if frog is on a log in water
        let onLog = false;
        if (frog.y >= 160 && frog.y <= 260) {
          logs.forEach(log => {
            if (frog.y === log.y && 
                frog.x + frog.size > log.x && 
                frog.x < log.x + log.width) {
              onLog = true;
              frog.x += log.speed;
            }
          });
          
          if (!onLog) {
            console.log('Game Over! Frog drowned');
            onGameOver();
            setupGame();
            return;
          }
        }

        // Check car collisions
        cars.forEach(car => {
          if (frog.y >= car.y && 
              frog.y <= car.y + 20 && 
              frog.x + frog.size > car.x && 
              frog.x < car.x + car.width) {
            console.log('Game Over! Hit by car');
            onGameOver();
            setupGame();
            return;
          }
        });

        // Check if frog reached the goal
        if (frog.y <= 40) {
          successfulCrossings++;
          score = successfulCrossings;
          console.log('Score increased:', score);
          onScoreChange(score);
          frog.x = 200;
          frog.y = 380;
        }

        // Keep frog within canvas
        frog.x = p.constrain(frog.x, 0, p.width - frog.size);
        frog.y = p.constrain(frog.y, 0, p.height - frog.size);

        // Show score
        p.fill(255);
        p.textSize(20);
        p.textAlign(p.LEFT);
        p.text(`Score: ${score}`, 10, 30);
      };

      p.keyPressed = () => {
        if (!gameStarted) return;

        switch (p.keyCode) {
          case p.UP_ARROW:
            frog.y -= frog.speed;
            break;
          case p.DOWN_ARROW:
            frog.y += frog.speed;
            break;
          case p.LEFT_ARROW:
            frog.x -= frog.speed;
            break;
          case p.RIGHT_ARROW:
            frog.x += frog.speed;
            break;
        }
      };

      p.mousePressed = () => {
        if (!gameStarted) {
          gameStarted = true;
        }
      };
    };

    const p5Instance = new p5(sketch, gameRef.current);
    setIsPlaying(true);

    return () => {
      console.log('Cleaning up Frogger game');
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