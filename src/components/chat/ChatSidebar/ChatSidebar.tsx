import {
  Home,
  Hash,
  MessageCircle,
  Settings,
  User,
  Users,
  Heart,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Plus,
  Globe,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useChatroomStore from "@/stores/chatroom-store";
import GroupChats from "./GroupChats";
import GlobalChat from "./GlobalChat";
import PrivateChats from "./PrivateChats";
import useUserStore from "@/stores/user-store";
import LogoutDialog from "../../LogoutDialog";
import SocketContext from "@/hooks/socketManager";
import useChatroomMemberStore from "@/stores/chatroom-member-store";
import { useIsMobile } from "../../../hooks/use-mobile";

interface ChatSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onCreateGroup: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export function ChatSidebar({
  collapsed,
  onToggleCollapsed,
  onCreateGroup,
  setSidebarCollapsed,
}: ChatSidebarProps) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const chatroomsMap = useChatroomStore((state) => state.chatroomsMap);
  const chatroomsOrder = useChatroomStore((state) => state.chatroomsOrder);
  const setCurrentChat = useChatroomStore((state) => state.setCurrentChat);
  const currentChat = useChatroomStore((state) => state.currentChat);
  const { socket } = useContext(SocketContext);
  const [groupChats, setGroupChats] = useState([]);
  const [privateChats, setPrivateChats] = useState([]);
  const [globalChats, setGlobalChats] = useState([]);
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const updateUnreadCount = useChatroomMemberStore(
    (state) => state.updateUnreadCount
  );
  const sidebarClass = isMobile
    ? collapsed
      ? "hidden" // 手機且折疊 = 隱藏
      : "w-screen h-screen z-50" // 手機且展開 = 滿版
    : collapsed
    ? "w-20" // 桌機且折疊
    : "w-80"; // 桌機且展開

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
    socket.emit("join room", currentChat._id);

    return () => {
      socket.emit("leave room", currentChat._id);
    };
  }, [currentChat]);

  useEffect(() => {
    if (!socket) return;

    const onUpdateUnread = (chatroom_id: string) => {
      console.log("update unread: ", chatroom_id);
      updateUnreadCount(user._id, chatroom_id);
    };

    /*const onUpdateOtherUnread = (chatroom_id: string, user_id: string[]) => {
      console.log("update other unread: ", chatroom_id, user_id);
      if (chatroom_id === currentChat._id) {
        user_id?.forEach((id) => {
          updateUnreadCount(id, chatroom_id); //傳訊息給別人
        });
      }
    };
    const onUpdateOwnUnread = (chatroom_id: string, user_id: string) => {
      console.log("update own unread: ", chatroom_id, user_id);
      if (chatroom_id === currentChat._id) {
        updateUnreadCount(user_id, chatroom_id); //已讀
      }
    };*/
    socket.on("update unread", onUpdateUnread);
    return () => {
      socket.off("update unread");
    };
  }, [socket]);

  return (
    <TooltipProvider>
      <div
        className={`${
          isMobile ? "absolute left-0" : "relative"
        } transition-all duration-300 ease-in-out ${sidebarClass}

     bg-white/90 backdrop-blur-sm border-r border-meow-purple/20`}
      >
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapsed}
          className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-white border border-meow-purple/20 shadow-sm hover:bg-meow-purple/50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </Button>

        <div className={`h-full flex flex-col`}>
          {/* Header */}
          <div
            className="p-4 border-b border-meow-purple/20 hover:cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl">🐱</span>
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
          </div>

          <div className="flex-1 max-h-[calc(100vh-150px)] hide-scrollbar p-4 space-y-6">
            {/* Global Chat */}
            <GlobalChat
              collapsed={collapsed}
              globalChat={globalChats?.[0]}
              setCurrentChat={setCurrentChat}
              currentChat={currentChat}
              isLoading={isLoading}
            />
            {!collapsed && <Separator className="bg-meow-purple/20" />}

            {/* Chat Groups */}
            <GroupChats
              collapsed={collapsed}
              onCreateGroup={onCreateGroup}
              groupChats={groupChats}
              setCurrentChat={setCurrentChat}
              currentChat={currentChat}
              isLoading={isLoading}
            />
            {!collapsed && <Separator className="bg-meow-purple/20" />}

            {/* Direct Messages */}
            <PrivateChats
              collapsed={collapsed}
              privateChats={privateChats}
              setCurrentChat={setCurrentChat}
              currentChat={currentChat}
              isLoading={isLoading}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-meow-purple/20">
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-center">
                    <button
                      onClick={() => navigate("/profile")}
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-meow-purple text-purple-800">
                          {user?.username}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">You (Online)</TooltipContent>
              </Tooltip>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/profile")}
                  className="relative hover:opacity-80 transition-opacity"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-meow-purple text-purple-800">
                      {user?.username}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-0.5 -right-1 w-3 h-3 rounded-full border border-white ${
                      user?.status === "online" ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                </button>
                <div className="flex-1">
                  <p className="font-medium text-purple-900 text-sm">
                    {user?.username}
                  </p>
                  <p className="text-xs text-purple-600">Online</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-purple-600 hover:bg-meow-purple/50 rounded-xl"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <LogoutDialog />
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
