import { WalletConnectModal } from '@walletconnect/modal'
import { supabase } from "@/integrations/supabase/client";

// Initialize the WalletConnect Modal with a temporary ID
let walletConnectModal: WalletConnectModal;

// Function to initialize the modal with the project ID
export const initializeWalletConnectModal = async () => {
  try {
    console.log('Fetching WalletConnect project ID...');
    const { data, error } = await supabase.functions.invoke('get-wallet-connect-id');
    
    if (error) {
      console.error('Error fetching WalletConnect project ID:', error);
      throw error;
    }

    console.log('Successfully fetched WalletConnect project ID');
    
    walletConnectModal = new WalletConnectModal({
      projectId: data.projectId,
      chains: ['eip155:1'], // Ethereum mainnet
      themeMode: 'dark',
      themeVariables: {
        '--wcm-font-family': 'Orbitron, sans-serif',
        '--wcm-accent-color': '#da373c', // Using our crimson color
      }
    });

    return walletConnectModal;
  } catch (error) {
    console.error('Failed to initialize WalletConnect modal:', error);
    throw error;
  }
}

export { walletConnectModal };