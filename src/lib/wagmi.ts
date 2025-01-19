import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';
import { createWeb3Modal } from '@web3modal/wagmi';
import { supabase } from '@/integrations/supabase/client';

// Initialize with a default value that will be replaced once we fetch from Supabase
let projectId: string | undefined;

// Fetch the project ID from Supabase secrets
const initializeProjectId = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('get-wallet-connect-id');
    if (error) throw error;
    projectId = data.projectId;
    console.log('Successfully retrieved WalletConnect project ID from Supabase');
    initializeWeb3Modal();
  } catch (error) {
    console.error('Failed to retrieve WalletConnect project ID:', error);
    throw new Error('Failed to initialize WalletConnect');
  }
};

const { chains, publicClient } = configureChains(
  [mainnet, polygon],
  [publicProvider()]
);

const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    projectId: projectId,
    metadata: {
      name: 'AnimNet',
      description: 'AnimNet Web3 Application',
      url: window.location.origin,
    },
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
  autoConnect: false,
  connectors: [walletConnectConnector, injectedConnector],
  publicClient,
});

const initializeWeb3Modal = () => {
  if (typeof window !== 'undefined' && projectId) {
    try {
      console.log('Initializing Web3Modal with projectId');
      createWeb3Modal({
        wagmiConfig: config,
        projectId,
        chains,
        themeMode: 'dark',
        defaultChain: mainnet,
      });
      console.log('Web3Modal initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Web3Modal:', error);
    }
  }
};

// Start the initialization process
initializeProjectId();

export { projectId };