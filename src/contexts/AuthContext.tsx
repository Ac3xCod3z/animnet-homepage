import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

interface AuthContextType {
  address: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { address } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  const handleConnect = async () => {
    try {
      console.log('Attempting to connect wallet...');
      const result = await connectAsync({
        connector: connectors[0] // MetaMask connector
      });
      console.log('Wallet connected:', result.account);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const handleDisconnect = async () => {
    try {
      console.log('Disconnecting wallet...');
      await disconnectAsync();
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        address: address || null,
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