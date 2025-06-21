import {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import { EmojiStickerPicker } from "./EmojiStickerPicker";
import useChatroomStore from "@/stores/chatroom-store";
import useUserStore from "@/stores/user-store";
import useMessageStore from "@/stores/message-store";
import useChatroomMemberStore from "@/stores/chatroom-member-store";
import { getSticker } from "@/lib/api/sticker-api";
import SocketContext from "@/hooks/socketManager";
import { Message } from "@/types/apiType";
import dayjs from "dayjs";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatHeader } from "./ChatHeader";
import { ReplyPreview } from "./ReplyPreview";

interface ChatAreaProps {
  onToggleUserPanel: () => void;
  showUserPanel: boolean;
  sidebarCollapsed: boolean;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const SCROLL_CHECK_OFFSET = 10;

export function ChatArea({
  onToggleCollapsed,
  collapsed,
  onToggleUserPanel,
  showUserPanel,
  sidebarCollapsed,
}: ChatAreaProps) {
  const currentChat = useChatroomStore((state) => state.currentChat);
  const user = useUserStore((state) => state.user);
  const messageMap = useMessageStore((state) => state.messageMap);
  const datedMessages = useMessageStore((state) => state.datedMessages);
  const memberMap = useChatroomMemberStore((state) => state.memberMap);
  const otherUsersMap = useUserStore((state) => state.otherUsersMap);

  const {
    sendMessage,
    getHistoryMessage,
    recallMessage,
    handleReceiveMessage,
    handleUpdateMessage,
  } = useMessageStore();

  const { getChatroomMember, updateLastReadAt, updateReadCount } =
    useChatroomMemberStore();

  const [inputState, setInputState] = useState({
    message: "",
    isReply: null as Message | null,
  });
  const [chatInfo, setChatInfo] = useState({
    name: "",
    privateUserId: null as string | null,
  });

  const [displayInfo, setDisplayInfo] = useState({
    name: "",
    avatar: "",
  });
  const [stickers, setStickers] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  //ref
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const messageAreaRef = useRef<HTMLDivElement>(null);
  let observer: IntersectionObserver | null = null;

  const { socket } = useContext(SocketContext);
  const isMobile = useIsMobile();

  const messages = useMemo(() => {
    return [...messageMap.values()];
  }, [messageMap]);

  const currentPrivateUser = useMemo(() => {
    if (!currentChat || currentChat.type !== "private") return null;
    const otherMemberId = currentChat.members.find(
      (member) => member !== user?._id
    );
    return otherMemberId ? otherUsersMap.get(otherMemberId) : null;
  }, [currentChat, user?._id, otherUsersMap]);

  const isAtBottom = useCallback(() => {
    if (!messageAreaRef.current) return false;
    const { scrollTop, clientHeight, scrollHeight } = messageAreaRef.current;
    return scrollTop + clientHeight >= scrollHeight - SCROLL_CHECK_OFFSET;
  }, []);

  //fetcher
  const getAllSticker = async () => {
    const allstickers = await getSticker();
    if (allstickers) {
      setStickers(allstickers);
    }
  };

  const getChatroomInfo = async () => {
    await getHistoryMessage(currentChat?._id);
    await getChatroomMember(user?._id);
    await getAllSticker();
    const nameInitials = currentChat?.name
      .split(" ")
      .map((n) => n[0])
      .join("");
    const privateUser = currentChat?.members.find(
      (member) => member !== user?._id
    );
    setChatInfo({
      name: nameInitials,
      privateUserId: privateUser || null,
    });
  };

  //handler
  const handleCopy = (message: Message) => {
    navigator.clipboard.writeText(message.content);
    setInputState((prev) => ({ ...prev, message: message.content }));
  };

  const handleReply = (message: Message) => {
    setInputState((prev) => ({ ...prev, isReply: message }));
  };
  const handleSendMessage = async (type: string, content: string) => {
    if (content.trim()) {
      const newMessage = await sendMessage(
        currentChat._id,
        user._id,
        content,
        type,
        inputState.isReply?._id
      );
      socket.emit("chat message", newMessage, currentChat._id);
      setInputState((prev) => ({ ...prev, message: "" }));
      setInputState((prev) => ({ ...prev, isReply: null }));
    }
  };

  const handleEmojiStickerSelect = useCallback(
    (content: string, type: "emoji" | "sticker") => {
      if (type === "emoji") {
        setInputState((prev) => ({ ...prev, message: prev.message + content }));
      } else {
        handleSendMessage("sticker", content);
      }
    },
    []
  );

  const handleRecallMessage = async (messageId: string) => {
    socket.emit("update message", messageId, user._id);
    socket.emit("update unread", currentChat._id);
    await recallMessage(messageId);
  };

  const handleUpdateReadCount = useCallback(async () => {
    if (
      !currentChat ||
      !messageMap ||
      memberMap.get(currentChat._id)?.length === 0
    )
      return;
    updateReadCount(messages, currentChat);
  }, [messages, currentChat]);

  //effects
  useEffect(() => {
    if (!currentChat) return;
    setIsFetching(true);
    getChatroomInfo().then(() => {
      setInputState((prev) => ({ ...prev, isReply: null }));
      setIsFetching(false);
    });
  }, [currentChat]);

  useEffect(() => {
    if (
      !currentChat ||
      messageMap.size === 0 ||
      memberMap.get(currentChat._id)?.length === 0 ||
      isFetching ||
      !socket
    )
      return;

    handleUpdateReadCount();

    const onMessage = (msg: Message, room_id: string) => {
      if (room_id === currentChat._id && msg.user._id !== user._id) {
        handleReceiveMessage(msg);
        socket.emit("update unread", currentChat._id);
        if (room_id === currentChat._id) {
          if (messageMap) {
            updateReadCount(messages, currentChat);
          }
        }
      }
    };

    const onUpdateMessage = (message_id: string, user_id: string) => {
      if (user_id !== user._id) {
        handleUpdateMessage(message_id);
      }
    };

    const onUpdateLastReadTime = async (
      chatroom_id: string,
      user_id: string
    ) => {
      await updateLastReadAt(user_id, chatroom_id);
      updateReadCount(messages, currentChat);
    };

    socket.on("chat message", onMessage);
    socket.on("update message", onUpdateMessage);
    socket.on("update last_read_time", onUpdateLastReadTime);

    return () => {
      socket.off("chat message", onMessage);
      socket.off("update message", onUpdateMessage);
      socket.off("update last_read_time", onUpdateLastReadTime);
    };
  }, [currentChat, messageMap.size, isFetching]);

  useEffect(() => {
    const observerfunc = () => {
      if (!lastMessageRef.current) return;
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          socket?.emit("update last_read_time", currentChat?._id, user._id);
          socket?.emit("update unread", currentChat?._id);
        }
      });
      observer.observe(lastMessageRef.current);
    };

    const onFocus = () => {
      if (isAtBottom() && currentChat?._id) {
        socket?.emit("update last_read_time", currentChat._id, user._id);
        socket?.emit("update unread", currentChat._id);
      }
      window.addEventListener("focus", onFocus);
    };
    observerfunc();
    onFocus();
    return () => {
      observer?.disconnect();
      window.removeEventListener("focus", onFocus);
    };
  }, [datedMessages]);

  useEffect(() => {
    if (!currentChat) {
      setDisplayInfo({ name: "", avatar: "" });
      return;
    }

    if (currentChat.type === "private" && currentPrivateUser) {
      setDisplayInfo({
        name: currentPrivateUser.username,
        avatar: currentPrivateUser.avatar,
      });
    } else {
      setDisplayInfo({
        name: currentChat.name,
        avatar: currentChat.avatar,
      });
    }
  }, [
    currentChat,
    currentPrivateUser?.username,
    currentPrivateUser?.avatar,
    currentChat?.name,
    currentChat?.avatar,
  ]);

  return (
    <div
      className={`flex-1 flex flex-col bg-white transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? "w-0" : ""
      }`}
    >
      {/* Chat Header */}
      <ChatHeader
        chat={currentChat}
        displayInfo={displayInfo}
        privateUser={otherUsersMap.get(chatInfo.privateUserId || "")}
        isMobile={isMobile}
        collapsed={collapsed}
        showUserPanel={showUserPanel}
        onToggleCollapsed={onToggleCollapsed}
        onToggleUserPanel={onToggleUserPanel}
      />

      {/* Messages Area */}
      <div
        ref={messageAreaRef}
        className="relative flex-1 max-h-[calc(100vh-200px)] hide-scrollbar p-4 space-y-4 bg-gradient-to-b from-white to-meow-cream/30"
      >
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
        {inputState.isReply && (
          <ReplyPreview
            message={inputState.isReply}
            onClose={() =>
              setInputState((prev) => ({ ...prev, isReply: null }))
            }
          />
        )}

        <div className="p-6 bg-white border-t border-meow-purple/20">
          <div className="flex items-center gap-3 bg-meow-cream/50 rounded-2xl p-3 shadow-sm">
            <Input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage("text", inputState.message);
                }
              }}
              value={inputState.message}
              onChange={(e) =>
                setInputState((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder={`Message ${currentChat?.name}...`}
              className="flex-1 border-0 bg-transparent placeholder:text-purple-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            />

            <EmojiStickerPicker
              onSelect={handleEmojiStickerSelect}
              stickers={stickers}
            />

            <Button
              onClick={() => handleSendMessage("text", inputState.message)}
              disabled={!inputState.message.trim()}
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
