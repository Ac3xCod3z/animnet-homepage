import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MangaPanel } from "@/components/MangaPanel";
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
        <div className="relative z-10 container mx-auto px-4 pt-24">
          <div className="flex justify-start items-center min-h-[50vh]">
            <MangaPanel />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Redeem;