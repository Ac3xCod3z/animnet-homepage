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
  const { address } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async () => {
    const validCode = validateRedemptionRequest(code, address);
    if (!validCode || !address) return;

    setIsLoading(true);
    try {
      const codeData = await checkCodeExists(validCode);
      if (!codeData) return;

      if (codeData.total_redemptions >= codeData.max_redemptions) {
        toast({
          title: "Error",
          description: "This code has reached its maximum number of redemptions",
          variant: "destructive",
        });
        return;
      }

      const hasRedeemed = await checkExistingRedemption(codeData.id, address);
      if (hasRedeemed) return;

      await processRedemption(codeData, address);
      
      toast({
        title: "Success",
        description: "Code redeemed successfully!",
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
      />
      <BottomPanel 
        isLoading={isLoading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};