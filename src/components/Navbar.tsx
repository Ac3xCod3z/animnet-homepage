import { Button } from "@/components/ui/button";
import { Wallet2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccount } from 'wagmi';

export const Navbar = () => {
  const { session, connectWallet, disconnectWallet } = useAuth();
  const { address } = useAccount();

  const handleWalletClick = async () => {
    if (session) {
      await disconnectWallet();
    } else {
      await connectWallet();
    }
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
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              AnimNet
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              About
            </a>
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={handleWalletClick}
            >
              <Wallet2 className="mr-2 h-4 w-4" />
              {session && address ? truncateAddress(address) : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};