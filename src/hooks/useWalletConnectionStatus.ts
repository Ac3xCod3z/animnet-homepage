import { useConnect } from 'wagmi';

export const useWalletConnectionStatus = () => {
  const { status, connectors } = useConnect();

  const isConnected = status === 'success';
  const getDefaultConnector = () => connectors[0];
  
  return {
    isConnected,
    getDefaultConnector,
    connectionStatus: status
  };
};