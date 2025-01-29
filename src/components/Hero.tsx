import { CodeStream } from "./CodeStream";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <CodeStream />
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-end min-h-screen pb-8">
        <img 
          src="/animnet-hero.png" 
          alt="AnimNet Hero" 
          className="w-full max-w-3xl h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};