import { createContext, useContext, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { useWalletConnection } from '@/hooks/useWalletConnection';

interface AuthContextType {
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount();
  const { connectWallet, disconnectWallet } = useWalletConnection();

  const value = {
    address: address ?? null,
    connectWallet,
    disconnectWallet,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};