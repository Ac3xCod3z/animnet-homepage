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

  // Check if maximum redemptions reached
  if (data.total_redemptions >= data.max_redemptions) {
    console.log("Maximum redemptions reached:", data.total_redemptions, ">=", data.max_redemptions);
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
  // Insert redemption record
  const { error: insertError } = await supabase
    .from('code_redemptions')
    .insert([{
      code_id: codeData.id,
      wallet_address: address
    }]);

  console.log("Redemption insert error:", insertError);
  if (insertError) throw insertError;

  // Get updated redemption count
  const { data: updatedData, error: updateError } = await supabase
    .from('redemption_codes')
    .select('total_redemptions, max_redemptions')
    .eq('id', codeData.id)
    .single();

  console.log("Updated redemption data:", updatedData);
  if (updateError || !updatedData) throw updateError;

  const remaining = updatedData.max_redemptions - updatedData.total_redemptions;
  console.log(`Redemption processed. Remaining: ${remaining}, Total: ${updatedData.max_redemptions}`);
  
  return `${remaining}/${updatedData.max_redemptions}`;
}