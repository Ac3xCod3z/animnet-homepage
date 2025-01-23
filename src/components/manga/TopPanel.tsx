import { Input } from "@/components/ui/input";

interface TopPanelProps {
  code: string;
  setCode: (code: string) => void;
}

export const TopPanel = ({ code, setCode }: TopPanelProps) => {
  return (
    <div className="glass rounded-lg p-6 space-y-4 clip-diagonal-top">
      <h2 className="text-xl font-bold text-white">Enter Redemption Code</h2>
      <Input
        type="text"
        placeholder="Enter code..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="bg-transparent border-white/20 text-white placeholder:text-white/50"
      />
    </div>
  );
};