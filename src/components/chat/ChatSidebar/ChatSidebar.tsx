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

interface ChatSidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onCreateGroup: () => void;
}

export function ChatSidebar({
  collapsed,
  onToggleCollapsed,
  onCreateGroup,
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

  useEffect(() => {
    if (chatroomsOrder.group.length > 0) {
      setGroupChats(
        chatroomsOrder.group.map((chatroom) => chatroomsMap.get(chatroom))
      );
    }
    if (chatroomsOrder.private.length > 0) {
      setPrivateChats(
        chatroomsOrder.private.map((chatroom) => chatroomsMap.get(chatroom))
      );
    }
    if (chatroomsOrder.global.length > 0) {
      setGlobalChats(
        chatroomsOrder.global.map((chatroom) => chatroomsMap.get(chatroom))
      );
    }
  }, [chatroomsOrder]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join room", currentChat._id);
    return () => {
      socket.emit("leave room", currentChat._id);
    };
  }, [currentChat]);

  return (
    <TooltipProvider>
      <div
        className={`relative transition-all duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-80"
        } bg-white/90 backdrop-blur-sm border-r border-meow-purple/20`}
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

        <div className="h-full flex flex-col">
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

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Global Chat */}
            <GlobalChat
              collapsed={collapsed}
              globalChat={globalChats?.[0]}
              setCurrentChat={setCurrentChat}
              currentChat={currentChat}
            />
            {!collapsed && <Separator className="bg-meow-purple/20" />}

            {/* Chat Groups */}
            <GroupChats
              collapsed={collapsed}
              onCreateGroup={onCreateGroup}
              groupChats={groupChats}
              setCurrentChat={setCurrentChat}
              currentChat={currentChat}
            />
            {!collapsed && <Separator className="bg-meow-purple/20" />}

            {/* Direct Messages */}
            <PrivateChats
              collapsed={collapsed}
              privateChats={privateChats}
              setCurrentChat={setCurrentChat}
              currentChat={currentChat}
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
                        <AvatarImage src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=faces" />
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
                    <AvatarImage src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=faces" />
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
