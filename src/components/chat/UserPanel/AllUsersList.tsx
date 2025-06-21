import { useContext, useState, useCallback, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MessageSquare, UserPlus } from "lucide-react";
import useUserStore from "@/stores/user-store";
import useChatroomStore from "@/stores/chatroom-store";
import SocketContext from "@/hooks/socketManager";
import { toast } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const USER_STATUS_STYLES = {
  online: { bg: "bg-green-300", text: "text-green-300" },
  away: { bg: "bg-yellow-300", text: "text-yellow-300" },
  offline: { bg: "bg-gray-300", text: "text-gray-300" },
} as const;

const TOAST_MESSAGES = {
  INVITE_SUCCESS: "Send invite complete 😍",
  INVITE_ERROR: "Send invite failed, please try again later",
  CREATE_CHAT_ERROR: "Create chat failed, please try again later",
} as const;

export function AllUsersList({
  isGroupChat,
  setShowUserPanel,
}: {
  isGroupChat: boolean;
  setShowUserPanel: (show: boolean) => void;
}) {
  interface OtherUser {
    _id: string;
    username: string;
    avatar: string;
    status: "online" | "away" | "offline";
  }

  const [isCreating, setIsCreating] = useState(false);
  const user = useUserStore((state) => state.user);
  const otherUsersMap = useUserStore((state) => state.otherUsersMap);
  const otherUsersOrder = useUserStore((state) => state.otherUsersOrder);
  const currentChat = useChatroomStore((state) => state.currentChat);
  const privateChatrooms = useChatroomStore((state) => state.privateChatrooms);
  const createChatroom = useChatroomStore((state) => state.createChatroom);

  const { socket } = useContext(SocketContext);
  const isMobile = useIsMobile();

  const otherUsers = () => {
    return otherUsersOrder
      .map((userId) => otherUsersMap.get(userId))
      .filter((user): user is OtherUser => user !== undefined);
  };

  const onlineCount = () => {
    return otherUsers().filter((user) => user.status === "online").length;
  };

  const inviteUserHandler = useCallback(
    async (targetUser_id: string) => {
      if (!socket) return;
      toast("Send invite complete😍😍");
      socket.emit("send group invite", currentChat, user, targetUser_id);
    },
    [socket, currentChat, user]
  );

  const existingPrivateChat = useCallback(
    (targetUserId: string) => {
      return privateChatrooms.find((chatroom) =>
        chatroom.members.includes(targetUserId)
      );
    },
    [privateChatrooms]
  );

  const handleCreatePrivateChat = useCallback(
    async (targetUserId: string) => {
      if (isCreating || !user) return;

      // 檢查是否已存在私聊
      const existingChat = existingPrivateChat(targetUserId);
      if (existingChat) {
        toast.info("This user already exists in private chat");
        return;
      }

      setIsCreating(true);
      try {
        await createChatroom("private", [user._id, targetUserId], "", "");
        toast.success("Private chat created successfully");
      } catch (error) {
        console.error("Create private chat failed:", error);
        toast.error(TOAST_MESSAGES.CREATE_CHAT_ERROR);
      } finally {
        setIsCreating(false);
      }
    },
    [isCreating, user, existingPrivateChat, createChatroom]
  );

  const getUserStatusStyle = useCallback(
    (status: OtherUser["status"], type: "bg" | "text") => {
      return (
        USER_STATUS_STYLES[status]?.[type] || USER_STATUS_STYLES.offline[type]
      );
    },
    []
  );
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {isMobile ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowUserPanel(false)}
          >
            <ChevronLeft className="w-3 h-3" />
          </Button>
        ) : null}
        <h3 className="font-fredoka font-semibold text-purple-900">
          Online Users
        </h3>
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 border-green-200"
        >
          {onlineCount()} online
        </Badge>
      </div>

      <div className="space-y-2">
        {otherUsersOrder.map((otherUser) => {
          const otherUserMap = otherUsersMap.get(otherUser);
          if (!otherUserMap) return null;
          return (
            <div
              key={otherUser}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-meow-purple/20 transition-colors group"
            >
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={otherUserMap.avatar} />
                  <AvatarFallback className="bg-meow-pink text-purple-800 text-xs">
                    {otherUserMap.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${getUserStatusStyle(
                    otherUserMap.status,
                    "bg"
                  )}`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-purple-900 truncate">
                  {otherUserMap.username}
                  {isGroupChat &&
                  currentChat?.members.includes(otherUserMap._id) ? (
                    <span className="text-xs text-gray-500 ml-2">in Group</span>
                  ) : null}
                </p>
                <p
                  className={`text-xs ${getUserStatusStyle(
                    otherUserMap.status,
                    "text"
                  )}`}
                >
                  {otherUserMap.status}
                </p>
              </div>

              {isGroupChat &&
              !currentChat?.members.includes(otherUserMap._id) ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-meow-purple/50 rounded-lg"
                  onClick={() => inviteUserHandler(otherUserMap._id)}
                >
                  <UserPlus />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-meow-purple/50 rounded-lg"
                  onClick={() => handleCreatePrivateChat(otherUserMap._id)}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
