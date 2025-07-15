import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/ChatSidebar/ChatSidebar";
import { ChatArea } from "@/components/chat/ChatArea/ChatArea";
import { UserPanel } from "@/components/chat/UserPanel/UserPanel";
import { CreateGroupModal } from "@/components/chat/CreateGroup/CreateGroupModal";
import useChatroomStore from "@/stores/chatroom-store";
import useUserStore from "@/stores/user-store";
import SocketContext from "@/hooks/socketManager";
import { toast } from "@/components/ui/sonner";
import { User, Chatroom, Message } from "@/types/apiType";
import useChatroomMemberStore from "@/stores/chatroom-member-store";
import { InviteToast } from "@/components/utils/InviteToast";
import useMessageStore from "@/stores/message-store";
const TOAST_DURATION = Infinity;

const Chat = () => {
  const { socket, connectSocket, disconnectSocket } = useContext(SocketContext);
  const [uiState, setUiState] = useState({
    showUserPanel: false,
    sidebarCollapsed: false,
    showCreateGroupModal: false,
  });
  const [isGroupChat, setIsGroupChat] = useState(false);

  // Store selectors - 使用淺比較避免不必要的重渲染
  const user = useUserStore((state) => state.user);
  const currentChat = useChatroomStore((state) => state.currentChat);
  const chatroomsMap = useChatroomStore((state) => state.chatroomsMap);
  const chatroomsOrder = useChatroomStore((state) => state.chatroomsOrder);

  // Store actions

  const { getChatrooms, setCurrentChat, inviteUserToChatroom, getOneChatroom } =
    useChatroomStore();

  const { getOtherUsers, setOtherUsers } = useUserStore();

  const {
    addChatroomMember,
    getChatroomMember,
    updateLastReadAt,
    updateReadCount,
    updateUnreadCount,
  } = useChatroomMemberStore();

  const { handleReceiveMessage, handleRecallMessage } = useMessageStore();

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

  const joinGroupAsInvitedUser = async (
    chatroom: Chatroom,
    invitedUserId: string
  ) => {
    if (!socket) return;

    const isAlreadyInGroup = useChatroomStore
      .getState()
      .chatroomsOrder.group.includes(chatroom._id);
    if (isAlreadyInGroup) {
      toast.error("You're already in this group.");
      return;
    }

    try {
      await inviteUserToChatroom(invitedUserId, chatroom._id);
      await addChatroomMember(invitedUserId, chatroom._id);
      socket.emit("invite accepted", chatroom, invitedUserId);
      toast.success("Joined group successfully 🎉");
    } catch (err) {
      console.error("Join failed:", err);
      toast.error("Failed to join group, try again.");
    }
  };

  const syncGroupAfterInvite = async (
    chatroom: Chatroom,
    invitedUserId: string
  ) => {
    if (!user || invitedUserId === user._id) return;

    const isInGroup = chatroomsOrder.group.includes(chatroom._id);
    if (!isInGroup) return;

    try {
      await Promise.all([
        getOneChatroom(chatroom._id),
        getChatroomMember(user._id),
      ]);
    } catch (err) {
      console.error("Sync failed:", err);
      toast.error("Failed to update group info.");
    }
  };

  const statusHandler = (userId: string, status: string) => {
    const otherUser = useUserStore.getState().otherUsersMap; //在觸發func時才拿otherUsersMap，避免拿到舊資料
    const newOtherUsers = new Map(otherUser);
    newOtherUsers.get(userId).status = status as "online" | "away" | "offline";
    const usersArray = Array.from(newOtherUsers.values());
    setOtherUsers(usersArray);
  };

  const initializeChat = (currentChat?: Chatroom) => {
    const firstChatroom = chatroomsMap?.get(chatroomsOrder?.global[0]);
    if (currentChat || firstChatroom) {
      setCurrentChat(currentChat || firstChatroom);
    }
  };

  const setupSocketListeners = () => {
    if (!socket || !user) return;

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
              joinGroupAsInvitedUser(chatroom, targetUser_id);
              toast.dismiss(t);
            }}
            onReject={() => toast.dismiss(t)}
          />
        ),
        { duration: TOAST_DURATION }
      );
    };

    const onReceiveMessage = (msg: Message, room_id: string) => {
      const existing = useChatroomStore.getState().chatroomsMap.get(room_id);
      const currentChat = useChatroomStore.getState().currentChat;
      if (room_id === currentChat?._id && msg.user._id !== user._id) {
        handleReceiveMessage(msg);
        socket.emit("update unread", currentChat?._id);
      } else if (!existing) {
        const newChatroom = {
          _id: room_id,
          members: [msg.user._id, user._id],
          name: msg.user.username,
          type: "private",
          avatar: msg.user.avatar,
        };
        const map = new Map(useChatroomStore.getState().chatroomsMap);
        map.set(newChatroom._id, newChatroom);
        const newOrder = {
          ...useChatroomStore.getState().chatroomsOrder,
          private: [
            ...useChatroomStore.getState().chatroomsOrder.private,
            newChatroom._id,
          ],
        };
        useChatroomStore.setState({
          chatroomsMap: map,
          chatroomsOrder: newOrder,
        });
      }
    };

    const onRecallMessage = (message_id: string, user_id: string) => {
      if (user_id !== user._id) {
        handleRecallMessage(message_id);
      }
    };

    const onUpdateLastReadTime = async (
      chatroom_id: string,
      user_id: string
    ) => {
      await updateLastReadAt(user_id, chatroom_id);
    };

    const onUpdateUnread = (chatroom_id: string) => {
      updateUnreadCount(user._id, chatroom_id);
    };

    const onUpdateReadCount = (messages: Message[], chatroom: Chatroom) => {
      updateReadCount(messages, chatroom);
    };

    /*const onHandleReconnect = () => {
      console.log("reconnect");
      syncOnReconnect();
    };

    const syncOnReconnect = async () => {
      if (!socket) return;
      await fetchInitialData();
      initializeChat(currentChat);
    }*/
    // 註冊事件監聽器

    setInterval(() => {
      socket.emit("ping");
    }, 10000);

    socket.on("chat message", onReceiveMessage);
    socket.on("update unread", onUpdateUnread);
    socket.on("user-status-online", statusHandler);
    socket.on("user-status-away", statusHandler);
    socket.on("user-status-offline", statusHandler);
    socket.on("send group invite", handleGroupInvite);
    socket.on("invite accepted", syncGroupAfterInvite);
    socket.on("update message", onRecallMessage);
    socket.on("update last_read_time", onUpdateLastReadTime);
    socket.on("update read count", onUpdateReadCount);
    //socket.on("reconnect",onHandleReconnect);//目前還用不到

    // 返回清理函數
    return () => {
      socket.off("chat message", onReceiveMessage);
      socket.off("update unread", onUpdateUnread);
      socket.off("update message", onRecallMessage);
      socket.off("update last_read_time", onUpdateLastReadTime);
      socket.off("user-status-online", statusHandler);
      socket.off("user-status-away", statusHandler);
      socket.off("user-status-offline", statusHandler);
      socket.off("send group invite", handleGroupInvite);
      socket.off("invite accepted", joinGroupAsInvitedUser);
      socket.off("update read count", onUpdateReadCount);
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
    if (!currentChat) return;
    setIsGroupChat(currentChat.type === "group");
  }, [currentChat]);

  useEffect(() => {
    if (!user?._id) return;
    connectSocket(user._id);

    return () => {
      disconnectSocket();
    };
  }, [user?._id]);

  useEffect(() => {
    if (!socket) return;
    const cleanup = setupSocketListeners();
    socket.emit("user online");

    return () => {
      cleanup?.();
    };
  }, [socket]);

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
