import { createContext, useContext, ReactNode } from "react";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { useAccount } from 'wagmi';

interface AuthContextType {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  address: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { address } = useAccount();
  const { connectWallet, disconnectWallet } = useWalletConnection(undefined);

  return (
    <AuthContext.Provider value={{
      connectWallet,
      disconnectWallet,
      address
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};