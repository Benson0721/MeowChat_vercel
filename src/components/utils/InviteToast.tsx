import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { User, Chatroom } from "@/types/apiType";

interface InviteToastProps {
  chatroom: Chatroom;
  sender: User;
  onAccept: () => void;
  onReject: () => void;
}

export const InviteToast = ({
  chatroom,
  sender,
  onAccept,
  onReject,
}: InviteToastProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg flex flex-col gap-3 w-[320px] border">
      <div className="flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={sender.avatar} alt={sender.username} />
          <AvatarFallback className="bg-meow-purple text-purple-800 text-xs">
            {sender.username?.charAt(0)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm text-purple-600">
            <span className="font-bold">{sender.username}</span>
            <span className="font-medium"> invite you to join </span>
            <span className="font-bold">{chatroom.avatar}{chatroom.name}</span>
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          onClick={onAccept}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Check className="w-4 h-4 mr-1" />
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onReject}
          className="border-gray-300 hover:bg-gray-50"
        >
          <X className="w-4 h-4 mr-1" />
          Reject
        </Button>
      </div>
    </div>
  );
};
