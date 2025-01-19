import { createContext, useContext, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { useAccount } from 'wagmi';
import { useAuthState } from "@/hooks/useAuthState";
import { useWalletConnection } from "@/hooks/useWalletConnection";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuthState();
  const { address } = useAccount();
  const { connectWallet, disconnectWallet, updateWalletAddress } = useWalletConnection(session?.user.id);

  useEffect(() => {
    if (address && session) {
      updateWalletAddress(address);
    }
  }, [address, session]);

  return (
    <AuthContext.Provider value={{ session, loading, connectWallet, disconnectWallet }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}