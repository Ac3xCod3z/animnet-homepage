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

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '';

if (!projectId) {
  console.warn('WalletConnect project ID is not set');
}

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
    new WalletConnectConnector({
      chains,
      options: {
        projectId,
        metadata: {
          name: 'AnimNet',
          description: 'AnimNet Web3 Application',
          url: window.location.origin,
          icons: ['https://avatars.githubusercontent.com/u/37784886'],
        },
        showQrModal: false,
      },
    }),
  ],
  publicClient,
});

// Initialize Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  chains,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent-color': '#DC143C',
    '--w3m-background-color': '#1a1a1a',
    '--w3m-font-family': 'Orbitron, sans-serif',
  },
});

console.log('Web3Modal initialized successfully');

export { chains };