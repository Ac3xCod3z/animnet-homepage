import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccount } from 'wagmi';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RedemptionResponse {
  success: boolean;
  message: string;
  remainingRedemptions?: number;
}

export const MangaPanel = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();
  const { address } = useAccount();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "Please sign in to redeem a code",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet to redeem a code",
        variant: "destructive",
      });
      return;
    }

    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter a redemption code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Attempting to redeem code:", code);
      const { data, error } = await supabase.rpc<RedemptionResponse>('check_and_redeem_code', {
        p_code: code.trim(),
        p_user_id: session.user.id,
        p_wallet_address: address
      });

      console.log("Redemption response:", data);

      if (error) {
        throw error;
      }

      if (!data.success) {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `${data.message}. ${data.remainingRedemptions} redemptions remaining.`,
      });

      setCode("");
    } catch (error) {
      console.error("Error redeeming code:", error);
      toast({
        title: "Error",
        description: "Failed to redeem code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            value={code}
            onChange={(e) => setCode(e.target.value)}
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
            onClick={handleSubmit}
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
    </div>
  );
};