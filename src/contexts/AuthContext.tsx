import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, useConnect, useDisconnect } from 'wagmi';

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

  const connectWallet = async (): Promise<void> => {
    try {
      console.log("Attempting to connect wallet...");
      const connector = connectors[0];
      const result = await connectAsync({ connector });
      
      if (!result?.account) {
        throw new Error('No account returned from wallet connection');
      }

      console.log("Wallet connected successfully:", result.account);
      toast({
        title: "Success",
        description: "Wallet connected successfully",
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      
      // Handle user rejection specifically
      if (error.name === 'UserRejectedRequestError') {
        toast({
          title: "Connection Cancelled",
          description: "You cancelled the wallet connection request",
          variant: "default"
        });
        return; // Exit without throwing since this is an expected user action
      }

      // Handle other errors
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to connect wallet. Please try again.",
      });
      throw error;
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    try {
      console.log("Attempting to disconnect wallet...");
      await disconnectAsync();
      
      if (session?.user.id) {
        const { error } = await supabase
          .from('profiles')
          .update({ wallet_address: null })
          .eq('id', session.user.id);

        if (error) throw error;
      }
      
      console.log("Wallet disconnected successfully");
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
      throw error;
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