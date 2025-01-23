import p5 from 'p5';

export const getRandomSymbol = (p: p5): string => {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ';
  return charset[Math.floor(p.random(charset.length))];
};

export const calculateNewPosition = (
  current: { x: number; y: number },
  target: { x: number; y: number },
  easing: number = 0.08
) => {
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  return {
    x: current.x + dx * easing,
    y: current.y + dy * easing,
    hasReachedTarget: Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1
  };
};