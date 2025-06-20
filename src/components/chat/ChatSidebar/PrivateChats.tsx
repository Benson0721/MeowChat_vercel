import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Chatroom } from "../../../types/apiType";
import useUserStore from "../../../stores/user-store";
import useChatroomMemberStore from "../../../stores/chatroom-member-store";
import { Skeleton } from "@/components/ui/skeleton";

interface PrivateChatsProps {
  privateChats: Array<Chatroom>;
  collapsed: boolean;
  setCurrentChat: (chatroom: Chatroom) => void;
  currentChat: Chatroom;
  isLoading: boolean;
}

export default function PrivateChats({
  privateChats,
  collapsed,
  setCurrentChat,
  currentChat,
  isLoading,
}: PrivateChatsProps) {
  const otherUser = useUserStore((state) => state.otherUsersMap);
  const user = useUserStore((state) => state.user);
  const userMemberMap = useChatroomMemberStore((state) => state.userMemberMap);

  privateChats.map((chat) => {
    chat.members = chat.members.filter((member) => member !== user._id);
    chat.name = otherUser.get(chat.members[0])?.username;
    return chat;
  });
  return (
    <div>
      {!collapsed && (
        <h3 className="text-purple-700 font-fredoka font-medium uppercase tracking-wide text-xs mb-3">
          Direct Messages
        </h3>
      )}
      <div className="space-y-1">
        {isLoading ? (
          <Skeleton className="w-full h-12 rounded-xl" />
        ) : (
          <>
            {privateChats.map((privateChat) => (
              <div key={privateChat._id}>
                {collapsed ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentChat(privateChat)}
                        className={`w-full h-12 p-0 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                          currentChat?._id === privateChat?._id
                            ? "bg-meow-purple text-purple-800"
                            : ""
                        }`}
                      >
                        <div className="relative">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={
                                otherUser.get(privateChat.members[0])?.avatar
                              }
                            />
                            <AvatarFallback className="bg-meow-pink text-purple-800 text-xs">
                              {otherUser
                                .get(privateChat.members[0])
                                ?.username.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                              otherUser.get(privateChat.members[0])?.status ===
                              "online"
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {privateChat.name}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <button
                    onClick={() => setCurrentChat(privateChat)}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl hover:bg-meow-purple/50 transition-all duration-200 ${
                      currentChat?._id === privateChat?._id
                        ? "bg-meow-purple text-purple-800"
                        : ""
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={otherUser.get(privateChat.members[0])?.avatar}
                        />
                        <AvatarFallback className="bg-meow-pink text-purple-800 text-sm">
                          {otherUser
                            .get(privateChat.members[0])
                            ?.username.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${
                          otherUser.get(privateChat.members[0])?.status ===
                          "online"
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />
                    </div>
                    <span className="font-medium text-sm">
                      {privateChat.name}
                    </span>
                    {userMemberMap.get(privateChat._id)?.unread_count > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                        {userMemberMap.get(privateChat._id)?.unread_count}
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
