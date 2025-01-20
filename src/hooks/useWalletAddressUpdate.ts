import { supabase } from "@/integrations/supabase/client";
import { showWalletNotification } from "@/utils/walletNotifications";

export const useWalletAddressUpdate = (userId: string | undefined) => {
  const updateWalletAddress = async (address: string | null) => {
    try {
      console.log(`Updating wallet address for user ${userId} to ${address}`);
      
      if (!userId) {
        console.log("No user ID provided for wallet address update");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ wallet_address: address })
        .eq('id', userId);

      if (error) {
        console.error('Error updating wallet address:', error);
        throw error;
      }

      console.log("Wallet address updated successfully");
    } catch (error) {
      console.error('Error in updateWalletAddress:', error);
      showWalletNotification.updateError();
      throw error;
    }
  };

  return { updateWalletAddress };
};