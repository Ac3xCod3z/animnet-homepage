import { useState, useEffect } from "react";
import { TopPanel } from "./manga/TopPanel";
import { BottomPanel } from "./manga/BottomPanel";
import { AccessMessage } from "./AccessMessage";
import { RedemptionFlow } from "./RedemptionFlow";
import { useRedemption } from "@/hooks/useRedemption";
import { useAuth } from "@/contexts/AuthContext";

interface MangaPanelProps {
  onAccessMessageChange: (show: boolean) => void;
}

export const MangaPanel = ({ onAccessMessageChange }: MangaPanelProps) => {
  const [code, setCode] = useState("");
  const [showRedemptionFlow, setShowRedemptionFlow] = useState(false);
  const { 
    isLoading, 
    showAccessMessage, 
    accessGranted, 
    handleRedemption 
  } = useRedemption();
  const { address } = useAuth();

  useEffect(() => {
    onAccessMessageChange(showAccessMessage);
  }, [showAccessMessage, onAccessMessageChange]);

  const handleSubmit = () => {
    if (!address) {
      console.log('No wallet connected');
      return;
    }
    console.log('Starting redemption flow');
    setShowRedemptionFlow(true);
  };

  const handleRedemptionSuccess = async () => {
    console.log('Redemption flow completed successfully');
    setShowRedemptionFlow(false);
    await handleRedemption(code);
    setCode("");
  };

  const handleRedemptionFailure = (message: string) => {
    console.log('Redemption flow failed:', message);
    setShowRedemptionFlow(false);
  };

  return (
    <>
      <div className={`w-full max-w-[400px] ml-16 lg:ml-32 space-y-8 transition-opacity duration-500 ${showAccessMessage ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        {showRedemptionFlow ? (
          <RedemptionFlow
            code={code}
            walletAddress={address}
            onSuccess={handleRedemptionSuccess}
            onFailure={handleRedemptionFailure}
          />
        ) : (
          <>
            <TopPanel 
              code={code}
              setCode={setCode}
            />
            <BottomPanel 
              isLoading={isLoading}
              onSubmit={handleSubmit}
            />
          </>
        )}
      </div>
      <AccessMessage 
        type={accessGranted ? 'granted' : 'denied'}
        show={showAccessMessage}
      />
    </>
  );
};