import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type RedemptionResponse = {
  success: boolean;
  message: string;
  remainingRedemptions?: number;
}

export const validateRedemptionRequest = (code: string, address: string | undefined) => {
  if (!address) {
    console.log("No wallet address found. Current address:", address);
    toast({
      title: "Error",
      description: "Please connect your wallet first",
      variant: "destructive",
    });
    return false;
  }

  const trimmedCode = code.trim().toUpperCase();
  if (!trimmedCode) {
    toast({
      title: "Error",
      description: "Please enter a redemption code",
      variant: "destructive",
    });
    return false;
  }

  return trimmedCode;
}

export const checkCodeExists = async (code: string) => {
  const { data, error } = await supabase
    .from('redemption_codes')
    .select('*')
    .eq('code', code)
    .single();

  console.log("Code lookup result:", data);
  console.log("Code lookup error:", error);

  if (error || !data) {
    console.log("Invalid code or code not found");
    toast({
      title: "Error",
      description: "Invalid redemption code",
      variant: "destructive",
    });
    return null;
  }

  return data;
}

export const checkExistingRedemption = async (codeId: string, address: string) => {
  const { data, error } = await supabase
    .from('code_redemptions')
    .select('*')
    .eq('code_id', codeId)
    .eq('wallet_address', address)
    .maybeSingle();

  console.log("Existing redemption check:", data);
  console.log("Redemption check error:", error);

  if (error) {
    console.error("Error checking redemption:", error);
    toast({
      title: "Error",
      description: "Failed to check redemption status",
      variant: "destructive",
    });
    throw error;
  }

  if (data) {
    console.log("Code already redeemed by this wallet");
    toast({
      title: "Error",
      description: "You have already redeemed this code",
      variant: "destructive",
    });
    return true;
  }

  return false;
}

export const processRedemption = async (codeData: any, address: string) => {
  // Get current redemption count
  const { data: currentData, error: countError } = await supabase
    .from('redemption_codes')
    .select('total_redemptions, max_redemptions')
    .eq('id', codeData.id)
    .single();

  if (countError) throw countError;
  console.log('Current redemption data:', currentData);

  // Insert redemption
  const { error: insertError } = await supabase
    .from('code_redemptions')
    .insert([{
      code_id: codeData.id,
      wallet_address: address
    }]);

  console.log("Redemption insert error:", insertError);
  if (insertError) throw insertError;

  // Update redemption count with the latest value
  const newTotalRedemptions = (currentData.total_redemptions || 0) + 1;
  const { error: updateError } = await supabase
    .from('redemption_codes')
    .update({ 
      total_redemptions: newTotalRedemptions,
      updated_at: new Date().toISOString()
    })
    .eq('id', codeData.id);

  console.log("Update redemption count error:", updateError);
  if (updateError) throw updateError;

  const remaining = currentData.max_redemptions - newTotalRedemptions;
  console.log(`Redemption processed. Remaining: ${remaining}, Total: ${currentData.max_redemptions}`);
  
  return `${remaining}/${currentData.max_redemptions}`;
}