import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { createWeb3Modal } from '@web3modal/wagmi';

// Access the environment variable
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  console.error('WalletConnect project ID is not defined');
}

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
        projectId: projectId || '',
        showQrModal: false, // Changed to false to prevent URL cloning issues
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
    if (projectId) {
      try {
        createWeb3Modal({
          wagmiConfig: config,
          projectId,
          chains,
          themeMode: 'dark',
        });
      } catch (error) {
        console.error('Failed to initialize Web3Modal:', error);
      }
    }
  });
}