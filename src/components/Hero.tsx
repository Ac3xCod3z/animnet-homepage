import { CodeStream } from "./CodeStream";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <CodeStream />
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center justify-center min-h-screen">
        <div className="glass p-8 rounded-lg max-w-3xl w-full">
          <img 
            src="/animnet-hero.png" 
            alt="AnimNet Hero" 
            className="w-full h-auto rounded-lg shadow-lg mb-8"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to <span className="text-crimson">AnimNet</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Your gateway to the future of anime and web3 technology
          </p>
        </div>
      </div>
    </div>
  );
};