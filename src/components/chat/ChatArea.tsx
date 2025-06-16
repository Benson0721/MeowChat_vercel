import { useState, useEffect, useContext, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Hash,
  Send,
  Paperclip,
  MoreVertical,
  Reply,
  CircleX,
} from "lucide-react";
import { ChatMessage } from "./ChatMessage/ChatMessage";
import { EmojiStickerPicker } from "./EmojiStickerPicker";
import { SidebarTrigger } from "@/components/ui/sidebar";
import useChatroomStore from "@/stores/chatroom-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserStore from "@/stores/user-store";
import useMessageStore from "@/stores/message-store";
import useChatroomMemberStore from "@/stores/chatroom-member-store";
import { getSticker } from "@/lib/api/sticker-api";
import SocketContext from "@/hooks/socketManager";
import { Message } from "@/types/apiType";
import dayjs from "dayjs";
import { ChatroomMember } from "@/types/apiType";

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

export function ChatArea({
  onToggleUserPanel,
  showUserPanel,
  sidebarCollapsed,
}: ChatAreaProps) {
  const currentChat = useChatroomStore((state) => state.currentChat);
  const messages = useMessageStore((state) => state.messageMap);
  const datedMessages = useMessageStore((state) => state.datedMessages);
  const otherUser = useUserStore((state) => state.otherUsersMap);
  const memberMap = useChatroomMemberStore((state) => state.memberMap);
  const sendMessage = useMessageStore((state) => state.sendMessage);
  const getHistoryMessage = useMessageStore((state) => state.getHistoryMessage);
  const recallMessage = useMessageStore((state) => state.recallMessage);

  const handleReceiveMessage = useMessageStore(
    (state) => state.handleReceiveMessage
  );
  const handleUpdateMessage = useMessageStore(
    (state) => state.handleUpdateMessage
  );
  const getChatroomMember = useChatroomMemberStore(
    (state) => state.getChatroomMember
  );
  const updateLastReadAt = useChatroomMemberStore(
    (state) => state.updateLastReadAt
  );
  const updateReadCount = useChatroomMemberStore(
    (state) => state.updateReadCount
  );

  const user = useUserStore((state) => state.user);
  const [message, setMessage] = useState("");
  const [isreply, setIsReply] = useState<Message | null>(null);
  const [chatName, setChatName] = useState(currentChat?.name || "");
  const [currentPrivate, setCurrentPrivate] = useState<string | null>(null);
  const [stickers, setStickers] = useState([]);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { socket } = useContext(SocketContext);

  const getAllSticker = async () => {
    const allstickers = await getSticker();
    if (allstickers) {
      setStickers(allstickers);
    }
  };

  const getChatroomInfo = async () => {
    console.log("getChatroomInfo: ", currentChat._id);
    await getHistoryMessage(currentChat._id);
    await getChatroomMember(user._id);
    await getAllSticker();
    const nameInitials = currentChat.name
      .split(" ")
      .map((n) => n[0])
      .join("");
    const privateUser = currentChat.members.find(
      (member) => member !== user._id
    );
    setCurrentPrivate(privateUser || null);
    setChatName(nameInitials);
  };

  const handleCopy = (message: Message) => {
    navigator.clipboard.writeText(message.content);
    setMessage(message.content);
  };

  const handleReply = (message: Message) => {
    setIsReply(() => message);
  };
  const handleSendMessage = async (type: string, content: string) => {
    if (content.trim()) {
      const newMessage = await sendMessage(
        currentChat._id,
        user._id,
        content,
        type,
        isreply?._id
      );
      socket.emit("chat message", newMessage, currentChat._id);
      /*if (newMessage.user._id === user._id) {
        console.log("我方發送");
        //const otherUserId = otherMemberMap.get(currentChat._id);

        //console.log("otherUserId: ", otherUserId);
        //socket.emit("update other unread", currentChat._id, otherUserId); //增加對方未讀
      }*/
      setMessage("");
      setIsReply(null);
    }
  };

  const handleEmojiStickerSelect = (
    content: string,
    type: "emoji" | "sticker"
  ) => {
    if (type === "emoji") {
      setMessage((prev) => prev + content);
    } else {
      handleSendMessage("sticker", content);
    }
  };

  const handleRecallMessage = async (messageId: string) => {
    console.log("recall message: ", messageId);
    socket.emit("update message", messageId, user._id);
    socket.emit("update unread", currentChat._id);
    await recallMessage(messageId);
  };

  const handleUpdateReadCount = async () => {
    if (
      !currentChat ||
      !messages ||
      memberMap.get(currentChat._id)?.length === 0
    )
      return;
    console.log("update read count: ", currentChat._id);
    updateReadCount([...messages.values()], currentChat._id);
  };

  useEffect(() => {
    if (!currentChat) return;
    console.log("切換currentChat: ", currentChat);
    getChatroomInfo(); // 這裡會載入 messages
    setIsReply(null);
  }, [currentChat]);

  useEffect(() => {
    if (
      !currentChat ||
      messages.size === 0 ||
      memberMap.get(currentChat._id)?.length === 0
    )
      return;

    console.log("切換currentChat2: ", currentChat);

    handleUpdateReadCount();

    const onMessage = (msg: Message) => {
      if (msg.chatroom_id === currentChat._id && msg.user._id !== user._id) {
        handleReceiveMessage(msg);
        socket.emit("update unread", currentChat._id);
        if (msg.chatroom_id === currentChat._id) {
          if (messages) {
            updateReadCount([...messages.values()], currentChat._id);
          }
        }
      }
    };

    const onUpdateMessage = (message_id: string, user_id: string) => {
      if (user_id !== user._id) {
        handleUpdateMessage(message_id);
      }
    };

    const onUpdateLastReadTime = async (chatroom_id: string) => {
      console.log("update last_read_time: ", chatroom_id);
      if (chatroom_id === currentChat._id) {
        await updateLastReadAt(user._id, chatroom_id);
        updateReadCount([...messages.values()], chatroom_id);
      }
    };

    socket.on("chat message", onMessage);
    socket.on("update message", onUpdateMessage);
    socket.on("update last_read_time", onUpdateLastReadTime);

    return () => {
      socket.off("chat message", onMessage);
      socket.off("update message", onUpdateMessage);
      socket.off("update last_read_time", onUpdateLastReadTime);
    };
  }, [currentChat?._id, messages.size]);

  useEffect(() => {
    if (!lastMessageRef.current) return;
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log("Read last message");
        socket.emit("update last_read_time", currentChat._id);
        socket.emit("update unread", currentChat._id);
      }
    });
    observer.observe(lastMessageRef.current);
    return () => {
      observer.disconnect();
    };
  }, [datedMessages]);

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
      <div className="relative flex-1 max-h-[calc(100vh-200px)] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-meow-cream/30">
        {Object.entries(datedMessages)?.map(([date, msgs], outIndex, arr) => {
          let lastDate = outIndex === arr.length - 1;
          return (
            <div key={date}>
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur text-center text-xs text-gray-500 py-2">
                {dayjs(date).format("YYYY/MM/DD (ddd)")} {/* 上方日期列 */}
              </div>
              {msgs.map((msg, index) => {
                let lastMsg = lastDate && index === msgs.length - 1;
                return (
                  <div
                    key={msg._id}
                    className="relative"
                    ref={lastMsg ? lastMessageRef : null}
                  >
                    <ChatMessage
                      message={msg}
                      onRecall={handleRecallMessage}
                      handleReply={handleReply}
                      handleCopy={handleCopy}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="relative ">
        {isreply && (
          <div className="absolute w-full bottom-[115px] flex items-center gap-3 bg-meow-purple/20 rounded-t-lg p-3 shadow-sm">
            <Reply className="w-4 h-4" />
            <div className="ml-5 flex flex-col">
              reply to {isreply.user.username}:
              <br />
              {isreply.type === "sticker" ? (
                <img
                  src={isreply.content}
                  alt="sticker"
                  className="w-16 h-16"
                />
              ) : (
                isreply.content
              )}
            </div>
            <CircleX
              className="w-4 h-4 cursor-pointer ml-auto"
              onClick={() => setIsReply(null)}
            />
          </div>
        )}
        <div className="p-6 bg-white border-t border-meow-purple/20">
          <div className="flex items-center gap-3 bg-meow-cream/50 rounded-2xl p-3 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:bg-meow-purple/50 rounded-xl transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </Button>

            <Input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage("text", message);
                }
              }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${currentChat?.name}...`}
              className="flex-1 border-0 bg-transparent placeholder:text-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <EmojiStickerPicker
              onSelect={handleEmojiStickerSelect}
              stickers={stickers}
            />

            <Button
              onClick={() => handleSendMessage("text", message)}
              disabled={!message.trim()}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl px-4 transition-all duration-200 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
