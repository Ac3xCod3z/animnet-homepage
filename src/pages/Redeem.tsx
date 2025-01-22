import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MangaPanel } from "@/components/MangaPanel";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const Redeem = () => {
  const [redemptionCount, setRedemptionCount] = useState("5/5");

  useEffect(() => {
    const fetchRedemptionCount = async () => {
      const { data, error } = await supabase
        .from('redemption_codes')
        .select('total_redemptions, max_redemptions')
        .eq('code', 'MANGA2025')
        .single();

      if (!error && data) {
        console.log('Redeem: Fetched redemption data:', data);
        const remaining = data.max_redemptions - data.total_redemptions;
        setRedemptionCount(`${remaining}/${data.max_redemptions}`);
      }
    };

    fetchRedemptionCount();

    // Subscribe to changes
    const channel = supabase
      .channel('redemption_updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'redemption_codes',
          filter: 'code=eq.MANGA2025'
        },
        (payload: any) => {
          console.log('Redeem: Realtime update received:', payload);
          const remaining = payload.new.max_redemptions - payload.new.total_redemptions;
          const newCount = `${remaining}/${payload.new.max_redemptions}`;
          console.log('Setting new redemption count:', newCount);
          setRedemptionCount(newCount);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col">
      <Navbar />
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="flex-1 flex">
          {/* Full-width section for the counter */}
          <div className="w-full relative">
            <AnimatedCounter count={redemptionCount.split('/')[0]} />
            {/* Overlay the form on top */}
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