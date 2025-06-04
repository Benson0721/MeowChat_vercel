
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Reply, Copy, MoreHorizontal, Heart, Smile, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  isRead: boolean;
  isRetracted: boolean;
}

interface ChatMessageProps {
  message: Message;
  onRecall?: (messageId: string) => void;
}

export function ChatMessage({ message, onRecall }: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false);
  const [reactions, setReactions] = useState<Record<string, number>>({});

  const handleReaction = (emoji: string) => {
    setReactions(prev => ({
      ...prev,
      [emoji]: (prev[emoji] || 0) + 1
    }));
  };

  const handleRecall = () => {
    if (onRecall && message.isMe && !message.isRetracted) {
      onRecall(message.id);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div 
          className={cn(
            "flex gap-3 group",
            message.isMe ? "flex-row-reverse" : "flex-row"
          )}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {!message.isMe && (
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={message.avatar} />
              <AvatarFallback className="bg-meow-pink text-purple-800 text-sm">
                {message.user.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          )}

          <div className={cn("flex flex-col max-w-[70%]", message.isMe ? "items-end" : "items-start")}>
            {!message.isMe && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-purple-800">{message.user}</span>
                <span className="text-xs text-purple-500">{message.timestamp}</span>
                {!message.isRead && (
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                    Unread
                  </Badge>
                )}
              </div>
            )}

            <div className="relative">
              <div 
                className={cn(
                  "chat-bubble hover-lift transition-all duration-200 relative",
                  message.isMe ? "chat-bubble-me" : "chat-bubble-other",
                  message.isRetracted && "opacity-70"
                )}
              >
                {message.isRetracted && (
                  <Badge variant="outline" className="absolute -top-2 left-2 text-xs bg-gray-100 text-gray-600">
                    Retracted
                  </Badge>
                )}
                <p className={cn(
                  "text-sm leading-relaxed",
                  message.isRetracted && "italic text-gray-500"
                )}>
                  {message.content}
                </p>
              </div>

              {/* Message Actions */}
              {showActions && (
                <div className={cn(
                  "absolute top-0 flex items-center gap-1 bg-white shadow-lg rounded-xl border border-meow-purple/20 p-1 transition-opacity duration-200",
                  message.isMe ? "-left-32" : "-right-32"
                )}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-meow-purple/50 rounded-lg"
                    onClick={() => handleReaction('❤️')}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-meow-purple/50 rounded-lg"
                    onClick={() => handleReaction('😸')}
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-meow-purple/50 rounded-lg"
                  >
                    <Reply className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-meow-purple/50 rounded-lg"
                    onClick={handleCopy}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {message.isMe && !message.isRetracted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-meow-purple/50 rounded-lg"
                      onClick={handleRecall}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-meow-purple/50 rounded-lg"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              )}
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

            {message.isMe && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-purple-500">{message.timestamp}</span>
                {!message.isRead && (
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                    Unread
                  </Badge>
                )}
              </div>
            )}
          </div>

          {message.isMe && (
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={message.avatar} />
              <AvatarFallback className="bg-meow-purple text-purple-800 text-sm">You</AvatarFallback>
            </Avatar>
          )}
        </div>
      </ContextMenuTrigger>
      
      <ContextMenuContent className="w-48 bg-white border-meow-purple/20">
        <ContextMenuItem onClick={() => handleReaction('❤️')}>
          <Heart className="w-4 h-4 mr-2" />
          React with ❤️
        </ContextMenuItem>
        <ContextMenuItem onClick={() => handleReaction('😸')}>
          <Smile className="w-4 h-4 mr-2" />
          React with 😸
        </ContextMenuItem>
        <ContextMenuItem>
          <Reply className="w-4 h-4 mr-2" />
          Reply
        </ContextMenuItem>
        <ContextMenuItem onClick={handleCopy}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Message
        </ContextMenuItem>
        {message.isMe && !message.isRetracted && (
          <ContextMenuItem onClick={handleRecall}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Recall Message
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
