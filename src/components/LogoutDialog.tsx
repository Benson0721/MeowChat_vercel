import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useUserStore from "@/stores/user-store";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import SocketContext from "@/hooks/socketManager";

export default function LogoutDialog() {
  const logout = useUserStore((state) => state.logoutHandler);
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const user = useUserStore((state) => state.user);
  const logoutHandler = async () => {
    if (!socket) return;
    socket.emit("logout", user._id);
    await logout();
    navigate("/");
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-purple-600 hover:bg-meow-purple/50 rounded-xl"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col gap-2">
            <DialogTitle>Are you sure to Logout?</DialogTitle>
            <DialogDescription>Hope to see you soon!~</DialogDescription>
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant="destructive" onClick={logoutHandler}>
              Logout
            </Button>
          </DialogClose>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
