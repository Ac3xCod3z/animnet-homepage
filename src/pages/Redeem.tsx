import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MangaPanel } from "@/components/MangaPanel";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { Frogger } from "@/components/game/Frogger";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type RedemptionState = 'game' | 'wallet' | 'code' | 'processing';

const Redeem = () => {
  const [redemptionCount, setRedemptionCount] = useState<string | null>(null);
  const [showCounter, setShowCounter] = useState(true);
  const [showAccessMessage, setShowAccessMessage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentState, setCurrentState] = useState<RedemptionState>('game');
  const [gameScore, setGameScore] = useState(0);
  const { address, connectWallet } = useAuth();

  useEffect(() => {
    // If wallet is already connected, we can skip the wallet state
    if (address && currentState === 'wallet') {
      setCurrentState('code');
    }
  }, [address, currentState]);

  useEffect(() => {
    const fetchRedemptionCount = async () => {
      const { data, error } = await supabase
        .from('redemption_codes')
        .select('total_redemptions, max_redemptions')
        .eq('code', 'MANGA2025')
        .single();

      if (!error && data) {
        console.log('Redeem: Initial redemption data:', data);
        const remaining = data.max_redemptions - data.total_redemptions;
        console.log('Initial remaining redemptions:', remaining);
        if (remaining >= 0) {
          setRedemptionCount(remaining.toString());
        }
      } else {
        console.error('Error fetching redemption data:', error);
      }
    };

    if (currentState === 'code') {
      fetchRedemptionCount();
    }
  }, [currentState]);

  const handleGameComplete = (score: number) => {
    console.log('Game completed with score:', score);
    setGameScore(score);
    if (score >= 10) {
      setCurrentState(address ? 'code' : 'wallet');
    }
  };

  const handleWalletConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleAccessMessageChange = (show: boolean) => {
    setShowAccessMessage(show);
  };

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col">
      <Navbar />
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="flex-1 flex">
          <div className="w-full relative">
            {currentState === 'game' && (
              <div className="max-w-2xl mx-auto mt-8">
                <h2 className="text-2xl font-bold text-white text-center mb-4">
                  Score 10+ points to continue
                </h2>
                <Frogger 
                  onScoreChange={setGameScore} 
                  onGameOver={() => handleGameComplete(gameScore)}
                />
                <div className="text-white text-center mt-4">
                  Current Score: {gameScore}
                </div>
              </div>
            )}

            {currentState === 'wallet' && (
              <div className="flex flex-col items-center justify-center mt-16">
                <h2 className="text-2xl font-bold text-white mb-8">
                  Connect your wallet to continue
                </h2>
                <Button 
                  onClick={handleWalletConnect}
                  className="bg-crimson hover:bg-[#b22d31] text-white"
                >
                  Connect Wallet
                </Button>
              </div>
            )}

            {currentState === 'code' && (
              <>
                <div className={`transition-opacity duration-500 ${showCounter ? 'opacity-100' : 'opacity-0'}`}>
                  {redemptionCount !== null && showCounter && !showAccessMessage && (
                    <AnimatedCounter key={`counter-${redemptionCount}`} count={redemptionCount} />
                  )}
                </div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 p-8">
                  <MangaPanel onAccessMessageChange={handleAccessMessageChange} />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
                  <img 
                    src={isHovered ? "/animnet-hero.png" : "/animnet-hero1.png"}
                    alt="AnimNet Hero"
                    className="w-full max-w-3xl h-auto rounded-lg shadow-lg transition-all duration-300"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Redeem;