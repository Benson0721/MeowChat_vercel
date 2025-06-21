import { Reply, CircleX } from "lucide-react";
import { Message } from "@/types/apiType";

interface ReplyPreviewProps {
  message: Message;
  onClose: () => void;
}

export const ReplyPreview = ({ message, onClose }: ReplyPreviewProps) => {
  const renderReplyContent = () => {
    if (message.type === "sticker") {
      return (
        <img
          src={message.content}
          alt="sticker"
          className="w-12 h-12 rounded"
        />
      );
    }

    return (
      <p className="text-sm text-gray-700 truncate max-w-xs">
        {message.content}
      </p>
    );
  };

  return (
    <div className="absolute w-full bottom-[115px] flex items-center gap-3 bg-meow-purple/20 rounded-t-lg p-3 shadow-sm border-t border-meow-purple/30">
      <Reply className="w-4 h-4 text-purple-600 flex-shrink-0" />

      <div className="flex-1 min-w-0">
        <p className="text-xs text-purple-600 font-medium mb-1">
          回覆給 {message.user.username}
        </p>
        {renderReplyContent()}
      </div>

      <button
        onClick={onClose}
        className="text-purple-600 hover:text-purple-800 transition-colors flex-shrink-0"
      >
        <CircleX className="w-4 h-4" />
      </button>
    </div>
  );
};
