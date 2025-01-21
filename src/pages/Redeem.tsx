import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MangaPanel } from "@/components/MangaPanel";

const Redeem = () => {
  return (
    <div className="min-h-screen bg-black text-foreground flex flex-col">
      <Navbar />
      <div className="relative min-h-screen flex flex-col overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 pt-24">
          <h1 className="text-4xl font-bold text-center text-white font-orbitron mb-16">
            Redeem Your Code
          </h1>
          <div className="flex justify-center items-start gap-8">
            <div className="w-full max-w-xl">
              <MangaPanel />
            </div>
            <div className="flex-1 hidden lg:block">
              {/* Right side content can be added here later */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Redeem;