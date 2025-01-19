import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { config } from '@/lib/wagmi';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();

  useEffect(() => {
    console.log("Setting up auth state listener");
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (address && session) {
      updateWalletAddress(address);
    }
  }, [address, session]);

  const updateWalletAddress = async (address: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ wallet_address: address })
        .eq('id', session?.user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating wallet address:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update wallet address",
      });
    }
  };

  const connectWallet = async () => {
    try {
      const connector = connectors[0]; // WalletConnect connector
      const result = await connectAsync({ connector });
      
      if (result.address) {
        toast({
          title: "Success",
          description: "Wallet connected successfully",
        });
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect wallet. Please try again.",
      });
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnectAsync();
      
      if (session?.user.id) {
        const { error } = await supabase
          .from('profiles')
          .update({ wallet_address: null })
          .eq('id', session.user.id);

        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "Wallet disconnected successfully",
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to disconnect wallet. Please try again.",
      });
    }
  };

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