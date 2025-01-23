import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TopPanel } from "./manga/TopPanel";
import { BottomPanel } from "./manga/BottomPanel";
import { supabase } from "@/integrations/supabase/client";

type RedemptionResponse = {
  success: boolean;
  message: string;
  remainingRedemptions: number;
}

export const MangaPanel = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redemptionCount, setRedemptionCount] = useState<string>("");
  const { address } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
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
      console.log('MangaPanel: Starting redemption process');
      
      // Call the database function to handle redemption
      const { data, error } = await supabase.rpc('check_and_redeem_code', {
        p_code: code.trim(),
        p_wallet_address: address
      });

      console.log('Redemption response:', data);

      if (error) {
        throw error;
      }

      // Cast the response to our expected type
      const response = data as RedemptionResponse;

      if (!response.success) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      console.log('MangaPanel: Redemption successful, remaining:', response.remainingRedemptions);
      setRedemptionCount(response.remainingRedemptions.toString());
      
      toast({
        title: "Success",
        description: `Code redeemed successfully. ${response.remainingRedemptions} redemptions remaining.`,
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
      <TopPanel 
        code={code}
        setCode={setCode}
        redemptionCount={redemptionCount}
      />
      <BottomPanel 
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};