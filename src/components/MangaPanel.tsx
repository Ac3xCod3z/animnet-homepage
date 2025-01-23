import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { TopPanel } from "./manga/TopPanel";
import { BottomPanel } from "./manga/BottomPanel";
import { AccessMessage } from "./AccessMessage";
import { supabase } from "@/integrations/supabase/client";

type RedemptionResponse = {
  success: boolean;
  message: string;
  remainingRedemptions: number;
}

export const MangaPanel = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAccessMessage, setShowAccessMessage] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
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
      
      const { data, error } = await supabase.rpc('check_and_redeem_code', {
        p_code: code.trim(),
        p_wallet_address: address
      });

      console.log('Redemption response:', data);

      if (error) {
        throw error;
      }

      const response = data as RedemptionResponse;
      setAccessGranted(response.success);
      setShowAccessMessage(true);

      if (!response.success) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      console.log('MangaPanel: Redemption successful');
      
      toast({
        title: "Success",
        description: "Code redeemed successfully",
      });

      setCode("");
    } catch (error) {
      console.error("Error in redemption process:", error);
      setAccessGranted(false);
      setShowAccessMessage(true);
      toast({
        title: "Error",
        description: "Failed to redeem code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Hide the access message after 5 seconds
      setTimeout(() => {
        setShowAccessMessage(false);
      }, 5000);
    }
  };

  return (
    <>
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
      <AccessMessage 
        type={accessGranted ? 'granted' : 'denied'}
        show={showAccessMessage}
      />
    </>
  );
};