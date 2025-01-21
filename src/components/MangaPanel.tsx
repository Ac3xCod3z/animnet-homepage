import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export const MangaPanel = () => {
  return (
    <div className="w-full max-w-[400px] ml-16 lg:ml-32 space-y-8">
      {/* Top Panel */}
      <div 
        className="glass relative min-h-[180px] bg-[#000000e6] border border-[#333333] shadow-lg"
        style={{
          clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 92%)",
          padding: "2rem",
          boxShadow: "inset 0 0 20px rgba(218, 55, 60, 0.1)"
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-crimson font-orbitron tracking-wider">Enter Code</h2>
            <p className="text-sm text-[#8E9196] tracking-wide">
              Enter your redemption code below
            </p>
          </div>
          <Input 
            placeholder="Enter your code" 
            className="bg-[#111111] border-[#222222] hover:border-[#444444] focus:border-crimson transition-colors duration-200 text-white placeholder:text-[#555555] font-orbitron tracking-wider rounded-md"
          />
        </div>
      </div>
      
      {/* Bottom Panel */}
      <div 
        className="glass relative min-h-[120px] bg-[#000000e6] border border-[#333333] shadow-lg"
        style={{
          clipPath: "polygon(8% 0, 100% 8%, 100% 100%, 0 100%)",
          padding: "2rem",
          boxShadow: "inset 0 0 20px rgba(218, 55, 60, 0.1)"
        }}
      >
        <div className="space-y-4">
          <Button 
            className="w-full group bg-crimson hover:bg-[#b22d31] text-white font-orbitron tracking-wider shadow-lg transition-all duration-200"
          >
            Submit
            <Send className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};