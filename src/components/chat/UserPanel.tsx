import { AllUsersList } from "./OnlineUsersList";

interface UserPanelProps {
  onStartPrivateChat?: (userId: string, username: string) => void;
}

export function UserPanel({ onStartPrivateChat }: UserPanelProps) {

  return (
    <div className="w-80 bg-white border-l border-meow-purple/20 flex flex-col p-4">
      <AllUsersList  />
    </div>
  );
}
