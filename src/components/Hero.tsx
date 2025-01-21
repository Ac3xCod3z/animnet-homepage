import { CodeStream } from "./CodeStream";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <CodeStream />
      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
      </div>
    </div>
  );
};