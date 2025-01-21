import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { supabase } from '@/integrations/supabase/client';

const { chains, publicClient } = configureChains(
  [mainnet, polygon],
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

// Initialize WalletConnect and Web3Modal
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

    const projectId = data.projectId;
    console.log('Successfully retrieved WalletConnect project ID');

    // Ensure proper URL formatting
    const baseUrl = window.location.origin.replace(/:[0-9]+$/, '').replace(/\/$/, '');
    const iconUrl = `${baseUrl}/favicon.ico`;

    console.log('Base URL:', baseUrl);
    console.log('Icon URL:', iconUrl);

    // Add WalletConnect connector
    config.connectors.push(
      new WalletConnectConnector({
        chains,
        options: {
          projectId,
          showQrModal: true,
          metadata: {
            name: 'AnimNet',
            description: 'AnimNet Web3 Application',
            url: baseUrl,
            icons: [iconUrl]
          },
        },
      })
    );

    // Initialize Web3Modal with updated configuration
    if (typeof window !== 'undefined') {
      console.log('Initializing Web3Modal...');
      createWeb3Modal({
        wagmiConfig: config,
        projectId,
        chains,
        themeMode: 'dark',
        themeVariables: {
          '--w3m-accent': '#dc2626',
          '--w3m-background': '#000000',
          '--w3m-font-family': 'Orbitron, sans-serif'
        },
        defaultChain: mainnet,
        // Remove specific wallet IDs to show all available wallets including MetaMask
        includeWalletIds: undefined
      });
      console.log('Web3Modal initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize WalletConnect:', error);
  }
};

// Start initialization
initializeWalletConnect();