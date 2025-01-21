import { Input } from "@/components/ui/input";

interface TopPanelProps {
  code: string;
  setCode: (code: string) => void;
  redemptionCount: string;
}

export const TopPanel = ({ code, setCode, redemptionCount }: TopPanelProps) => (
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
          {redemptionCount && (
            <span className="ml-2 text-crimson font-orbitron">
              ({redemptionCount} redeemed)
            </span>
          )}
        </p>
      </div>
      <Input 
        placeholder="Enter your code" 
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="bg-[#111111] border-[#222222] hover:border-[#444444] focus:border-crimson transition-colors duration-200 text-white placeholder:text-[#555555] font-orbitron tracking-wider rounded-md"
      />
    </div>
  </div>
);