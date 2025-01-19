import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { createWeb3Modal } from '@web3modal/wagmi';

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

console.log('Initializing WalletConnect with project ID:', projectId?.substring(0, 5) + '...');

const { chains, publicClient } = configureChains(
  [mainnet, polygon],
  [publicProvider()]
);

// Create metadata with static strings to avoid URL object issues
const metadata = {
  name: 'AnimNet',
  description: 'AnimNet Web3 Platform',
  url: 'https://animnet.com',
  icons: ['https://animnet.com/favicon.ico']
};

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId: projectId || '',
        showQrModal: true,
        metadata
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

// Initialize Web3Modal only if we're in a browser environment
if (typeof window !== 'undefined') {
  try {
    console.log('Initializing Web3Modal...');
    createWeb3Modal({
      wagmiConfig: config,
      projectId: projectId || '',
      chains,
      themeMode: 'dark',
      defaultChain: mainnet,
    });
    console.log('Web3Modal initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Web3Modal:', error);
  }
}