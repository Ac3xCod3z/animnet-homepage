import { useState } from "react";
import { TopPanel } from "./manga/TopPanel";
import { BottomPanel } from "./manga/BottomPanel";
import { AccessMessage } from "./AccessMessage";
import { useRedemption } from "@/hooks/useRedemption";

export const MangaPanel = () => {
  const [code, setCode] = useState("");
  const { 
    isLoading, 
    showAccessMessage, 
    accessGranted, 
    handleRedemption 
  } = useRedemption();

  const handleSubmit = async () => {
    await handleRedemption(code);
    setCode("");
  };

  return (
    <>
      {!showAccessMessage && (
        <div className="w-full max-w-[400px] ml-16 lg:ml-32 space-y-8">
          <TopPanel 
            code={code}
            setCode={setCode}
          />
          <BottomPanel 
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        </div>
      )}
      <AccessMessage 
        type={accessGranted ? 'granted' : 'denied'}
        show={showAccessMessage}
      />
    </>
  );
};