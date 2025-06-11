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

const Chat = () => {
  const { socket, connectSocket, disconnectSocket } = useContext(SocketContext);
  //const [currentChat, setCurrentChat] = useState("global");
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [customGroups, setCustomGroups] = useState([
    {
      id: "cat-lovers",
      name: "Cat Lovers",
      icon: "❤️",
      unread: 0,
    },
    {
      id: "dev-cats",
      name: "Dev Cats",
      icon: "☕",
      unread: 0,
    },
    {
      id: "kitten-pics",
      name: "Kitten Pics",
      icon: "#",
      unread: 0,
    },
    {
      id: "cat-care",
      name: "Cat Care Tips",
      icon: "🏥",
      unread: 0,
    },
  ]);

  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const getOtherUsers = useUserStore((state) => state.getOtherUsers);
  const getChatrooms = useChatroomStore((state) => state.getChatrooms);
  const setOtherUsers = useUserStore((state) => state.setOtherUsers);

  const fetchAllList = async () => {
    await getChatrooms(user._id);
    await getOtherUsers(user._id);
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
    // Check if user is logged in
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const startChat = async () => {
      if (!user) return;
      console.log("user connected:", user._id);
      connectSocket(user._id);
      await fetchAllList();
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
    };
    startChat();
    return () => {
      disconnectSocket();
    };
  }, [user, socket]);

  const handleStartPrivateChat = (userId: string, username: string) => {
    /*
    const chatId = `dm-${userId}`;

    // Check if chat already exists
    const existingChat = privateChats.find((chat) => chat.id === chatId);
    if (!existingChat) {
      // Add new private chat to the list
      const newPrivateChat = {
        id: chatId,
        name: username,
        avatar: "",
        status: "online",
        unread: 0,
      };
      setPrivateChats((prev) => [...prev, newPrivateChat]);
    }
    setCurrentChat(username, chatId);
    setShowUserPanel(false);
   
  */ console.log("fake start private chat");
  };

  const handleCreateGroup = (groupName: string, emoji: string) => {
    /*const groupId = `group-${Date.now()}`;
    const newGroup = {
      id: groupId,
      name: groupName,
      icon: emoji,
      unread: 0,
      members: ["you"], // In a real app, this would be managed properly
    };
    setCurrentChat(newGroup);
    setShowCreateGroupModal(false);*/
    console.log("fake create group");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-meow-cream">
        <ChatSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          onCreateGroup={() => setShowCreateGroupModal(true)}
        />
        <ChatArea
          onToggleUserPanel={() => setShowUserPanel(!showUserPanel)}
          showUserPanel={showUserPanel}
          sidebarCollapsed={sidebarCollapsed}
          customGroups={customGroups}
        />
        {showUserPanel && <UserPanel />}
        <CreateGroupModal
          open={showCreateGroupModal}
          onOpenChange={setShowCreateGroupModal}
        />
      </div>
    </SidebarProvider>
  );
};

export default Chat;
