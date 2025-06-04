
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { ChatArea } from '@/components/chat/ChatArea';
import { UserPanel } from '@/components/chat/UserPanel';
import { CreateGroupModal } from '@/components/chat/CreateGroupModal';

const Chat = () => {
  const [currentChat, setCurrentChat] = useState('global');
  const [showUserPanel, setShowUserPanel] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [customGroups, setCustomGroups] = useState([]);
  const [privateChats, setPrivateChats] = useState([
    {
      id: 'dm-alice',
      name: 'Alice Whiskers',
      avatar: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=faces',
      status: 'online',
      unread: 2
    },
    {
      id: 'dm-bob',
      name: 'Bob Mittens',
      avatar: '',
      status: 'away',
      unread: 0
    },
    {
      id: 'dm-charlie',
      name: 'Charlie Paws',
      avatar: '',
      status: 'offline',
      unread: 5
    }
  ]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('meowchat_user');
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleStartPrivateChat = (userId: string, username: string) => {
    const chatId = `dm-${userId}`;
    
    // Check if chat already exists
    const existingChat = privateChats.find(chat => chat.id === chatId);
    if (!existingChat) {
      // Add new private chat to the list
      const newPrivateChat = {
        id: chatId,
        name: username,
        avatar: '',
        status: 'online',
        unread: 0
      };
      setPrivateChats(prev => [...prev, newPrivateChat]);
    }
    
    setCurrentChat(chatId);
    setShowUserPanel(false);
  };

  const handleCreateGroup = (groupName: string, emoji: string) => {
    const groupId = `group-${Date.now()}`;
    const newGroup = {
      id: groupId,
      name: groupName,
      icon: emoji,
      unread: 0,
      members: ['you'] // In a real app, this would be managed properly
    };
    setCustomGroups(prev => [...prev, newGroup]);
    setCurrentChat(groupId);
    setShowCreateGroupModal(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-meow-cream">
        <ChatSidebar 
          currentChat={currentChat} 
          onChatSelect={setCurrentChat}
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)}
          onCreateGroup={() => setShowCreateGroupModal(true)}
          privateChats={privateChats}
          customGroups={customGroups}
        />
        <ChatArea 
          currentChat={currentChat} 
          onToggleUserPanel={() => setShowUserPanel(!showUserPanel)}
          showUserPanel={showUserPanel}
          sidebarCollapsed={sidebarCollapsed}
          customGroups={customGroups}
        />
        {showUserPanel && <UserPanel onStartPrivateChat={handleStartPrivateChat} />}
        <CreateGroupModal 
          open={showCreateGroupModal}
          onOpenChange={setShowCreateGroupModal}
          onCreateGroup={handleCreateGroup}
        />
      </div>
    </SidebarProvider>
  );
};

export default Chat;
