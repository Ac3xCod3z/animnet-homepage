import { WalletConnectModal } from '@walletconnect/modal';
import { supabase } from '@/integrations/supabase/client';

// Initialize WalletConnect Modal with project configuration
let walletConnectModal: WalletConnectModal;

const initializeWalletConnect = async () => {
  try {
    console.log('Fetching WalletConnect project ID...');
    const { data, error } = await supabase.functions.invoke('get-wallet-connect-id');
    
    if (error) {
      console.error('Error fetching WalletConnect project ID:', error);
      throw error;
    }

    if (!data?.projectId) {
      throw new Error('No project ID returned from Edge Function');
    }

    walletConnectModal = new WalletConnectModal({
      projectId: data.projectId,
      chains: ['eip155:1'], // Ethereum mainnet
      themeMode: 'dark',
      themeVariables: {
        '--wcm-font-family': 'Orbitron, sans-serif',
        '--wcm-accent-color': '#da373c',
        '--wcm-accent-fill-color': '#ffffff',
        '--wcm-background-color': '#1a1b1f',
        '--wcm-overlay-background-color': 'rgba(0, 0, 0, 0.8)',
        '--wcm-container-border-radius': '24px',
        '--wcm-wallet-icon-border-radius': '12px',
        '--wcm-button-border-radius': '8px',
        '--wcm-notification-border-radius': '8px',
      }
    });

    console.log('WalletConnect initialized successfully');
  } catch (error) {
    console.error('Failed to initialize WalletConnect:', error);
  }
};

// Initialize immediately in browser environment
if (typeof window !== 'undefined') {
  initializeWalletConnect().catch(console.error);
}

// Helper functions for wallet connection
export const connectWallet = async () => {
  try {
    console.log('Attempting to connect wallet...');
    if (!walletConnectModal) {
      throw new Error('WalletConnect Modal not initialized');
    }
    await walletConnectModal.openModal({
      uri: 'YOUR_CONNECTION_URI' // This will need to be provided by your Web3 provider
    });
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const disconnectWallet = () => {
  try {
    console.log('Disconnecting wallet...');
    if (!walletConnectModal) {
      throw new Error('WalletConnect Modal not initialized');
    }
    walletConnectModal.closeModal();
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    throw error;
  }
};

// Subscribe to modal state changes
if (typeof window !== 'undefined' && walletConnectModal) {
  walletConnectModal.subscribeModal((state) => {
    console.log('Modal state changed:', state.open);
  });
}

export { walletConnectModal };