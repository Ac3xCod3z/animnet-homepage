import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export const MangaPanel = () => {
  return (
    <div className="w-full max-w-[400px] ml-16 lg:ml-32">
      {/* Top Panel */}
      <div className="glass clip-diagonal-top p-8 relative mb-1 min-h-[180px] bg-[#000000e6]">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-crimson font-orbitron">Enter Code</h2>
            <p className="text-sm text-[#8E9196]">
              Enter your redemption code below
            </p>
          </div>
          <Input 
            placeholder="Enter your code" 
            className="bg-[#111111] border-[#333333] text-white placeholder:text-[#555555] font-orbitron"
          />
        </div>
      </div>
      
      {/* Bottom Panel */}
      <div className="glass clip-diagonal-bottom p-8 relative min-h-[120px] bg-[#000000e6]">
        <div className="space-y-4">
          <Button 
            className="w-full group bg-crimson hover:bg-[#b22d31] text-white font-orbitron"
          >
            Submit
            <Send className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};