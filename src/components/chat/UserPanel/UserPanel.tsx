import { AllUsersList } from "./AllUsersList";
import { useIsMobile } from "@/hooks/use-mobile";

export function UserPanel({
  isGroupChat,
  setShowUserPanel,
}: {
  isGroupChat: boolean;
  setShowUserPanel: (show: boolean) => void;
}) {
  const isMobile = useIsMobile();
  return (
    <div
      className={`w-80 bg-white border-l border-meow-purple/20 flex flex-col p-4 ${
        isMobile ? "w-screen absolute left-0 h-screen z-50" : ""
      }`}
    >
      <AllUsersList
        isGroupChat={isGroupChat}
        setShowUserPanel={setShowUserPanel}
      />
    </div>
  );
}
