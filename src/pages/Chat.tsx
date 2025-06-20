import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/ChatSidebar/ChatSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { UserPanel } from "@/components/chat/UserPanel";
import { CreateGroupModal } from "@/components/chat/CreateGroupModal";
import useChatroomStore from "@/stores/chatroom-store";
import useUserStore from "@/stores/user-store";
import SocketContext from "@/hooks/socketManager";
import { toast } from "@/components/ui/sonner";
import { User, Chatroom } from "@/types/apiType";
import useChatroomMemberStore from "@/stores/chatroom-member-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const Chat = () => {
  const { socket, connectSocket, disconnectSocket } = useContext(SocketContext);
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [isGroupChat, setIsGroupChat] = useState(false);

  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const getOtherUsers = useUserStore((state) => state.getOtherUsers);
  const getChatrooms = useChatroomStore((state) => state.getChatrooms);
  const setOtherUsers = useUserStore((state) => state.setOtherUsers);
  const setCurrentChat = useChatroomStore((state) => state.setCurrentChat);
  const chatroomsMap = useChatroomStore((state) => state.chatroomsMap);
  const chatroomsOrder = useChatroomStore((state) => state.chatroomsOrder);
  const currentChat = useChatroomStore((state) => state.currentChat);
  const inviteUser = useChatroomStore((state) => state.inviteUser);
  const getOneChatroom = useChatroomStore((state) => state.getOneChatroom);
  const addChatroomMember = useChatroomMemberStore(
    (state) => state.addChatroomMember
  );
  const getChatroomMember = useChatroomMemberStore(
    (state) => state.getChatroomMember
  );

  const fetchAllList = async () => {
    await getChatrooms(user._id);
    await getOtherUsers(user._id);
  };

  const sendInviteHandler = async (
    chatroom_id: string,
    targetUser_id: string
  ) => {
    if (!socket) return;
    await inviteUser(targetUser_id, chatroom_id);
    await addChatroomMember(targetUser_id, chatroom_id);
    socket.emit("invite accepted", chatroom_id, targetUser_id);
    toast.success("已加入群組 🎉");
  };

  const acceptInviteHandler = async (
    chatroom_id: string,
    targetUser_id: string
  ) => {
    if (!user || targetUser_id === user?._id) return;
    await getOneChatroom(chatroom_id);
    await getChatroomMember(user?._id);
  };

  const statusHandler = (userId: string, status: string) => {
    const otherUser = useUserStore.getState().otherUsersMap; //在觸發func時才拿otherUsersMap，避免拿到舊資料
    if (otherUser.has(userId)) {
      const newOtherUsers = new Map(otherUser);
      const user = newOtherUsers.get(userId);
      user.status = status;
      newOtherUsers.set(userId, user);
      setOtherUsers(newOtherUsers);
    }
  };

  useEffect(() => {
    if (!currentChat) return;
    setIsGroupChat(currentChat.type === "group");
  }, [currentChat]);

  useEffect(() => {
    if (!user) return navigate("/login");
    const startChat = () => {
      setCurrentChat(chatroomsMap.get(chatroomsOrder.global[0]));
      console.log("user connected:", user._id);
      connectSocket(user._id);
      if (!socket) return;
      socket.on("connect", () => {
        console.log("Connected to server");
      });
      socket.on("user-status-online", (userId: string) => {
        console.log("user online:", userId);
        statusHandler(userId, "online");
      });
      socket.on("user-status-offline", (userId: string) => {
        console.log("user offline:", userId);
        statusHandler(userId, "offline");
      });
      socket.on(
        "send group invite",
        (chatroom: Chatroom, sender: User, targetUser_id: string) => {
          if (targetUser_id !== user._id) return;
          toast.custom(
            (t) => (
              <div className="p-4 bg-white rounded shadow flex flex-col gap-2 w-[300px]">
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
                      sendInviteHandler(chatroom._id, targetUser_id);
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
              </div>
            ),
            { duration: Infinity }
          );
        }
      );
      socket.on(
        "invite accepted",
        (chatroom_id: string, targetUser_id: string) => {
          console.log("invite accepted: " + chatroom_id + targetUser_id);
          acceptInviteHandler(chatroom_id, targetUser_id);
        }
      );
    };
    fetchAllList().then(() => {
      startChat();
    });

    return () => {
      disconnectSocket();
    };
  }, [socket]);

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-meow-cream`}>
        <ChatSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          onCreateGroup={() => setShowCreateGroupModal(true)}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        <ChatArea
          onToggleUserPanel={() => setShowUserPanel(!showUserPanel)}
          showUserPanel={showUserPanel}
          sidebarCollapsed={sidebarCollapsed}
        />
        {showUserPanel && (
          <UserPanel
            isGroupChat={isGroupChat}
            setShowUserPanel={setShowUserPanel}
          />
        )}
        <CreateGroupModal
          open={showCreateGroupModal}
          onOpenChange={setShowCreateGroupModal}
        />
      </div>
    </SidebarProvider>
  );
};

export default Chat;
