import { Position } from '../types/gameTypes';
import { MAZE_LAYOUT, CELL_SIZE } from '../constants/mazeConfig';

export const checkCollision = (x: number, y: number): boolean => {
  const row = Math.floor(y / CELL_SIZE);
  const col = Math.floor(x / CELL_SIZE);
  return MAZE_LAYOUT[row][col] === 1;
};

export const createDots = (): { dots: Position[]; totalDots: number } => {
  const dots: Position[] = [];
  let totalDots = 0;
  
  for (let row = 0; row < MAZE_LAYOUT.length; row++) {
    for (let col = 0; col < MAZE_LAYOUT[0].length; col++) {
      if (MAZE_LAYOUT[row][col] === 0) {
        dots.push({ 
          x: col * CELL_SIZE + CELL_SIZE/2, 
          y: row * CELL_SIZE + CELL_SIZE/2 
        });
        totalDots++;
      }
    }
  }
  
  return { dots, totalDots };
};

export const moveGhost = (ghost: Position, speed: number): Position => {
  let nextX = ghost.x;
  let nextY = ghost.y;

  switch (ghost.direction) {
    case 0: nextX += speed; break;
    case 1: nextY += speed; break;
    case 2: nextX -= speed; break;
    case 3: nextY -= speed; break;
  }

  const nextCol = Math.floor(nextX / CELL_SIZE);
  const nextRow = Math.floor(nextY / CELL_SIZE);
  
  if (MAZE_LAYOUT[nextRow] && MAZE_LAYOUT[nextRow][nextCol] === 0) {
    return { x: nextX, y: nextY };
  }
  
  return ghost;
};