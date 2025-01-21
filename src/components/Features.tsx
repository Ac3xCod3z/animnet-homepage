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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Why Choose AnimNet
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-white/20 p-[2px]">
          {/* Large Panel */}
          <div className="bg-black/90 p-6 relative row-span-2 transform skew-y-1">
            <div className="absolute top-2 right-2">
              {React.createElement(features[0].icon, { 
                className: "w-8 h-8 text-blue-400 opacity-50" 
              })}
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-3 text-white">{features[0].title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{features[0].description}</p>
            </div>
          </div>
          
          {/* Medium Panel */}
          <div className="bg-black/90 p-6 relative col-span-2 transform -skew-x-1">
            <div className="absolute top-2 right-2">
              {React.createElement(features[1].icon, { 
                className: "w-8 h-8 text-blue-400 opacity-50" 
              })}
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-3 text-white">{features[1].title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{features[1].description}</p>
            </div>
          </div>
          
          {/* Small Panel */}
          <div className="bg-black/90 p-6 relative transform skew-x-1 md:col-start-2 md:col-span-2">
            <div className="absolute top-2 right-2">
              {React.createElement(features[2].icon, { 
                className: "w-8 h-8 text-blue-400 opacity-50" 
              })}
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-3 text-white">{features[2].title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{features[2].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};