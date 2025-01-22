import { WalletConnectModal } from '@walletconnect/modal'
import { supabase } from "@/integrations/supabase/client";

// Initialize the WalletConnect Modal with a temporary ID
let walletConnectModal: WalletConnectModal;

// Function to initialize the modal with the project ID
export const initializeWalletConnectModal = async () => {
  try {
    console.log('Fetching WalletConnect project ID...');
    const { data, error } = await supabase.functions.invoke('get-wallet-connect-id');
    
    if (error) {
      console.error('Error fetching WalletConnect project ID:', error);
      throw error;
    }

    console.log('Successfully fetched WalletConnect project ID');
    
    walletConnectModal = new WalletConnectModal({
      projectId: data.projectId,
      chains: ['eip155:1'], // Ethereum mainnet
      themeMode: 'dark',
      explorerRecommendedWalletIds: [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
        '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
        '225affb176778569276e484e1b92637ad061b01e13a048b35a9d280c3b58970f', // Zerion
        '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Rainbow
        '4ab2542c2799c825a8465ba5ab8aa7def52b7904f38b74484af917ed9c0fc4e5', // Crypto.com
        'ef333840daf915aafdc4a004525502d6d49d77bd9c65e0642dbaefb3c2893bef', // Argent
        '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662', // Coinbase
      ],
      themeVariables: {
        '--wcm-font-family': 'Orbitron, sans-serif',
        '--wcm-accent-color': '#da373c', // Using our crimson color
      },
      enableExplorer: true,
      enableInjected: true, // Enable browser extension wallets
      explorerExcludedWalletIds: undefined, // Don't exclude any wallets
    });

    return walletConnectModal;
  } catch (error) {
    console.error('Failed to initialize WalletConnect modal:', error);
    throw error;
  }
}

export const checkForInjectedProvider = () => {
  return typeof window !== 'undefined' && window.ethereum !== undefined;
};

export { walletConnectModal };