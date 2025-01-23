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

    const sketch = useP5Setup(type);
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
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 50 }}
    />
  );
};