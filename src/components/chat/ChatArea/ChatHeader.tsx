import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MoreVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { Chatroom, User } from "@/types/apiType";

interface ChatHeaderProps {
  chat: Chatroom;
  displayInfo: { name: string; avatar: string };
  privateUser: User | null;
  isMobile: boolean;
  collapsed: boolean;
  showUserPanel: boolean;
  onToggleCollapsed: () => void;
  onToggleUserPanel: () => void;
}

export const ChatHeader = ({
  chat,
  displayInfo,
  privateUser,
  isMobile,
  collapsed,
  showUserPanel,
  onToggleCollapsed,
  onToggleUserPanel,
}: ChatHeaderProps) => {
  const getMemberStatusText = () => {
    if (chat?.type === "private") {
      return privateUser?.status || "offline";
    }
    return `${chat?.members?.length || 0} members online`;
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-meow-purple/20 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 relative">
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapsed}
              className="absolute -left-3 top-6 z-10 h-6 w-6 rounded-full bg-white border border-meow-purple/20 shadow-sm hover:bg-meow-purple/50 transition-colors"
            >
              {collapsed ? (
                <ChevronRight className="w-3 h-3" />
              ) : (
                <ChevronLeft className="w-3 h-3" />
              )}
            </Button>
          )}

          <div className="w-8 h-8 bg-meow-lavender rounded-full flex items-center justify-center">
            <Avatar className="w-6 h-6">
              <AvatarImage src={displayInfo?.avatar} alt={displayInfo?.name} />
              <AvatarFallback className="bg-meow-pink text-purple-800 text-xs">
                {displayInfo?.avatar ||
                  displayInfo?.name?.charAt(0)?.toUpperCase() ||
                  "?"}
              </AvatarFallback>
            </Avatar>
          </div>

          <div>
            <h2 className="font-fredoka font-semibold text-purple-900 text-lg">
              {displayInfo.name}
            </h2>
            <p className="text-sm text-purple-600">{getMemberStatusText()}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleUserPanel}
          className={`rounded-xl hover:bg-meow-purple/50 transition-colors ${
            showUserPanel ? "bg-meow-purple text-purple-800" : ""
          }`}
        >
          <Users className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-xl hover:bg-meow-purple/50"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
