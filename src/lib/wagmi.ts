import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { createWeb3Modal } from '@web3modal/wagmi';

// Access the environment variable
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  console.error('WalletConnect project ID is not defined in environment variables');
  throw new Error('WalletConnect project ID is required');
}

console.log('Initializing WalletConnect with project ID:', projectId);

const { chains, publicClient } = configureChains(
  [mainnet, polygon],
  [publicProvider()]
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        showQrModal: false,
        metadata: {
          name: 'Your App Name',
          description: 'Your App Description',
          url: window.location.origin,
          icons: ['https://your-app-icon.com']
        }
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
});

// Initialize Web3Modal only after the window is fully loaded
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    if (!projectId) {
      console.error('Cannot initialize Web3Modal: Project ID is missing');
      return;
    }

    try {
      console.log('Initializing Web3Modal...');
      createWeb3Modal({
        wagmiConfig: config,
        projectId,
        chains,
        themeMode: 'dark',
        defaultChain: mainnet,
      });
      console.log('Web3Modal initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Web3Modal:', error);
    }
  });
}