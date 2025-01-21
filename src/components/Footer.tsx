import { Github, Twitter, MessageCircle, Sparkles, Rocket, Star, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden py-16 glass border-t border-white/10">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 animate-gradient" />
      
      {/* Floating sparkles */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <Sparkles
            key={i}
            className={cn(
              "absolute text-purple-400/30 animate-float",
              i === 0 && "top-10 left-[20%] w-8 h-8",
              i === 1 && "top-20 left-[60%] w-6 h-6",
              i === 2 && "top-16 left-[80%] w-4 h-4"
            )}
          />
        ))}
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold manga-text bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AnimNet
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed manga-text">
              Bridging the gap between anime culture and web3 technology. Join our community of creators and collectors.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2 manga-text">
              <Star className="w-4 h-4 text-purple-400" />
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 manga-text">
                  Marketplace
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 manga-text">
                  Collections
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 manga-text">
                  Artists
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2 manga-text">
              <MessageCircle className="w-4 h-4 text-purple-400" />
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 manga-text">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 manga-text">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors duration-200 manga-text">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white manga-text">Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="p-2 rounded-lg glass text-purple-400 hover:bg-purple-500/20 transition-colors duration-200 manga-border"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg glass text-purple-400 hover:bg-purple-500/20 transition-colors duration-200 manga-border"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg glass text-purple-400 hover:bg-purple-500/20 transition-colors duration-200 manga-border"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm manga-text">
              &copy; {new Date().getFullYear()} AnimNet. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200 manga-text">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors duration-200 manga-text">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};