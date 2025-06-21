import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/ChatSidebar/ChatSidebar";
import { ChatArea } from "@/components/chat/ChatArea/ChatArea";
import { UserPanel } from "@/components/chat/UserPanel/UserPanel";
import { CreateGroupModal } from "@/components/chat/CreateGroup/CreateGroupModal";
import useChatroomStore from "@/stores/chatroom-store";
import useUserStore from "@/stores/user-store";
import SocketContext from "@/hooks/socketManager";
import { toast } from "@/components/ui/sonner";
import { User, Chatroom } from "@/types/apiType";
import useChatroomMemberStore from "@/stores/chatroom-member-store";
import { InviteToast } from "@/components/utils/InviteToast";

const TOAST_DURATION = Infinity;

const Chat = () => {
  const { socket, connectSocket, disconnectSocket } = useContext(SocketContext);
  const [uiState, setUiState] = useState({
    showUserPanel: false,
    sidebarCollapsed: false,
    showCreateGroupModal: false,
  });
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Store selectors - 使用淺比較避免不必要的重渲染
  const user = useUserStore((state) => state.user);
  const currentChat = useChatroomStore((state) => state.currentChat);
  const chatroomsMap = useChatroomStore((state) => state.chatroomsMap);
  const chatroomsOrder = useChatroomStore((state) => state.chatroomsOrder);

  // Store actions
  const { getChatrooms, setCurrentChat, inviteUser, getOneChatroom } =
    useChatroomStore();

  const { getOtherUsers, setOtherUsers } = useUserStore();

  const { addChatroomMember, getChatroomMember } = useChatroomMemberStore();

  const fetchInitialData = async () => {
    if (!user?._id) return;

    try {
      await Promise.all([getChatrooms(user._id), getOtherUsers(user._id)]);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
      toast.error("載入數據失敗，請重試");
    }
  };

  const updateUiState = useCallback((updates: Partial<typeof uiState>) => {
    setUiState((prev) => ({ ...prev, ...updates }));
  }, []);

  const receiveInviteHandler = async (
    chatroom_id: string,
    targetUser_id: string
  ) => {
    if (!socket) return;
    try {
      await inviteUser(targetUser_id, chatroom_id);
      await addChatroomMember(targetUser_id, chatroom_id);
      socket.emit("invite accepted", chatroom_id, targetUser_id);
      toast.success("已加入群組 🎉");
    } catch (error) {
      console.error("Failed to send invite:", error);
      toast.error("邀請失敗，請重試");
    }
  };

  const acceptInviteHandler = async (
    chatroom_id: string,
    targetUser_id: string
  ) => {
    if (!user || targetUser_id === user?._id) return;
    try {
      await Promise.all([
        getOneChatroom(chatroom_id),
        getChatroomMember(user._id),
      ]);
    } catch (error) {
      console.error("Failed to accept invite:", error);
      toast.error("加入群組失敗");
    }
  };

  const statusHandler = (userId: string, status: string) => {
    const otherUser = useUserStore.getState().otherUsersMap; //在觸發func時才拿otherUsersMap，避免拿到舊資料
    if (otherUser.has(userId)) {
      const newOtherUsers = new Map(otherUser);
      const user = newOtherUsers.get(userId);
      user.status = status as "online" | "away" | "offline";
      newOtherUsers.set(userId, user);
      setOtherUsers(newOtherUsers);
    }
  };

  useEffect(() => {
    if (!currentChat) return;
    setIsGroupChat(currentChat.type === "group");
  }, [currentChat]);

  const initializeChat = () => {
    console.log("Initializing chat");
    const firstChatroom = chatroomsMap?.get(chatroomsOrder?.global[0]);
    if (firstChatroom) {
      setCurrentChat(firstChatroom);
    }

    connectSocket(user._id);
  };

  const setupSocketListeners = () => {
    if (!socket || !user) return;

    const handleUserOnline = (userId: string) =>
      statusHandler(userId, "online");
    const handleUserAway = (userId: string) => statusHandler(userId, "away");
    const handleUserOffline = (userId: string) =>
      statusHandler(userId, "offline");

    const handleGroupInvite = (
      chatroom: Chatroom,
      sender: User,
      targetUser_id: string
    ) => {
      if (targetUser_id !== user._id) return;

      toast.custom(
        (t) => (
          <InviteToast
            chatroom={chatroom}
            sender={sender}
            onAccept={() => {
              receiveInviteHandler(chatroom._id, targetUser_id);
              toast.dismiss(t);
            }}
            onReject={() => toast.dismiss(t)}
          />
        ),
        { duration: TOAST_DURATION }
      );
    };

    const handleInviteAccepted = (
      chatroom_id: string,
      targetUser_id: string
    ) => {
      acceptInviteHandler(chatroom_id, targetUser_id);
    };

    // 註冊事件監聽器
    socket.on("user-status-online", handleUserOnline);
    socket.on("user-status-away", handleUserAway);
    socket.on("user-status-offline", handleUserOffline);
    socket.on("send group invite", handleGroupInvite);
    socket.on("invite accepted", handleInviteAccepted);

    // 返回清理函數
    return () => {
      socket.off("user-status-online", handleUserOnline);
      socket.off("user-status-away", handleUserAway);
      socket.off("user-status-offline", handleUserOffline);
      socket.off("send group invite", handleGroupInvite);
      socket.off("invite accepted", handleInviteAccepted);
    };
  };

  useEffect(() => {
    if (!user) return;

    const initialize = async () => {
      try {
        await fetchInitialData();
        initializeChat();
      } catch (error) {
        console.error("Initialization failed:", error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (!socket) return;
    console.log("Setting up socket listeners");
    const cleanup = setupSocketListeners();
    return () => {
      cleanup?.();
      disconnectSocket();
    };
  }, []);

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-meow-cream`}>
        <ChatSidebar
          collapsed={uiState.sidebarCollapsed}
          onToggleCollapsed={() =>
            updateUiState({ sidebarCollapsed: !uiState.sidebarCollapsed })
          }
          onCreateGroup={() => updateUiState({ showCreateGroupModal: true })}
          setSidebarCollapsed={() =>
            updateUiState({ sidebarCollapsed: !uiState.sidebarCollapsed })
          }
        />
        <ChatArea
          collapsed={uiState.sidebarCollapsed}
          onToggleCollapsed={() =>
            updateUiState({ sidebarCollapsed: !uiState.sidebarCollapsed })
          }
          onToggleUserPanel={() =>
            updateUiState({ showUserPanel: !uiState.showUserPanel })
          }
          showUserPanel={uiState.showUserPanel}
          sidebarCollapsed={uiState.sidebarCollapsed}
        />
        {uiState.showUserPanel && (
          <UserPanel
            isGroupChat={isGroupChat}
            setShowUserPanel={() =>
              updateUiState({ showUserPanel: !uiState.showUserPanel })
            }
          />
        )}
        <CreateGroupModal
          open={uiState.showCreateGroupModal}
          onOpenChange={() =>
            updateUiState({
              showCreateGroupModal: !uiState.showCreateGroupModal,
            })
          }
        />
      </div>
    </SidebarProvider>
  );
};

export default Chat;
{
  /*<div className="p-4 bg-white rounded shadow flex flex-col gap-2 w-[300px]">
  <div className="flex items-center gap-2">
    <Avatar className="w-6 h-6">
      <AvatarImage src={sender.avatar} />
      <AvatarFallback className="bg-meow-purple text-purple-800">
        {sender.username}
      </AvatarFallback>
    </Avatar>
    <span className="text-xs text-gray-500">
      invite you to join
    </span>
    <span className="text-xs text-gray-500">
      {chatroom.avatar}
      <strong>{chatroom.name}</strong>
    </span>
  </div>
  <div className="flex justify-end gap-2">
    <Button
      className="text-xs px-2 bg-blue-500 text-white rounded"
      onClick={() => {
        receiveInviteHandler(chatroom._id, targetUser_id);
        toast.dismiss(t);
      }}
    >
      <Check />
    </Button>
    <Button
      className="text-xs px-2 bg-gray-200 rounded"
      onClick={() => toast.dismiss(t)}
    >
      <X />
    </Button>
  </div>
</div>*/
}
