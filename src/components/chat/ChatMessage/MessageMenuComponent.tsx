import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Ellipsis, Reply, Copy, Heart, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message, User } from "../../../types/apiType";
export default function MessageMenuComponent({
  onReact,
  onReply,
  onCopy,
  onRecall,
  message,
  user,
}: {
  onReact: (emoji: string) => void;
  onReply: (message: Message) => void;
  onCopy: (message: Message) => void;
  onRecall: (messageId: string) => void;
  message: Message;
  user: User;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onReact("❤️")}>
          <Heart className="w-4 h-4 mr-2" />
          React
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onReply(message)}>
          <Reply className="w-4 h-4 mr-2" />
          Reply
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCopy(message)}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Message
        </DropdownMenuItem>
        {message?.user._id === user._id && !message?.isRecalled && (
          <DropdownMenuItem onClick={() => onRecall(message._id)}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Recall Message
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
