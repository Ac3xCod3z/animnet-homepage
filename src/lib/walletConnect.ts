import { WalletConnectModal } from '@walletconnect/modal'

// Initialize the WalletConnect Modal
export const walletConnectModal = new WalletConnectModal({
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '',
  chains: ['eip155:1'], // Ethereum mainnet
  themeMode: 'dark',
  themeVariables: {
    '--wcm-font-family': 'Orbitron, sans-serif',
    '--wcm-accent-color': '#da373c', // Using our crimson color
  }
})