import { Button } from "@/components/ui/button";
import { Wallet2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const { address, connectWallet, disconnectWallet } = useAuth();

  const handleWalletClick = async () => {
    try {
      console.log("Handling wallet click. Current address:", address);
      
      if (address) {
        console.log("Attempting to disconnect wallet");
        await disconnectWallet();
      } else {
        console.log("Attempting to connect wallet");
        await connectWallet();
      }
    } catch (error) {
      console.error("Error in handleWalletClick:", error);
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
            <Button 
              className="bg-crimson hover:bg-crimson/90 text-white font-orbitron"
              onClick={handleWalletClick}
            >
              <Wallet2 className="mr-2 h-4 w-4" />
              {address ? truncateAddress(address) : "Connect Wallet"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};