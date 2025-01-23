import p5 from 'p5';

export const getRandomSymbol = (p: p5): string => {
  return String.fromCharCode(
    p.random(1) > 0.5 ? p.floor(p.random(65, 90)) : p.floor(p.random(48, 57))
  );
};

export const calculateNewPosition = (current: { x: number, y: number }, target: { x: number, y: number }) => {
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const speed = 0.1;
  
  return {
    x: current.x + (dx * speed),
    y: current.y + (dy * speed),
    hasReachedTarget: distance < 1
  };
};