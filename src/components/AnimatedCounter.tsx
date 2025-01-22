import { useEffect, useRef } from 'react';
import p5 from 'p5';
import { useP5Setup } from './animated-counter/useP5Setup';

interface AnimatedCounterProps {
  count: string;
}

export const AnimatedCounter = ({ count }: AnimatedCounterProps) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const createSketch = useP5Setup(count);

  useEffect(() => {
    if (!sketchRef.current) return;
    console.log('AnimatedCounter: Updating counter with new value:', count);

    // Remove any existing canvas
    const existingCanvas = sketchRef.current.querySelector('canvas');
    if (existingCanvas) {
      existingCanvas.remove();
    }

    // Create new p5 instance with updated count
    const p5Instance = new p5(createSketch, sketchRef.current);
    
    return () => {
      p5Instance.remove();
    };
  }, [count, createSketch]); // Ensure effect runs when count changes

  return (
    <div 
      ref={sketchRef} 
      className="w-[400px] h-[200px] mx-auto"
      style={{ zIndex: 10 }}
    />
  );
};