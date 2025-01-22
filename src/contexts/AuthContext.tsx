import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { initializeWalletConnectModal } from '@/lib/walletConnect';
import { useWalletConnection } from '@/hooks/useWalletConnection';

interface AuthContextType {
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  switchWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const walletConnection = useWalletConnection();

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

  return (
    <AuthContext.Provider value={walletConnection}>
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