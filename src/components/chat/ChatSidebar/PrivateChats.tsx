import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Chatrooms } from "../../../types/apiType";

interface PrivateChatsProps {
  privateChats: Array<Chatrooms>;
  currentChat: string;
  onChatSelect: (chatId: string) => void;
  collapsed: boolean;
}

export default function PrivateChats({
  privateChats,
  currentChat,
  onChatSelect,
  collapsed,
}: PrivateChatsProps) {
  return (
    <div>
      {!collapsed && (
        <h3 className="text-purple-700 font-fredoka font-medium uppercase tracking-wide text-xs mb-3">
          Direct Messages
        </h3>
      )}
      <div className="space-y-1">
        {privateChats.map((chat) => (
          <div key={chat.id}>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onChatSelect(chat.id)}
                    className={`w-full h-12 p-0 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                      currentChat === chat.id
                        ? "bg-meow-purple text-purple-800"
                        : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={dm.avatar} />
                        <AvatarFallback className="bg-meow-pink text-purple-800 text-xs">
                          {dm.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                          dm.status === "online"
                            ? "bg-green-500"
                            : dm.status === "away"
                            ? "bg-white"
                            : "bg-gray-400"
                        }`}
                      />
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">{dm.name}</TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={() => onChatSelect(dm.id)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                  currentChat === dm.id ? "bg-meow-purple text-purple-800" : ""
                }`}
              >
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={dm.avatar} />
                    <AvatarFallback className="bg-meow-pink text-purple-800 text-sm">
                      {dm.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      dm.status === "online"
                        ? "bg-green-500"
                        : dm.status === "away"
                        ? "bg-white"
                        : "bg-gray-400"
                    }`}
                  />
                </div>
                <span className="font-medium text-sm">{dm.name}</span>
                {dm.unread > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {dm.unread}
                  </span>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
