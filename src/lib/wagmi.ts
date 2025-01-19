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

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId: projectId || '',
        showQrModal: true,
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

// Only initialize Web3Modal in browser environment and when projectId is available
if (typeof window !== 'undefined' && projectId) {
  try {
    console.log('Initializing Web3Modal with project ID:', projectId);
    createWeb3Modal({
      wagmiConfig: config,
      projectId: projectId,
      chains,
      themeMode: 'dark',
      defaultChain: mainnet,
    });
    console.log('Web3Modal initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Web3Modal:', error);
  }
}