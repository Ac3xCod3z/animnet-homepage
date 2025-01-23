import p5 from 'p5';

export const getRandomSymbol = (p: p5): string => {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
  return charset[Math.floor(p.random(charset.length))];
};

export const calculateNewPosition = (
  current: { x: number; y: number },
  target: { x: number; y: number },
  progress: number = 0
) => {
  // Spiral parameters
  const spiralRadius = 50 * (1 - progress); // Radius decreases as we get closer
  const spiralAngle = progress * Math.PI * 4; // 2 complete rotations
  
  // Calculate spiral offset
  const spiralX = Math.cos(spiralAngle) * spiralRadius;
  const spiralY = Math.sin(spiralAngle) * spiralRadius;
  
  // Interpolate between current and target position with easing
  const easing = 0.05;
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  
  // Add spiral motion to the interpolated position
  const newX = current.x + (dx * easing) + spiralX;
  const newY = current.y + (dy * easing) + spiralY;
  
  // Calculate distance to target for completion check
  const distanceToTarget = Math.sqrt(
    Math.pow(target.x - newX, 2) + 
    Math.pow(target.y - newY, 2)
  );
  
  return {
    x: newX,
    y: newY,
    hasReachedTarget: distanceToTarget < 1
  };
};