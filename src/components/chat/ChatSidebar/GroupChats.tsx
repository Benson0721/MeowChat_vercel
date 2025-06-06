import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Chatrooms } from "../../../types/apiType";
interface GroupChatsProps {
  currentChat: string;
  onChatSelect: (chatId: string) => void;
  collapsed: boolean;
  onCreateGroup: () => void;
  groupChats: Array<Chatrooms>;
}

export default function GroupChats({
  currentChat,
  onChatSelect,
  collapsed,
  onCreateGroup,
  groupChats,
}: GroupChatsProps) {
  return (
    <div>
      {!collapsed && (
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-purple-700 font-fredoka font-medium uppercase tracking-wide text-xs">
            Chat Groups
          </h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCreateGroup}
                className="h-6 w-6 p-0 hover:bg-meow-purple/50 rounded-lg"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Create New Group</TooltipContent>
          </Tooltip>
        </div>
      )}
      <div className="space-y-1">
        {/* Default Groups */}
        {groupChats.map((group) => (
          <div key={group._id}>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onChatSelect(group._id)}
                    className={`w-full h-12 p-0 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                      currentChat === group._id
                        ? "bg-meow-purple text-purple-800"
                        : ""
                    }`}
                  ></Button>
                </TooltipTrigger>
                <TooltipContent side="right">{group.name}</TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={() => onChatSelect(group._id)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                  currentChat === group._id
                    ? "bg-meow-purple text-purple-800"
                    : ""
                }`}
              >
                <span className="w-8 h-8 bg-meow-lavender rounded-full flex items-center justify-center">
                  <span className="text-lg">{group.avatar}</span>
                </span>
                <span className="font-medium">{group.name}</span>
                {/*group.unread > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {group.unread}
                  </span>
                )*/}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
