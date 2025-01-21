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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* First Panel - Diagonal Split */}
          <div className="bg-black/90 p-6 relative transform hover:scale-[1.02] transition-transform duration-300 overflow-hidden rounded-lg">
            <div className="absolute top-0 right-0 w-full h-full bg-crimson/10 clip-diagonal"></div>
            <div className="absolute top-2 right-2">
              {React.createElement(features[0].icon, { 
                className: "w-8 h-8 text-crimson opacity-50" 
              })}
            </div>
            <div className="mt-8 relative z-10">
              <h3 className="text-xl font-bold mb-3 text-white font-orbitron">{features[0].title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-orbitron">{features[0].description}</p>
            </div>
          </div>
          
          {/* Second Panel - Gradient Overlay with Angular Cut */}
          <div className="bg-black/90 p-6 relative transform hover:scale-[1.02] transition-transform duration-300 overflow-hidden rounded-lg">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-crimson/20 to-transparent"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-crimson/10 rotate-45"></div>
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
          
          {/* Third Panel - Geometric Pattern */}
          <div className="bg-black/90 p-6 relative transform hover:scale-[1.02] transition-transform duration-300 overflow-hidden rounded-lg">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-crimson/5 rotate-45 transform -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-crimson/10 rotate-45 transform translate-y-16 -translate-x-16"></div>
            </div>
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