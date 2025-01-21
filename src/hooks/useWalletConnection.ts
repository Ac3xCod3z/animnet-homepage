import { useConnect, useDisconnect } from 'wagmi';
import { showWalletNotification } from "@/utils/walletNotifications";
import { useWalletConnectionStatus } from "./useWalletConnectionStatus";

export const useWalletConnection = (_userId: string | undefined) => {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected, getDefaultConnector } = useWalletConnectionStatus();

  const connectWallet = async (): Promise<void> => {
    try {
      console.log("Attempting to connect wallet...");
      
      if (isConnected) {
        console.log("Wallet is already connected");
        showWalletNotification.alreadyConnected();
        return;
      }

      const connector = getDefaultConnector();
      const result = await connectAsync({ connector });
      
      if (!result?.account) {
        throw new Error('No account returned from wallet connection');
      }

      console.log("Wallet connected successfully:", result.account);
      showWalletNotification.connectionSuccess();
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      
      if (error.name === 'UserRejectedRequestError') {
        showWalletNotification.connectionCancelled();
        return;
      }

      if (error.name === 'ConnectorAlreadyConnectedError') {
        showWalletNotification.alreadyConnected();
        return;
      }

      showWalletNotification.connectionError();
      throw error;
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    try {
      console.log("Attempting to disconnect wallet...");
      await disconnectAsync();
      console.log("Wallet disconnected successfully");
      showWalletNotification.disconnectionSuccess();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      showWalletNotification.disconnectionError();
      throw error;
    }
  };

  return {
    connectWallet,
    disconnectWallet
  };
};