import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const Redeem = () => {
  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12 flex-grow">
        <h1 className="text-4xl font-bold text-center text-white font-orbitron mb-8">
          Redeem Your Code
        </h1>
      </div>
      <Footer />
    </div>
  );
};

export default Redeem;