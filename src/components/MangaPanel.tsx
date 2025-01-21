import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export const MangaPanel = () => {
  return (
    <div className="w-full max-w-md">
      <div className="glass clip-diagonal p-8 relative">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Enter Code</h2>
            <p className="text-sm text-gray-400">
              Enter your redemption code below
            </p>
          </div>
          <div className="space-y-4">
            <Input 
              placeholder="Enter your code" 
              className="bg-background/50 border-white/10 text-white placeholder:text-gray-500"
            />
            <Button className="w-full group">
              Submit
              <Send className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};