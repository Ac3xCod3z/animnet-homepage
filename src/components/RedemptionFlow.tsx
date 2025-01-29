import { useState } from 'react';
import { FlappyBird } from './game/FlappyBird';
import ReCAPTCHA from 'react-google-recaptcha';
import { getDeviceFingerprint } from '@/utils/fingerprint';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RedemptionFlowProps {
  code: string;
  walletAddress: string | null;
  onSuccess: () => void;
  onFailure: (message: string) => void;
}

interface RedemptionResponse {
  success: boolean;
  message: string;
  remainingRedemptions?: number;
}

export const RedemptionFlow = ({ 
  code, 
  walletAddress, 
  onSuccess, 
  onFailure 
}: RedemptionFlowProps) => {
  const [gameScore, setGameScore] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleGameOver = () => {
    if (gameScore >= 10) {
      console.log('Game completed with qualifying score:', gameScore);
      setShowCaptcha(true);
    } else {
      toast({
        title: "Score too low",
        description: "You need to score at least 10 points to proceed",
        variant: "destructive",
      });
    }
  };

  const handleCaptchaComplete = async (token: string | null) => {
    if (!token) {
      console.log('ReCAPTCHA verification failed');
      onFailure('ReCAPTCHA verification failed');
      return;
    }

    if (!walletAddress) {
      console.log('No wallet address available');
      onFailure('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Starting redemption process');
      const fingerprint = await getDeviceFingerprint();
      const ip = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip);

      const { data, error } = await supabase.rpc('check_and_redeem_code', {
        p_code: code,
        p_wallet_address: walletAddress,
        p_ip_address: ip,
        p_fingerprint: fingerprint,
        p_game_score: gameScore,
        p_recaptcha_token: token
      });

      if (error) throw error;

      const response = data as RedemptionResponse;
      
      if (response.success) {
        console.log('Redemption successful');
        onSuccess();
      } else {
        console.log('Redemption failed:', response.message);
        onFailure(response.message);
      }
    } catch (error) {
      console.error('Error in redemption process:', error);
      onFailure('Failed to process redemption');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {!showCaptcha ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Score 10 points to proceed
          </h3>
          <FlappyBird 
            onScoreChange={setGameScore} 
            onGameOver={handleGameOver}
          />
          <div className="text-sm text-white/70">
            Current Score: {gameScore}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Verify you're human
          </h3>
          <ReCAPTCHA
            sitekey="YOUR_RECAPTCHA_SITE_KEY"
            onChange={handleCaptchaComplete}
            theme="dark"
          />
          {isProcessing && (
            <div className="text-sm text-white/70">
              Processing your redemption...
            </div>
          )}
        </div>
      )}
    </div>
  );
};