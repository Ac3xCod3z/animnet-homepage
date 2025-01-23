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
  // Enhanced 3D spiral parameters
  const baseRadius = 100; // Larger initial radius
  const spiralRadius = baseRadius * Math.pow(1 - progress, 2); // Quadratic decrease for smoother transition
  const verticalStretch = 1.5; // Stretch the spiral vertically
  const rotations = 3; // Number of rotations during formation
  const spiralAngle = progress * Math.PI * 2 * rotations;
  
  // Add perspective effect
  const perspectiveScale = 0.5 + (progress * 0.5); // Scale from 0.5 to 1.0
  
  // Calculate 3D-like spiral motion
  const spiralX = Math.cos(spiralAngle) * spiralRadius * perspectiveScale;
  const spiralY = (Math.sin(spiralAngle) * spiralRadius * verticalStretch * perspectiveScale) + 
                  (Math.sin(progress * Math.PI) * 50); // Add vertical wave
  
  // Smooth easing function
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  const easedProgress = easeOutCubic(progress);
  
  // Calculate position with enhanced easing
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  
  // Combine linear movement with spiral
  const newX = current.x + (dx * easedProgress) + spiralX;
  const newY = current.y + (dy * easedProgress) + spiralY;
  
  // Smoother completion check
  const distanceToTarget = Math.sqrt(
    Math.pow(target.x - newX, 2) + 
    Math.pow(target.y - newY, 2)
  );
  
  return {
    x: newX,
    y: newY,
    hasReachedTarget: distanceToTarget < 1 || progress >= 0.99
  };
};