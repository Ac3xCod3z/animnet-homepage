import { toast } from "@/components/ui/use-toast";

export const showWalletNotification = {
  alreadyConnected: () => {
    toast({
      title: "Info",
      description: "Wallet is already connected",
    });
  },

  connectionSuccess: () => {
    toast({
      title: "Success",
      description: "Wallet connected successfully",
    });
  },

  connectionCancelled: () => {
    toast({
      title: "Connection Cancelled",
      description: "You cancelled the wallet connection request",
      variant: "default"
    });
  },

  connectionError: () => {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to connect wallet. Please try again.",
    });
  },

  disconnectionSuccess: () => {
    toast({
      title: "Success",
      description: "Wallet disconnected successfully",
    });
  },

  disconnectionError: () => {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to disconnect wallet. Please try again.",
    });
  },

  updateError: () => {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to update wallet address",
    });
  }
};