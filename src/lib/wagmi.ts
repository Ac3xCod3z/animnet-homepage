import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { createWeb3Modal } from '@web3modal/wagmi';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

if (!projectId) {
  console.error('WalletConnect project ID is not defined in environment variables');
}

const { chains, publicClient } = configureChains(
  [mainnet, polygon],
  [publicProvider()]
);

const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    projectId: projectId || '',
    showQrModal: false, // We'll use Web3Modal for this
  },
});

const injectedConnector = new InjectedConnector({
  chains,
  options: {
    name: 'Injected',
    shimDisconnect: true,
  },
});

export const config = createConfig({
  autoConnect: true,
  connectors: [
    walletConnectConnector,
    injectedConnector
  ],
  publicClient,
});

// Initialize Web3Modal only if we're in a browser environment and have a project ID
if (typeof window !== 'undefined' && projectId) {
  try {
    console.log('Initializing Web3Modal...');
    createWeb3Modal({
      wagmiConfig: config,
      projectId,
      chains,
      themeMode: 'dark',
      defaultChain: mainnet,
    });
  } catch (error) {
    console.error('Failed to initialize Web3Modal:', error);
  }
}