import { useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmojiGroupPicker } from "./EmojiGroupPicker";
import useChatroomStore from "@/stores/chatroom-store";
import useUserStore from "@/stores/user-store";
import SocketContext from "@/hooks/socketManager";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupModal({
  open,
  onOpenChange,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🐱");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createGroup = useChatroomStore((state) => state.createChatroom);
  const user = useUserStore((state) => state.user);
  const { socket } = useContext(SocketContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }

    if (groupName.trim().length < 3) {
      setError("Group name must be at least 3 characters");
      return;
    }
    setIsLoading(true);
    await createGroup("group", [user._id], selectedEmoji, groupName.trim());
    setIsLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setGroupName("");
    setSelectedEmoji("🐱");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-2xl shadow-xl border border-meow-purple/20">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-xl">🐱</span>
            </div>
            <div>
              <DialogTitle className="font-fredoka font-bold text-purple-900 text-xl">
                Create New Group
              </DialogTitle>
              <DialogDescription className="text-purple-600 text-sm">
                Start a new chat group for your community
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-purple-700 font-medium">Group Icon</Label>
            <div className="flex justify-center">
              <EmojiGroupPicker
                onSelect={setSelectedEmoji}
                selectedEmoji={selectedEmoji}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupName" className="text-purple-700 font-medium">
              Group Name
            </Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setError("");
              }}
              placeholder="Enter group name..."
              className="rounded-xl border-meow-purple/20 focus:border-purple-500 focus:ring-purple-500/20"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-xl border-meow-purple/20 hover:bg-meow-purple/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl shadow-sm"
            >
              Create Group
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
