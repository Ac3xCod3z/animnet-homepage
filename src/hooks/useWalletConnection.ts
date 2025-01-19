import { useToast } from "@/components/ui/use-toast";
import { useConnect, useDisconnect } from 'wagmi';
import { supabase } from "@/integrations/supabase/client";

export const useWalletConnection = (userId: string | undefined) => {
  const { toast } = useToast();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const updateWalletAddress = async (address: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ wallet_address: address })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating wallet address:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update wallet address",
      });
    }
  };

  const connectWallet = async (): Promise<void> => {
    try {
      console.log("Attempting to connect wallet...");
      const connector = connectors[0];
      const result = await connectAsync({ connector });
      
      if (!result?.account) {
        throw new Error('No account returned from wallet connection');
      }

      console.log("Wallet connected successfully:", result.account);
      toast({
        title: "Success",
        description: "Wallet connected successfully",
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      
      if (error.name === 'UserRejectedRequestError') {
        toast({
          title: "Connection Cancelled",
          description: "You cancelled the wallet connection request",
          variant: "default"
        });
        return;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect wallet. Please try again.",
      });
      throw error;
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    try {
      console.log("Attempting to disconnect wallet...");
      await disconnectAsync();
      
      if (userId) {
        const { error } = await supabase
          .from('profiles')
          .update({ wallet_address: null })
          .eq('id', userId);

        if (error) throw error;
      }
      
      console.log("Wallet disconnected successfully");
      toast({
        title: "Success",
        description: "Wallet disconnected successfully",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to disconnect wallet. Please try again.",
      });
      throw error;
    }
  };

  return {
    connectWallet,
    disconnectWallet,
    updateWalletAddress
  };
};