import { useState, useEffect, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Reply, Copy, Heart, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Message } from "../../../types/apiType";
import useUserStore from "@/stores/user-store";
import useChatroomMemberStore from "@/stores/chatroom-member-store";
import MessageMenuComponent from "./MessageMenuComponent";
import { timeParser } from "@/utils/TimeParser";

interface ChatMessageProps {
  message: Message;
  onRecall?: (messageId: string) => void;
  handleReply?: (message: Message) => void;
  handleCopy?: (message: Message) => void;
}

export function ChatMessage({
  message,
  onRecall,
  handleReply,
  handleCopy,
}: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const user = useUserStore((state) => state.user);

  const readCount = useChatroomMemberStore(
    (state) => state.readCount?.[message._id] ?? 0
  );

  const handleReaction = (emoji: string) => {
    setReactions((prev) => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1,
    }));
  };

  const handleRecall = (messageId: string) => {
    if (onRecall && message.user._id === user._id && !message.isRecalled) {
      onRecall(messageId);
    }
  };

  return (
    <div className="flex flex-col">
      {message?.reply_to && (
        <p
          className={cn(
            "mb-2 w-[30%] text-sm border bg-meow-purple/20 rounded p-2 italic text-gray-500",
            message?.user._id === user._id ? "ml-auto" : "mr-auto"
          )}
        >
          Reply to {message?.reply_to?.user?.username}:
          {message?.reply_to?.type === "sticker" ? (
            <img
              src={message?.reply_to?.content}
              alt="sticker"
              className="w-16 h-16"
            />
          ) : (
            message?.reply_to?.content
          )}
        </p>
      )}
      <div
        className={cn(
          "flex gap-3 group",
          message?.user._id === user._id ? "flex-row-reverse" : "flex-row",
          "hover:bg-meow-purple/20 transition-all duration-200"
        )}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {message?.user._id !== user._id && (
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={message.user.avatar} />
            <AvatarFallback className="bg-meow-pink text-purple-800 text-sm">
              {typeof message?.user != "string" &&
                message?.user?.username
                  .split("")
                  .map((n) => n[0])
                  .join("")}
            </AvatarFallback>
          </Avatar>
        )}

        <div
          className={cn(
            "flex flex-col max-w-[70%]",
            message?.user._id === user._id ? "items-end" : "items-start"
          )}
        >
          {message?.user._id !== user._id && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-purple-800">
                {message?.user.username}
              </span>
              <span className="text-xs text-purple-500">
                {timeParser(message.createdAt)}
              </span>
            </div>
          )}

          <div
            className={`relative flex ${
              message?.user._id === user._id ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div
                  className={cn(
                    "chat-bubble hover-lift transition-all duration-200 relative",
                    message?.user._id === user._id
                      ? "chat-bubble-me"
                      : "chat-bubble-other",
                    message?.type === "text" && "bg-meow-purple",
                    message?.isRecalled && "opacity-70"
                  )}
                >
                  {message?.isRecalled ? (
                    <p className="italic text-gray-500">Recalled🤫</p>
                  ) : message?.type === "sticker" ? (
                    <img
                      src={message.content}
                      alt="sticker"
                      className="w-24 h-24"
                    />
                  ) : (
                    <p
                      className={cn(
                        "text-sm leading-relaxed",
                        message?.isRecalled && "italic text-gray-500"
                      )}
                    >
                      {message?.content}
                    </p>
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-48 bg-white border-meow-purple/20">
                <ContextMenuItem onClick={() => handleReaction("❤️")}>
                  <Heart className="w-4 h-4 mr-2" />
                  React with ❤️
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleReply(message)}>
                  <Reply className="w-4 h-4 mr-2" />
                  Reply
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleCopy(message)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Message
                </ContextMenuItem>
                {message?.user._id === user._id && !message?.isRecalled && (
                  <ContextMenuItem onClick={() => handleRecall(message._id)}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Recall Message
                  </ContextMenuItem>
                )}
              </ContextMenuContent>
            </ContextMenu>

            {/* Message Actions */}

            <div
              className={cn(
                "max-w-[100px] max-h-[50px] opacity-0 flex items-center gap-1 bg-white shadow-lg rounded-xl border border-meow-purple/20 p-1 transition-opacity duration-200",
                message?.user._id === user._id ? "mr-2" : "ml-2",
                message?.isRecalled && "hidden",
                showActions && "opacity-100"
              )}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-meow-purple/50 rounded-lg"
                onClick={() => handleReply(message)}
              >
                <Reply className="w-4 h-4" />
              </Button>
              <MessageMenuComponent
                message={message}
                user={user}
                onReact={handleReaction}
                onReply={handleReply}
                onCopy={handleCopy}
                onRecall={handleRecall}
              />
            </div>
          </div>
          {/* Reactions */}
          {Object.keys(reactions).length > 0 && (
            <div className="flex gap-1 mt-1">
              {Object.entries(reactions).map(([emoji, count]) => (
                <button
                  key={emoji}
                  className="flex items-center gap-1 bg-meow-purple/30 rounded-full px-2 py-1 text-xs hover:bg-meow-purple/50 transition-colors"
                  onClick={() => handleReaction(emoji)}
                >
                  <span>{emoji}</span>
                  <span className="text-purple-800 font-medium">{count}</span>
                </button>
              ))}
            </div>
          )}
          {message?.user._id === user._id && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-purple-500">
                {timeParser(message.createdAt)}
              </span>
              {readCount > 0 ? (
                readCount > 1 ? (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-800"
                  >
                    {readCount} Read
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-green-100 text-green-800"
                  >
                    Read
                  </Badge>
                )
              ) : (
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-100 text-blue-800"
                >
                  Unread
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
