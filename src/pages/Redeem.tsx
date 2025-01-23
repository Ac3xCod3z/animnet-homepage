import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MangaPanel } from "@/components/MangaPanel";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const Redeem = () => {
  const [redemptionCount, setRedemptionCount] = useState<string | null>(null);
  const [showCounter, setShowCounter] = useState(true);

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

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col">
      <Navbar />
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="flex-1 flex">
          <div className="w-full relative">
            <div className={`transition-opacity duration-500 ${showCounter ? 'opacity-100' : 'opacity-0'}`}>
              {redemptionCount !== null && showCounter && (
                <AnimatedCounter key={`counter-${redemptionCount}`} count={redemptionCount} />
              )}
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 p-8">
              <MangaPanel />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Redeem;