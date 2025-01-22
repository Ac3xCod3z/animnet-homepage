import { WalletConnectModal } from '@walletconnect/modal';

// Initialize WalletConnect Modal with project configuration
export const walletConnectModal = new WalletConnectModal({
  projectId: process.env.WALLET_CONNECT_PROJECT_ID || '',
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

// Helper functions for wallet connection
export const connectWallet = async () => {
  try {
    console.log('Attempting to connect wallet...');
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
    walletConnectModal.closeModal();
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
    throw error;
  }
};

// Subscribe to modal state changes
walletConnectModal.subscribeModal((state) => {
  console.log('Modal state changed:', state.open);
});