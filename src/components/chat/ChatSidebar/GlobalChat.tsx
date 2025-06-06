import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Chatrooms } from "../../../types/apiType";
interface GlobalChatProps {
  currentChat: string;
  onChatSelect: (chatId: string) => void;
  collapsed: boolean;
  globalChat: Chatrooms;
}

export default function GlobalChat({
  currentChat,
  onChatSelect,
  collapsed,
  globalChat,
}: GlobalChatProps) {
  return (
    <div>
      {!collapsed && (
        <h3 className="text-purple-700 font-fredoka font-medium uppercase tracking-wide text-xs mb-3">
          Global
        </h3>
      )}
      <div className="space-y-1">
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChatSelect("global")}
                className={`w-full h-12 p-0 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                  currentChat === "global"
                    ? "bg-meow-purple text-purple-800"
                    : ""
                }`}
              >
                <Globe className="w-5 h-5 text-blue-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{globalChat?.name}</TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={() => onChatSelect("global")}
            className={`flex items-center gap-3 w-full p-3 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
              currentChat === "global" ? "bg-meow-purple text-purple-800" : ""
            }`}
          >
            <Globe className="w-5 h-5 text-blue-500" />
            <span className="font-medium">{globalChat?.name}</span>
          </button>
        )}
      </div>
    </div>
  );
}
