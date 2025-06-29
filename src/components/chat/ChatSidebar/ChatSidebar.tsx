import { Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useChatroomStore from "@/stores/chatroom-store";
import GroupChats from "./GroupChats";
import GlobalChat from "./GlobalChat";
import PrivateChats from "./PrivateChats";
import useUserStore from "@/stores/user-store";
import LogoutDialog from "./LogoutDialog";
import SocketContext from "@/hooks/socketManager";
import useChatroomMemberStore from "@/stores/chatroom-member-store";
import { useIsMobile } from "../../../hooks/use-mobile";
import { Message } from "@/types/apiType";

interface ChatSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onCreateGroup: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

/*const USER_STATUS_STYLES = {
  online: "bg-green-300",
  away: "bg-yellow-300",
  offline: "bg-gray-300",
} as const;*/

const SIDEBAR_CLASSES = {
  mobile: {
    collapsed: "hidden",
    expanded: "w-screen h-screen z-50",
  },
  desktop: {
    collapsed: "w-20",
    expanded: "w-80",
  },
} as const;

export function ChatSidebar({
  collapsed,
  onToggleCollapsed,
  onCreateGroup,
  setSidebarCollapsed,
}: ChatSidebarProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Store hooks
  const user = useUserStore((state) => state.user);
  const { chatroomsMap, chatroomsOrder, setCurrentChat, currentChat } =
    useChatroomStore();

  const { socket } = useContext(SocketContext);

  // Local state
  const [groupChats, setGroupChats] = useState([]);
  const [privateChats, setPrivateChats] = useState([]);
  const [globalChats, setGlobalChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const sidebarClass = useMemo(() => {
    const baseClasses = isMobile
      ? SIDEBAR_CLASSES.mobile
      : SIDEBAR_CLASSES.desktop;
    return collapsed ? baseClasses.collapsed : baseClasses.expanded;
  }, [isMobile, collapsed]);

  /* const userStatusStyle = useMemo(() => {
    return (
      USER_STATUS_STYLES[user?.status as keyof typeof USER_STATUS_STYLES] ||
      USER_STATUS_STYLES.offline
    );
  }, [user?.status]);*/

  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  useEffect(() => {
    if (!chatroomsOrder) return;
    setIsLoading(true);
    setGroupChats(
      chatroomsOrder.group.map((chatroom) => chatroomsMap.get(chatroom))
    );

    setPrivateChats(
      chatroomsOrder.private.map((chatroom) => chatroomsMap.get(chatroom))
    );

    setGlobalChats(
      chatroomsOrder.global.map((chatroom) => chatroomsMap.get(chatroom))
    );
    setIsLoading(false);
  }, [chatroomsOrder, chatroomsMap]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join room", useChatroomStore.getState().currentChat?._id);

    if (isMobile) {
      onToggleCollapsed();
    }

    return () => {
      socket.emit("leave room", useChatroomStore.getState().currentChat?._id);
    };
  }, [currentChat]);

  const renderUserSection = () => {
    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/profile")}
                className="hover:opacity-80 transition-opacity"
                aria-label="前往個人資料"
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback className="bg-meow-purple text-purple-800">
                    {user?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">你 (在線)</TooltipContent>
        </Tooltip>
      );
    }

    return (
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/profile")}
          className="relative hover:opacity-80 transition-opacity"
          aria-label="前往個人資料"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar} alt={user?.username} />
            <AvatarFallback className="bg-meow-purple text-purple-800">
              {user?.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute -bottom-0.5 -right-1 w-3 h-3 rounded-full border border-white bg-green-300`}
            aria-label={`狀態: ${user?.status || "offline"}`}
          />
        </button>
        <div className="flex-1">
          <p className="font-medium text-purple-900 text-sm truncate">
            {user?.username}
          </p>
        </div>
        <LogoutDialog />
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div
        className={`${
          isMobile ? "absolute left-0" : "relative"
        } transition-all duration-300 ease-in-out ${sidebarClass} bg-white/90 backdrop-blur-sm border-r border-meow-purple/20`}
        role="navigation"
        aria-label="聊天室側邊欄"
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapsed}
          className={`absolute ${
            isMobile ? "right-0" : "-right-3"
          } top-6 z-10 h-6 w-6 rounded-full bg-white border border-meow-purple/20 shadow-sm hover:bg-meow-purple/50 transition-colors`}
          aria-label={collapsed ? "展開側邊欄" : "收合側邊欄"}
        >
          {collapsed ? (
            <ChevronRight className="w-6 h-6" />
          ) : (
            <ChevronLeft className="w-6 h-6" />
          )}
        </Button>

        <div className="h-full flex flex-col">
          {/* Header */}
          <header className="p-4 border-b border-meow-purple/20 hover:cursor-pointer">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0"
                onClick={() => navigate("/")}
              >
                <span className="text-xl" role="img" aria-label="貓咪">
                  🐱
                </span>
              </div>
              {!collapsed && (
                <div className="transition-opacity duration-200">
                  <h1 className="font-fredoka font-bold text-purple-900 text-lg">
                    MeowChat
                  </h1>
                  <p className="text-sm text-purple-600">Cozy conversations</p>
                </div>
              )}
            </div>
          </header>

          {/* Chat Sections */}
          <main className="flex-1 max-h-[calc(100vh-150px)] hide-scrollbar p-4 space-y-6">
            <GlobalChat
              collapsed={collapsed}
              globalChat={globalChats?.[0]}
              setCurrentChat={setCurrentChat}
              currentChat={currentChat}
              isLoading={isLoading}
            />

            {!collapsed && <Separator className="bg-meow-purple/20" />}

            <GroupChats
              collapsed={collapsed}
              onCreateGroup={onCreateGroup}
              groupChats={groupChats}
              setCurrentChat={setCurrentChat}
              currentChat={currentChat}
              isLoading={isLoading}
            />

            {!collapsed && <Separator className="bg-meow-purple/20" />}

            <PrivateChats
              collapsed={collapsed}
              privateChats={privateChats}
              setCurrentChat={setCurrentChat}
              currentChat={currentChat}
              isLoading={isLoading}
            />
          </main>

          {/* Footer */}
          <footer className="p-4 border-t border-meow-purple/20">
            {renderUserSection()}
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
}
