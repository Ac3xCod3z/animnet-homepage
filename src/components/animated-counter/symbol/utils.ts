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
  // Custom elastic easing function for natural motion
  const easeOutElastic = (t: number) => {
    const p = 0.3; // Period
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  };
  
  // Combine elastic easing with smooth cubic
  const easeOutCombined = (t: number) => {
    const elastic = easeOutElastic(t);
    const cubic = 1 - Math.pow(1 - t, 3);
    return elastic * 0.7 + cubic * 0.3; // Blend both easing functions
  };

  const easedProgress = easeOutCombined(progress);
  
  // Calculate wave effect
  const waveAmplitude = 50 * (1 - progress); // Decreases as animation progresses
  const waveFrequency = 2;
  const wave = Math.sin(progress * Math.PI * waveFrequency) * waveAmplitude;
  
  // Add slight rotation effect
  const rotationRadius = 30 * (1 - progress);
  const rotationAngle = progress * Math.PI;
  const rotationX = Math.cos(rotationAngle) * rotationRadius;
  
  // Calculate final position with all effects combined
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  
  const newX = current.x + (dx * easedProgress) + rotationX;
  const newY = current.y + (dy * easedProgress) + wave;

  return {
    x: newX,
    y: newY,
    hasReachedTarget: progress >= 0.99
  };
};