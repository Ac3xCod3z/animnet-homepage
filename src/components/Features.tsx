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
        <div className="grid grid-cols-12 gap-4 h-[600px]">
          {/* Large Left Panel - Angled Top */}
          <div className="col-span-5 row-span-2 bg-black/90 relative transform hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute inset-0" style={{
              clipPath: 'polygon(0 0, 100% 30px, 100% 100%, 0 100%)'
            }}>
              <div className="absolute inset-0 bg-gradient-to-br from-crimson/10 to-transparent" />
              <div className="p-6 mt-12">
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
            </div>
          </div>

          {/* Top Right Panel - Diagonal Bottom */}
          <div className="col-span-7 bg-black/90 relative transform hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute inset-0" style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 85%)'
            }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-crimson/10 to-transparent" />
              <div className="p-6">
                <div className="absolute top-2 right-2">
                  {React.createElement(features[1].icon, { 
                    className: "w-8 h-8 text-crimson opacity-50" 
                  })}
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-3 text-white font-orbitron">{features[1].title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-orbitron">{features[1].description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Right Panel - Angled Sides */}
          <div className="col-span-7 bg-black/90 relative transform hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute inset-0" style={{
              clipPath: 'polygon(0 15%, 100% 0, 100% 100%, 0 100%)'
            }}>
              <div className="absolute inset-0 bg-gradient-to-bl from-crimson/10 to-transparent" />
              <div className="p-6">
                <div className="absolute top-2 right-2">
                  {React.createElement(features[2].icon, { 
                    className: "w-8 h-8 text-crimson opacity-50" 
                  })}
                </div>
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-3 text-white font-orbitron">{features[2].title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-orbitron">{features[2].description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};