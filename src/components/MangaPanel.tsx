import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type RedemptionResponse = {
  success: boolean;
  message: string;
  remainingRedemptions?: number;
}

export const MangaPanel = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redemptionCount, setRedemptionCount] = useState<string>("");
  const { address } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!address) {
      console.log("No wallet address found. Current address:", address);
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      toast({
        title: "Error",
        description: "Please enter a redemption code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Starting redemption process...");
      console.log("Code:", trimmedCode);
      console.log("Wallet address:", address);
      
      // First, let's check if the code exists
      const { data: codeData, error: codeError } = await supabase
        .from('redemption_codes')
        .select('*')
        .eq('code', trimmedCode)
        .single();

      console.log("Code lookup result:", codeData);
      console.log("Code lookup error:", codeError);

      if (codeError || !codeData) {
        console.log("Invalid code or code not found");
        toast({
          title: "Error",
          description: "Invalid redemption code",
          variant: "destructive",
        });
        return;
      }

      // Check if user has already redeemed
      const { data: existingRedemption, error: redemptionError } = await supabase
        .from('code_redemptions')
        .select('*')
        .eq('code_id', codeData.id)
        .eq('wallet_address', address)
        .single();

      console.log("Existing redemption check:", existingRedemption);
      console.log("Redemption check error:", redemptionError);

      if (existingRedemption) {
        console.log("Code already redeemed by this wallet");
        toast({
          title: "Error",
          description: "You have already redeemed this code",
          variant: "destructive",
        });
        return;
      }

      // Check if max redemptions reached
      if (codeData.total_redemptions >= codeData.max_redemptions) {
        console.log("Max redemptions reached");
        toast({
          title: "Error",
          description: "This code has reached its maximum number of redemptions",
          variant: "destructive",
        });
        return;
      }

      // Insert redemption
      const { error: insertError } = await supabase
        .from('code_redemptions')
        .insert([
          {
            code_id: codeData.id,
            wallet_address: address
          }
        ]);

      console.log("Redemption insert error:", insertError);

      if (insertError) {
        console.error("Error inserting redemption:", insertError);
        throw insertError;
      }

      // Update redemption count
      const { error: updateError } = await supabase
        .from('redemption_codes')
        .update({ 
          total_redemptions: codeData.total_redemptions + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', codeData.id);

      console.log("Update redemption count error:", updateError);

      if (updateError) {
        console.error("Error updating redemption count:", updateError);
        throw updateError;
      }

      // Update UI
      setRedemptionCount(`${codeData.total_redemptions + 1}/${codeData.max_redemptions}`);
      
      toast({
        title: "Success",
        description: `Code redeemed successfully. ${codeData.max_redemptions - (codeData.total_redemptions + 1)} redemptions remaining.`,
      });

      setCode("");
    } catch (error) {
      console.error("Error in redemption process:", error);
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