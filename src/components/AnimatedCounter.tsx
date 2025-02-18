import { useEffect, useRef } from 'react';
import p5 from 'p5';
import { useP5Setup } from './animated-counter/useP5Setup';
import { AnimatedCounterProps } from './animated-counter/types';

export const AnimatedCounter = ({ count }: AnimatedCounterProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef<string>(count);
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (!sketchRef.current) return;
    
    // Validate that count is a positive number
    const numCount = parseInt(count);
    if (isNaN(numCount) || numCount < 0) {
      console.error('AnimatedCounter: Invalid count value:', count);
      return;
    }
    
    // Always animate on first render
    if (isFirstRender.current) {
      console.log('AnimatedCounter: Initial render with value:', count);
      isFirstRender.current = false;
      const sketch = useP5Setup(count);
      new p5(sketch, sketchRef.current);
    }
    // Then only trigger animation if count has changed
    else if (previousCountRef.current !== count) {
      console.log('AnimatedCounter: Transitioning from', previousCountRef.current, 'to', count);
      previousCountRef.current = count;
      const sketch = useP5Setup(count);
      new p5(sketch, sketchRef.current);
    }

    return () => {
      // Cleanup previous canvas on unmount or count change
      const existingCanvas = sketchRef.current?.querySelector('canvas');
      if (existingCanvas) {
        existingCanvas.remove();
      }
    };
  }, [count]); // Re-run effect when count changes

  return (
    <div 
      ref={sketchRef} 
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};