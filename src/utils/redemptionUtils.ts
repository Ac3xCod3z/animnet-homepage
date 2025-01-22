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
  // First, get the current total redemptions
  const { data: redemptionsData, error: redemptionsError } = await supabase
    .from('code_redemptions')
    .select('code_id')
    .eq('code_id', (
      await supabase
        .from('redemption_codes')
        .select('id')
        .eq('code', code)
        .single()
    ).data?.id);

  if (redemptionsError) {
    console.error("Error checking redemptions:", redemptionsError);
    return null;
  }

  const currentRedemptions = redemptionsData?.length || 0;

  // Then get the code data
  const { data, error } = await supabase
    .from('redemption_codes')
    .select('*')
    .eq('code', code)
    .single();

  console.log("Code lookup result:", data);
  console.log("Code lookup error:", error);
  console.log("Current total redemptions:", currentRedemptions);

  if (error || !data) {
    console.log("Invalid code or code not found");
    toast({
      title: "Error",
      description: "Invalid redemption code",
      variant: "destructive",
    });
    return null;
  }

  // Check if maximum redemptions reached before proceeding
  if (currentRedemptions >= data.max_redemptions) {
    console.log("Maximum redemptions reached:", currentRedemptions, ">=", data.max_redemptions);
    toast({
      title: "Error",
      description: "All redemption codes have been used",
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
  // Get current total redemptions count from code_redemptions table
  const { data: redemptionsData, error: countError } = await supabase
    .from('code_redemptions')
    .select('code_id')
    .eq('code_id', codeData.id);

  if (countError) throw countError;
  
  const currentRedemptions = redemptionsData?.length || 0;
  console.log('Current total redemptions:', currentRedemptions);

  // Double-check max redemptions haven't been reached
  if (currentRedemptions >= codeData.max_redemptions) {
    console.log("Maximum redemptions reached during processing");
    toast({
      title: "Error",
      description: "All redemption codes have been used",
      variant: "destructive",
    });
    return `0/${codeData.max_redemptions}`;
  }

  // Insert redemption
  const { error: insertError } = await supabase
    .from('code_redemptions')
    .insert([{
      code_id: codeData.id,
      wallet_address: address
    }]);

  console.log("Redemption insert error:", insertError);
  if (insertError) throw insertError;

  // Update redemption count
  const { error: updateError } = await supabase
    .from('redemption_codes')
    .update({ 
      total_redemptions: currentRedemptions + 1,
      updated_at: new Date().toISOString()
    })
    .eq('id', codeData.id);

  console.log("Update redemption count error:", updateError);
  if (updateError) throw updateError;

  const remaining = codeData.max_redemptions - (currentRedemptions + 1);
  console.log(`Redemption processed. Remaining: ${remaining}, Total: ${codeData.max_redemptions}`);
  
  return `${remaining}/${codeData.max_redemptions}`;
}