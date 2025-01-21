import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero count={5} /> {/* Pass initial count of 5 */}
      <Features />
      <Footer />
    </div>
  );
};

export default Index;