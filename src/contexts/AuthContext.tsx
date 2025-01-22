import { createContext, useContext, useState, ReactNode } from 'react';
import { connectWallet, disconnectWallet } from '@/lib/wallet';

interface AuthContextType {
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      await connectWallet();
      // The actual address will need to be retrieved from your Web3 provider
      // This is just a placeholder
      setAddress('0x...');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    try {
      disconnectWallet();
      setAddress(null);
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
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