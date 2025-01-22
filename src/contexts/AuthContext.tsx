import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    // Will be implemented with new wallet connection logic
    console.log('Wallet connect to be implemented');
  };

  const handleDisconnect = async () => {
    // Will be implemented with new wallet connection logic
    console.log('Wallet disconnect to be implemented');
    setAddress(null);
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
