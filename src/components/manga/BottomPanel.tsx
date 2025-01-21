import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface BottomPanelProps {
  isLoading: boolean;
  onSubmit: () => void;
}

export const BottomPanel = ({ isLoading, onSubmit }: BottomPanelProps) => (
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
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full group bg-crimson hover:bg-[#b22d31] text-white font-orbitron tracking-wider shadow-lg transition-all duration-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Redeeming...
          </>
        ) : (
          <>
            Submit
            <Send className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </div>
  </div>
);