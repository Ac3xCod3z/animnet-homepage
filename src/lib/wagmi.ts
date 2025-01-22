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

// Create wagmi config
export const config = createConfig({
  autoConnect: true,
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

    // Initialize Web3Modal with correct theme variables
    createWeb3Modal({
      wagmiConfig: config,
      projectId,
      chains,
      themeMode: 'dark',
      defaultChain: mainnet,
      themeVariables: {
        '--wcm-font-family': 'Orbitron, sans-serif',
        '--wcm-accent-color': '#da373c',
        '--wcm-accent-fill-color': '#ffffff',
        '--wcm-overlay-background-color': 'rgba(0, 0, 0, 0.8)',
        '--wcm-overlay-backdrop-filter': 'blur(5px)',
        '--wcm-background-color': '#1a1b1f',
        '--wcm-background-border-radius': '12px',
        '--wcm-container-border-radius': '24px',
        '--wcm-wallet-icon-border-radius': '12px',
        '--wcm-button-border-radius': '8px',
        '--wcm-text-big-bold-font-family': 'Orbitron, sans-serif',
        '--wcm-text-medium-regular-font-family': 'Orbitron, sans-serif',
        '--wcm-text-small-regular-font-family': 'Orbitron, sans-serif',
        '--wcm-text-small-thin-font-family': 'Orbitron, sans-serif',
        '--wcm-text-xsmall-bold-font-family': 'Orbitron, sans-serif',
        '--wcm-text-xsmall-regular-font-family': 'Orbitron, sans-serif'
      }
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