import { createConfig, configureChains } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { createWeb3Modal } from '@web3modal/wagmi/react';

const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
);

// Create config
export const config = createConfig({
  autoConnect: false,
  connectors: [
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

// Initialize WalletConnect
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '';

if (!projectId) {
  console.warn('WalletConnect project ID is not set');
} else {
  try {
    console.log('Setting up WalletConnect...');
    
    // Prepare metadata
    const metadata = {
      name: 'AnimNet',
      description: 'AnimNet Web3 Application',
      url: window.location.origin,
      icons: ['https://avatars.githubusercontent.com/u/37784886'],
    };

    // Prepare URLs
    const baseUrl = window.location.origin;
    const iconUrl = `${baseUrl}/placeholder.svg`;
    
    console.log('Base URL:', baseUrl);
    console.log('Icon URL:', iconUrl);

    // Add WalletConnect connector
    config.connectors.push(
      new WalletConnectConnector({
        chains,
        options: {
          projectId,
          metadata,
          showQrModal: false,
        },
      })
    );

    // Initialize Web3Modal
    if (typeof window !== 'undefined') {
      console.log('Initializing Web3Modal...');
      createWeb3Modal({
        wagmiConfig: config,
        projectId,
        chains,
        themeMode: 'dark',
        themeVariables: {
          accentColor: '#DC143C',
          backgroundColor: '#1a1a1a',
          fontFamily: 'Orbitron, sans-serif',
        },
      });
      console.log('Web3Modal initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing WalletConnect:', error);
  }
}

export { chains };