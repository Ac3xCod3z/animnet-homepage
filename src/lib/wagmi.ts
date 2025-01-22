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

// Create wagmi config with MetaMask (Injected) as primary connector
export const config = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'MetaMask',
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

    // Add WalletConnect as secondary connector
    config.connectors.push(
      new WalletConnectConnector({
        chains,
        options: {
          projectId,
          showQrModal: true,
          metadata: {
            name: 'AnimNet',
            description: 'AnimNet Web3 Application',
            url: window.location.origin,
            icons: [`${window.location.origin}/favicon.ico`]
          },
        },
      })
    );

    // Initialize Web3Modal
    createWeb3Modal({
      wagmiConfig: config,
      projectId,
      chains,
      defaultChain: mainnet,
      featuredWalletIds: ['c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96'], // MetaMask wallet ID
    });
    
    console.log('Web3Modal initialized successfully');
  } catch (error) {
    console.error('Failed to initialize WalletConnect:', error);
  }
};

// Initialize immediately in browser environment
if (typeof window !== 'undefined') {
  initializeWalletConnect().catch(console.error);
}

export { chains };