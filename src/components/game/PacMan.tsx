import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { CELL_SIZE, MAZE_LAYOUT } from './constants/mazeConfig';
import { checkCollision, createDots, moveGhost } from './utils/gameUtils';
import { GameState, Ghost, Player } from './types/gameTypes';

interface PacManProps {
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
}

export const PacMan = ({ onScoreChange, onGameOver }: PacManProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!gameRef.current) return;

    const initialState: GameState = {
      player: {
        x: 40,
        y: 40,
        size: 20,
        speed: 2,
        direction: 0,
        mouthOpen: true
      },
      ghosts: [
        { x: 360, y: 40, color: [255, 0, 0], direction: 2 },
        { x: 360, y: 360, color: [255, 182, 255], direction: 3 },
        { x: 40, y: 360, color: [0, 255, 255], direction: 0 }
      ],
      dots: [],
      score: 0,
      totalDots: 0,
      gameStarted: false
    };

    const sketch = (p: p5) => {
      let gameState: GameState = { ...initialState };

      const resetGame = () => {
        const { dots, totalDots } = createDots();
        gameState = {
          ...initialState,
          dots,
          totalDots
        };
        onScoreChange(0);
      };

      p.setup = () => {
        console.log('Setting up Pac-Man game');
        p.createCanvas(400, 400);
        resetGame();
      };

      p.draw = () => {
        p.background(0);

        if (!gameState.gameStarted) {
          p.fill(255);
          p.textSize(20);
          p.textAlign(p.CENTER);
          p.text('Click to start', p.width / 2, p.height / 2);
          p.textSize(16);
          p.text('Use arrow keys to move', p.width / 2, p.height / 2 + 30);
          return;
        }

        // Draw maze
        p.stroke(0, 0, 255);
        for (let row = 0; row < MAZE_LAYOUT.length; row++) {
          for (let col = 0; col < MAZE_LAYOUT[0].length; col++) {
            if (MAZE_LAYOUT[row][col] === 1) {
              p.fill(0, 0, 255);
              p.rect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
          }
        }

        // Update player direction and position
        if (p.keyIsDown(p.RIGHT_ARROW)) gameState.player.direction = 0;
        if (p.keyIsDown(p.DOWN_ARROW)) gameState.player.direction = 1;
        if (p.keyIsDown(p.LEFT_ARROW)) gameState.player.direction = 2;
        if (p.keyIsDown(p.UP_ARROW)) gameState.player.direction = 3;

        let nextX = gameState.player.x;
        let nextY = gameState.player.y;
        
        switch (gameState.player.direction) {
          case 0: nextX += gameState.player.speed; break;
          case 1: nextY += gameState.player.speed; break;
          case 2: nextX -= gameState.player.speed; break;
          case 3: nextY -= gameState.player.speed; break;
        }

        if (!checkCollision(nextX, nextY)) {
          gameState.player.x = nextX;
          gameState.player.y = nextY;
        }

        // Update and draw ghosts
        gameState.ghosts = gameState.ghosts.map(ghost => {
          const newPos = moveGhost(ghost, 1);
          if (Math.random() < 0.02) {
            ghost.direction = Math.floor(Math.random() * 4);
          }
          return { ...ghost, ...newPos };
        });

        gameState.ghosts.forEach(ghost => {
          p.fill(ghost.color);
          p.noStroke();
          p.circle(ghost.x, ghost.y, gameState.player.size);

          const distance = p.dist(gameState.player.x, gameState.player.y, ghost.x, ghost.y);
          if (distance < gameState.player.size) {
            console.log('Ghost collision! Game over');
            gameState.gameStarted = false;
            onGameOver();
            resetGame();
            return;
          }
        });

        // Draw and check dots
        p.fill(255);
        gameState.dots = gameState.dots.filter(dot => {
          const distance = p.dist(gameState.player.x, gameState.player.y, dot.x, dot.y);
          if (distance < gameState.player.size / 2) {
            gameState.score++;
            onScoreChange(gameState.score);
            
            if (gameState.score >= Math.ceil(gameState.totalDots * 0.75)) {
              console.log('Game won! Final score:', gameState.score);
              onGameOver();
              resetGame();
              gameState.gameStarted = false;
              return false;
            }
            return false;
          }
          p.circle(dot.x, dot.y, 4);
          return true;
        });

        // Draw Pac-Man
        p.fill(255, 255, 0);
        p.push();
        p.translate(gameState.player.x, gameState.player.y);
        p.rotate(gameState.player.direction * p.HALF_PI);
        
        gameState.player.mouthOpen = p.frameCount % 30 < 15;
        if (gameState.player.mouthOpen) {
          p.arc(0, 0, gameState.player.size, gameState.player.size, p.PI / 6, -p.PI / 6);
        } else {
          p.circle(0, 0, gameState.player.size);
        }
        p.pop();
      };

      p.mousePressed = () => {
        if (!gameState.gameStarted && p.mouseX > 0 && p.mouseX < p.width && 
            p.mouseY > 0 && p.mouseY < p.height) {
          gameState.gameStarted = true;
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