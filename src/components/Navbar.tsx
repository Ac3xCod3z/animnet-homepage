import { Button } from "@/components/ui/button";
import { Wallet2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWeb3Modal } from '@web3modal/wagmi';

export const Navbar = () => {
  const { address, connectWallet, disconnectWallet } = useAuth();
  const { open } = useWeb3Modal();

  const handleWalletClick = async () => {
    try {
      console.log("Handling wallet click. Current address:", address);
      
      if (!address) {
        console.log("Attempting to connect wallet");
        await connectWallet();
      }
    } catch (error) {
      console.error("Error in handleWalletClick:", error);
    }
  };

  const handleOpenAccountModal = () => {
    console.log("Opening account modal");
    open({ view: 'Account' });
  };

  const handleOpenNetworkModal = () => {
    console.log("Opening network modal");
    open({ view: 'Networks' });
  };

  const handleDisconnect = async () => {
    console.log("Disconnecting wallet");
    await disconnectWallet();
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="fixed w-full z-50 glass">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="/" className="text-2xl font-bold text-crimson font-orbitron hover:text-crimson/90 transition-colors">
              AnimNet
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-crimson font-orbitron transition-colors">
              Features
            </a>
            <a href="#about" className="text-gray-300 hover:text-crimson font-orbitron transition-colors">
              About
            </a>
            {address ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="bg-crimson hover:bg-crimson/90 text-white font-orbitron"
                  >
                    <Wallet2 className="mr-2 h-4 w-4" />
                    {truncateAddress(address)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleOpenAccountModal}>
                    Change Wallet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleOpenNetworkModal}>
                    Switch Network
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDisconnect}>
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                className="bg-crimson hover:bg-crimson/90 text-white font-orbitron"
                onClick={handleWalletClick}
              >
                <Wallet2 className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};