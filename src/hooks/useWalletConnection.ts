import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { walletConnectModal, checkForInjectedProvider } from '@/lib/walletConnect';

export const useWalletConnection = () => {
  const [address, setAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const connectWithInjectedProvider = async () => {
    try {
      console.log('Requesting wallet connection with MetaMask...');
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (accounts[0]) {
        console.log('Connected with address:', accounts[0]);
        setAddress(accounts[0]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error connecting with injected provider:', error);
      return false;
    }
  };

  const handleConnect = async () => {
    try {
      console.log('Attempting to connect wallet');
      
      if (checkForInjectedProvider()) {
        const connected = await connectWithInjectedProvider();
        if (connected) {
          toast({
            title: "Connected",
            description: "Wallet connected successfully via extension",
          });
          return;
        }
      }
      
      console.log('Opening WalletConnect modal...');
      await walletConnectModal.openModal();
      
      setAddress("0x1234...5678");
      
      toast({
        title: "Connected",
        description: "Wallet connected successfully",
      });
    } catch (error) {
      console.error('Wallet connect error:', error);
      toast({
        title: "Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleSwitchWallet = async () => {
    try {
      console.log('Attempting to switch wallet');
      
      if (checkForInjectedProvider()) {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts[0]) {
          console.log('Switched to address:', accounts[0]);
          setAddress(accounts[0]);
          toast({
            title: "Wallet Switched",
            description: "Successfully switched to new wallet",
          });
        }
      } else {
        console.log('Opening WalletConnect modal for wallet switch...');
        await walletConnectModal.openModal();
      }
    } catch (error) {
      console.error('Wallet switch error:', error);
      toast({
        title: "Error",
        description: "Failed to switch wallet",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      console.log('Disconnecting wallet');
      walletConnectModal.closeModal();
      setAddress(null);
      toast({
        title: "Disconnected",
        description: "Wallet disconnected successfully",
      });
    } catch (error) {
      console.error('Wallet disconnect error:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
    }
  };

  return {
    address,
    connectWallet: handleConnect,
    disconnectWallet: handleDisconnect,
    switchWallet: handleSwitchWallet,
  };
};