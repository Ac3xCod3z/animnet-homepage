import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MangaPanel } from "@/components/MangaPanel";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { supabase } from "@/integrations/supabase/client";

const Redeem = () => {
  const [redemptionCount, setRedemptionCount] = useState<string | null>(null);
  const [showCounter, setShowCounter] = useState(true);
  const [showAccessMessage, setShowAccessMessage] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

    fetchRedemptionCount();

    const codeChannel = supabase
      .channel('redemption_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'redemption_codes',
          filter: 'code=eq.MANGA2025'
        },
        (payload: any) => {
          console.log('Redeem: Real-time update received for redemption_codes:', payload);
          if (payload.new) {
            const remaining = payload.new.max_redemptions - payload.new.total_redemptions;
            console.log('New remaining redemptions:', remaining);
            if (remaining >= 0) {
              setShowCounter(false);
              setTimeout(() => {
                setRedemptionCount(remaining.toString());
                setShowCounter(true);
              }, 5000);
            }
          }
        }
      )
      .subscribe();

    const redemptionsChannel = supabase
      .channel('code_redemptions_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'code_redemptions'
        },
        (payload: any) => {
          console.log('Redeem: New redemption recorded:', payload);
          fetchRedemptionCount();
        }
      )
      .subscribe();

    return () => {
      console.log('Redeem: Cleaning up subscriptions');
      supabase.removeChannel(codeChannel);
      supabase.removeChannel(redemptionsChannel);
    };
  }, []);

  const handleAccessMessageChange = (show: boolean) => {
    setShowAccessMessage(show);
  };

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col">
      <Navbar />
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="flex-1 flex">
          <div className="w-full relative">
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Redeem;
