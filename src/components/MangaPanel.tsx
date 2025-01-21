import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export const MangaPanel = () => {
  return (
    <div className="w-full max-w-[400px] ml-8 lg:ml-16">
      {/* Top Panel */}
      <div className="glass clip-diagonal-top p-8 relative mb-1 min-h-[180px] bg-[#000000e6]">
        <div className="space-y-4">
          <div className="space-y-2 text-left">
            <h2 className="text-2xl font-bold text-white font-orbitron">Enter Code</h2>
            <p className="text-sm text-[#8E9196]">
              Enter your redemption code below
            </p>
          </div>
          <Input 
            placeholder="Enter your code" 
            className="bg-[#222222] border-[#333333] text-white placeholder:text-[#555555] font-orbitron"
          />
        </div>
      </div>
      
      {/* Bottom Panel */}
      <div className="glass clip-diagonal-bottom p-8 relative min-h-[120px] bg-[#000000e6]">
        <div className="space-y-4">
          <Button 
            className="w-full group bg-[#3b82f6] hover:bg-[#2563eb] text-white font-orbitron"
          >
            Submit
            <Send className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};