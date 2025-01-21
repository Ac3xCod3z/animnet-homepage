import React from 'react';
import { Shield, Zap, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure Platform",
    description: "Built on blockchain technology ensuring your creations remain protected and authenticated."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Experience seamless animation rendering and sharing with our optimized infrastructure."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Connect with fellow animators, share resources, and collaborate on projects."
  }
];

export const Features = () => {
  return (
    <section id="features" className="py-20 glass">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-orbitron">
          <span className="text-crimson">
            Why Choose AnimNet
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-white/20 p-[2px]">
          {/* Large Panel */}
          <div className="bg-black/90 p-6 relative row-span-2 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute top-2 right-2">
              {React.createElement(features[0].icon, { 
                className: "w-8 h-8 text-crimson opacity-50" 
              })}
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-3 text-white font-orbitron">{features[0].title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-orbitron">{features[0].description}</p>
            </div>
          </div>
          
          {/* Right Top Panel - Diagonal Split */}
          <div className="bg-black/90 p-6 relative col-span-2 transform hover:scale-[1.02] transition-transform duration-300 overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-crimson/10 clip-diagonal"></div>
            <div className="absolute top-2 right-2">
              {React.createElement(features[1].icon, { 
                className: "w-8 h-8 text-crimson opacity-50" 
              })}
            </div>
            <div className="mt-8 relative z-10">
              <h3 className="text-xl font-bold mb-3 text-white font-orbitron">{features[1].title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-orbitron">{features[1].description}</p>
            </div>
          </div>
          
          {/* Right Bottom Panel - Gradient Overlay */}
          <div className="bg-black/90 p-6 relative transform hover:scale-[1.02] transition-transform duration-300 md:col-start-2 md:col-span-2 overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-crimson/5 to-black/50"></div>
            <div className="absolute top-2 right-2">
              {React.createElement(features[2].icon, { 
                className: "w-8 h-8 text-crimson opacity-50" 
              })}
            </div>
            <div className="mt-8 relative z-10">
              <h3 className="text-xl font-bold mb-3 text-white font-orbitron">{features[2].title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-orbitron">{features[2].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};