import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import useUserStore from "@/stores/user-store";
import useChatroomStore from "@/stores/chatroom-store";

export function AllUsersList() {
  const user = useUserStore((state) => state.user);
  const otherUsersMap = useUserStore((state) => state.otherUsersMap);
  const otherUsersOrder = useUserStore((state) => state.otherUsersOrder);
  const onlineCount = otherUsersOrder.filter(
    (user) => otherUsersMap.get(user)?.status === "online"
  ).length;
  const privateChatrooms = useChatroomStore((state) => state.privateChatrooms);
  const createPrivateChat = useChatroomStore((state) => state.createChatroom);

  const createPrivateChatHandler = async (
    type: string,
    member: string[],
    inspactMember: string
  ) => {
    let ignoreCreatePrivateChat = privateChatrooms.find((chatroom) =>
      chatroom.members.includes(inspactMember)
    ); //避免重複創建
    if (ignoreCreatePrivateChat) {
      return;
    }
    await createPrivateChat(type, member, "", "");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-fredoka font-semibold text-purple-900">
          Online Users
        </h3>
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-800 border-green-200"
        >
          {onlineCount} online
        </Badge>
      </div>

      <div className="space-y-2">
        {otherUsersOrder.map((otherUser) => {
          const otherUserMap = otherUsersMap.get(otherUser);
          if (!otherUserMap) return null;
          return (
            <div
              key={otherUser}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-meow-purple/20 transition-colors group"
            >
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={otherUserMap.avatar} />
                  <AvatarFallback className="bg-meow-pink text-purple-800 text-xs">
                    {otherUserMap.username
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    otherUserMap.status === "online"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-purple-900 truncate">
                  {otherUserMap.username}
                </p>
                <p
                  className={`text-xs ${
                    otherUserMap.status === "online"
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {otherUserMap.status}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-meow-purple/50 rounded-lg"
                onClick={() =>
                  createPrivateChatHandler(
                    "private",
                    [user._id, otherUserMap._id],
                    otherUserMap._id
                  )
                }
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
