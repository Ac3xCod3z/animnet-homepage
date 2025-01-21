import { CodeStream } from "./CodeStream";
import { AnimatedCounter } from "./AnimatedCounter";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Hero = () => {
  const [redemptionCount, setRedemptionCount] = useState("5/5");

  useEffect(() => {
    const fetchRedemptionCount = async () => {
      const { data, error } = await supabase
        .from('redemption_codes')
        .select('total_redemptions')
        .eq('code', 'MANGA2024')
        .single();

      if (!error && data) {
        const remaining = 5 - data.total_redemptions;
        setRedemptionCount(`${remaining}/5`);
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
          setRedemptionCount(`${remaining}/5`);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <CodeStream />
      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
        <AnimatedCounter count={redemptionCount} />
      </div>
    </div>
  );
};