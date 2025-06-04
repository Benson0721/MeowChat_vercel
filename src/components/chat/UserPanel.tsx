
import { OnlineUsersList } from './OnlineUsersList';

interface UserPanelProps {
  onStartPrivateChat?: (userId: string, username: string) => void;
}

export function UserPanel({ onStartPrivateChat }: UserPanelProps) {
  const handleStartPrivateChat = (userId: string, username: string) => {
    console.log('Starting private chat with:', username);
    if (onStartPrivateChat) {
      onStartPrivateChat(userId, username);
    }
  };

  return (
    <div className="w-80 bg-white border-l border-meow-purple/20 flex flex-col p-4">
      <OnlineUsersList onStartPrivateChat={handleStartPrivateChat} />
    </div>
  );
}
