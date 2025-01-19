import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { createWeb3Modal } from '@web3modal/wagmi';
import { supabase } from '@/integrations/supabase/client';

const { chains, publicClient } = configureChains(
  [mainnet, polygon],
  [publicProvider()]
);

// Create config without WalletConnect initially
export const config = createConfig({
  autoConnect: false,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    })
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

    // Add WalletConnect connector
    config.connectors.push(
      new WalletConnectConnector({
        chains,
        options: {
          projectId,
          metadata: {
            name: 'AnimNet',
            description: 'AnimNet Web3 Application',
            url: window.location.origin,
            icons: [`${window.location.origin}/favicon.ico`],
          },
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
        defaultChain: mainnet,
      });
      console.log('Web3Modal initialized successfully');
    }
  } catch (error) {
    console.error('Failed to initialize WalletConnect:', error);
    // Don't throw here - we want the app to continue working with just the injected connector
  }
};

// Start initialization
initializeWalletConnect();