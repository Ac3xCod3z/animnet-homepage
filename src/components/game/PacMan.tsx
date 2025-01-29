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
      x: 40,
      y: 40,
      size: 20,
      speed: 2,
      direction: 0, // 0: right, 1: down, 2: left, 3: up
      mouthOpen: true
    };

    let ghosts = [
      { x: 360, y: 40, color: [255, 0, 0], direction: 2 },    // Red ghost
      { x: 360, y: 360, color: [255, 182, 255], direction: 3 }, // Pink ghost
      { x: 40, y: 360, color: [0, 255, 255], direction: 0 }   // Cyan ghost
    ];

    // Define maze walls - 1 represents walls, 0 represents paths
    const maze = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
      [1,1,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1],
      [1,1,1,0,1,0,1,0,1,1,1,1,0,1,0,1,0,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,0,0,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,1,0,1,0,0,0,0,0,0,1,0,1,0,0,0,1],
      [1,0,1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,1,0,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];

    let dots: { x: number; y: number; }[] = [];
    let score = 0;
    let totalDots = 0;
    let gameStarted = false;
    const cellSize = 20;

    const sketch = (p: p5) => {
      p.setup = () => {
        console.log('Setting up Pac-Man game');
        p.createCanvas(400, 400);
        resetGame();
      };

      const resetGame = () => {
        // Reset player position
        player.x = 40;
        player.y = 40;
        player.direction = 0;
        score = 0;
        onScoreChange(0);
        
        // Create dots in empty spaces
        dots = [];
        totalDots = 0;
        for (let row = 0; row < maze.length; row++) {
          for (let col = 0; col < maze[0].length; col++) {
            if (maze[row][col] === 0) {
              dots.push({ 
                x: col * cellSize + cellSize/2, 
                y: row * cellSize + cellSize/2 
              });
              totalDots++;
            }
          }
        }

        // Reset ghost positions
        ghosts = [
          { x: 360, y: 40, color: [255, 0, 0], direction: 2 },
          { x: 360, y: 360, color: [255, 182, 255], direction: 3 },
          { x: 40, y: 360, color: [0, 255, 255], direction: 0 }
        ];
      };

      const moveGhosts = () => {
        ghosts.forEach(ghost => {
          // Try to maintain current direction
          let nextX = ghost.x;
          let nextY = ghost.y;
          const speed = 1;

          switch (ghost.direction) {
            case 0: nextX += speed; break;
            case 1: nextY += speed; break;
            case 2: nextX -= speed; break;
            case 3: nextY -= speed; break;
          }

          // Check if next position hits a wall
          const nextCol = Math.floor(nextX / cellSize);
          const nextRow = Math.floor(nextY / cellSize);
          
          if (maze[nextRow] && maze[nextRow][nextCol] === 0) {
            ghost.x = nextX;
            ghost.y = nextY;
          } else {
            // Change direction if hit wall
            ghost.direction = Math.floor(Math.random() * 4);
          }
        });
      };

      const checkCollision = (x: number, y: number) => {
        const row = Math.floor(y / cellSize);
        const col = Math.floor(x / cellSize);
        return maze[row][col] === 1;
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

        // Draw maze
        p.stroke(0, 0, 255);
        for (let row = 0; row < maze.length; row++) {
          for (let col = 0; col < maze[0].length; col++) {
            if (maze[row][col] === 1) {
              p.fill(0, 0, 255);
              p.rect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
          }
        }

        // Update player direction based on input
        if (p.keyIsDown(p.RIGHT_ARROW)) player.direction = 0;
        if (p.keyIsDown(p.DOWN_ARROW)) player.direction = 1;
        if (p.keyIsDown(p.LEFT_ARROW)) player.direction = 2;
        if (p.keyIsDown(p.UP_ARROW)) player.direction = 3;

        // Move player
        let nextX = player.x;
        let nextY = player.y;
        switch (player.direction) {
          case 0: nextX += player.speed; break;
          case 1: nextY += player.speed; break;
          case 2: nextX -= player.speed; break;
          case 3: nextY -= player.speed; break;
        }

        // Check wall collision before updating position
        if (!checkCollision(nextX, nextY)) {
          player.x = nextX;
          player.y = nextY;
        }

        // Move and draw ghosts
        moveGhosts();
        ghosts.forEach(ghost => {
          p.fill(ghost.color);
          p.noStroke();
          p.circle(ghost.x, ghost.y, player.size);

          // Check ghost collision
          const distance = p.dist(player.x, player.y, ghost.x, ghost.y);
          if (distance < player.size) {
            console.log('Ghost collision! Game over');
            gameStarted = false;
            onGameOver();
            resetGame();
            return;
          }
        });

        // Draw dots and check collection
        p.fill(255);
        dots = dots.filter(dot => {
          const distance = p.dist(player.x, player.y, dot.x, dot.y);
          if (distance < player.size / 2) {
            score++;
            console.log('Score increased:', score);
            onScoreChange(score);
            
            // Win condition: collect 75% of dots
            if (score >= Math.ceil(totalDots * 0.75)) {
              console.log('Game won! Final score:', score);
              onGameOver();
              resetGame();
              gameStarted = false;
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
        if (!gameStarted && p.mouseX > 0 && p.mouseX < p.width && 
            p.mouseY > 0 && p.mouseY < p.height) {
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