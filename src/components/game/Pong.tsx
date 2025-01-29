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
        if (ball.y < 0 || ball.y > p.height) {
          ball.speedY *= -1;
        }

        // Ball collision with paddles
        // Left paddle (player) collision
        if (
          ball.x - ball.size / 2 <= paddle.x + paddle.width &&
          ball.x + ball.size / 2 >= paddle.x &&
          ball.y >= paddle.y &&
          ball.y <= paddle.y + paddle.height &&
          ball.speedX < 0
        ) {
          ball.speedX *= -1;
          // Add a slight vertical adjustment based on where the ball hits the paddle
          const relativeIntersectY = (paddle.y + (paddle.height / 2)) - ball.y;
          const normalizedRelativeIntersectY = relativeIntersectY / (paddle.height / 2);
          ball.speedY = -normalizedRelativeIntersectY * 6; // Max vertical speed of 6
          
          score++;
          console.log('Score increased:', score);
          onScoreChange(score);
        }

        // Right paddle (AI) collision
        if (
          ball.x + ball.size / 2 >= aiPaddle.x &&
          ball.x - ball.size / 2 <= aiPaddle.x + aiPaddle.width &&
          ball.y >= aiPaddle.y &&
          ball.y <= aiPaddle.y + aiPaddle.height &&
          ball.speedX > 0
        ) {
          ball.speedX *= -1;
          // Add a slight vertical adjustment based on where the ball hits the paddle
          const relativeIntersectY = (aiPaddle.y + (aiPaddle.height / 2)) - ball.y;
          const normalizedRelativeIntersectY = relativeIntersectY / (aiPaddle.height / 2);
          ball.speedY = -normalizedRelativeIntersectY * 6;
        }

        // Check if ball is out
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