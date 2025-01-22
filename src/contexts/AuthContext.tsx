import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { walletConnectModal, initializeWalletConnectModal, checkForInjectedProvider } from '@/lib/walletConnect';

interface AuthContextType {
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      try {
        console.log('Initializing WalletConnect modal...');
        await initializeWalletConnectModal();
        console.log('WalletConnect modal initialized successfully');
      } catch (error) {
        console.error('Failed to initialize WalletConnect:', error);
        toast({
          title: "Error",
          description: "Failed to initialize wallet connection",
          variant: "destructive",
        });
      }
    };

    init();
  }, [toast]);

  const connectWithInjectedProvider = async () => {
    try {
      console.log('Connecting with injected provider (MetaMask)...');
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
      
      // First try to connect with injected provider if available
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
      
      // If no injected provider or connection failed, use WalletConnect
      console.log('Opening WalletConnect modal...');
      await walletConnectModal.openModal();
      
      // For now, using a mock address until we implement full wallet connection
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

  return (
    <AuthContext.Provider
      value={{
        address,
        connectWallet: handleConnect,
        disconnectWallet: handleDisconnect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}