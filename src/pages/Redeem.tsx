import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MangaPanel } from "@/components/MangaPanel";
import { Hero } from "@/components/Hero";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Redeem = () => {
  const [redemptionCount, setRedemptionCount] = useState(5);

  useEffect(() => {
    const fetchRedemptionCount = async () => {
      const { data, error } = await supabase
        .from('redemption_codes')
        .select('total_redemptions')
        .eq('code', 'MANGA2024')
        .single();

      if (!error && data) {
        const remaining = 5 - data.total_redemptions;
        setRedemptionCount(remaining);
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
          filter: 'code=eq.MANGA2024'
        },
        (payload: any) => {
          const remaining = 5 - payload.new.total_redemptions;
          setRedemptionCount(remaining);
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
        <Hero count={redemptionCount} />
        <div className="relative z-10 container mx-auto px-4 pt-24">
          <h1 className="text-4xl font-bold text-center text-white font-orbitron mb-16">
            Redeem Your Code
          </h1>
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