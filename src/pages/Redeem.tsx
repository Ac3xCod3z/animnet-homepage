import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Redeem = () => {
  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col">
      <Navbar />
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 pt-24 text-center">
          <h1 className="text-4xl font-bold text-center text-white font-orbitron mb-8">
            Redeem Your Code
          </h1>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Redeem;