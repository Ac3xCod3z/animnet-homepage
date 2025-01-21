import { CodeStream } from "./CodeStream";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <CodeStream />
      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 manga-text bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Welcome to AnimNet
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 manga-text">
          Your Gateway to Web3 Anime & Manga
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-8 py-3 rounded-lg manga-border glass text-white hover:bg-white/10 transition-all duration-300 manga-text">
            Explore Collections
          </button>
          <button className="px-8 py-3 rounded-lg manga-gradient text-white hover:opacity-90 transition-all duration-300 manga-text">
            Start Creating
          </button>
        </div>
      </div>
    </div>
  );
};