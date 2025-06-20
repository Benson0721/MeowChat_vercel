import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Chatroom } from "../../../types/apiType";
import useChatroomMemberStore from "@/stores/chatroom-member-store";
import { Skeleton } from "@/components/ui/skeleton";

interface GroupChatsProps {
  collapsed: boolean;
  groupChats: Array<Chatroom>;
  onCreateGroup: () => void;
  setCurrentChat: (chatroom: Chatroom) => void;
  currentChat: Chatroom;
  isLoading: boolean;
}

export default function GroupChats({
  collapsed,
  groupChats,
  onCreateGroup,
  setCurrentChat,
  currentChat,
  isLoading,
}: GroupChatsProps) {
  const userMemberMap = useChatroomMemberStore((state) => state.userMemberMap);

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
        {isLoading ? (
          <Skeleton className="w-full h-12 rounded-xl" />
        ) : (
          <>
            {groupChats.map((group) => (
              <div key={group._id}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentChat(group)}
                        className={`w-full h-12 p-0 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                          currentChat?._id === group?._id
                            ? "bg-meow-lavender"
                            : ""
                        }`}
                      >
                        <div className="relative">
                          <span className="w-8 h-8 rounded-full flex items-center justify-center">
                            <span className="text-lg">{group?.avatar}</span>
                          </span>
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">{group?.name}</TooltipContent>
                  </Tooltip>
                ) : (
                  <button
                    onClick={() => setCurrentChat(group)}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                      currentChat?._id === group?._id
                        ? "bg-meow-purple text-purple-800"
                        : ""
                    }`}
                  >
                    <span className="w-8 h-8 bg-meow-lavender rounded-full flex items-center justify-center">
                      <span className="text-lg">{group.avatar}</span>
                    </span>
                    <span className="font-medium">{group.name}</span>
                    {userMemberMap?.get(group?._id)?.unread_count > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {userMemberMap?.get(group?._id)?.unread_count}
                      </span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
