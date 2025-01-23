import { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import { useP5Setup } from './animated-counter/useP5Setup';
import { AnimatedCounterProps } from './animated-counter/types';

export const AnimatedCounter = ({ count }: AnimatedCounterProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [currentCount, setCurrentCount] = useState(count);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!sketchRef.current) return;
    
    // Validate that count is a positive number
    const numCount = parseInt(count);
    if (isNaN(numCount) || numCount <= 0) {
      console.error('AnimatedCounter: Invalid count value:', count);
      return;
    }
    
    if (count !== currentCount) {
      console.log('AnimatedCounter: Starting transition from', currentCount, 'to', count);
      setIsTransitioning(true);
      
      // Allow time for dissolution animation
      setTimeout(() => {
        setCurrentCount(count);
        setIsTransitioning(false);
      }, 2000); // Match this with the dissolution duration in useP5Setup
    }

    const existingCanvas = sketchRef.current.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    const sketch = useP5Setup(currentCount, isTransitioning);
    new p5(sketch, sketchRef.current);
  }, [count, currentCount, isTransitioning]);

  return (
    <div 
      ref={sketchRef} 
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};