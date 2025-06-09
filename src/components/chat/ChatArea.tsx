import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Hash, Send, Paperclip, MoreVertical } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { EmojiStickerPicker } from "./EmojiStickerPicker";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useChatroomStore from "@/stores/chatroom-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserStore from "@/stores/user-store";

interface ChatAreaProps {
  onToggleUserPanel: () => void;
  showUserPanel: boolean;
  sidebarCollapsed: boolean;
  customGroups: Array<{
    id: string;
    name: string;
    icon: string;
    unread: number;
  }>;
}

const mockMessages = [
  {
    id: "1",
    user: "Alice Whiskers",
    avatar:
      "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=faces",
    content: "Just adopted a new kitten! 🐱 She's absolutely adorable",
    timestamp: "10:30 AM",
    isMe: false,
    isRead: true,
    isRetracted: false,
  },
  {
    id: "2",
    user: "You",
    avatar:
      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=faces",
    content: "Aww! What's her name? I'd love to see photos! 😍",
    timestamp: "10:32 AM",
    isMe: true,
    isRead: true,
    isRetracted: false,
  },
  {
    id: "3",
    user: "Alice Whiskers",
    avatar:
      "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=faces",
    content: "This message was retracted",
    timestamp: "10:33 AM",
    isMe: false,
    isRead: true,
    isRetracted: true,
  },
  {
    id: "4",
    user: "Bob Mittens",
    avatar: "",
    content:
      "Luna is such a perfect name for a cat! My cat Oliver sends his greetings 🐾",
    timestamp: "10:35 AM",
    isMe: false,
    isRead: false,
    isRetracted: false,
  },
];

const getChatTitle = (
  chatId: string,
  customGroups: Array<{ id: string; name: string; icon: string }>
) => {
  // Check custom groups first
  const customGroup = customGroups.find((group) => group.id === chatId);
  if (customGroup) {
    return { name: customGroup.name, icon: customGroup.icon };
  }

  const titles: Record<string, { name: string; icon: any; members?: number }> =
    {
      global: { name: "Global Chatroom", icon: "🌍", members: 1247 },
      "cat-lovers": { name: "Cat Lovers", icon: "❤️", members: 1247 },
      "dev-cats": { name: "Dev Cats", icon: "☕", members: 342 },
      "kitten-pics": { name: "Kitten Pics", icon: "#", members: 2891 },
      "cat-care": { name: "Cat Care Tips", icon: "🏥", members: 567 },
      "dm-alice": { name: "Alice Whiskers", icon: "💬" },
      "dm-bob": { name: "Bob Mittens", icon: "💬" },
      "dm-charlie": { name: "Charlie Paws", icon: "💬" },
    };
  return titles[chatId] || { name: "Unknown Chat", icon: "💬" };
};

export function ChatArea({
  onToggleUserPanel,
  showUserPanel,
  sidebarCollapsed,
  customGroups,
}: ChatAreaProps) {
  const currentChat = useChatroomStore((state) => state.currentChat);
  const otherUser = useUserStore((state) => state.otherUsersMap);
  const user = useUserStore((state) => state.user);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const chatInfo = getChatTitle(currentChat?._id || "", customGroups);
  const [chatName, setChatName] = useState(currentChat?.name || "");
  const [currentPrivate, setCurrentPrivate] = useState<string | null>(null);

  useEffect(() => {
    if (!currentChat?.name) return;
    const nameInitials = currentChat.name
      .split(" ")
      .map((n) => n[0])
      .join("");
    setChatName(nameInitials);
  }, [currentChat]);

  useEffect(() => {
    if (currentChat?.type !== "private") return;
    const privateUser = currentChat.members.find(
      (member) => member !== user._id
    );
    setCurrentPrivate(privateUser || null);
  }, [currentChat]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        user: "You",
        avatar:
          "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=faces",
        content: message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: true,
        isRead: false,
        isRetracted: false,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiStickerSelect = (
    content: string,
    type: "emoji" | "sticker"
  ) => {
    if (type === "emoji") {
      setMessage((prev) => prev + content);
    } else {
      // For stickers, send immediately
      const newMessage = {
        id: Date.now().toString(),
        user: "You",
        avatar:
          "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=100&h=100&fit=crop&crop=faces",
        content: content,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: true,
        isRead: false,
        isRetracted: false,
      };
      setMessages([...messages, newMessage]);
    }
  };

  const handleRecallMessage = (messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId && msg.isMe
          ? { ...msg, content: "This message was retracted", isRetracted: true }
          : msg
      )
    );
  };

  return (
    <div
      className={`flex-1 flex flex-col bg-white transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? "ml-0" : "ml-0"
      }`}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-meow-purple/20 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="lg:hidden" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-meow-lavender rounded-full flex items-center justify-center">
              <Avatar className="w-6 h-6">
                <AvatarImage src={currentChat?.avatar} />
                <AvatarFallback className="bg-meow-pink text-purple-800 text-xs">
                  {currentChat?.avatar || chatName}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="font-fredoka font-semibold text-purple-900 text-lg">
                {currentChat?.name}
              </h2>
              {currentChat?.members && currentChat?.type !== "private" && (
                <p className="text-sm text-purple-600">
                  {currentChat?.members.length} members online
                </p>
              )}
              {currentChat?.type === "private" && (
                <p className="text-sm text-purple-600">
                  {otherUser.get(currentPrivate || "")?.status}
                </p>
              )}
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-meow-cream/30">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onRecall={handleRecallMessage}
          />
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-meow-purple/20">
        <div className="flex items-center gap-3 bg-meow-cream/50 rounded-2xl p-3 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-600 hover:bg-meow-purple/50 rounded-xl transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${chatInfo.name}...`}
            className="flex-1 border-0 bg-transparent placeholder:text-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <EmojiStickerPicker onSelect={handleEmojiStickerSelect} />

          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="sm"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl px-4 transition-all duration-200 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
