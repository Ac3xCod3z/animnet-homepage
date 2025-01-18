import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center gradient-bg overflow-hidden">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative container mx-auto px-4 py-32 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-float">
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            The Future of Animation
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Connect, create, and collaborate in the next generation of animation networks.
          Powered by blockchain technology.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="secondary" className="glass">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};