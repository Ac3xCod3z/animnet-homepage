import { useEffect, useRef } from 'react';
import p5 from 'p5';
import { useP5Setup } from './access-message/useP5Setup';

interface AccessMessageProps {
  type: 'granted' | 'denied';
  show: boolean;
}

export const AccessMessage = ({ type, show }: AccessMessageProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sketchRef.current || !show) return;

    const sketch = useP5Setup(type, sketchRef.current);
    const p5Instance = new p5(sketch, sketchRef.current);
    
    return () => {
      console.log('Cleaning up access message p5 sketch...');
      p5Instance.remove();
    };
  }, [type, show]);

  if (!show) return null;

  return (
    <div 
      ref={sketchRef} 
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      style={{ 
        zIndex: 50,
        width: '100vw',
        height: '100vh',
        position: 'absolute',
        left: 0,
        top: 0,
        clipPath: 'circle(30% at center)'
      }}
    />
  );
};