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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-black p-1">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors relative"
            >
              <div className="absolute top-2 right-2">
                <feature.icon className="w-8 h-8 text-blue-400 opacity-50" />
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};