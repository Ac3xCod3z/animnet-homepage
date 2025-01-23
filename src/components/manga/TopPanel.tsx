import { Input } from "@/components/ui/input";

interface TopPanelProps {
  code: string;
  setCode: (code: string) => void;
}

export const TopPanel = ({ code, setCode }: TopPanelProps) => {
  return (
    <div 
      className="glass relative min-h-[120px] bg-[#000000e6] border border-[#333333] shadow-lg"
      style={{
        clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 92%)",
        padding: "2rem",
        boxShadow: "inset 0 0 20px rgba(218, 55, 60, 0.1)"
      }}
    >
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Enter Redemption Code</h2>
        <Input
          type="text"
          placeholder="Enter code..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="bg-transparent border-white/20 text-white placeholder:text-white/50 focus-visible:ring-crimson/50"
        />
      </div>
    </div>
  );
};