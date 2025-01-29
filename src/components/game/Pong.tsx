import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';

interface PongProps {
  onScoreChange: (score: number) => void;
  onGameOver: () => void;
}

export const Pong = ({ onScoreChange, onGameOver }: PongProps) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!gameRef.current) return;

    let paddle = {
      x: 20,
      y: 200,
      width: 10,
      height: 60,
      speed: 5
    };

    let ball = {
      x: 200,
      y: 200,
      size: 10,
      speedX: 4,
      speedY: 4
    };

    let aiPaddle = {
      x: 370,
      y: 200,
      width: 10,
      height: 60,
      speed: 4
    };

    let score = 0;
    let gameStarted = false;

    const sketch = (p: p5) => {
      p.setup = () => {
        console.log('Setting up Pong game');
        p.createCanvas(400, 400);
        resetGame();
      };

      const resetGame = () => {
        ball.x = p.width / 2;
        ball.y = p.height / 2;
        ball.speedX = 4 * (Math.random() > 0.5 ? 1 : -1);
        ball.speedY = 4 * (Math.random() > 0.5 ? 1 : -1);
        paddle.y = p.height / 2 - paddle.height / 2;
        aiPaddle.y = p.height / 2 - aiPaddle.height / 2;
        score = 0;
        onScoreChange(0);
      };

      const checkPaddleCollision = (paddleX: number, paddleY: number, paddleWidth: number, paddleHeight: number) => {
        return (
          ball.x + ball.size / 2 > paddleX &&
          ball.x - ball.size / 2 < paddleX + paddleWidth &&
          ball.y + ball.size / 2 > paddleY &&
          ball.y - ball.size / 2 < paddleY + paddleHeight
        );
      };

      p.draw = () => {
        p.background(0);

        if (!gameStarted) {
          p.fill(255);
          p.textSize(20);
          p.textAlign(p.CENTER);
          p.text('Click to start', p.width / 2, p.height / 2);
          p.textSize(16);
          p.text('Use mouse to move paddle', p.width / 2, p.height / 2 + 30);
          return;
        }

        // Draw center line
        p.stroke(255);
        p.strokeWeight(2);
        for (let i = 0; i < p.height; i += 20) {
          p.line(p.width / 2, i, p.width / 2, i + 10);
        }
        p.noStroke();

        // Update paddle position based on mouse
        paddle.y = p.constrain(p.mouseY - paddle.height / 2, 0, p.height - paddle.height);

        // Update AI paddle
        const aiTarget = ball.y - aiPaddle.height / 2;
        if (aiPaddle.y < aiTarget) {
          aiPaddle.y += aiPaddle.speed;
        } else if (aiPaddle.y > aiTarget) {
          aiPaddle.y -= aiPaddle.speed;
        }
        aiPaddle.y = p.constrain(aiPaddle.y, 0, p.height - aiPaddle.height);

        // Update ball position
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        // Ball collision with top and bottom
        if (ball.y - ball.size / 2 < 0 || ball.y + ball.size / 2 > p.height) {
          ball.speedY *= -1;
        }

        // Check for paddle collisions
        const playerHit = checkPaddleCollision(paddle.x, paddle.y, paddle.width, paddle.height);
        const aiHit = checkPaddleCollision(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

        // Handle player paddle collision
        if (playerHit && ball.speedX < 0) {
          ball.speedX *= -1;
          const relativeIntersectY = (paddle.y + (paddle.height / 2)) - ball.y;
          const normalizedRelativeIntersectY = relativeIntersectY / (paddle.height / 2);
          ball.speedY = -normalizedRelativeIntersectY * 6;
          
          score++;
          console.log('Score increased:', score);
          onScoreChange(score);

          if (score >= 3) {
            console.log('Game won! Final score:', score);
            onGameOver();
            resetGame();
            gameStarted = false;
          }
        }

        // Handle AI paddle collision
        if (aiHit && ball.speedX > 0) {
          ball.speedX *= -1;
          const relativeIntersectY = (aiPaddle.y + (aiPaddle.height / 2)) - ball.y;
          const normalizedRelativeIntersectY = relativeIntersectY / (aiPaddle.height / 2);
          ball.speedY = -normalizedRelativeIntersectY * 6;
        }

        // Check if ball is out (only if it's past the paddles)
        if (ball.x < 0 || ball.x > p.width) {
          console.log('Game Over! Final score:', score);
          onGameOver();
          resetGame();
          gameStarted = false;
          return;
        }

        // Draw paddles
        p.fill(255);
        p.rect(paddle.x, paddle.y, paddle.width, paddle.height);
        p.rect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

        // Draw ball
        p.ellipse(ball.x, ball.y, ball.size);

        // Draw score
        p.textSize(32);
        p.textAlign(p.CENTER);
        p.text(score, p.width / 2, 50);
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
      console.log('Cleaning up Pong game');
      p5Instance.remove();
      setIsPlaying(false);
    };
  }, [onScoreChange, onGameOver]);

  return (
    <div className="relative">
      <div ref={gameRef} className="rounded-lg overflow-hidden shadow-lg" />
      {isPlaying && (
        <div className="absolute top-2 left-2 bg-black/50 text-white px-3 py-1 rounded">
          Use mouse to move paddle
        </div>
      )}
    </div>
  );
};