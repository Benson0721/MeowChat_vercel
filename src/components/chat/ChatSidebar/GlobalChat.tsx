import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Chatroom, ChatroomMember } from "../../../types/apiType";
import { useEffect, useMemo } from "react";
import useChatroomMemberStore from "@/stores/chatroom-member-store";
import useUserStore from "@/stores/user-store";

interface GlobalChatProps {
  collapsed: boolean;
  globalChat: Chatroom;
  setCurrentChat: (chatroom: Chatroom) => void;
  currentChat: Chatroom;
}

export default function GlobalChat({
  collapsed,
  globalChat,
  setCurrentChat,
  currentChat,
}: GlobalChatProps) {
  const userMemberMap = useChatroomMemberStore((state) => state.userMemberMap);

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
                onClick={() => setCurrentChat(globalChat)}
                className={`w-full h-12 p-0 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                  currentChat?._id === globalChat?._id
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
            onClick={() => setCurrentChat(globalChat)}
            className={`flex items-center gap-3 w-full p-3 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
              currentChat?._id === globalChat?._id
                ? "bg-meow-purple text-purple-800"
                : ""
            }`}
          >
            <Globe className="w-5 h-5 text-blue-500" />
            <span className="font-medium">{globalChat?.name}</span>
            {userMemberMap?.get(globalChat?._id)?.unread_count > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {userMemberMap?.get(globalChat?._id)?.unread_count}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
