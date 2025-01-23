import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TopPanel } from "./manga/TopPanel";
import { BottomPanel } from "./manga/BottomPanel";
import { 
  validateRedemptionRequest, 
  checkCodeExists, 
  checkExistingRedemption, 
  processRedemption 
} from "@/utils/redemptionUtils";

export const MangaPanel = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redemptionCount, setRedemptionCount] = useState<string>("");
  const { address } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    const validCode = validateRedemptionRequest(code, address);
    if (!validCode || !address) return;

    setIsLoading(true);
    try {
      console.log('MangaPanel: Starting redemption process');
      const codeData = await checkCodeExists(validCode);
      if (!codeData) return;

      const hasRedeemed = await checkExistingRedemption(codeData.id, address);
      if (hasRedeemed) return;

      const newRedemptionCount = await processRedemption(codeData, address);
      console.log('MangaPanel: Redemption successful, new count:', newRedemptionCount);
      setRedemptionCount(newRedemptionCount.split('/')[0]); // Only use the remaining count
      
      toast({
        title: "Success",
        description: `Code redeemed successfully. ${newRedemptionCount.split('/')[0]} redemptions remaining.`,
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